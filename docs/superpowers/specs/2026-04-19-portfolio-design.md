# Personal portfolio — design spec

**Author:** Brayden May
**Date:** 2026-04-19
**Status:** Draft — awaiting review

## Summary

Brayden's personal portfolio, built as a dual-mode site:

- **Terminal mode** (`/`) — the primary experience. A CLI interface where visitors type commands (`about`, `work`, `writing`, `reading`, `contact`) to reveal content.
- **GUI mode** (`/gui`) — a plain-text fallback for visitors who don't want a terminal UX. Simple, considered, no polish.

Both modes render from the same content sources. Mobile visitors default to GUI; desktop visitors default to terminal. Users can switch either direction, and the choice persists.

The site replaces a prior static HTML/CSS/JS portfolio at `~/repos/personal-portfolio/`. The new implementation lives at `~/repos/portfolio/` and leaves the old repo untouched.

## Goals

- Distinctive, on-brand experience that reflects Brayden's identity (builder, designer, CS student)
- Functional for every visitor — recruiters on phones, crawlers, JS-disabled users, and terminal nerds
- Fast to ship (< 1 week of focused work), easy to maintain (content = markdown + TS)
- Zero-friction publishing: add an article or book by committing a file

## Non-goals

- CMS, database, auth, or server-side state
- Analytics (can be added later)
- Animations or polish in GUI mode (intentionally plain)
- Blog comments, reactions, or engagement features

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Content:** MDX (articles), TypeScript module (books)
- **Font:** Berkeley Mono, self-hosted from `public/fonts/`
- **Deploy:** Vercel, connected to GitHub repo, auto-deploy on push to `main`
- **Repo:** `/Users/braydenmay/repos/portfolio/` (new). `~/repos/personal-portfolio/` stays as-is.

## Architecture

```
portfolio/
├── app/
│   ├── layout.tsx                # Root layout: theme provider, meta tags, font
│   ├── page.tsx                  # Terminal mode (client component)
│   ├── gui/
│   │   ├── layout.tsx            # GUI shared layout: header/footer, switch link
│   │   ├── page.tsx              # GUI home
│   │   ├── writing/
│   │   │   ├── page.tsx          # GUI article index
│   │   │   └── [slug]/page.tsx   # GUI article detail
│   │   └── reading/page.tsx      # GUI book list
│   └── not-found.tsx             # 404 (terminal-styled)
├── components/
│   ├── terminal/
│   │   ├── Terminal.tsx          # Main terminal shell
│   │   ├── Prompt.tsx            # Input line with blinking caret
│   │   ├── Output.tsx            # Typed output line renderer
│   │   └── commands.ts           # Command registry & handlers
│   ├── gui/
│   │   ├── Header.tsx            # Minimal plain header
│   │   └── Footer.tsx            # Contact list
│   ├── ModeSwitch.tsx            # Persistent switch link + smart default
│   └── SeoContent.tsx            # SSR-only crawler content for terminal route
├── content/
│   ├── writing/
│   │   ├── on-building-ai-agents.mdx
│   │   └── ...                   # One MDX file per article
│   └── reading/
│       └── books.ts              # Static book list
├── lib/
│   ├── writing.ts                # Parse/list MDX articles, reading time
│   ├── reading.ts                # Load book list
│   └── mode.ts                   # Mode preference (cookie + localStorage)
├── public/
│   ├── fonts/BerkeleyMono-Regular.otf
│   └── books/                    # Book cover images
└── docs/superpowers/specs/       # This document lives here
```

### Why these boundaries

- `components/terminal/` is a self-contained unit — swap it out or embed it elsewhere without touching the rest. Internal state (history, output buffer) is owned here.
- `lib/writing.ts` and `lib/reading.ts` are the single source of truth for content. Both terminal commands and GUI pages call these libs; neither knows how the other renders.
- `components/ModeSwitch.tsx` owns all mode-preference logic (cookie read/write, mobile detection, default decisions). No other component touches this concern.
- `SeoContent.tsx` renders the same content as `/gui` but hidden via CSS, inside the terminal page's HTML — so crawlers see real text and share cards work without JS.

