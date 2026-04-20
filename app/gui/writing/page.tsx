import Link from 'next/link'
import { getAllArticles } from '@/lib/writing'

export const metadata = { title: 'Blog — Brayden May' }

export default function WritingIndex() {
  const articles = getAllArticles()
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Blog</h1>
      <ul className="space-y-2">
        {articles.map((a) => (
          <li key={a.slug} className="flex justify-between gap-4 border-b border-[var(--border)] py-2">
            <Link href={`/gui/writing/${a.slug}`} className="hover:underline">{a.title}</Link>
            <span className="text-[var(--muted)] text-sm">{a.date}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
