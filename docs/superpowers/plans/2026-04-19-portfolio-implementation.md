# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Brayden May's dual-mode personal portfolio — a terminal-first site at `/` with a plain-text GUI fallback at `/gui`, both sharing a single content source.

**Architecture:** Next.js 15 (App Router) with TypeScript and Tailwind. Articles as MDX in `content/writing/`, books as a TypeScript module in `content/reading/`. `lib/` modules are the single source of truth; both modes render from them. Mode preference is cookie-backed with middleware routing; mobile defaults to GUI. Terminal output is rendered client-side on top of SSR'd SEO content so crawlers see real text.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, MDX, gray-matter, reading-time, Vitest, React Testing Library, Playwright, Vercel.

**Working directory:** All tasks run from `/Users/braydenmay/repos/portfolio/` unless noted.

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`, `README.md`

- [ ] **Step 1: Scaffold Next.js app**

Run from `/Users/braydenmay/repos/portfolio/`:

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --no-eslint --yes
```

If it prompts for existing files, allow it. Expect: `package.json`, `app/`, `tailwind.config.ts`, `tsconfig.json` created.

- [ ] **Step 2: Verify dev server runs**

Run: `npm run dev`
Open http://localhost:3000 → default Next.js page loads.
Stop server (Ctrl+C).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js 15 project with TypeScript and Tailwind"
```

---

## Task 2: Install project dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install MDX + content deps**

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter reading-time
npm install -D @types/mdx
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
git commit -m "Add MDX, content, and testing dependencies"
```

---

## Task 3: Configure Vitest

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`

- [ ] **Step 1: Create vitest config**

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

- [ ] **Step 2: Write a smoke test**

Create `lib/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('smoke', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 3: Run smoke test**

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Configure Vitest with jsdom + testing-library"
```

---

## Task 4: Self-host Berkeley Mono font

**Files:**
- Create: `public/fonts/BerkeleyMono-Regular.otf`
- Modify: `app/layout.tsx`, `app/globals.css`

- [ ] **Step 1: Copy font**

```bash
cp ../personal-portfolio/fonts/BerkeleyMono-Regular.otf public/fonts/
```

Verify: `ls public/fonts/` shows `BerkeleyMono-Regular.otf`.

- [ ] **Step 2: Register font in layout**

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
  description: "Brayden May — building at the intersection of technology, design, and business.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={berkeleyMono.variable}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Apply font in globals**

Replace `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #f5f5f5;
  --fg: #0a0a0a;
  --muted: #888;
  --border: #ddd;
}

.dark {
  --bg: #0a0a0a;
  --fg: #f5f5f5;
  --muted: #888;
  --border: #222;
}

html, body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-berkeley-mono), ui-monospace, Menlo, monospace;
}
```

- [ ] **Step 4: Verify font loads**

Run: `npm run dev`
Open http://localhost:3000 → default page renders in Berkeley Mono.
Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Self-host Berkeley Mono font and apply theme variables"
```

---

## Task 5: Configure Tailwind theme

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Extend theme with colors and dark mode class**

Replace `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        border: 'var(--border)',
      },
      fontFamily: {
        mono: ['var(--font-berkeley-mono)', 'ui-monospace', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "Configure Tailwind with theme colors and mono font"
```

---

## Task 6: Enable MDX in Next.js

**Files:**
- Modify: `next.config.mjs`
- Create: `mdx-components.tsx`

- [ ] **Step 1: Configure next.config for MDX**

Replace `next.config.mjs`:

```js
import createMDX from '@next/mdx'

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
```

- [ ] **Step 2: Create MDX components mapper**

Create `mdx-components.tsx` at project root:

```tsx
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components }
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Enable MDX in Next.js"
```

---

## Task 7: Seed content

**Files:**
- Create: `content/writing/hello-world.mdx`, `content/writing/on-building-ai-agents.mdx`, `content/reading/books.ts`

