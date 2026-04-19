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
