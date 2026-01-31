import rss from "@astrojs/rss";
import { getUnifiedFeed } from "@/utils/getUnifiedFeed";
import { SITE } from "@/config";

export async function GET() {
  const items = await getUnifiedFeed(50); // Fetch more for RSS

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: items.map((item) => {
      // Create a descriptive title for RSS
      const rssTitle = item.title || item.text?.substring(0, 80) + "...";

      // Create a descriptive content/summary
      const rssDescription = item.recommendation || item.text || `${item.platform} activity`;

      return {
        link: item.link.startsWith('http') ? item.link : new URL(item.link, SITE.website).href,
        title: `[${item.platform}] ${rssTitle}`,
        description: rssDescription,
        pubDate: new Date(item.date),
      };
    }),
  });
}
