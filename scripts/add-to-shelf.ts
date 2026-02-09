import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIG & CONSTANTS ---
const DATA_PATH = path.resolve(process.cwd(), 'src/data/shelf.json');
const CINEMATIC_COLORS = [
    "rgba(0, 102, 204, 0.4)", // Deep Blue
    "rgba(45, 27, 0, 0.4)",   // Warm Amber
    "rgba(0, 26, 51, 0.4)",   // Space Black
    "rgba(102, 0, 0, 0.4)",   // Crimson
    "rgba(0, 51, 0, 0.4)",    // Forest Green
    "rgba(51, 0, 102, 0.4)",  // Twilight Purple
    "rgba(45, 45, 45, 0.4)"   // Monolith Gray
];

type ShelfItem = {
    id: string;
    title: string;
    type: "movie" | "book" | "tv" | "audio" | "podcast";
    category?: string;
    pubDatetime: string;
    author?: string;
    description: string;
    image?: string;
    rating: number;
    color: string;
    link?: string;
    featured?: boolean;
};

// --- UTILS ---
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const getRandomColor = () => CINEMATIC_COLORS[Math.floor(Math.random() * CINEMATIC_COLORS.length)];

async function fetchMetadata(url: string) {
    console.log(`\x1b[36m🔍 Fetching metadata from: ${url}\x1b[0m`);

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    const html = await response.text();

    const extractMeta = (regex: RegExp) => {
        const match = html.match(regex);
        return match ? match[1] : null;
    };

    const title = extractMeta(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || "";
    const description = extractMeta(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) || "";
    const image = extractMeta(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || "";

    return { title, description, image, html };
}

async function handleOpenLibrary(url: string): Promise<ShelfItem> {
    const match = url.match(/works\/(OL[0-9]+W)/);
    const workId = match ? match[1] : null;

    console.log(`\x1b[35m📚 OpenLibrary path detected...\x1b[0m`);

    if (!workId) {
        // Fallback if they pasted an edition URL without /works/
        const matchEd = url.match(/books\/(OL[0-9]+M)/);
        if (matchEd) {
            console.log(`\x1b[33m⚠️ Detected Edition URL. Trying to find parent Work for description...\x1b[0m`);
            const res = await fetch(`https://openlibrary.org/books/${matchEd[1]}.json`);
            const edition = await res.json();
            // Often the work ID is in the edition data
            const works = edition.works || [];
            if (works.length > 0) {
                return handleOpenLibrary(`https://openlibrary.org${works[0].key}`);
            }
        }
    }

    // Fetch Work Data (Description lies here)
    const workUrl = `https://openlibrary.org/works/${workId}.json`;
    const res = await fetch(workUrl);
    const workData = await res.json();

    // Fetch Author Data
    let authorName = "Unknown Author";
    if (workData.authors && workData.authors.length > 0) {
        const authorRes = await fetch(`https://openlibrary.org${workData.authors[0].author.key}.json`);
        const authorData = await authorRes.json();
        authorName = authorData.name || "Unknown Author";
    }

    let description = "";
    if (typeof workData.description === 'string') {
        description = workData.description;
    } else if (workData.description && workData.description.value) {
        description = workData.description.value;
    }

    // Cover
    const image = workData.covers && workData.covers.length > 0
        ? `https://covers.openlibrary.org/b/id/${workData.covers[0]}-L.jpg`
        : "";

    // Truncate description (OpenLibrary)
    if (description.length > 300) {
        description = description.substring(0, 300).trim() + "...";
    }

    return {
        id: slugify(workData.title || "new-book"),
        title: workData.title || "New Book",
        type: "book",
        category: "Reading",
        pubDatetime: new Date().toISOString(),
        author: authorName,
        description: description || "No description provided.",
        image: image,
        rating: 5,
        color: getRandomColor(),
        link: url
    };
}

async function handleTMDB(url: string): Promise<ShelfItem> {
    const { title, description, image, html } = await fetchMetadata(url);
    const isTV = url.includes('/tv/');

    let author = "Unknown";
    let category = isTV ? "TV Show" : "Movie";

    // 1. Try JSON-LD
    try {
        const ldJsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
        if (ldJsonMatch) {
            const ldData = JSON.parse(ldJsonMatch[1]);

            if (ldData.director) {
                author = Array.isArray(ldData.director) ? ldData.director[0].name : ldData.director.name;
            } else if (ldData.creator) {
                const creators = Array.isArray(ldData.creator) ? ldData.creator : [ldData.creator];
                author = creators.map((c: any) => c.name).slice(0, 2).join(', ');
            }

            if (ldData.genre) {
                const genres = Array.isArray(ldData.genre) ? ldData.genre : [ldData.genre];
                if (genres.length > 0) category = genres[0];
            }
        }
    } catch (e) { }

    // 1b. HTML Fallback for Genre
    // If category is still default, try to find it in the HTML
    // Pattern: <a href="/genre/18-drama/movie">Drama</a>
    if (category === "Movie" || category === "TV Show") {
        const genreMatch = html.match(/<a[^>]+href=["']\/genre\/\d+-[^"']+["'][^>]*>([^<]+)<\/a>/i);
        if (genreMatch) {
            category = genreMatch[1].trim();
        }
    }

    // 2. HTML Fallback for Director/Creator (common TMDB markup)
    if (author === "Unknown") {
        // Structure: <li ...> ... <a href="/person/...">Name</a> ... <p ...>Director</p> ... </li>
        // The debug showed <p class="character">Director, Writer</p>, so we look for an anchor Name BEFORE that paragraph within reasonable distance
        const directorMatch = html.match(/<a[^>]+>([^<]+)<\/a>(?:(?!<\/li>).)*?<p[^>]*>.*?Director.*?<\/p>/s);
        const creatorMatch = html.match(/<a[^>]+>([^<]+)<\/a>(?:(?!<\/li>).)*?<p[^>]*>.*?Creator.*?<\/p>/s);

        if (directorMatch) author = directorMatch[1].trim();
        else if (creatorMatch) author = creatorMatch[1].trim();
    }

    // 3. Fallback to Genre/Category
    if (author === "Unknown" || !author) {
        author = category;
    }

    // Clean description and truncate (TMDB)
    let cleanDesc = description
        .replace(/\.\.\.\s*Read the full.*$/i, '...')
        .replace(/<[^>]*>?/gm, '') // Strip HTML
        .trim();

    if (cleanDesc.length > 300) {
        cleanDesc = cleanDesc.substring(0, 300).trim() + "...";
    }

    return {
        id: slugify(title.split('(')[0].trim() || "new-item"),
        title: title.split('(')[0].trim() || "New Item",
        type: isTV ? "tv" : "movie",
        category: category,
        pubDatetime: new Date().toISOString(),
        author: author,
        description: cleanDesc || "No description provided.",
        image: image || "",
        rating: 5,
        color: getRandomColor(),
        link: url
    };
}

// --- MAIN ---
async function main() {
    const url = process.argv[2];
    if (!url) {
        console.error("❌ Please provide a URL as an argument.");
        process.exit(1);
    }

    try {
        let newItem: ShelfItem;

        if (url.includes('themoviedb.org')) {
            newItem = await handleTMDB(url);
        } else if (url.includes('openlibrary.org')) {
            newItem = await handleOpenLibrary(url);
        } else {
            console.error("❌ Unsupported source. Currently only supports TMDB and OpenLibrary.");
            process.exit(1);
        }

        // Read existing
        const existingData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

        // Check for dups
        if (existingData.some((item: any) => item.id === newItem.id)) {
            console.warn(`\x1b[33m⚠️ Item with ID "${newItem.id}" already exists. Updating instead.\x1b[0m`);
            const index = existingData.findIndex((item: any) => item.id === newItem.id);
            existingData[index] = { ...existingData[index], ...newItem };
        } else {
            existingData.push(newItem);
        }

        // Write back
        fs.writeFileSync(DATA_PATH, JSON.stringify(existingData, null, 2));

        console.log(`\x1b[32m✅ Successfully added "${newItem.title}" to the shelf!\x1b[0m`);
        console.log(`\x1b[90mLocation: ${DATA_PATH}\x1b[0m`);

    } catch (error) {
        console.error("❌ Error processing URL:", error);
        process.exit(1);
    }
}

main();