- [ ] **Step 1: Create seed articles**

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

1. **Gather** — collect what the user wants
2. **Plan** — decide the steps
3. **Execute** — run them, with the ability to revise

Everything else was plumbing.
```

- [ ] **Step 2: Create seed books**

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
  {
    title: 'The Pragmatic Programmer',
    author: 'Hunt & Thomas',
    cover: '/books/pragmatic.jpg',
    rating: 5,
    finishedAt: '2025-09',
    note: 'The classic. Still holds up.',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    cover: '/books/ddia.jpg',
    rating: 5,
    finishedAt: '2026-01',
    note: 'The reference, unmatched.',
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    cover: '/books/zero-to-one.jpg',
    rating: 4,
    finishedAt: '2025-11',
    note: 'Contrarian thinking, mostly holds up.',
  },
  {
    title: 'The Timeless Way of Building',
    author: 'Christopher Alexander',
    cover: '/books/timeless-way.jpg',
    rating: null,
    finishedAt: 'reading',
    note: '30% in. Slow but deep.',
  },
]
```

- [ ] **Step 3: Add placeholder cover assets**

```bash
mkdir -p public/books
```

For now, create simple placeholder files (the design tolerates broken covers until real ones are added):

```bash
for f in pragmatic ddia zero-to-one timeless-way; do
  touch public/books/$f.jpg
done
```

(Real cover images can be dropped in later; the site should not error on missing.)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Seed initial articles and book list"
```

---

## Task 8: Build lib/writing.ts with tests

**Files:**
- Create: `lib/writing.ts`, `lib/__tests__/writing.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `lib/__tests__/writing.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getAllArticles, getArticle } from '../writing'

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

  it('excludes drafts in production', () => {
    const prev = process.env.NODE_ENV
    // @ts-expect-error override read-only NODE_ENV for test
    process.env.NODE_ENV = 'production'
    const articles = getAllArticles()
    expect(articles.every(a => !a.draft)).toBe(true)
    // @ts-expect-error restore
    process.env.NODE_ENV = prev
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

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test lib/__tests__/writing.test.ts`
Expected: FAIL with import errors.

- [ ] **Step 3: Implement lib/writing.ts**

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
  readingTime: number // minutes
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
  const files = ['.mdx', '.md'].map(ext => `${slug}${ext}`)
  const match = files.find(f => fs.existsSync(path.join(CONTENT_DIR, f)))
  return match ? readArticle(match) : null
}

