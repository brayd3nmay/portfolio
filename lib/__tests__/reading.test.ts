import { describe, it, expect } from 'vitest'
import { getBooks, getBook } from '../reading'

describe('getBooks', () => {
  it('returns an array', () => {
    expect(Array.isArray(getBooks())).toBe(true)
  })
})

describe('getBook', () => {
  it('returns null for out-of-range index', () => {
    expect(getBook(0)).toBeNull()
    expect(getBook(9999)).toBeNull()
  })
})
