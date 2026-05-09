const RAINDROP_API_URL = "https://api.raindrop.io/rest/v1/raindrops/68672269";

export interface ShelfItem {
  id: string;
  title: string;
  type: "movie" | "book" | "tv" | "audio" | "podcast";
  category?: string;
  pubDatetime: Date;
  author?: string;
  description: string;
  image?: string;
  rating: number;
  color: string;
  link?: string;
}

const CINEMATIC_COLORS = [
  "rgba(0, 102, 204, 0.4)", // Deep Blue
  "rgba(45, 27, 0, 0.4)",   // Warm Amber
  "rgba(0, 26, 51, 0.4)",   // Space Black
  "rgba(102, 0, 0, 0.4)",   // Crimson
  "rgba(0, 51, 0, 0.4)",    // Forest Green
  "rgba(51, 0, 102, 0.4)",  // Twilight Purple
  "rgba(45, 45, 45, 0.4)"   // Monolith Gray
];

const getRandomColor = () => CINEMATIC_COLORS[Math.floor(Math.random() * CINEMATIC_COLORS.length)];

function inferType(url: string, tags: string[] = []): "movie" | "book" | "tv" | "audio" | "podcast" {
  const urlLower = url.toLowerCase();
  
  // 1. Explicit Tag Overrides (Highest Priority - Specific to Broad)
  if (tags.includes("podcast")) return "podcast";
  if (tags.includes("audio")) return "audio";
  if (tags.includes("book")) return "book";
  if (tags.includes("tv")) return "tv";
  if (tags.includes("movie")) return "movie";

  // 2. URL-based Inference
  if (urlLower.includes("audible.com") || urlLower.includes("storytel.com")) return "audio";
  if (urlLower.includes("podcasts.apple.com") || urlLower.includes("spotify.com/show")) return "podcast";
  if (urlLower.includes("themoviedb.org/movie")) return "movie";
  if (urlLower.includes("themoviedb.org/tv")) return "tv";
  if (urlLower.includes("openlibrary.org") || urlLower.includes("goodreads.com") || urlLower.includes("books.google.com")) return "book";
  
  // 3. Broad Fallbacks
  if (urlLower.includes("themoviedb.org")) return "movie";
  return "movie"; // Final default
}

export async function getExternalShelfItems(): Promise<ShelfItem[]> {
  try {
    const token = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.RAINDROP_TEST_TOKEN : undefined) || process.env.RAINDROP_TEST_TOKEN;
    if (!token) {
        console.warn("RAINDROP_TEST_TOKEN is not set. Cannot fetch external shelf items.");
        return [];
    }

    const response = await fetch(RAINDROP_API_URL, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        console.error(`Error fetching from Raindrop API: ${response.statusText}`);
        return [];
    }

    const data = await response.json();
    const items = data.items || [];

    return items.map((item: any) => {
      const link = item.link || "";
      const rawTags = item.tags || [];
      const tags = rawTags.map((t: string) => t.toLowerCase().trim());
      
      const type = inferType(link, tags);
      
      const rawDescription = item.excerpt || item.note || "";
      
      // Clean description
      let description = rawDescription.replace(/<[^>]*>/g, '').trim();
      if (description.length > 300) description = description.substring(0, 300) + "...";

      // Parse title loosely
      let title = item.title || "";
      title = title.split(/ [|—-] /)[0].replace(/\s*\(.*\)\s*$/, "").trim();

      return {
        id: `external-${item._id}`,
        title: title || "Unknown",
        type: type,
        category: type.charAt(0).toUpperCase() + type.slice(1),
        pubDatetime: new Date(item.created),
        author: "Raindrop", 
        description: description || "Curated via Raindrop.",
        image: item.cover || "", 
        rating: 5, 
        color: getRandomColor(),
        link: link
      };
    });
  } catch (error) {
    console.error("Error fetching external shelf items:", error);
    return [];
  }
}