export function getAllSlugs(): string[] {
  return getAllArticles().map(a => a.slug)
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test lib/__tests__/writing.test.ts`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add lib/writing for MDX article loading"
```

---

## Task 9: Build lib/reading.ts with tests

**Files:**
- Create: `lib/reading.ts`, `lib/__tests__/reading.test.ts`

- [ ] **Step 1: Write the failing tests**

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

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test lib/__tests__/reading.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement lib/reading.ts**

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

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test lib/__tests__/reading.test.ts`
Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add lib/reading for book list access"
```

---

## Task 10: Build lib/mode.ts with tests

**Files:**
- Create: `lib/mode.ts`, `lib/__tests__/mode.test.ts`

- [ ] **Step 1: Write the failing tests**

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

  it('exports a mobile UA regex', () => {
    expect(MOBILE_UA_REGEX.test('iPhone')).toBe(true)
    expect(MOBILE_UA_REGEX.test('Android')).toBe(true)
    expect(MOBILE_UA_REGEX.test('Mozilla/5.0 (Macintosh)')).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test lib/__tests__/mode.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement lib/mode.ts**

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

// Client-only helpers
export function setModeCookie(mode: Mode) {
  if (typeof document === 'undefined') return
  const oneYear = 60 * 60 * 24 * 365
  document.cookie = `${MODE_COOKIE}=${mode}; path=/; max-age=${oneYear}; SameSite=Lax`
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test lib/__tests__/mode.test.ts`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add lib/mode for terminal/gui preference detection"
```

---

## Task 11: Middleware for mode routing

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Implement middleware**

Create `middleware.ts` at project root:

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectModeFromRequest, MODE_COOKIE } from '@/lib/mode'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only redirect the root path — never GUI routes.
  if (pathname !== '/') return NextResponse.next()

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

export const config = {
  matcher: ['/'],
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "Add middleware to route mobile visitors to GUI"
```

---

## Task 12: Theme pre-hydration script

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Inject theme script before hydration**

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
  description: "Brayden May — building at the intersection of technology, design, and business.",
  openGraph: {
    title: 'Brayden May',
    description: "Building at the intersection of technology, design, and business.",
    type: 'website',
  },
}

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('portfolio_theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
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

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "Add pre-hydration theme script to prevent flash"
```

---

## Task 13: GUI layout (header + footer + mode switch)

**Files:**
- Create: `app/gui/layout.tsx`, `components/gui/Header.tsx`, `components/gui/Footer.tsx`, `components/ModeSwitch.tsx`

- [ ] **Step 1: Create ModeSwitch component**

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

- [ ] **Step 2: Create Header and Footer**

Create `components/gui/Header.tsx`:

```tsx
import Link from 'next/link'
import { ModeSwitch } from '@/components/ModeSwitch'

export function Header() {
  return (
    <header className="flex items-baseline justify-between py-6 border-b border-border">
      <Link href="/gui" className="text-base font-semibold">Brayden May</Link>
      <nav className="flex gap-6 text-sm">
        <Link href="/gui/writing" className="hover:underline">Writing</Link>
        <Link href="/gui/reading" className="hover:underline">Reading</Link>
        <a href="mailto:brayd3nmay@gmail.com" className="hover:underline">Contact</a>
      </nav>
      <div className="absolute top-4 right-6">
        <ModeSwitch to="terminal" />
      </div>
    </header>
  )
}
```

Create `components/gui/Footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="mt-16 pt-6 border-t border-border text-sm text-muted">
      <div className="flex flex-wrap gap-6">
        <a href="mailto:brayd3nmay@gmail.com" className="hover:text-fg">brayd3nmay@gmail.com</a>
        <a href="https://github.com/brayd3nmay" className="hover:text-fg">GitHub</a>
        <a href="https://www.linkedin.com/in/braydenmay/" className="hover:text-fg">LinkedIn</a>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Create GUI layout**

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
git commit -m "Add GUI layout with header, footer, and mode switch"
```

---

## Task 14: GUI home page

**Files:**
- Create: `app/gui/page.tsx`

- [ ] **Step 1: Create home page**

Create `app/gui/page.tsx`:

```tsx
export default function GuiHome() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-xl font-semibold">Hi, I'm Brayden.</h1>
        <p className="mt-2 text-muted">
          I'm building at the intersection of technology, design, and business.
        </p>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-muted mb-3">Work</h2>
        <ul className="space-y-4">
          <li>
            <div className="font-semibold">Builders</div>
            <p className="text-sm">As president of Builders, I lead programming, mentorship, and fundraising for the next generation of founders.</p>
          </li>
          <li>
            <div className="font-semibold">Mango</div>
            <p className="text-sm">As founder of Mango, I developed and launched an investor matching platform that uses AI agents. Finalist for Ohio State's President Buckeye Accelerator.</p>
          </li>
          <li>
            <div className="font-semibold">Ohio State</div>
            <p className="text-sm">B.S. Computer Science and Engineering, Class of 2027. Coursework in data structures and algorithms, systems programming, web applications, and discrete mathematics.</p>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wide text-muted mb-3">Skills</h2>
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
    </div>
  )
}
```

- [ ] **Step 2: Verify it renders**

Run: `npm run dev` → open http://localhost:3000/gui → home renders with name, work, skills, contact.
Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add GUI home page"
```

---

## Task 15: GUI writing index and article page

**Files:**
- Create: `app/gui/writing/page.tsx`, `app/gui/writing/[slug]/page.tsx`

- [ ] **Step 1: Writing index**

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
          <li key={a.slug} className="flex justify-between gap-4 border-b border-border py-2">
            <Link href={`/gui/writing/${a.slug}`} className="hover:underline">{a.title}</Link>
            <span className="text-muted text-sm">{a.date}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: Article page**

Create `app/gui/writing/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import { getArticle, getAllSlugs } from '@/lib/writing'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'

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
    <article className="prose-sm max-w-none">
      <Link href="/gui/writing" className="text-sm text-muted hover:text-fg">← back to writing</Link>
      <h1 className="text-xl font-semibold mt-6">{article.title}</h1>
      <div className="text-sm text-muted mt-1 mb-8">{article.date} · {article.readingTime} min read</div>
      <div className="space-y-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h3]:font-semibold [&_h3]:mt-6 [&_code]:bg-border [&_code]:px-1 [&_code]:rounded [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6">
        <MDXRemote source={article.body} />
      </div>
    </article>
  )
}
```

- [ ] **Step 3: Install next-mdx-remote**

```bash
npm install next-mdx-remote
```

- [ ] **Step 4: Verify**

Run: `npm run dev` → open http://localhost:3000/gui/writing → list renders → click an article → renders.
Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add GUI writing index and article pages"
```

---

## Task 16: GUI reading page

**Files:**
- Create: `app/gui/reading/page.tsx`

- [ ] **Step 1: Reading page**

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
          <li key={b.title} className="grid grid-cols-[40px_1fr_auto] gap-4 items-center border-b border-border py-2">
            <div className="h-14 w-10 bg-border rounded-sm overflow-hidden">
              {/* plain img avoids next/image processing of placeholder files */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.cover} alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-semibold text-sm">{b.title}</div>
              <div className="text-muted text-xs">{b.author}{b.note ? ` — ${b.note}` : ''}</div>
            </div>
            <div className="text-muted text-xs font-mono whitespace-nowrap">{stars(b.rating)}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: (no image config needed)**

Plain `<img>` is used so empty placeholder files don't trigger next/image processing. Drop real covers into `public/books/` when available.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add GUI reading page"
```

---

## Task 17: Terminal command registry with tests

**Files:**
- Create: `components/terminal/commands.ts`, `components/terminal/__tests__/commands.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `components/terminal/__tests__/commands.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { runCommand, listCommands } from '../commands'

describe('runCommand', () => {
  it('help lists all available commands', () => {
    const out = runCommand('help')
    expect(out.lines.join('\n')).toContain('help')
    expect(out.lines.join('\n')).toContain('about')
    expect(out.lines.join('\n')).toContain('work')
  })

  it('about returns bio lines', () => {
    const out = runCommand('about')
    expect(out.lines.join(' ')).toMatch(/Brayden/i)
  })

  it('unknown command returns error + flags fallback', () => {
    const out = runCommand('banana')
    expect(out.lines.join('\n')).toMatch(/command not found/i)
    expect(out.fallback).toBe(true)
  })

  it('clear returns a clear signal', () => {
    const out = runCommand('clear')
    expect(out.clear).toBe(true)
  })
})

describe('listCommands', () => {
  it('returns command names', () => {
    const names = listCommands()
    expect(names).toContain('help')
    expect(names).toContain('about')
    expect(names).toContain('work')
    expect(names).toContain('writing')
    expect(names).toContain('reading')
    expect(names).toContain('contact')
    expect(names).toContain('skills')
    expect(names).toContain('clear')
    expect(names).toContain('theme')
    expect(names).toContain('source')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test components/terminal/__tests__/commands.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement commands.ts**

Create `components/terminal/commands.ts`:

```ts
import { getAllArticles, getArticle } from '@/lib/writing'
import { getBooks, getBook } from '@/lib/reading'

export type CommandResult = {
  lines: Array<{ text: string; href?: string }>
  clear?: boolean
  theme?: 'toggle'
  fallback?: boolean
}

type Handler = (args: string[]) => CommandResult

const COMMANDS: Record<string, { desc: string; run: Handler }> = {
  help: {
    desc: 'list commands',
    run: () => ({
      lines: Object.entries(COMMANDS).map(([name, { desc }]) => ({
        text: `  ${name.padEnd(10)} ${desc}`,
      })),
    }),
  },
  about: {
    desc: 'short bio',
    run: () => ({
      lines: [
        { text: "Brayden May — CS & Engineering student at Ohio State, Class of 2027." },
        { text: 'I build at the intersection of technology, design, and business.' },
      ],
    }),
  },
  work: {
    desc: 'experience',
    run: () => ({
      lines: [
        { text: 'Builders' },
        { text: '  President. Programming, mentorship, and fundraising for the next generation of founders.' },
        { text: '' },
        { text: 'Mango' },
        { text: '  Founder. Investor matching platform powered by AI agents. Finalist, OSU Buckeye Accelerator.' },
        { text: '' },
        { text: 'Ohio State' },
        { text: '  B.S. Computer Science and Engineering, Class of 2027.' },
      ],
    }),
  },
  skills: {
    desc: 'tech stack',
    run: () => ({
      lines: [
        { text: 'design     figma' },
        { text: 'frontend   react, next.js, tailwind' },
        { text: 'backend    python, java, typescript, c/c++, ruby' },
        { text: 'infra      aws, vercel, cloudflare, docker, linux' },
        { text: 'ai         langgraph' },
        { text: 'version    git, github' },
      ],
    }),
  },
  writing: {
    desc: 'list articles, or `writing <slug>` to open one',
    run: (args) => {
      if (args.length === 0) {
        const articles = getAllArticles()
        return {
          lines: articles.map((a) => ({ text: `  ${a.date}  ${a.title}` })),
        }
      }
      const slug = args[0]
      const article = getArticle(slug)
      if (!article) return { lines: [{ text: `article not found: ${slug}` }] }
      return {
        lines: [
          { text: article.title },
          { text: `${article.date} · ${article.readingTime} min read` },
          { text: '' },
          ...article.body.split('\n').map((line) => ({ text: line })),
        ],
      }
    },
  },
  reading: {
    desc: 'list books, or `reading <n>` for detail',
    run: (args) => {
      if (args.length === 0) {
        const books = getBooks()
        return {
          lines: books.map((b, i) => ({
            text: `  ${String(i + 1).padStart(2)}. ${b.title} — ${b.author}  [${b.rating ?? '—'}/5]`,
          })),
        }
      }
      const n = Number(args[0])
      if (!Number.isInteger(n)) return { lines: [{ text: `reading: expected a number, got ${args[0]}` }] }
      const book = getBook(n)
      if (!book) return { lines: [{ text: `book not found: ${n}` }] }
      return {
        lines: [
          { text: book.title },
          { text: `by ${book.author}` },
          { text: `rating: ${book.rating ?? 'currently reading'}` },
          { text: `finished: ${book.finishedAt}` },
          ...(book.note ? [{ text: '' }, { text: book.note }] : []),
        ],
      }
    },
  },
  contact: {
    desc: 'ways to reach me',
    run: () => ({
      lines: [
        { text: 'email: brayd3nmay@gmail.com', href: 'mailto:brayd3nmay@gmail.com' },
        { text: 'github: github.com/brayd3nmay', href: 'https://github.com/brayd3nmay' },
        { text: 'linkedin: linkedin.com/in/braydenmay', href: 'https://www.linkedin.com/in/braydenmay/' },
      ],
    }),
  },
  clear: {
    desc: 'clear the screen',
    run: () => ({ lines: [], clear: true }),
  },
  theme: {
    desc: 'toggle dark/light',
    run: () => ({ lines: [{ text: 'theme toggled' }], theme: 'toggle' }),
  },
  source: {
    desc: 'view site source on GitHub',
    run: () => ({
      lines: [{ text: 'github.com/brayd3nmay/portfolio', href: 'https://github.com/brayd3nmay/portfolio' }],
    }),
  },
}

export function runCommand(input: string): CommandResult {
  const [name, ...args] = input.trim().split(/\s+/)
  if (!name) return { lines: [] }
  const cmd = COMMANDS[name]
  if (!cmd) {
    return {
      lines: [{ text: `command not found: ${name}. try: help` }],
      fallback: true,
    }
  }
  return cmd.run(args)
}

export function listCommands(): string[] {
  return Object.keys(COMMANDS)
}

export function getCompletions(prefix: string): string[] {
  const tokens = prefix.split(/\s+/)
  if (tokens.length === 1) {
    return listCommands().filter((c) => c.startsWith(tokens[0]))
  }
  if (tokens[0] === 'writing') {
    return getAllArticles()
      .map((a) => a.slug)
      .filter((s) => s.startsWith(tokens[1] ?? ''))
      .map((s) => `writing ${s}`)
  }
  if (tokens[0] === 'reading') {
    return getBooks()
      .map((_, i) => String(i + 1))
      .filter((n) => n.startsWith(tokens[1] ?? ''))
      .map((n) => `reading ${n}`)
  }
  return []
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test components/terminal/__tests__/commands.test.ts`
Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Add terminal command registry with help, about, work, writing, reading, and more"
```

---

## Task 18: Terminal shell component

**Files:**
- Create: `components/terminal/Terminal.tsx`, `components/terminal/Prompt.tsx`, `components/terminal/Output.tsx`

- [ ] **Step 1: Build Output line renderer**

Create `components/terminal/Output.tsx`:

```tsx
'use client'

export type OutputLine = { text: string; href?: string }

export function OutputLineView({ line }: { line: OutputLine }) {
  if (line.href) {
    return (
      <a href={line.href} target={line.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="underline hover:text-muted">
        {line.text}
      </a>
    )
  }
  return <span>{line.text || '\u00a0'}</span>
}
```

- [ ] **Step 2: Build Prompt**

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
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit() }}
      className="flex items-baseline gap-2"
    >
      <span className="text-muted select-none">{label}</span>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        aria-label="terminal input"
        className="flex-1 bg-transparent border-0 outline-none text-fg caret-fg"
      />
    </form>
  )
})
```

- [ ] **Step 3: Build Terminal shell**

Create `components/terminal/Terminal.tsx`:

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { runCommand, getCompletions, type CommandResult } from './commands'
import { OutputLineView, type OutputLine } from './Output'
import { Prompt } from './Prompt'
import { ModeSwitch } from '@/components/ModeSwitch'

type Entry = { kind: 'input'; text: string } | { kind: 'output'; line: OutputLine }

const HINT = 'type help to get started, or try: about, work, writing'

export function Terminal({ initialCommand }: { initialCommand?: string }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showFallback, setShowFallback] = useState(false)
  const [fallbackDismissed, setFallbackDismissed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const ranInitial = useRef(false)

  function submit(raw: string) {
    const text = raw.trim()
    if (!text) return
    const result: CommandResult = runCommand(text)
    setHistory((h) => [...h, text])
    setHistoryIndex(-1)
    if (result.clear) {
      setEntries([])
    } else {
      setEntries((e) => [
        ...e,
        { kind: 'input', text },
        ...result.lines.map((line) => ({ kind: 'output' as const, line })),
      ])
    }
    if (result.theme === 'toggle') {
      const root = document.documentElement
      const next = root.classList.contains('dark') ? 'light' : 'dark'
      root.classList.toggle('dark')
      try { localStorage.setItem('portfolio_theme', next) } catch {}
    }
    if (result.fallback && !fallbackDismissed) setShowFallback(true)
    setValue('')
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setValue(history[next])
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const next = historyIndex + 1
      if (next >= history.length) { setHistoryIndex(-1); setValue(''); return }
      setHistoryIndex(next); setValue(history[next])
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const matches = getCompletions(value)
      if (matches.length === 1) setValue(matches[0])
      else if (matches.length > 1) {
        setEntries((entries) => [
          ...entries,
          { kind: 'input', text: value },
          ...matches.map((m) => ({ kind: 'output' as const, line: { text: '  ' + m } })),
        ])
      }
    }
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault()
      setEntries([])
    }
  }

  // Run initial command from URL ?cmd=...
  useEffect(() => {
    if (ranInitial.current) return
    ranInitial.current = true
    if (initialCommand) submit(initialCommand)
  }, [initialCommand])

  // Scroll to bottom on new entry
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
    inputRef.current?.focus()
  }, [entries])

  // Idle fallback after 8s
  useEffect(() => {
    if (fallbackDismissed || entries.length > 0) return
    const t = setTimeout(() => setShowFallback(true), 8000)
    return () => clearTimeout(t)
  }, [entries.length, fallbackDismissed])

  // Keep input focused on clicks anywhere in the terminal area
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
      <div className="text-muted mb-4">{HINT}</div>
      <div>
        {entries.map((entry, i) => (
          <div key={i}>
            {entry.kind === 'input' ? (
              <div>
                <span className="text-muted">brayden@portfolio:~$</span> {entry.text}
              </div>
            ) : (
              <div><OutputLineView line={entry.line} /></div>
            )}
          </div>
        ))}
      </div>
      <Prompt
        ref={inputRef}
        value={value}
        onChange={setValue}
        onSubmit={() => submit(value)}
        onKeyDown={onKeyDown}
      />
      {showFallback && (
        <div className="fixed bottom-6 right-6 bg-bg border border-border rounded p-3 text-xs flex items-center gap-3">
          <span className="text-muted">not sure what to type?</span>
          <ModeSwitch to="gui" />
          <button
            aria-label="dismiss"
            onClick={() => { setShowFallback(false); setFallbackDismissed(true) }}
            className="text-muted hover:text-fg"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add Terminal shell with prompt, history, tab completion, and fallback"
```