### Data flow

```
content/writing/*.mdx  →  lib/writing.ts  →  ├─ app/gui/writing/*       (GUI pages)
                                             └─ commands.ts `writing`   (terminal command)

content/reading/books.ts → lib/reading.ts →  ├─ app/gui/reading         (GUI page)
                                             └─ commands.ts `reading`   (terminal command)
```

Everything is static at build time. No runtime data fetching.

## Terminal mode (`/`)

### Initial state

On load, the page shows:

```
type help to get started, or try: about, work, writing
brayden@portfolio:~$ _
```

A blinking caret (`_`) sits at the prompt. Top-right corner shows a persistent link: `[switch to GUI →]`.

### Commands

| Command | Output |
|---------|--------|
| `help` | Lists all commands with one-line descriptions |
| `about` | Short bio (2-3 lines) |
| `work` | Builders, Mango, Ohio State — title + description, one per section |
| `skills` | Tech stack, grouped: design, frontend, backend, infra |
| `writing` | Lists articles: `YYYY-MM-DD  title` |
| `writing <slug>` | Renders article MDX as plain-text output (styled headings, code blocks, links) |
| `reading` | Lists books: `title — author  [★★★★★]` |
| `reading <n>` | Shows book N in detail (title, author, rating, note) |
| `contact` | Email (copyable), GitHub, LinkedIn — all clickable |
| `clear` | Empties the terminal buffer |
| `theme` | Toggles dark/light, persists in localStorage |
| `source` | Opens the portfolio's GitHub repo |

Unknown commands print `command not found: <cmd>. try: help` and trigger the GUI-fallback banner (see below).

### Input behavior

- **Tab** — autocompletes the current command or argument (article slugs, book indices)
- **Up / Down arrows** — navigate command history (session only)
- **Enter** — submits; output types out fast (~10ms per char), respects `prefers-reduced-motion`
- **Ctrl+L** or `clear` — clears buffer

### GUI fallback prompts

- **Persistent link** top-right: `[switch to GUI →]` — always visible
- **Gentle banner** appears once per session after:
  - 8 seconds of no input, OR
  - The first unknown command
  ```
  not sure what to type? [switch to GUI →]
  ```
  Dismissable; does not reappear that session.

### URL deep linking

- `/` — blank prompt
- `/?cmd=writing` — auto-runs `writing` on load (appears as if the user typed it)
- `/?cmd=writing+on-building-ai-agents` — auto-runs `writing on-building-ai-agents`

This makes specific terminal outputs shareable, and makes browser back/forward work for command navigation (each Enter pushes history state).

### SEO / crawler path

The terminal route's SSR HTML includes a visually-hidden `<SeoContent>` block with the full GUI content (bio, work, skills, contact, article list, book list). Crawlers see real text. Proper `<meta>` + OpenGraph tags on every route.

## GUI mode (`/gui`)

### Design principles

Plain. Considered. No animations, no theme toggle, no palette, no effects. Monospace font, black on off-white.

### Pages

- **`/gui`** — name, one-line bio, sections for About / Work / Skills, links to Writing, Reading, Contact
- **`/gui/writing`** — article index: `YYYY-MM-DD  title` rows, newest first
- **`/gui/writing/[slug]`** — article title, date, reading time, body (MDX)
- **`/gui/reading`** — list of books: cover thumb, title, author, star rating

All pages share a minimal header (name + nav) and a footer (contact links). Top-right corner shows `[switch to terminal →]`.

### Structure, not bareness

"Very very simple" means no polish. It does **not** mean unstructured. Headings, paragraphs, clear visual hierarchy, readable typography — a site that reflects well on Brayden when a recruiter loads it. Think: a well-formatted README.

## Mode preference & mobile default

A small module, `lib/mode.ts`, handles the mode-selection logic:

