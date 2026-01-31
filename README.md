# Shannon Dussoye 📄

![Shannon Dussoye Blog](public/astropaper-og.jpg)

This is my personal blog, migrated from Jekyll to [AstroPaper](https://github.com/satnaing/astro-paper).

## 🚀 Project Structure

Inside of this project, you'll see the following folders and files:

```bash
/
├── public/
│   ├── pagefind/ # auto-generated when build
│   ├── favicon.svg
│   ├── astropaper-og.jpg
│   ├── img/      # Legacy Jekyll blog images
│   ├── images/   # Legacy Jekyll blog images
│   ├── js/       # Legacy interactive visualization scripts
│   └── pages/    # Legacy HTML visualization pages
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   ├── data/
│   │   └── blog/ # Blog posts in Markdown
│   ├── layouts/
│   ├── pages/
│   ├── scripts/
│   ├── styles/
│   ├── utils/
│   ├── config.ts
│   ├── constants.ts
│   ├── content.config.ts
│   ├── env.d.ts
│   └── remark-collapse.d.ts
└── astro.config.ts
```

## 💻 Tech Stack

- **Main Framework** - [Astro](https://astro.build/)
- **Type Checking** - [TypeScript](https://www.typescriptlang.org/)
- **Styling** - [TailwindCSS](https://tailwindcss.com/)
- **Static Search** - [Pagefind](https://pagefind.app/)
- **Icons** - [Tabler Icons](https://tabler-icons.io/)
- **Code Formatting** - [Prettier](https://prettier.io/)

## 👨🏻‍💻 Running Locally

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start the project**:
    ```bash
    npm run dev
    ```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                        |
| :--------------------- | :-------------------------------------------- |
| `npm install`          | Installs dependencies                         |
| `npm run dev`          | Starts local dev server at `localhost:4321`   |
| `npm run build`        | Build your production site to `./dist/`       |
| `npm run preview`      | Preview your build locally, before deploying  |
| `npm run format`       | Format code with Prettier                     |
| `npm run lint`         | Lint with ESLint                              |

## 📜 License

Licensed under the MIT License, Copyright © 2026.
Original theme by [Sat Naing](https://satnaing.dev).

---

# 🌍 The Atlas Contributor's Guide

This section explains how to add new travel memories or dining experiences to the interactive globe and timeline.

### 1. Create the File
Add a new `.md` file to `src/data/atlas/`.  
*Example: `paris-summer.md`*

### 2. The Data Blueprint (Frontmatter)
Every file must start with this data block:

```markdown
---
title: "Memory Title"
location: "City, Country"
coordinates: [latitude, longitude] # [Number, Number]
pubDatetime: 2024-05-20T12:00:00Z    # Used for timeline sorting
category: "travel"                  # "travel" or "dining"
images:
  - "CLOUDINARY_URL_1"
  - "CLOUDINARY_URL_2"
tags: ["city", "adventure"]
---

Write your story here in Markdown.
```

### 3. Coordinate Lookup
1.  Go to [Google Maps](https://www.google.com/maps).
2.  **Right-click** on the specific location.
3.  The first numbers provided (e.g., `48.858, 2.294`) are the **Latitude** and **Longitude**.
4.  Copy them exactly into the `coordinates: [lat, lng]` field.

### 4. Cloudinary Image Optimization
To ensure the Atlas loads instantly, always include `/f_auto,q_auto/` in your Cloudinary URLs:
`https://res.cloudinary.com/[id]/image/upload/f_auto,q_auto/v123.../image.jpg`

---

# 🛠️ Workshop Contributor's Guide

To add new gear or books to the Workshop bento grid:
1.  Add a new file to `src/data/workshop/`.
2.  Follow the schema:
```markdown
---
title: "Item Name"
description: "Short description"
pubDatetime: 2024-01-01
category: "Tech" or "Books"
heroImage: "/assets/workshop/image-name.png"
---
```
3.  Place the corresponding image in `public/assets/workshop/`.