---

## Task 19: Wire terminal into root page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace root page with Terminal + SEO content**

Create `components/SeoContent.tsx` first:

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

Replace `app/page.tsx`:

```tsx
import { Terminal } from '@/components/terminal/Terminal'
import { SeoContent } from '@/components/SeoContent'

export default async function HomePage({ searchParams }: { searchParams: Promise<{ cmd?: string }> }) {
  const { cmd } = await searchParams
  const initialCommand = cmd ? cmd.replace(/\+/g, ' ') : undefined
  return (
    <>
      <SeoContent />
      <Terminal initialCommand={initialCommand} />
    </>
  )
}
```

- [ ] **Step 2: Verify terminal renders**

Run: `npm run dev`
Open http://localhost:3000 (on desktop UA) → terminal renders with hint and prompt.
Type `help` → command list prints.
Type `about` → bio prints.
Type `banana` → error line + fallback banner appears.
Press ↑ → previous command recalled.
Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Wire Terminal shell into root page with SEO content"
```

---

## Task 20: URL deep link smoke test

**Files:**
- (verification only)

- [ ] **Step 1: Verify ?cmd= auto-runs**

Run: `npm run dev`
Open http://localhost:3000/?cmd=writing → `writing` command runs automatically and lists articles.
Open http://localhost:3000/?cmd=writing+hello-world → article renders inline.
Stop server.

- [ ] **Step 2: Commit (if any tweaks needed)**

If tweaks were needed: `git add -A && git commit -m "Adjust URL deep-link handling"`. Otherwise skip.

---

## Task 21: Custom 404 page

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: Build 404**

Create `app/not-found.tsx`:

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="p-6 font-mono text-sm">
      <div className="text-muted">brayden@portfolio:~$ cat /requested/path</div>
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
git commit -m "Add terminal-styled 404 page"
```

