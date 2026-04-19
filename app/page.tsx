import { Terminal } from '@/components/terminal/Terminal'
import { SeoContent } from '@/components/SeoContent'
import { getAllArticles } from '@/lib/writing'
import { getBooks } from '@/lib/reading'
import type { CommandContext, SerializedArticle } from '@/components/terminal/types'

export default async function HomePage({
  searchParams,
}: { searchParams: Promise<{ cmd?: string }> }) {
  const { cmd } = await searchParams
  const initialCommand = cmd ? cmd.replace(/\+/g, ' ') : undefined

  const articles: SerializedArticle[] = getAllArticles().map((a) => ({
    slug: a.slug, title: a.title, date: a.date, excerpt: a.excerpt, readingTime: a.readingTime, body: a.body,
  }))
  const books = getBooks()
  const ctx: CommandContext = { articles, books }

  return (
    <>
      <SeoContent />
      <Terminal ctx={ctx} initialCommand={initialCommand} />
    </>
  )
}
