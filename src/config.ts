export const SITE = {
  website: "https://shannondussoye.github.io/", // replace this with your deployed domain
  author: "Shannon Dussoye",
  profile: "https://shannondussoye.github.io/",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "Shannon Dussoye",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: false,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/shannondussoye/shannondussoye.github.io/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Bangkok", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