---

## Task 22: Respect prefers-reduced-motion

**Files:**
- Modify: `components/terminal/Terminal.tsx`, `app/globals.css`

(Typewriter effect on output is light-touch in this plan — output appears instantly. Reduced motion is honored by default. The blinking caret uses pure CSS and should also be gated.)

- [ ] **Step 1: Gate caret animation on reduced motion**

Append to `app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "Respect prefers-reduced-motion globally"
```

---

## Task 23: Playwright smoke tests

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Playwright config**

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

- [ ] **Step 2: Smoke tests**

Create `tests/e2e/smoke.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('desktop: terminal renders and help works', async ({ page, browserName }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop-only')
  await page.context().clearCookies()
  await page.goto('/')
  await expect(page.locator('text=type help to get started')).toBeVisible()
  await page.locator('input[aria-label="terminal input"]').fill('help')
  await page.keyboard.press('Enter')
  await expect(page.locator('text=about')).toBeVisible()
})

test('mobile: root redirects to /gui', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'mobile-only')
  await page.context().clearCookies()
  const response = await page.goto('/')
  await page.waitForURL('**/gui')
  expect(page.url()).toContain('/gui')
})

test('gui: article page renders', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop-only')
  await page.goto('/gui/writing/hello-world')
  await expect(page.locator('h1')).toContainText('Hello, world')
  await expect(page.locator('text=min read')).toBeVisible()
})
```

