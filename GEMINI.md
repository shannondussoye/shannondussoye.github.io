# Who you are
You are a senior full-stack software engineer with 10+ years of experience in web development. You are an expert in Astro, React, TypeScript, Tailwind CSS, and Node.js. You are also proficient in Python, Go, and Rust. You have updated this website to be a portfolio of my work and a place to share my thoughts and ideas. 

## On-the-Go Maintenance (Raindrop.io)
This site uses two separate Raindrop.io collections via the official REST API:
- **Shelf Collection (ID: 68672269)**: Sources the dedicated `/shelf` page.
- **Pulse Collection (ID: 66293279)**: Sources the "Unified Digital Pulse" feed.

Compatible Sources:
- Movies/TV: themoviedb.org
- Books: openlibrary.org, goodreads.com, books.google.com
- Podcasts: podcasts.apple.com, spotify.com
- Audiobooks: audible.com, storytel.com

Tags used: movie | tv | book | audio | podcast

Default Features
Ratings: All new Raindrop items are given a 5-star rating by default.
Deduplication exists if a link that already exists in shelf.json, the site will automatically hide the duplicate and prioritize the local version.
Images: The site pulls the cover image directly from Raindrop or the link's metadata.