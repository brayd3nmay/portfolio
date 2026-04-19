# Portfolio Implementation Plan (revised)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Brayden May's dual-mode personal portfolio — a terminal-first site at `/` with a plain-text GUI fallback at `/gui`, both sharing a single content source.

**Architecture:** Next.js 15 (App Router) with TypeScript and Tailwind CSS v4. Articles as MDX in `content/writing/`, books as a TypeScript module. `lib/` modules read content on the server only. The terminal client component receives content as serialized props from the root server component — no fs imports leak into the browser bundle. Mode preference is cookie-backed with middleware routing; mobile defaults to GUI.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4 (CSS-first config), next-mdx-remote v5 (article rendering), gray-matter, reading-time, Vitest + React Testing Library, Playwright, Vercel.

**Working directory:** All tasks run from `/Users/braydenmay/repos/portfolio/` unless noted.

---

## Task 1: Scaffold Next.js project into non-empty directory

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `postcss.config.mjs`, `.gitignore`

**Why the tmp-dir dance:** the target repo already contains `.git/` and `docs/`. `create-next-app` refuses non-empty targets. We scaffold into a temp dir and copy the Next.js files in without touching our existing ones.

- [ ] **Step 1: Scaffold into a tmp directory**

Run (from `/Users/braydenmay/repos/portfolio/`):

```bash
TMP=$(mktemp -d)
npx --yes create-next-app@latest "$TMP/app" \
  --ts --tailwind --app --no-src-dir --no-eslint \
  --import-alias "@/*" --use-npm
```

Expect it to finish without prompts.

- [ ] **Step 2: Copy scaffold into the repo**

```bash
rsync -a --exclude='.git' --exclude='node_modules' "$TMP/app/" ./
rm -rf "$TMP"
npm install
```

- [ ] **Step 3: Verify dev server runs**

```bash
npm run dev
```

Open http://localhost:3000 → default Next.js page loads. Ctrl+C to stop.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js 15 with TypeScript and Tailwind v4"
```

---

## Task 2: Install project dependencies (no @next/mdx)

**Files:**
- Modify: `package.json`

We use `next-mdx-remote` for runtime MDX rendering (fits our data-as-props architecture). We do NOT use `@next/mdx` (would require `.mdx` files inside `app/`).

- [ ] **Step 1: Install content deps**

```bash
npm install next-mdx-remote@^5 gray-matter reading-time
```

- [ ] **Step 2: Install testing deps**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 3: Add test scripts**

Edit `package.json` — add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add content and testing dependencies"
```

---

## Task 3: Configure Vitest

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`, `lib/__tests__/smoke.test.ts`

- [ ] **Step 1: Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
})
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 2: Smoke test**

Create `lib/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('smoke', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 3: Run**

```bash
npm test
```

Expected: 1 passed.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Configure Vitest with jsdom and testing-library"
```

---

## Task 4: Self-host Berkeley Mono

**Files:**
- Create: `public/fonts/BerkeleyMono-Regular.otf`
- Modify: `app/layout.tsx`, `app/globals.css`

- [ ] **Step 1: Copy font**

```bash
mkdir -p public/fonts
cp ../personal-portfolio/fonts/BerkeleyMono-Regular.otf public/fonts/
ls public/fonts/   # expect: BerkeleyMono-Regular.otf
```

- [ ] **Step 2: Register font and base theme variables**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const berkeleyMono = localFont({
  src: '../public/fonts/BerkeleyMono-Regular.otf',
  variable: '--font-berkeley-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Brayden May',
  description: 'Brayden May — building at the intersection of technology, design, and business.',
  openGraph: {
    title: 'Brayden May',
    description: 'Building at the intersection of technology, design, and business.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={berkeleyMono.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Self-host Berkeley Mono font"
```

---

## Task 5: Tailwind v4 CSS-first theme

**Files:**
- Modify: `app/globals.css`
- Delete: `tailwind.config.ts` (if present)

Next 15's `--tailwind` ships Tailwind v4. v4 uses `@import "tailwindcss"` and CSS-first config via `@theme`. No `tailwind.config.ts` needed.

- [ ] **Step 1: Remove old config if it exists**

```bash
rm -f tailwind.config.ts tailwind.config.js
```

- [ ] **Step 2: Replace globals.css with v4 theme**

Replace `app/globals.css`:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-bg: #f5f5f5;
  --color-fg: #0a0a0a;
  --color-muted: #888888;
  --color-border: #dddddd;
  --font-mono: var(--font-berkeley-mono), ui-monospace, Menlo, monospace;
}

:root {
  --bg: #f5f5f5;
  --fg: #0a0a0a;
  --muted: #888888;
  --border: #dddddd;
}

.dark {
  --bg: #0a0a0a;
  --fg: #f5f5f5;
  --muted: #888888;
  --border: #222222;
}

html, body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-berkeley-mono), ui-monospace, Menlo, monospace;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 3: Verify dev server still compiles**

```bash
npm run dev
```

