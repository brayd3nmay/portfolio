import { getBooks } from '@/lib/reading'

export const metadata = { title: 'Reading — Brayden May' }

function stars(rating: number | null) {
  if (rating === null) return 'reading'
  return '★'.repeat(rating)
}

export default function ReadingPage() {
  const books = getBooks()
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Reading</h1>
      <ul className="space-y-6">
        {books.map((b) => (
          <li key={b.title} className="flex gap-4 items-end">
            <div className="aspect-[2/3] w-24 shrink-0 bg-[var(--border)] rounded-sm overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.cover} alt={`${b.title} by ${b.author}`} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="text-[var(--muted)]">{stars(b.rating)}</div>
              {b.note && <div>{b.note}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
