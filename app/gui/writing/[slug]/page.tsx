import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getArticle, getAllSlugs } from '@/lib/writing'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: 'Not found' }
  return {
    title: `${article.title} — Brayden May`,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: 'article' },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  return (
    <article className="max-w-none">
      <Link href="/gui/writing" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">← back to blog</Link>
      <h1 className="text-xl font-semibold mt-6">{article.title}</h1>
      <div className="text-sm text-[var(--muted)] mt-1 mb-8">{article.date} · {article.readingTime} min read</div>
      <div className="space-y-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_h3]:font-semibold [&_h3]:mt-6 [&_code]:bg-[var(--border)] [&_code]:px-1 [&_code]:rounded [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6">
        <MDXRemote source={article.body} />
      </div>
    </article>
  )
}