- On first visit: check viewport width at or below 768px → default to `/gui`. Otherwise → `/`.
- On switch: user clicks `[switch to X →]` → set cookie `portfolio_mode=terminal|gui` (one year) and navigate.
- On subsequent visits: cookie wins over default. Read cookie in root layout, redirect if needed.

This means the server can SSR the correct mode immediately — no flash of the wrong UI.

## Content model

### Articles (`content/writing/*.mdx`)

```mdx
---
title: "On building AI agents"
date: "2026-04-10"
excerpt: "LangGraph isn't magic — it's a state machine with an LLM in the loop."
tags: ["ai", "systems"]
draft: false
---

Article body in MDX. Can embed React components if needed.
```

`lib/writing.ts` globs `content/writing/*.mdx`, parses frontmatter (via `gray-matter`), computes reading time (words / 200), sorts by date descending, filters drafts in production builds.

### Books (`content/reading/books.ts`)

```ts
export type Book = {
  title: string
  author: string
  cover: string          // path under /public/books/
  rating: number | null  // 0-5, null if currently reading
  finishedAt: string     // "YYYY-MM" or "reading"
  note?: string          // one-line take
}

export const books: Book[] = [
  { title: "The Pragmatic Programmer", author: "Hunt & Thomas", cover: "/books/pragmatic.jpg", rating: 5, finishedAt: "2025-09", note: "The classic." },
  // ...
]
```

Adding a book = add an entry + drop a cover image + commit.

## Theming

- Light theme: `#f5f5f5` background, `#0a0a0a` text, `#888` muted, `#ddd` borders
- Dark theme: `#0a0a0a` background, `#f5f5f5` text, `#888` muted, `#222` borders
- Tailwind `class`-based dark mode; toggle in terminal via `theme` command
- Inline script in `<head>` sets class pre-hydration to prevent flash
- GUI mode does not expose a theme toggle (plain by design) — it uses the same preference, but there's no UI to change it within GUI

## Error handling

- **Invalid terminal command** — prints `command not found` line, triggers GUI fallback banner
- **Unknown article slug** — terminal: `article not found: <slug>`; GUI: 404 page
- **Unknown book index** — terminal: `book not found: <n>`
- **404** — custom page styled like terminal output
- **JS disabled** — terminal route still shows SeoContent (real HTML content); GUI works fully without JS

## Testing strategy

Minimal but real:

- **Unit:** `lib/writing.ts` and `lib/reading.ts` — parsing, sorting, draft filtering, reading-time calc
- **Component:** `components/terminal/commands.ts` — each command handler, given mocked content, produces expected output lines
- **Integration (Playwright):** three smoke tests
  1. Load `/` on desktop viewport → terminal renders; type `help` → commands list appears
  2. Load `/` on mobile viewport → redirected to `/gui`
  3. Load `/gui/writing/[slug]` → article renders with title, date, body

No aim for 100% coverage — aim for confidence that the two modes both work and share the same content.

## Accessibility

- All motion respects `prefers-reduced-motion` (typewriter output jumps to full instantly)
- Terminal input is a real `<input>` — screen readers announce it
- All commands accessible via keyboard (the interface is keyboard-first by design)
- Color contrast AA in both themes
- GUI mode is semantic HTML with proper headings, lists, and landmark roles

## Deploy & launch

1. Create Vercel project, connect to new GitHub repo `brayd3nmay/portfolio`
2. Deploy on push to `main`
3. Preview deploys for PRs
4. Custom domain attached when Brayden chooses one (stub for now: `<project>.vercel.app`)

## Open questions (post-launch, not blocking)

- Analytics (Plausible or Vercel Analytics)?
- RSS feed for writing?
- OG image generation per article (dynamic monospace share cards)?
- ASCII renders for headshot / book covers in terminal mode?
- Easter-egg commands (`sudo`, `vim`, `rm -rf /`)?

These are deferred — ship the core first.
