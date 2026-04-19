import { getAllArticles } from '@/lib/writing'
import { getBooks } from '@/lib/reading'

export function SeoContent() {
  const articles = getAllArticles()
  const books = getBooks()
  return (
    <div className="sr-only">
      <h1>Brayden May</h1>
      <p>Building at the intersection of technology, design, and business.</p>
      <h2>Work</h2>
      <ul>
        <li>Builders — President</li>
        <li>Mango — Founder</li>
        <li>Ohio State — B.S. Computer Science and Engineering, Class of 2027</li>
      </ul>
      <h2>Writing</h2>
      <ul>
        {articles.map((a) => (<li key={a.slug}>{a.date} — {a.title}: {a.excerpt}</li>))}
      </ul>
      <h2>Reading</h2>
      <ul>
        {books.map((b) => (<li key={b.title}>{b.title} by {b.author}</li>))}
      </ul>
      <h2>Contact</h2>
      <ul>
        <li><a href="mailto:brayd3nmay@gmail.com">brayd3nmay@gmail.com</a></li>
        <li><a href="https://github.com/brayd3nmay">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/braydenmay/">LinkedIn</a></li>
      </ul>
    </div>
  )
}