Open http://localhost:3000 → page renders in Berkeley Mono on off-white bg. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Configure Tailwind v4 with CSS-first theme and dark variant"
```

---

## Task 6: Seed content (articles + draft + books)

**Files:**
- Create: `content/writing/hello-world.mdx`, `content/writing/on-building-ai-agents.mdx`, `content/writing/draft-post.mdx`, `content/reading/books.ts`, `public/books/*.jpg` (placeholders)

- [ ] **Step 1: Published articles**

Create `content/writing/hello-world.mdx`:

```mdx
---
title: "Hello, world"
date: "2026-04-15"
excerpt: "The obligatory first post."
tags: ["meta"]
draft: false
---

This is the first post on this site. If you're reading this, something's working.
```

Create `content/writing/on-building-ai-agents.mdx`:

```mdx
---
title: "On building AI agents"
date: "2026-04-10"
excerpt: "LangGraph isn't magic — it's a state machine with an LLM in the loop."
tags: ["ai", "systems"]
draft: false
---

## What I learned shipping Mango

Building with LangGraph taught me that agents are just state machines whose transitions happen to involve language models. The hard part isn't the model — it's designing the states.

### The three states that mattered

1. Gather — collect what the user wants
2. Plan — decide the steps
3. Execute — run them, with the ability to revise

Everything else was plumbing.
```

- [ ] **Step 2: Draft fixture (for filter test)**

Create `content/writing/draft-post.mdx`:

```mdx
---
title: "A draft I haven't shipped"
date: "2026-04-01"
excerpt: "Unshipped."
tags: ["meta"]
draft: true
---

This post is a draft. It should appear in dev and disappear in production builds.
```

- [ ] **Step 3: Books**

Create `content/reading/books.ts`:

```ts
export type Book = {
  title: string
  author: string
  cover: string
  rating: number | null
  finishedAt: string
  note?: string
}

export const books: Book[] = [
  { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', cover: '/books/pragmatic.jpg', rating: 5, finishedAt: '2025-09', note: 'The classic. Still holds up.' },
  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', cover: '/books/ddia.jpg', rating: 5, finishedAt: '2026-01', note: 'The reference, unmatched.' },
  { title: 'Zero to One', author: 'Peter Thiel', cover: '/books/zero-to-one.jpg', rating: 4, finishedAt: '2025-11', note: 'Contrarian thinking, mostly holds up.' },
  { title: 'The Timeless Way of Building', author: 'Christopher Alexander', cover: '/books/timeless-way.jpg', rating: null, finishedAt: 'reading', note: '30% in. Slow but deep.' },
]
```

- [ ] **Step 4: Cover placeholders**

```bash
mkdir -p public/books
for f in pragmatic ddia zero-to-one timeless-way; do
  touch public/books/$f.jpg
done
```

Real covers can be dropped in later.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Seed articles, draft fixture, and book list"
```

---

## Task 7: lib/writing.ts with tests (including draft filter)

**Files:**
- Create: `lib/writing.ts`, `lib/__tests__/writing.test.ts`

- [ ] **Step 1: Failing tests**

Create `lib/__tests__/writing.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { getAllArticles, getArticle } from '../writing'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('getAllArticles', () => {
  it('returns articles sorted by date descending', () => {
    const articles = getAllArticles()
    expect(articles.length).toBeGreaterThanOrEqual(2)
    const dates = articles.map(a => a.date)
    const sorted = [...dates].sort((a, b) => b.localeCompare(a))
    expect(dates).toEqual(sorted)
  })

  it('includes reading time and slug on each article', () => {
    const [first] = getAllArticles()
    expect(first.slug).toBeTruthy()
    expect(first.readingTime).toBeGreaterThan(0)
    expect(first.title).toBeTruthy()
  })

  it('includes drafts in non-production', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const slugs = getAllArticles().map(a => a.slug)
    expect(slugs).toContain('draft-post')
  })

  it('excludes drafts in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const slugs = getAllArticles().map(a => a.slug)
    expect(slugs).not.toContain('draft-post')
  })
})

describe('getArticle', () => {
  it('returns an article by slug with body', () => {
    const article = getArticle('hello-world')
    expect(article).not.toBeNull()
    expect(article!.slug).toBe('hello-world')
    expect(article!.body).toContain('first post')
  })

  it('returns null for unknown slug', () => {
    expect(getArticle('does-not-exist')).toBeNull()
  })
})
```

- [ ] **Step 2: Run — expect failure**

```bash
npm test lib/__tests__/writing.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

Create `lib/writing.ts`:

```ts
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export type Article = {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  draft: boolean
  body: string
  readingTime: number
}

const CONTENT_DIR = path.join(process.cwd(), 'content/writing')

function readArticle(filename: string): Article {
  const slug = filename.replace(/\.mdx?$/, '')
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ''),
    excerpt: String(data.excerpt ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft ?? false),
    body: content,
    readingTime: Math.max(1, Math.round(readingTime(content).minutes)),
  }
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  const files = fs.readdirSync(CONTENT_DIR).filter(f => /\.mdx?$/.test(f))
  const all = files.map(readArticle)
  const filtered = process.env.NODE_ENV === 'production' ? all.filter(a => !a.draft) : all
  return filtered.sort((a, b) => b.date.localeCompare(a.date))
}

export function getArticle(slug: string): Article | null {
  for (const ext of ['.mdx', '.md']) {
    const filename = `${slug}${ext}`
    if (fs.existsSync(path.join(CONTENT_DIR, filename))) return readArticle(filename)
  }
  return null
}

export function getAllSlugs(): string[] {
  return getAllArticles().map(a => a.slug)
}
```

- [ ] **Step 4: Pass**

```bash
npm test lib/__tests__/writing.test.ts
```

Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add lib/writing with draft filter and reading time"
```

---

## Task 8: lib/reading.ts with tests

**Files:**
- Create: `lib/reading.ts`, `lib/__tests__/reading.test.ts`

- [ ] **Step 1: Tests**

Create `lib/__tests__/reading.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getBooks, getBook } from '../reading'

describe('getBooks', () => {
  it('returns all books', () => {
    const books = getBooks()
    expect(books.length).toBeGreaterThanOrEqual(3)
    expect(books[0]).toHaveProperty('title')
    expect(books[0]).toHaveProperty('author')
  })
})

describe('getBook', () => {
  it('returns book by 1-based index', () => {
    const book = getBook(1)
    expect(book).not.toBeNull()
    expect(book!.title).toBeTruthy()
  })

  it('returns null for out-of-range index', () => {
    expect(getBook(0)).toBeNull()
    expect(getBook(9999)).toBeNull()
  })
})
```

- [ ] **Step 2: Fail**

```bash
npm test lib/__tests__/reading.test.ts
```

- [ ] **Step 3: Implement**

Create `lib/reading.ts`:

```ts
import { books, type Book } from '@/content/reading/books'
export type { Book }

export function getBooks(): Book[] {
  return books
}

export function getBook(index: number): Book | null {
  if (index < 1 || index > books.length) return null
  return books[index - 1]
}
```

- [ ] **Step 4: Pass**

```bash
npm test lib/__tests__/reading.test.ts
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add lib/reading for book list access"
```

---

## Task 9: lib/mode.ts with tests

**Files:**
- Create: `lib/mode.ts`, `lib/__tests__/mode.test.ts`

- [ ] **Step 1: Tests**

Create `lib/__tests__/mode.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { detectModeFromRequest, MOBILE_UA_REGEX } from '../mode'

describe('detectModeFromRequest', () => {
  it('returns cookie value when set', () => {
    expect(detectModeFromRequest({ cookie: 'terminal', ua: 'iPhone' })).toBe('terminal')
    expect(detectModeFromRequest({ cookie: 'gui', ua: 'Mozilla' })).toBe('gui')
  })

  it('defaults to gui for mobile UA when no cookie', () => {
    expect(detectModeFromRequest({ cookie: null, ua: 'iPhone' })).toBe('gui')
    expect(detectModeFromRequest({ cookie: null, ua: 'Android' })).toBe('gui')
  })

  it('defaults to terminal for desktop UA when no cookie', () => {
    expect(detectModeFromRequest({ cookie: null, ua: 'Mozilla/5.0 (Macintosh)' })).toBe('terminal')
  })

  it('mobile UA regex matches phones not desktops', () => {
    expect(MOBILE_UA_REGEX.test('iPhone')).toBe(true)
    expect(MOBILE_UA_REGEX.test('Android')).toBe(true)
    expect(MOBILE_UA_REGEX.test('Mozilla/5.0 (Macintosh)')).toBe(false)
  })
})
```

- [ ] **Step 2: Fail → implement**

Create `lib/mode.ts`:

```ts
export type Mode = 'terminal' | 'gui'
export const MODE_COOKIE = 'portfolio_mode'
export const MOBILE_UA_REGEX = /iPhone|iPad|iPod|Android|Mobile/i

export function detectModeFromRequest({
  cookie,
  ua,
}: { cookie: string | null; ua: string }): Mode {
  if (cookie === 'terminal' || cookie === 'gui') return cookie
  return MOBILE_UA_REGEX.test(ua) ? 'gui' : 'terminal'
}

export function setModeCookie(mode: Mode) {
  if (typeof document === 'undefined') return
  const oneYear = 60 * 60 * 24 * 365
  document.cookie = `${MODE_COOKIE}=${mode}; path=/; max-age=${oneYear}; SameSite=Lax`
}
```

- [ ] **Step 3: Pass**

```bash
npm test lib/__tests__/mode.test.ts
```

Expected: 4 passed.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add lib/mode for terminal/gui preference detection"
```

---

## Task 10: Middleware + test

**Files:**
- Create: `middleware.ts`, `__tests__/middleware.test.ts`

- [ ] **Step 1: Middleware test**

Create `__tests__/middleware.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from '../middleware'

function makeReq(url: string, { ua = '', cookie = '' } = {}) {
  const headers = new Headers()
  if (ua) headers.set('user-agent', ua)
  if (cookie) headers.set('cookie', cookie)
  return new NextRequest(url, { headers })
}

describe('middleware', () => {
  it('redirects mobile UA at / to /gui', () => {
    const res = middleware(makeReq('http://localhost/', { ua: 'iPhone' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/gui')
  })

  it('does not redirect desktop UA at /', () => {
    const res = middleware(makeReq('http://localhost/', { ua: 'Mozilla/5.0 (Macintosh)' }))
    expect(res.headers.get('location')).toBeNull()
  })

  it('honors cookie over UA', () => {
    const res = middleware(makeReq('http://localhost/', {
      ua: 'iPhone',
      cookie: 'portfolio_mode=terminal',
    }))
    expect(res.headers.get('location')).toBeNull()
  })
})
```

- [ ] **Step 2: Implement**

Create `middleware.ts`:

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectModeFromRequest, MODE_COOKIE } from '@/lib/mode'

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== '/') return NextResponse.next()
  const cookie = req.cookies.get(MODE_COOKIE)?.value ?? null
  const ua = req.headers.get('user-agent') ?? ''
  const mode = detectModeFromRequest({ cookie, ua })
  if (mode === 'gui') {
    const url = req.nextUrl.clone()
    url.pathname = '/gui'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/'] }
```

- [ ] **Step 3: Pass**

```bash
npm test __tests__/middleware.test.ts
```

Expected: 3 passed.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add middleware for mobile/cookie-based mode routing"
```

---

## Task 11: Pre-hydration theme script

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Inject theme script**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const berkeleyMono = localFont({
  src: '../public/fonts/BerkeleyMono-Regular.otf',
  variable: '--font-berkeley-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Brayden May',
  description: 'Brayden May — building at the intersection of technology, design, and business.',
  openGraph: {
    title: 'Brayden May',
    description: 'Building at the intersection of technology, design, and business.',
    type: 'website',
  },
}

const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('portfolio_theme');
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={berkeleyMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

Theme defaults to light; user opts in via terminal `theme` command which persists to localStorage.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "Add pre-hydration theme script"
```

---

## Task 12: ModeSwitch component + test

**Files:**
- Create: `components/ModeSwitch.tsx`, `components/__tests__/ModeSwitch.test.tsx`

- [ ] **Step 1: Test**

Create `components/__tests__/ModeSwitch.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModeSwitch } from '../ModeSwitch'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('ModeSwitch', () => {
  beforeEach(() => {
    document.cookie = 'portfolio_mode=; path=/; max-age=0'
  })

  it('writes cookie when clicked', async () => {
    render(<ModeSwitch to="gui" />)
    await userEvent.click(screen.getByRole('link'))
    expect(document.cookie).toContain('portfolio_mode=gui')
  })

  it('renders correct label for terminal target', () => {
    render(<ModeSwitch to="terminal" />)
    expect(screen.getByRole('link')).toHaveTextContent('switch to terminal')
  })
})
```

- [ ] **Step 2: Implement**

Create `components/ModeSwitch.tsx`:

```tsx
'use client'

import { setModeCookie, type Mode } from '@/lib/mode'
import { useRouter } from 'next/navigation'

export function ModeSwitch({ to }: { to: Mode }) {
  const router = useRouter()
  const label = to === 'terminal' ? 'switch to terminal →' : 'switch to GUI →'
  const href = to === 'terminal' ? '/' : '/gui'
  return (
    <a
      href={href}
      className="text-xs text-muted hover:text-fg"
      onClick={(e) => {
        e.preventDefault()
        setModeCookie(to)
        router.push(href)
      }}
    >
      [{label}]
    </a>
  )
}
```

- [ ] **Step 3: Pass**

```bash
npm test components/__tests__/ModeSwitch.test.tsx
```

Expected: 2 passed.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add ModeSwitch component with cookie write test"
```

---

## Task 13: GUI layout (header, footer)

**Files:**
- Create: `app/gui/layout.tsx`, `components/gui/Header.tsx`, `components/gui/Footer.tsx`

- [ ] **Step 1: Header**

Create `components/gui/Header.tsx`:

```tsx
import Link from 'next/link'
import { ModeSwitch } from '@/components/ModeSwitch'

export function Header() {
  return (
    <header className="relative flex items-baseline justify-between py-6 border-b border-[var(--border)]">
      <Link href="/gui" className="text-base font-semibold">Brayden May</Link>
      <nav className="flex gap-6 text-sm">
        <Link href="/gui/writing" className="hover:underline">Writing</Link>
        <Link href="/gui/reading" className="hover:underline">Reading</Link>
        <a href="mailto:brayd3nmay@gmail.com" className="hover:underline">Contact</a>
      </nav>
      <div className="absolute top-4 right-0">
        <ModeSwitch to="terminal" />
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Footer**

Create `components/gui/Footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="mt-16 pt-6 border-t border-[var(--border)] text-sm text-[var(--muted)]">
      <div className="flex flex-wrap gap-6">
        <a href="mailto:brayd3nmay@gmail.com" className="hover:text-[var(--fg)]">brayd3nmay@gmail.com</a>
        <a href="https://github.com/brayd3nmay" className="hover:text-[var(--fg)]">GitHub</a>
        <a href="https://www.linkedin.com/in/braydenmay/" className="hover:text-[var(--fg)]">LinkedIn</a>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Layout**

Create `app/gui/layout.tsx`:

```tsx
import { Header } from '@/components/gui/Header'
import { Footer } from '@/components/gui/Footer'

export default function GuiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-w-2xl mx-auto px-6 pb-12">
      <Header />
      <main className="py-10">{children}</main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add GUI layout with header and footer"
```

---

## Task 14: GUI home

**Files:**
- Create: `app/gui/page.tsx`

- [ ] **Step 1: Home**

Create `app/gui/page.tsx`:

```tsx
import Link from 'next/link'

export default function GuiHome() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-xl font-semibold">Hi, I'm Brayden.</h1>
        <p className="mt-2 text-[var(--muted)]">
          I'm building at the intersection of technology, design, and business.
        </p>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-[var(--muted)] mb-3">About</h2>
        <p className="text-sm">
          CS &amp; Engineering student at Ohio State, Class of 2027. I work on ambitious projects at the intersection of technology, design, and business.
        </p>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-[var(--muted)] mb-3">Work</h2>
        <ul className="space-y-4">
          <li><div className="font-semibold">Builders</div><p className="text-sm">President. Programming, mentorship, and fundraising for the next generation of founders.</p></li>
          <li><div className="font-semibold">Mango</div><p className="text-sm">Founder. Investor matching platform powered by AI agents. Finalist, OSU Buckeye Accelerator.</p></li>
          <li><div className="font-semibold">Ohio State</div><p className="text-sm">B.S. Computer Science and Engineering, Class of 2027.</p></li>
        </ul>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-[var(--muted)] mb-3">Skills</h2>
        <ul className="text-sm space-y-1">
          <li>Design interfaces in Figma</li>
          <li>Build frontends with React and Next.js</li>
          <li>Write backends in Python, Java, TypeScript, C/C++, and Ruby</li>
          <li>Deploy on AWS, Vercel, and Cloudflare</li>
          <li>Containerize with Docker and run on Linux</li>
          <li>Build AI agents with LangGraph</li>
          <li>Ship everything through Git and GitHub</li>
        </ul>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-[var(--muted)] mb-3">More</h2>
        <ul className="text-sm space-y-1">
          <li><Link href="/gui/writing" className="underline">Writing</Link></li>
          <li><Link href="/gui/reading" className="underline">Reading</Link></li>
        </ul>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```

Open http://localhost:3000/gui → renders. Stop.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add GUI home page with About, Work, Skills, More"
```

---

## Task 15: GUI writing (index + article)

**Files:**
- Create: `app/gui/writing/page.tsx`, `app/gui/writing/[slug]/page.tsx`

- [ ] **Step 1: Index**

Create `app/gui/writing/page.tsx`:

```tsx
import Link from 'next/link'
import { getAllArticles } from '@/lib/writing'

export const metadata = { title: 'Writing — Brayden May' }

export default function WritingIndex() {
  const articles = getAllArticles()
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Writing</h1>
      <ul className="space-y-2">
        {articles.map((a) => (
          <li key={a.slug} className="flex justify-between gap-4 border-b border-[var(--border)] py-2">
            <Link href={`/gui/writing/${a.slug}`} className="hover:underline">{a.title}</Link>
            <span className="text-[var(--muted)] text-sm">{a.date}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: Article detail**

Create `app/gui/writing/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getArticle, getAllSlugs } from '@/lib/writing'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: 'Not found' }
  return {
    title: `${article.title} — Brayden May`,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: 'article' },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  return (
    <article className="max-w-none">
      <Link href="/gui/writing" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">← back to writing</Link>
      <h1 className="text-xl font-semibold mt-6">{article.title}</h1>
      <div className="text-sm text-[var(--muted)] mt-1 mb-8">{article.date} · {article.readingTime} min read</div>
      <div className="space-y-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h3]:font-semibold [&_h3]:mt-6 [&_code]:bg-[var(--border)] [&_code]:px-1 [&_code]:rounded [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6">
        <MDXRemote source={article.body} />
      </div>
    </article>
  )
}
```

- [ ] **Step 3: Verify**

```bash
npm run dev
```

Open http://localhost:3000/gui/writing → list renders. Click article → renders. Stop.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add GUI writing index and article pages"
```

---

## Task 16: GUI reading

**Files:**
- Create: `app/gui/reading/page.tsx`

- [ ] **Step 1: Reading page (plain `<img>` so empty placeholder files don't error)**

Create `app/gui/reading/page.tsx`:

```tsx
import { getBooks } from '@/lib/reading'

export const metadata = { title: 'Reading — Brayden May' }

function stars(rating: number | null) {
  if (rating === null) return '—'
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

export default function ReadingPage() {
  const books = getBooks()
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Reading</h1>
      <ul className="space-y-3">
        {books.map((b) => (
          <li key={b.title} className="grid grid-cols-[40px_1fr_auto] gap-4 items-center border-b border-[var(--border)] py-2">
            <div className="h-14 w-10 bg-[var(--border)] rounded-sm overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.cover} alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-semibold text-sm">{b.title}</div>
              <div className="text-[var(--muted)] text-xs">{b.author}{b.note ? ` — ${b.note}` : ''}</div>
            </div>
            <div className="text-[var(--muted)] text-xs whitespace-nowrap">{stars(b.rating)}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "Add GUI reading page"
```

---

## Task 17: Terminal commands as a pure, data-injected factory (+ tests)

**Files:**
- Create: `components/terminal/commands.ts`, `components/terminal/__tests__/commands.test.ts`, `components/terminal/types.ts`

**Key architectural choice:** commands are pure over injected data (articles, books). No fs imports. The root server component fetches data and passes it into the client terminal, which invokes commands with that data as context. This keeps the client bundle free of `node:fs`.

- [ ] **Step 1: Types**

Create `components/terminal/types.ts`:

```ts
import type { Article } from '@/lib/writing'
import type { Book } from '@/lib/reading'

export type SerializedArticle = Pick<Article, 'slug' | 'title' | 'date' | 'excerpt' | 'readingTime' | 'body'>
export type SerializedBook = Book

export type CommandContext = {
  articles: SerializedArticle[]
  books: SerializedBook[]
}

export type OutputLine =
  | { kind: 'text'; text: string; tone?: 'normal' | 'muted' | 'accent' }
  | { kind: 'link'; text: string; href: string }
  | { kind: 'copy'; text: string; value: string; label: string }
  | { kind: 'heading'; text: string; level: 1 | 2 | 3 }
  | { kind: 'code'; text: string }

export type CommandResult = {
  lines: OutputLine[]
  clear?: boolean
  theme?: 'toggle'
  fallback?: boolean
}
```

- [ ] **Step 2: Tests**

Create `components/terminal/__tests__/commands.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { runCommand, listCommands } from '../commands'
import type { CommandContext } from '../types'

const ctx: CommandContext = {
  articles: [
    { slug: 'post-a', title: 'Post A', date: '2026-02-01', excerpt: 'a', readingTime: 2, body: '## Hello\n\nParagraph text.\n\n```\ncode here\n```' },
    { slug: 'post-b', title: 'Post B', date: '2026-01-01', excerpt: 'b', readingTime: 1, body: 'Plain body.' },
  ],
  books: [
    { title: 'Book One', author: 'Alice', cover: '/x.jpg', rating: 5, finishedAt: '2025-09' },
    { title: 'Book Two', author: 'Bob', cover: '/y.jpg', rating: null, finishedAt: 'reading' },
  ],
}

describe('runCommand', () => {
  it('help lists all commands', () => {
    const out = runCommand('help', ctx)
    const txt = out.lines.map((l) => (l as any).text).join('\n')
    expect(txt).toContain('about')
    expect(txt).toContain('work')
    expect(txt).toContain('writing')
  })

  it('about returns bio', () => {
    const out = runCommand('about', ctx)
    expect(out.lines.map((l) => (l as any).text).join(' ')).toMatch(/Brayden/i)
  })

  it('unknown command flags fallback', () => {
    const out = runCommand('banana', ctx)
    expect(out.fallback).toBe(true)
    expect(out.lines.some((l: any) => /command not found/i.test(l.text))).toBe(true)
  })

  it('clear returns clear signal', () => {
    expect(runCommand('clear', ctx).clear).toBe(true)
  })

  it('reading lists books with star ratings', () => {
    const out = runCommand('reading', ctx)
    const txt = out.lines.map((l: any) => l.text).join('\n')
    expect(txt).toContain('★')
    expect(txt).toContain('Book One')
    expect(txt).toContain('Alice')
  })

  it('reading <n> returns specific book', () => {
    const out = runCommand('reading 2', ctx)
    const txt = out.lines.map((l: any) => l.text).join('\n')
    expect(txt).toContain('Book Two')
  })

  it('writing lists articles', () => {
    const out = runCommand('writing', ctx)
    const txt = out.lines.map((l: any) => l.text).join('\n')
    expect(txt).toContain('Post A')
  })

  it('writing <slug> parses MDX headings and code', () => {
    const out = runCommand('writing post-a', ctx)
    const kinds = out.lines.map((l) => l.kind)
    expect(kinds).toContain('heading')
    expect(kinds).toContain('code')
  })

  it('contact includes a copy entry for email', () => {
    const out = runCommand('contact', ctx)
    const copy = out.lines.find((l) => l.kind === 'copy') as any
    expect(copy).toBeTruthy()
    expect(copy.value).toBe('brayd3nmay@gmail.com')
  })
})

describe('listCommands', () => {
  it('returns all command names', () => {
    const names = listCommands()
    for (const n of ['help', 'about', 'work', 'skills', 'writing', 'reading', 'contact', 'clear', 'theme', 'source']) {
      expect(names).toContain(n)
    }
  })
})
```

- [ ] **Step 3: Fail → implement**

Create `components/terminal/commands.ts`:

```ts
import type { CommandContext, CommandResult, OutputLine, SerializedBook } from './types'

type Handler = (args: string[], ctx: CommandContext) => CommandResult

function text(t: string, tone?: 'normal' | 'muted' | 'accent'): OutputLine {
  return { kind: 'text', text: t, tone }
}

function stars(rating: number | null): string {
  if (rating === null) return '—   '
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

function renderBody(body: string): OutputLine[] {
  const lines = body.split('\n')
  const out: OutputLine[] = []
  let inCode = false
  let codeBuf: string[] = []
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        out.push({ kind: 'code', text: codeBuf.join('\n') })
        codeBuf = []
        inCode = false
      } else {
        inCode = true
      }
      continue
    }
    if (inCode) { codeBuf.push(line); continue }
    if (line.startsWith('### ')) out.push({ kind: 'heading', text: line.slice(4), level: 3 })
    else if (line.startsWith('## ')) out.push({ kind: 'heading', text: line.slice(3), level: 2 })
    else if (line.startsWith('# ')) out.push({ kind: 'heading', text: line.slice(2), level: 1 })
    else out.push(text(line))
  }
  if (inCode && codeBuf.length) out.push({ kind: 'code', text: codeBuf.join('\n') })
  return out
}

const HANDLERS: Record<string, { desc: string; run: Handler }> = {
  help: {
    desc: 'list commands',
    run: () => ({
      lines: Object.entries(HANDLERS).map(([n, h]) => text(`  ${n.padEnd(10)} ${h.desc}`)),
    }),
  },
  about: {
    desc: 'short bio',
    run: () => ({
      lines: [
        text('Brayden May — CS & Engineering student at Ohio State, Class of 2027.'),
        text('Building at the intersection of technology, design, and business.'),
      ],
    }),
  },
  work: {
    desc: 'experience',
    run: () => ({
      lines: [
        { kind: 'heading', text: 'Builders', level: 3 },
        text('  President. Programming, mentorship, and fundraising for the next generation of founders.'),
        text(''),
        { kind: 'heading', text: 'Mango', level: 3 },
        text('  Founder. Investor matching platform powered by AI agents. Finalist, OSU Buckeye Accelerator.'),
        text(''),
        { kind: 'heading', text: 'Ohio State', level: 3 },
        text('  B.S. Computer Science and Engineering, Class of 2027.'),
      ],
    }),
  },
  skills: {
    desc: 'tech stack',
    run: () => ({
      lines: [
        text('design     figma'),
        text('frontend   react, next.js, tailwind'),
        text('backend    python, java, typescript, c/c++, ruby'),
        text('infra      aws, vercel, cloudflare, docker, linux'),
        text('ai         langgraph'),
        text('version    git, github'),
      ],
    }),
  },
  writing: {
    desc: 'list articles, or `writing <slug>` to open one',
    run: (args, ctx) => {
      if (args.length === 0) {
        return { lines: ctx.articles.map((a) => text(`  ${a.date}  ${a.title}  (${a.slug})`)) }
      }
      const slug = args[0]
      const article = ctx.articles.find((a) => a.slug === slug)
      if (!article) return { lines: [text(`article not found: ${slug}`)] }
      return {
        lines: [
          { kind: 'heading', text: article.title, level: 2 },
          text(`${article.date} · ${article.readingTime} min read`, 'muted'),
          text(''),
          ...renderBody(article.body),
        ],
      }
    },
  },
  reading: {
    desc: 'list books, or `reading <n>` for detail',
    run: (args, ctx) => {
      if (args.length === 0) {
        return {
          lines: ctx.books.map((b: SerializedBook, i: number) =>
            text(`  ${String(i + 1).padStart(2)}. ${b.title} — ${b.author}  [${stars(b.rating)}]`),
          ),
        }
      }
      const n = Number(args[0])
      if (!Number.isInteger(n)) return { lines: [text(`reading: expected a number, got ${args[0]}`)] }
      if (n < 1 || n > ctx.books.length) return { lines: [text(`book not found: ${n}`)] }
      const b = ctx.books[n - 1]
      return {
        lines: [
          { kind: 'heading', text: b.title, level: 3 },
          text(`by ${b.author}`, 'muted'),
          text(`rating: ${b.rating === null ? 'currently reading' : stars(b.rating)}`),
          text(`finished: ${b.finishedAt}`, 'muted'),
          ...(b.note ? [text(''), text(b.note)] : []),
        ],
      }
    },
  },
  contact: {
    desc: 'ways to reach me',
    run: () => ({
      lines: [
        { kind: 'copy', text: 'email: brayd3nmay@gmail.com', value: 'brayd3nmay@gmail.com', label: 'copy' },
        { kind: 'link', text: 'github: github.com/brayd3nmay', href: 'https://github.com/brayd3nmay' },
        { kind: 'link', text: 'linkedin: linkedin.com/in/braydenmay', href: 'https://www.linkedin.com/in/braydenmay/' },
      ],
    }),
  },
  clear: { desc: 'clear the screen', run: () => ({ lines: [], clear: true }) },
  theme: { desc: 'toggle dark/light', run: () => ({ lines: [text('theme toggled')], theme: 'toggle' }) },
  source: {
    desc: 'view site source on GitHub',
    run: () => ({
      lines: [{ kind: 'link', text: 'github.com/brayd3nmay/portfolio', href: 'https://github.com/brayd3nmay/portfolio' }],
    }),
  },
}

export function runCommand(input: string, ctx: CommandContext): CommandResult {
  const [name, ...args] = input.trim().split(/\s+/)
  if (!name) return { lines: [] }
  const cmd = HANDLERS[name]
  if (!cmd) return { lines: [text(`command not found: ${name}. try: help`)], fallback: true }
  return cmd.run(args, ctx)
}

export function listCommands(): string[] {
  return Object.keys(HANDLERS)
}

export function getCompletions(prefix: string, ctx: CommandContext): string[] {
  const tokens = prefix.split(/\s+/)
  if (tokens.length === 1) {
    return listCommands().filter((c) => c.startsWith(tokens[0]))
  }
  if (tokens[0] === 'writing') {
    return ctx.articles
      .map((a) => a.slug)
      .filter((s) => s.startsWith(tokens[1] ?? ''))
      .map((s) => `writing ${s}`)
  }
  if (tokens[0] === 'reading') {
    return ctx.books
      .map((_, i) => String(i + 1))
      .filter((n) => n.startsWith(tokens[1] ?? ''))
      .map((n) => `reading ${n}`)
  }
  return []
}
```

- [ ] **Step 4: Pass**

```bash
npm test components/terminal/__tests__/commands.test.ts
```

Expected: 10 passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add terminal commands as pure data-injected factory"
```

---

## Task 18: Terminal components (Output, Prompt, Terminal) with typewriter + tests

**Files:**
- Create: `components/terminal/Output.tsx`, `components/terminal/Prompt.tsx`, `components/terminal/Terminal.tsx`, `components/terminal/__tests__/terminal.test.tsx`

- [ ] **Step 1: Output renderer**

Create `components/terminal/Output.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import type { OutputLine } from './types'

function Text({ line, reveal }: { line: Extract<OutputLine, { kind: 'text' }>; reveal: string }) {
  const cls =
    line.tone === 'muted' ? 'text-[var(--muted)]' :
    line.tone === 'accent' ? 'font-semibold' : ''
  return <span className={cls}>{reveal || '\u00a0'}</span>
}

export function OutputLineView({ line, typewriter }: { line: OutputLine; typewriter: boolean }) {
  if (line.kind === 'text') {
    const full = line.text
    const [reveal, setReveal] = useState(typewriter ? '' : full)
    useEffect(() => {
      if (!typewriter) { setReveal(full); return }
      let i = 0
      const t = setInterval(() => {
        i++
        setReveal(full.slice(0, i))
        if (i >= full.length) clearInterval(t)
      }, 10)
      return () => clearInterval(t)
    }, [full, typewriter])
    return <div><Text line={line} reveal={reveal} /></div>
  }

  if (line.kind === 'link') {
    const external = line.href.startsWith('http')
    return (
      <div>
        <a
          href={line.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          className="underline hover:text-[var(--muted)]"
        >
          {line.text}
        </a>
      </div>
    )
  }

  if (line.kind === 'copy') {
    return (
      <div>
        <span>{line.text}</span>{' '}
        <button
          onClick={async () => {
            try { await navigator.clipboard.writeText(line.value) } catch {}
          }}
          className="underline text-[var(--muted)] hover:text-[var(--fg)]"
        >
          [{line.label}]
        </button>
      </div>
    )
  }

  if (line.kind === 'heading') {
    const size = line.level === 1 ? 'text-lg' : line.level === 2 ? 'text-base font-semibold' : 'font-semibold'
    return <div className={size}>{line.text}</div>
  }

  if (line.kind === 'code') {
    return (
      <pre className="bg-[var(--border)] p-2 rounded text-xs whitespace-pre-wrap overflow-x-auto my-1">
        {line.text}
      </pre>
    )
  }

  return null
}
```

- [ ] **Step 2: Prompt**

Create `components/terminal/Prompt.tsx`:

```tsx
'use client'

import { forwardRef } from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  label?: string
}

export const Prompt = forwardRef<HTMLInputElement, Props>(function Prompt(
  { value, onChange, onSubmit, onKeyDown, label = 'brayden@portfolio:~$' }, ref
) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} className="flex items-baseline gap-2">
      <span className="text-[var(--muted)] select-none">{label}</span>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        aria-label="terminal input"
        className="flex-1 bg-transparent border-0 outline-none text-[var(--fg)] caret-[var(--fg)]"
      />
    </form>
  )
})
```

- [ ] **Step 3: Terminal shell**

Create `components/terminal/Terminal.tsx`:

```tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { runCommand, getCompletions, type CommandResult } from './commands'
import { OutputLineView } from './Output'
import { Prompt } from './Prompt'
import { ModeSwitch } from '@/components/ModeSwitch'
import type { CommandContext, OutputLine } from './types'

type Entry =
  | { kind: 'input'; text: string; id: number }
  | { kind: 'output'; line: OutputLine; id: number; typewriter: boolean }

const HINT = 'type help to get started, or try: about, work, writing'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Terminal({ ctx, initialCommand }: { ctx: CommandContext; initialCommand?: string }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showFallback, setShowFallback] = useState(false)
  const [fallbackDismissed, setFallbackDismissed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)
  const ranInitial = useRef(false)

  const reducedMotion = useMemo(() => prefersReducedMotion(), [])

  function nextId() { idRef.current += 1; return idRef.current }

  function pushCommand(raw: string) {
    const text = raw.trim()
    if (!text) return
    const result: CommandResult = runCommand(text, ctx)
    setHistory((h) => [...h, text])
    setHistoryIndex(-1)
    if (result.clear) {
      setEntries([])
    } else {
      const typewriter = !reducedMotion
      setEntries((e) => [
        ...e,
        { kind: 'input', text, id: nextId() },
        ...result.lines.map((line) => ({ kind: 'output' as const, line, id: nextId(), typewriter })),
      ])
    }
    if (result.theme === 'toggle') {
      const root = document.documentElement
      root.classList.toggle('dark')
      const next = root.classList.contains('dark') ? 'dark' : 'light'
      try { localStorage.setItem('portfolio_theme', next) } catch {}
    }
    if (result.fallback && !fallbackDismissed) setShowFallback(true)
    setValue('')

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('cmd', text.replace(/\s+/g, '+'))
      window.history.pushState({ cmd: text }, '', url.toString())
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next); setValue(history[next]); return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const next = historyIndex + 1
      if (next >= history.length) { setHistoryIndex(-1); setValue(''); return }
      setHistoryIndex(next); setValue(history[next]); return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const matches = getCompletions(value, ctx)
      if (matches.length === 1) setValue(matches[0])
      else if (matches.length > 1) {
        setEntries((es) => [
          ...es,
          { kind: 'input', text: value, id: nextId() },
          ...matches.map((m) => ({
            kind: 'output' as const,
            line: { kind: 'text' as const, text: '  ' + m },
            id: nextId(),
            typewriter: false,
          })),
        ])
      }
      return
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      setEntries([])
    }
  }

  useEffect(() => {
    if (ranInitial.current) return
    ranInitial.current = true
    if (initialCommand) pushCommand(initialCommand)
  }, [initialCommand])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
    inputRef.current?.focus()
  }, [entries.length])

  useEffect(() => {
    if (fallbackDismissed || entries.length > 0) return
    const t = setTimeout(() => setShowFallback(true), 8000)
    return () => clearTimeout(t)
  }, [entries.length, fallbackDismissed])

  function refocus() { inputRef.current?.focus() }

  return (
    <div
      ref={scrollRef}
      onClick={refocus}
      className="min-h-screen max-h-screen overflow-y-auto p-6 font-mono text-sm leading-relaxed relative"
    >
      <div className="absolute top-4 right-6">
        <ModeSwitch to="gui" />
      </div>
      <div className="text-[var(--muted)] mb-4">{HINT}</div>
      <div>
        {entries.map((entry) =>
          entry.kind === 'input' ? (
            <div key={entry.id}>
              <span className="text-[var(--muted)]">brayden@portfolio:~$</span> {entry.text}
            </div>
          ) : (
            <OutputLineView key={entry.id} line={entry.line} typewriter={entry.typewriter} />
          ),
        )}
      </div>
      <Prompt
        ref={inputRef}
        value={value}
        onChange={setValue}
        onSubmit={() => pushCommand(value)}
        onKeyDown={onKeyDown}
      />
      {showFallback && (
        <div className="fixed bottom-6 right-6 bg-[var(--bg)] border border-[var(--border)] rounded p-3 text-xs flex items-center gap-3">
          <span className="text-[var(--muted)]">not sure what to type?</span>
          <ModeSwitch to="gui" />
          <button
            aria-label="dismiss"
            onClick={() => { setShowFallback(false); setFallbackDismissed(true) }}
            className="text-[var(--muted)] hover:text-[var(--fg)]"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Terminal interaction tests**

Create `components/terminal/__tests__/terminal.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Terminal } from '../Terminal'
import type { CommandContext } from '../types'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

const ctx: CommandContext = {
  articles: [{ slug: 'foo', title: 'Foo', date: '2026-01-01', excerpt: '', readingTime: 1, body: 'body' }],
  books: [{ title: 'Bk', author: 'A', cover: '/x.jpg', rating: 5, finishedAt: '2025-01' }],
}

describe('Terminal', () => {
  beforeEach(() => { vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }) })
  afterEach(() => { vi.useRealTimers() })

  it('runs initialCommand on mount', async () => {
    render(<Terminal ctx={ctx} initialCommand="help" />)
    expect(screen.getByText(/about/)).toBeInTheDocument()
  })

  it('arrow up recalls last command', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Terminal ctx={ctx} />)
    const input = screen.getByLabelText('terminal input') as HTMLInputElement
    await user.type(input, 'help{Enter}')
    await user.keyboard('{ArrowUp}')
    expect(input.value).toBe('help')
  })

  it('Tab completes a single match', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Terminal ctx={ctx} />)
    const input = screen.getByLabelText('terminal input') as HTMLInputElement
    await user.type(input, 'abo')
    await user.keyboard('{Tab}')
    expect(input.value).toBe('about')
  })

  it('shows fallback banner after 8s idle', async () => {
    render(<Terminal ctx={ctx} />)
    act(() => { vi.advanceTimersByTime(8001) })
    expect(screen.getByText(/not sure what to type/i)).toBeInTheDocument()
  })

  it('unknown command triggers fallback banner immediately', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<Terminal ctx={ctx} />)
    const input = screen.getByLabelText('terminal input') as HTMLInputElement
    await user.type(input, 'banana{Enter}')
    expect(screen.getByText(/not sure what to type/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 5: Pass**

```bash
npm test components/terminal/__tests__/terminal.test.tsx
```

Expected: 5 passed.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add Terminal shell with typewriter, history, Tab, fallback banner"
```

---

## Task 19: Wire terminal into root page (data from server)

**Files:**
- Modify: `app/page.tsx`
- Create: `components/SeoContent.tsx`

- [ ] **Step 1: SeoContent (hidden but SSR'd)**

Create `components/SeoContent.tsx`:

```tsx
import { getAllArticles } from '@/lib/writing'
import { getBooks } from '@/lib/reading'

export function SeoContent() {
  const articles = getAllArticles()
  const books = getBooks()
  return (
    <div className="sr-only">
      <h1>Brayden May</h1>
      <p>Building at the intersection of technology, design, and business.</p>
      <h2>Work</h2>
      <ul>
        <li>Builders — President</li>
        <li>Mango — Founder</li>
        <li>Ohio State — B.S. Computer Science and Engineering, Class of 2027</li>
      </ul>
      <h2>Writing</h2>
      <ul>
        {articles.map((a) => (<li key={a.slug}>{a.date} — {a.title}: {a.excerpt}</li>))}
      </ul>
      <h2>Reading</h2>
      <ul>
        {books.map((b) => (<li key={b.title}>{b.title} by {b.author}</li>))}
      </ul>
      <h2>Contact</h2>
      <ul>
        <li><a href="mailto:brayd3nmay@gmail.com">brayd3nmay@gmail.com</a></li>
        <li><a href="https://github.com/brayd3nmay">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/braydenmay/">LinkedIn</a></li>
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: Root page serializes content and hands it to the terminal**

Replace `app/page.tsx`:

```tsx
import { Terminal } from '@/components/terminal/Terminal'
import { SeoContent } from '@/components/SeoContent'
import { getAllArticles } from '@/lib/writing'
import { getBooks } from '@/lib/reading'
import type { CommandContext, SerializedArticle } from '@/components/terminal/types'

export default async function HomePage({
  searchParams,
}: { searchParams: Promise<{ cmd?: string }> }) {
  const { cmd } = await searchParams
  const initialCommand = cmd ? cmd.replace(/\+/g, ' ') : undefined

  const articles: SerializedArticle[] = getAllArticles().map((a) => ({
    slug: a.slug, title: a.title, date: a.date, excerpt: a.excerpt, readingTime: a.readingTime, body: a.body,
  }))
  const books = getBooks()
  const ctx: CommandContext = { articles, books }

  return (
    <>
      <SeoContent />
      <Terminal ctx={ctx} initialCommand={initialCommand} />
    </>
  )
}
```

- [ ] **Step 3: Manual verify**

```bash
npm run dev
```

- http://localhost:3000 → hint + prompt render
- Type `help` → commands list
- Type `about` → bio
- Type `writing` → article list
- Type `writing hello-world` → article body with styled heading
- Type `contact` → email has a [copy] button; click → clipboard updated (hard to verify in manual; accept presence of button)
- Press ↑ → last command recalled
- `?cmd=writing` in URL → runs writing
- Type `banana` → fallback banner appears

Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Wire Terminal with server-fetched content via serialized props"
```

---

## Task 20: Custom 404

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: 404 page**

Create `app/not-found.tsx`:

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="p-6 font-mono text-sm">
      <div className="text-[var(--muted)]">brayden@portfolio:~$ cat /requested/path</div>
      <div className="mt-1">cat: /requested/path: No such file or directory</div>
      <div className="mt-6 space-x-4">
        <Link href="/" className="underline">terminal</Link>
        <Link href="/gui" className="underline">gui</Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "Add terminal-styled 404"
```

---

## Task 21: Playwright smoke tests

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/gui',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
})
```

- [ ] **Step 2: Tests**

Create `tests/e2e/smoke.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('desktop: terminal renders, help works, ?cmd= auto-runs', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop-only')
  await page.context().clearCookies()
  await page.goto('/')
  await expect(page.getByText('type help to get started')).toBeVisible()

  await page.getByLabel('terminal input').fill('help')
  await page.keyboard.press('Enter')
  await expect(page.getByText(/\babout\b/)).toBeVisible()

  await page.goto('/?cmd=writing')
  await expect(page.getByText(/Hello, world/)).toBeVisible()
})

test('mobile: root redirects to /gui', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'mobile-only')
  await page.context().clearCookies()
  await page.goto('/')
  await expect(page).toHaveURL(/\/gui$/)
})

test('gui: article page renders with reading time', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop-only')
  await page.goto('/gui/writing/hello-world')
  await expect(page.locator('h1')).toContainText('Hello, world')
  await expect(page.getByText(/min read/)).toBeVisible()
})
```

- [ ] **Step 3: Run**

```bash
npm run test:e2e
```

Expected: 3 pass across two projects (mobile test only runs under mobile project; others only run under desktop).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add Playwright smoke tests for terminal, mobile redirect, and article render"
```

---

## Task 22: README and gitignore

**Files:**
- Modify: `README.md`, `.gitignore`

- [ ] **Step 1: README**

Replace `README.md`:

```md
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
```

- [ ] **Step 2: Ensure .gitignore entries**

Ensure `.gitignore` includes: `node_modules`, `.next`, `.env*.local`, `/playwright-report`, `/test-results`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Update README and gitignore"
```

---

## Task 23: Push to GitHub and deploy to Vercel

**Files:** manual

- [ ] **Step 1: Create GitHub repo**

Create empty public repo at https://github.com/brayd3nmay/portfolio (no README).

- [ ] **Step 2: Push**

```bash
git remote add origin git@github.com:brayd3nmay/portfolio.git
git push -u origin main
```

- [ ] **Step 3: Connect Vercel**

https://vercel.com/new → import `portfolio` → defaults → deploy.

- [ ] **Step 4: Verify deployed site**

- `/` on desktop shows terminal
- `/gui` shows plain site
- `/gui/writing/hello-world` renders article
- Mobile emulator → `/` redirects to `/gui`

- [ ] **Step 5: (Optional) Custom domain**

Vercel → Settings → Domains.

---

## Self-review notes

**Architectural fix:** Terminal is fully decoupled from `lib/*` fs imports. Server component serializes articles/books into a `CommandContext` prop. This was the root cause of the original plan's client-bundle bug.

**Coverage vs. spec:**
- ✅ Stack, routes, commands, content model, mode preference, SEO content, theme, reduced motion, deploy
- ✅ Typewriter (implemented + gated by reduced motion via CSS media query)
- ✅ `writing <slug>` renders styled headings and code blocks
- ✅ `reading` uses star ratings
- ✅ `contact` has copyable email
- ✅ URL deep linking with history push
- ✅ Unit tests for middleware, ModeSwitch, Terminal interactions (fake timers, Tab, arrows)
- ✅ Draft filter has both positive (dev includes) and negative (prod excludes) assertions
- ✅ Tailwind v4 CSS-first config

**Intentionally deferred (spec Open Questions):** analytics, RSS, OG image generation, ASCII renders, easter-egg commands. Not blockers for launch.
