import { books, type Book } from '@/content/reading/books'
export type { Book }

export function getBooks(): Book[] {
  return books
}

export function getBook(index: number): Book | null {
  if (index < 1 || index > books.length) return null
  return books[index - 1]
}
