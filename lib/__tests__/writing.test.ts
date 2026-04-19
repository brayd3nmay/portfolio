import { describe, it, expect } from 'vitest'
import { getAllArticles, getArticle, getAllSlugs } from '../writing'

describe('getAllArticles', () => {
  it('returns an array', () => {
    expect(Array.isArray(getAllArticles())).toBe(true)
  })

  it('returns articles sorted by date descending when populated', () => {
    const articles = getAllArticles()
    const dates = articles.map(a => a.date)
    const sorted = [...dates].sort((a, b) => b.localeCompare(a))
    expect(dates).toEqual(sorted)
  })
})

describe('getArticle', () => {
  it('returns null for unknown slug', () => {
    expect(getArticle('does-not-exist')).toBeNull()
  })
})

describe('getAllSlugs', () => {
  it('returns slugs for all articles', () => {
    expect(getAllSlugs()).toEqual(getAllArticles().map(a => a.slug))
  })
})
