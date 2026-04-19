# portfolio

Brayden May's personal portfolio. Dual-mode site: terminal at `/`, GUI fallback at `/gui`.

## Dev

    npm install
    npm run dev            # http://localhost:3000
    npm test               # unit tests
    npm run test:e2e       # smoke e2e

## Add content

- Articles: add `content/writing/<slug>.mdx` with frontmatter (title, date, excerpt, tags, draft)
- Books: edit `content/reading/books.ts`; drop covers in `public/books/`

## Deploy

Connected to Vercel. Push to `main` to deploy.
