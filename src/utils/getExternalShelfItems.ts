import { XMLParser } from "fast-xml-parser";

const RAINDROP_SHELF_RSS_URL = import.meta.env.PUBLIC_RAINDROP_SHELF_RSS_URL || "https://bg.raindrop.io/rss/public/68672269";

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
    const response = await fetch(RAINDROP_SHELF_RSS_URL);
    if (!response.ok) return [];

    const xmlData = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    const jsonObj = parser.parse(xmlData);
    const items = jsonObj.rss?.channel?.item;

    if (!items) return [];
    const itemsList = Array.isArray(items) ? items : [items];

    return itemsList.map((item: any) => {
      const link = item.link;
      
      // 1. More robust tag extraction
      let rawTags = item.category ? (Array.isArray(item.category) ? item.category : [item.category]) : [];
      const tags = rawTags.map((t: any) => (typeof t === 'string' ? t : t["#text"] || "").toLowerCase().trim());
      
      const type = inferType(link, tags);
      
      const rawDescription = item.description || "";
      
      // 1. Extract Image from <img> tag in description
      const imgMatch = rawDescription.match(/<img[^>]+src="([^"]+)"/i);
      const extractedImage = imgMatch ? imgMatch[1] : "";

      // 2. Clean description (remove HTML and the image tag)
      let description = rawDescription.replace(/<[^>]*>/g, '').trim();
      if (description.length > 300) description = description.substring(0, 300) + "...";

      return {
        id: `external-${Buffer.from(link).toString('base64').substring(0, 10)}`,
        title: item.title.split(/ [|—-] /)[0].replace(/\s*\(.*\)\s*$/, "").trim(),
        type: type,
        category: type.charAt(0).toUpperCase() + type.slice(1),
        pubDatetime: new Date(item.pubDate),
        author: "Raindrop", 
        description: description || "Curated via Raindrop.",
        image: extractedImage || item["media:content"]?.["@_url"] || item.enclosure?.["@_url"] || "", 
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
