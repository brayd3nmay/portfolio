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
