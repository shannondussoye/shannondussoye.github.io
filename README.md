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
