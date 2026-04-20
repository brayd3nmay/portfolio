export type Book = {
  title: string
  author: string
  cover: string
  rating: number | null
  note?: string
}

export const books: Book[] = [
  {
    title: "Zero to One",
    author: "Peter Thiel",
    cover: "/books/zto.jpg",
    rating: 5,
    note: "This was the first non-fiction book that made me fall in love with reading.",
  },
]
