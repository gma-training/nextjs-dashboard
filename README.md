## Next.js App Router Course

This repository contains the result of me working through Vercel's Next.js Foundations Course, in mid-2026. I fancied a refresher.

I've been making notes in my commit messages.

## Running the code

The app needs an instance of Postgres to be running. I'm running it locally in Docker. To download and launch it, run:

    docker compose up -d

To install dependencies and then run the web server, use:

    pnpm install
    pnpm dev

You should now be able to visit the site's home page at <http://localhost:3000/>.

To seed the database with dummy data, visit <http://localhost:3000/seed>.
