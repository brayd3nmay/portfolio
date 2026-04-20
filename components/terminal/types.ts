import type { Article } from '@/lib/writing'
import type { Book } from '@/lib/reading'

export type SerializedArticle = Pick<Article, 'slug' | 'title' | 'date' | 'excerpt' | 'readingTime' | 'body'>
export type SerializedBook = Book

export type CommandContext = {
  articles: SerializedArticle[]
  books: SerializedBook[]
  cwd: string
}

export const HOME = '/home/braydenmay'

export type OutputLine =
  | { kind: 'text'; text: string; tone?: 'normal' | 'muted' | 'accent' }
  | { kind: 'link'; text: string; href: string }
  | { kind: 'copy'; text: string; value: string; label: string }
  | { kind: 'heading'; text: string; level: 1 | 2 | 3 }
  | { kind: 'code'; text: string }
  | { kind: 'manHeader'; left: string; center: string; right: string }
  | { kind: 'manSection'; text: string }
  | { kind: 'image'; src: string; alt: string }

export type CommandResult = {
  lines: OutputLine[]
  clear?: boolean
  fallback?: boolean
  open?: string
  switchToGui?: boolean
  cwd?: string
}
