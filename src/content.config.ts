import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";
export const WORKSHOP_PATH = "src/data/workshop";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: () =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: z.string().optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const workshop = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${WORKSHOP_PATH}` }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDatetime: z.coerce.date(),
      heroImage: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().optional(),
    }),
});

const atlas = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./src/data/atlas` }),
  schema: () =>
    z.object({
      title: z.string(),
      location: z.string(),
      coordinates: z.tuple([z.number(), z.number()]), // [lat, lng]
      pubDatetime: z.coerce.date(),
      images: z.array(z.string()).default([]), // Array of image URLs for carousel
      category: z.enum(["travel", "dining"]).default("travel"),
      tags: z.array(z.string()).default([]),
      trip: z.string().optional(),
      tripDescription: z.string().optional(), // Custom intro for trip summary
      draft: z.boolean().optional(),
    }),
});

export const collections = { blog, workshop, atlas };
