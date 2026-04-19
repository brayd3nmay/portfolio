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
