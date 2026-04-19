import { getBooks } from '@/lib/reading'

export const metadata = { title: 'Reading — Brayden May' }

function stars(rating: number | null) {
  if (rating === null) return '—'
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

export default function ReadingPage() {
  const books = getBooks()
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Reading</h1>
      <ul className="space-y-3">
        {books.map((b) => (
          <li key={b.title} className="grid grid-cols-[40px_1fr_auto] gap-4 items-center border-b border-[var(--border)] py-2">
            <div className="h-14 w-10 bg-[var(--border)] rounded-sm overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.cover} alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-semibold text-sm">{b.title}</div>
              <div className="text-[var(--muted)] text-xs">{b.author}{b.note ? ` — ${b.note}` : ''}</div>
            </div>
            <div className="text-[var(--muted)] text-xs whitespace-nowrap">{stars(b.rating)}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
