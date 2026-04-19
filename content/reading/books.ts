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
