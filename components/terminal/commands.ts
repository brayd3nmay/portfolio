import type { CommandContext, CommandResult, OutputLine, SerializedBook } from './types'

type Handler = (args: string[], ctx: CommandContext) => CommandResult

function text(t: string, tone?: 'normal' | 'muted' | 'accent'): OutputLine {
  return { kind: 'text', text: t, tone }
}

function stars(rating: number | null): string {
  if (rating === null) return '—   '
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}

function renderBody(body: string): OutputLine[] {
  const lines = body.split('\n')
  const out: OutputLine[] = []
  let inCode = false
  let codeBuf: string[] = []
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        out.push({ kind: 'code', text: codeBuf.join('\n') })
        codeBuf = []
        inCode = false
      } else {
        inCode = true
      }
      continue
    }
    if (inCode) { codeBuf.push(line); continue }
    if (line.startsWith('### ')) out.push({ kind: 'heading', text: line.slice(4), level: 3 })
    else if (line.startsWith('## ')) out.push({ kind: 'heading', text: line.slice(3), level: 2 })
    else if (line.startsWith('# ')) out.push({ kind: 'heading', text: line.slice(2), level: 1 })
    else out.push(text(line))
  }
  if (inCode && codeBuf.length) out.push({ kind: 'code', text: codeBuf.join('\n') })
  return out
}

const HANDLERS: Record<string, { desc: string; run: Handler }> = {
  help: {
    desc: 'list commands',
    run: () => ({
      lines: Object.entries(HANDLERS).map(([n, h]) => text(`  ${n.padEnd(10)} ${h.desc}`)),
    }),
  },
  about: {
    desc: 'short bio',
    run: () => ({
      lines: [
        text('Brayden May — CS & Engineering student at Ohio State, Class of 2027.'),
        text('Building at the intersection of technology, design, and business.'),
      ],
    }),
  },
  work: {
    desc: 'experience',
    run: () => ({
      lines: [
        { kind: 'heading', text: 'Builders', level: 3 },
        text('  President. Programming, mentorship, and fundraising for the next generation of founders.'),
        text(''),
        { kind: 'heading', text: 'Mango', level: 3 },
        text('  Founder. Investor matching platform powered by AI agents. Finalist, OSU Buckeye Accelerator.'),
        text(''),
        { kind: 'heading', text: 'Ohio State', level: 3 },
        text('  B.S. Computer Science and Engineering, Class of 2027.'),
      ],
    }),
  },
  skills: {
    desc: 'tech stack',
    run: () => ({
      lines: [
        text('design     figma'),
        text('frontend   react, next.js, tailwind'),
        text('backend    python, java, typescript, c/c++, ruby'),
        text('infra      aws, vercel, cloudflare, docker, linux'),
        text('ai         langgraph'),
        text('version    git, github'),
      ],
    }),
  },
  writing: {
    desc: 'list articles, or `writing <slug>` to open one',
    run: (args, ctx) => {
      if (args.length === 0) {
        return { lines: ctx.articles.map((a) => text(`  ${a.date}  ${a.title}  (${a.slug})`)) }
      }
      const slug = args[0]
      const article = ctx.articles.find((a) => a.slug === slug)
      if (!article) return { lines: [text(`article not found: ${slug}`)] }
      return {
        lines: [
          { kind: 'heading', text: article.title, level: 2 },
          text(`${article.date} · ${article.readingTime} min read`, 'muted'),
          text(''),
          ...renderBody(article.body),
        ],
      }
    },
  },
  reading: {
    desc: 'list books, or `reading <n>` for detail',
    run: (args, ctx) => {
      if (args.length === 0) {
        return {
          lines: ctx.books.map((b: SerializedBook, i: number) =>
            text(`  ${String(i + 1).padStart(2)}. ${b.title} — ${b.author}  [${stars(b.rating)}]`),
          ),
        }
      }
      const n = Number(args[0])
      if (!Number.isInteger(n)) return { lines: [text(`reading: expected a number, got ${args[0]}`)] }
      if (n < 1 || n > ctx.books.length) return { lines: [text(`book not found: ${n}`)] }
      const b = ctx.books[n - 1]
      return {
        lines: [
          { kind: 'heading', text: b.title, level: 3 },
          text(`by ${b.author}`, 'muted'),
          text(`rating: ${b.rating === null ? 'currently reading' : stars(b.rating)}`),
          text(`finished: ${b.finishedAt}`, 'muted'),
          ...(b.note ? [text(''), text(b.note)] : []),
        ],
      }
    },
  },
  contact: {
    desc: 'ways to reach me',
    run: () => ({
      lines: [
        { kind: 'copy', text: 'email: brayd3nmay@gmail.com', value: 'brayd3nmay@gmail.com', label: 'copy' },
        { kind: 'link', text: 'github: github.com/brayd3nmay', href: 'https://github.com/brayd3nmay' },
        { kind: 'link', text: 'linkedin: linkedin.com/in/braydenmay', href: 'https://www.linkedin.com/in/braydenmay/' },
      ],
    }),
  },
  clear: { desc: 'clear the screen', run: () => ({ lines: [], clear: true }) },
  theme: { desc: 'toggle dark/light', run: () => ({ lines: [text('theme toggled')], theme: 'toggle' }) },
  source: {
    desc: 'view site source on GitHub',
    run: () => ({
      lines: [{ kind: 'link', text: 'github.com/brayd3nmay/portfolio', href: 'https://github.com/brayd3nmay/portfolio' }],
    }),
  },
}

export function runCommand(input: string, ctx: CommandContext): CommandResult {
  const [name, ...args] = input.trim().split(/\s+/)
  if (!name) return { lines: [] }
  const cmd = HANDLERS[name]
  if (!cmd) return { lines: [text(`command not found: ${name}. try: help`)], fallback: true }
  return cmd.run(args, ctx)
}

export function listCommands(): string[] {
  return Object.keys(HANDLERS)
}

export function getCompletions(prefix: string, ctx: CommandContext): string[] {
  const tokens = prefix.split(/\s+/)
  if (tokens.length === 1) {
    return listCommands().filter((c) => c.startsWith(tokens[0]))
  }
  if (tokens[0] === 'writing') {
    return ctx.articles
      .map((a) => a.slug)
      .filter((s) => s.startsWith(tokens[1] ?? ''))
      .map((s) => `writing ${s}`)
  }
  if (tokens[0] === 'reading') {
    return ctx.books
      .map((_, i) => String(i + 1))
      .filter((n) => n.startsWith(tokens[1] ?? ''))
      .map((n) => `reading ${n}`)
  }
  return []
}
