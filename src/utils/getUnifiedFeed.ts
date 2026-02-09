import { getCollection } from "astro:content";
import { XMLParser } from "fast-xml-parser";

const BLUESKY_HANDLE = import.meta.env.PUBLIC_BLUESKY_HANDLE || "anotherrealshannon.bsky.social";
const SUBSTACK_URL = import.meta.env.PUBLIC_SUBSTACK_URL || "https://shannon205107.substack.com/feed";
const HN_USERNAME = import.meta.env.PUBLIC_HN_USERNAME || "notrealrootuser";
const RAINDROP_RSS_URL = import.meta.env.PUBLIC_RAINDROP_RSS_URL || "https://bg.raindrop.io/rss/public/66293279";
const GITHUB_USERNAME = "shannondussoye";

export interface ActivityItem {
  type: string;
  platform: string;
  category: string;
  label: string;
  title?: string;
  text?: string;
  recommendation?: string;
  date: number;
  displayDate: string;
  color: string;
  link: string;
}

export async function getUnifiedFeed(limit = 25): Promise<ActivityItem[]> {
  let activityItems: ActivityItem[] = [];

  // 1. BLUESKY
  try {
    const bskyResponse = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${BLUESKY_HANDLE}&limit=10`
    );
    if (bskyResponse.ok) {
      const data = await bskyResponse.json();
      const bskyItems = data.feed.map((item: any) => {
        const post = item.post;
        return {
          type: "bluesky",
          platform: "Bluesky",
          category: "social",
          label: "Post",
          text: post.record.text,
          date: new Date(post.indexedAt).getTime(),
          displayDate: new Date(post.indexedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          }),
          color: "text-[#0085ff]",
          link: `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`
        };
      });
      activityItems = [...activityItems, ...bskyItems];
    }
  } catch (e) { }

  // 2. SUBSTACK
  try {
    const ssResponse = await fetch(SUBSTACK_URL);
    if (ssResponse.ok) {
      const xmlData = await ssResponse.text();
      const parser = new XMLParser();
      const jsonObj = parser.parse(xmlData);
      const items = jsonObj.rss?.channel?.item;
      if (items) {
        const itemsList = Array.isArray(items) ? items : [items];
        const ssItems = itemsList.slice(0, 5).map((item: any) => ({
          type: "substack",
          platform: "Substack",
          category: "writing",
          label: "Article",
          title: item.title,
          recommendation: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : "",
          date: new Date(item.pubDate).getTime(),
          displayDate: new Date(item.pubDate).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          }),
          color: "text-[#ff6719]",
          link: item.link
        }));
        activityItems = [...activityItems, ...ssItems];
      }
    }
  } catch (e) { }

  // 3. HACKER NEWS
  try {
    const hnUserResponse = await fetch(`https://hacker-news.firebaseio.com/v0/user/${HN_USERNAME}.json`);
    if (hnUserResponse.ok) {
      const userData = await hnUserResponse.json();
      if (userData.submitted) {
        const topSubmissions = userData.submitted.slice(0, 5);
        const hnItems = await Promise.all(
          topSubmissions.map(async (id: number) => {
            const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            const item = await itemRes.json();
            return {
              type: "hackernews",
              platform: "Hacker News",
              category: "social",
              label: item.type === "comment" ? "Comment" : "Story",
              title: item.title || (item.text ? item.text.substring(0, 100) + "..." : "HN Interaction"),
              date: item.time * 1000,
              displayDate: new Date(item.time * 1000).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
              }),
              color: "text-[#fb651e]",
              link: `https://news.ycombinator.com/item?id=${id}`
            };
          })
        );
        activityItems = [...activityItems, ...hnItems];
      }
    }
  } catch (e) { }

  // 4. RAINDROP
  try {
    const rdResponse = await fetch(RAINDROP_RSS_URL);
    if (rdResponse.ok) {
      const xmlData = await rdResponse.text();
      const parser = new XMLParser();
      const jsonObj = parser.parse(xmlData);
      const items = jsonObj.rss?.channel?.item;
      if (items) {
        const itemsList = Array.isArray(items) ? items : [items];
        const rdItems = itemsList.slice(0, 15).map((item: any) => ({
          type: "raindrop",
          platform: "Reading",
          category: "reading",
          label: "Bookmark",
          title: item.title,
          recommendation: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : "",
          date: new Date(item.pubDate).getTime(),
          displayDate: new Date(item.pubDate).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          }),
          color: "text-blue-400",
          link: item.link
        }));
        activityItems = [...activityItems, ...rdItems];
      }
    }
  } catch (e) { }

  // 5. GITHUB STARS
  try {
    const ghResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/starred?per_page=10`, {
      headers: { 'Accept': 'application/vnd.github.v3.star+json' }
    });
    if (ghResponse.ok) {
      const data = await ghResponse.json();
      const ghItems = data.map((item: any) => ({
        type: "github-star",
        platform: "GitHub",
        category: "stars",
        label: "Star",
        title: item.repo.full_name,
        recommendation: item.repo.description,
        date: new Date(item.starred_at).getTime(),
        displayDate: new Date(item.starred_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric'
        }),
        color: "text-purple-400",
        link: item.repo.html_url
      }));
      activityItems = [...activityItems, ...ghItems];
    }
  } catch (e) { }

  // 6. INTERNAL CONTENT
  const blogPosts = await getCollection("blog", ({ data }) => !data.draft);
  const blogItems = blogPosts.map(post => ({
    type: "blog",
    platform: "Writing",
    category: "writing",
    label: "Post",
    title: post.data.title,
    recommendation: post.data.description,
    date: post.data.pubDatetime.getTime(),
    displayDate: post.data.pubDatetime.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    }),
    color: "text-accent",
    link: `/posts/${post.id}/`
  }));

  const workshopEntries = await getCollection("workshop", ({ data }) => !data.draft);
  const workshopItems = workshopEntries.map(entry => ({
    type: "workshop",
    platform: "Workshop",
    category: "workshop",
    label: "Project",
    title: entry.data.title,
    recommendation: entry.data.description,
    date: entry.data.pubDatetime.getTime(),
    displayDate: entry.data.pubDatetime.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    }),
    color: "text-accent",
    link: "/workshop/"
  }));

  const shelfEntries = await getCollection("shelf");
  const shelfItems = shelfEntries
    .filter(({ data }) => !data.draft)
    .map(item => ({
      type: "curated",
      platform: "Shelf",
      category: "reading",
      label: item.data.type,
      title: item.data.title,
      recommendation: item.data.description,
      date: item.data.pubDatetime.getTime(),
      displayDate: item.data.pubDatetime.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      }),
      color: "text-accent",
      link: "/shelf/"
    }));

  activityItems = [...activityItems, ...blogItems, ...workshopItems, ...shelfItems];

  // Final Sort & Cap
  activityItems.sort((a, b) => b.date - a.date);
  return activityItems.slice(0, limit);
}