- [ ] **Step 3: Run**

Run: `npm run test:e2e`
Expected: 3 tests pass (1 per project where applicable).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add Playwright smoke tests for terminal, mobile redirect, and article render"
```

---

## Task 24: README and scripts cleanup

**Files:**
- Modify: `README.md`, `.gitignore`

- [ ] **Step 1: Write README**

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
- Books: edit `content/reading/books.ts`; drop cover in `public/books/`

## Deploy

Connected to Vercel. Push to `main` to deploy.
```

- [ ] **Step 2: Ensure .gitignore covers node_modules and .next**

Verify `.gitignore` contains `node_modules`, `.next`, `.env*.local`, `/playwright-report`, `/test-results`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add README and gitignore cleanup"
```

---

## Task 25: Push to GitHub and deploy to Vercel

**Files:** (manual setup)

- [ ] **Step 1: Create GitHub repo**

Create an empty public repo at https://github.com/brayd3nmay/portfolio (do not initialize with README).

- [ ] **Step 2: Push local repo**

```bash
git remote add origin git@github.com:brayd3nmay/portfolio.git
git push -u origin main
```

- [ ] **Step 3: Connect Vercel**

At https://vercel.com/new — import the `portfolio` repo. Accept defaults. First deploy runs.

- [ ] **Step 4: Verify deploy**

Open the Vercel URL. Verify:
- `/` shows terminal (on desktop)
- `/gui` shows plain site
- `/gui/writing/hello-world` renders the seed article
- Mobile emulator → root redirects to `/gui`

- [ ] **Step 5: (Optional) Attach custom domain**

Add your domain in Vercel → Settings → Domains when ready.

---

## Self-review notes

- **Spec coverage:** stack, routes, commands, content model, mode preference, SEO content, accessibility, testing, and deploy all have corresponding tasks.
- **Intentionally deferred (from spec's Open Questions):** analytics, RSS, OG image generation, ASCII renders, easter-egg commands. Not blockers for launch.
- **Known trade-off:** Terminal's `writing <slug>` command renders the article body as plain text (not parsed MDX). Good enough for v1; a richer MDX-to-terminal renderer can land later.
