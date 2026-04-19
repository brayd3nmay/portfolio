export type Book = {
  title: string
  author: string
  cover: string
  rating: number | null
  finishedAt: string
  note?: string
}

export const books: Book[] = []
