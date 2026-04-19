import type { CommandContext, CommandResult, OutputLine, SerializedBook } from './types'
import { HOME } from './types'

type Handler = (args: string[], ctx: CommandContext) => CommandResult
type Entry = { desc: string; run: Handler; hidden?: boolean }

function text(t: string, tone?: 'normal' | 'muted' | 'accent'): OutputLine {
  return { kind: 'text', text: t, tone }
}

// --- Virtual filesystem -----------------------------------------------------

function bookFile(i: number, title: string): string {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${i + 1}-${slug}`
}

function listDir(path: string, ctx: CommandContext): string[] | null {
  if (path === HOME) {
    return ['about', 'work', 'skills', 'contact/', 'writing/', 'reading/']
  }
  if (path === `${HOME}/contact`) {
    return ['email', 'github', 'linkedin']
  }
  if (path === `${HOME}/writing`) {
    return ctx.articles.map((a) => `${a.slug}.mdx`)
  }
  if (path === `${HOME}/reading`) {
    return ctx.books.map((b, i) => bookFile(i, b.title))
  }
  return null
}

function resolvePath(cwd: string, target: string): string {
  if (!target || target === '~') return HOME
  const start = target.startsWith('/') ? '' : cwd
  const resolved = target.startsWith('/') ? target : `${start}/${target}`
  const parts: string[] = []
  for (const seg of resolved.split('/')) {
    if (!seg || seg === '.') continue
    if (seg === '..') parts.pop()
    else parts.push(seg)
  }
  return '/' + parts.join('/')
}

// Run a name inside the current directory as its underlying action.
// Returns null if no file match.
function runFile(name: string, ctx: CommandContext): CommandResult | null {
  if (ctx.cwd === `${HOME}/writing`) {
    const slug = name.replace(/\.mdx?$/, '')
    const article = ctx.articles.find((a) => a.slug === slug)
    if (article) return HANDLERS.writing.run([slug], ctx)
  }
  if (ctx.cwd === `${HOME}/reading`) {
    const m = name.match(/^(\d+)(?:-.*)?$/)
    if (m) return HANDLERS.reading.run([m[1]], ctx)
  }
  if (ctx.cwd === `${HOME}/contact`) {
    if (name === 'email' || name === 'github' || name === 'linkedin') {
      return HANDLERS[name].run([], ctx)
    }
  }
  return null
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

const HANDLERS: Record<string, Entry> = {
  help: {
    desc: 'list commands',
    run: () => {
      const entries = Object.entries(HANDLERS).filter(([, h]) => !h.hidden)
      return {
        lines: [
          { kind: 'manHeader', left: 'PORTFOLIO(1)', center: 'General Commands Manual', right: 'PORTFOLIO(1)' },
          { kind: 'manSection', text: 'NAME' },
          text('     braydenmay - personal portfolio terminal'),
          text(''),
          { kind: 'manSection', text: 'SYNOPSIS' },
          text('     <command> [args...]'),
          text(''),
          { kind: 'manSection', text: 'DESCRIPTION' },
          text('     This site is a terminal. Type a command to reveal content.'),
          text('     The GUI fallback is always available via [switch to GUI →].'),
          text(''),
          text('     The following commands are available:'),
          text(''),
          ...entries.map(([n, h]) => text(`     ${n.padEnd(12)}${h.desc}`)),
        ],
      }
    },
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
        text('  Founder. Investor matching platform powered by AI agents. Finalist at OSU Buckeye Accelerator and ShowOH/IO.'),
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
  email: {
    desc: 'open mail client to brayd3nmay@gmail.com',
    run: () => ({
      lines: [text('opening mail client...', 'muted')],
      open: 'mailto:brayd3nmay@gmail.com',
    }),
  },
  github: {
    desc: 'open github.com/brayd3nmay in a new tab',
    run: () => ({
      lines: [text('opening github.com/brayd3nmay...', 'muted')],
      open: 'https://github.com/brayd3nmay',
    }),
  },
  linkedin: {
    desc: 'open linkedin.com/in/braydenmay in a new tab',
    run: () => ({
      lines: [text('opening linkedin.com/in/braydenmay...', 'muted')],
      open: 'https://www.linkedin.com/in/braydenmay/',
    }),
  },
  clear: { desc: 'clear the screen', run: () => ({ lines: [], clear: true }) },
  gui: {
    desc: 'switch to the graphical version of this site',
    run: () => ({
      lines: [text('switching to GUI...', 'muted')],
      switchToGui: true,
    }),
  },
  source: {
    desc: 'view site source on GitHub',
    run: () => ({
      lines: [text('opening github.com/brayd3nmay/portfolio...', 'muted')],
      open: 'https://github.com/brayd3nmay/portfolio',
    }),
  },
  ls: {
    desc: 'list directory contents',
    run: (args, ctx) => {
      const target = args.length > 0 ? resolvePath(ctx.cwd, args[0]) : ctx.cwd
      const entries = listDir(target, ctx)
      if (entries === null) return { lines: [text(`ls: ${args[0] ?? target}: No such file or directory`)] }
      return { lines: entries.map((e) => text(e)) }
    },
  },
  pwd: {
    desc: 'print working directory',
    run: (_args, ctx) => ({ lines: [text(ctx.cwd)] }),
  },
  cd: {
    desc: 'change directory',
    run: (args, ctx) => {
      const target = args.length > 0 ? args[0] : '~'
      const resolved = resolvePath(ctx.cwd, target)
      if (listDir(resolved, ctx) === null) {
        return { lines: [text(`cd: no such directory: ${target}`)] }
      }
      return { lines: [], cwd: resolved }
    },
  },
  cat: {
    desc: 'print the contents of a file',
    run: (args, ctx) => {
      if (args.length === 0) return { lines: [text('usage: cat <file>')] }
      const name = args[0]
      const entries = listDir(ctx.cwd, ctx)
      if (entries && entries.includes(name)) {
        const result = runFile(name.replace(/\/$/, ''), ctx)
        if (result) return result
      }
      if (ctx.cwd === HOME && ['about', 'work', 'skills'].includes(name)) {
        return HANDLERS[name].run([], ctx)
      }
      return { lines: [text(`cat: ${name}: No such file or directory`)] }
    },
  },
  whoami: {
    desc: 'who you are talking to',
    run: () => ({ lines: [text('braydenmay')] }),
  },
  echo: {
    desc: 'print the arguments back',
    run: (args) => ({ lines: [text(args.join(' '))] }),
  },
  date: {
    desc: "today's date (your local time)",
    run: () => ({ lines: [text(new Date().toString())] }),
  },
  uname: {
    desc: 'system info',
    run: (args) => {
      if (args[0] === '-a') {
        return { lines: [text('BraydenMayOS 1.0 portfolio.local x86_64 Berkeley Mono / Next.js')] }
      }
      return { lines: [text('BraydenMayOS')] }
    },
  },
  man: {
    desc: 'manual (alias for `help`)',
    run: (args, ctx) => HANDLERS.help.run(args, ctx),
  },
  neofetch: {
    desc: 'system info, brayden may edition',
    run: () => ({
      lines: [
        text('        ___'),
        text('       /   \\       braydenmay@portfolio'),
        text('      |  o  |      --------------------'),
        text('       \\___/       OS:       BraydenMayOS 1.0'),
        text('      /     \\      Host:     Ohio State, CS & Engineering, 2027'),
        text('     |       |     Shell:    portfolio-terminal'),
        text('     |       |     Editor:   Figma, VS Code'),
        text('      \\     /      Stack:    React, Next.js, Python, TypeScript'),
        text('       \\   /       Currently: building @ Builders, was founder @ Mango'),
        text('        | |        Contact:  brayd3nmay@gmail.com'),
      ],
    }),
  },
  // easter eggs — hidden from help
  sudo: {
    desc: 'execute as superuser',
    hidden: true,
    run: () => ({ lines: [text('nice try.')] }),
  },
  rm: {
    desc: 'remove files',
    hidden: true,
    run: () => ({ lines: [text("you can't break this. it's just a website.")] }),
  },
  vim: {
    desc: 'open vim',
    hidden: true,
    run: () => ({ lines: [text("vim doesn't run here. try `writing` to read instead.")] }),
  },
  emacs: {
    desc: 'open emacs',
    hidden: true,
    run: () => ({ lines: [text('emacs? in this house?')] }),
  },
  nano: {
    desc: 'open nano',
    hidden: true,
    run: () => ({ lines: [text('nano is for cowards. (jk)')] }),
  },
  exit: {
    desc: 'exit',
    hidden: true,
    run: () => ({ lines: [text("you can't exit. this is the web.")] }),
  },
  quit: {
    desc: 'quit',
    hidden: true,
    run: () => ({ lines: [text("you can't quit. this is the web.")] }),
  },
  ping: {
    desc: 'ping',
    hidden: true,
    run: () => ({ lines: [text('PONG (from localhost, probably)')] }),
  },
  make: {
    desc: 'make',
    hidden: true,
    run: () => ({ lines: [text('make what? (try `writing`, `work`, or `neofetch`.)')] }),
  },
}

export function runCommand(input: string, ctx: CommandContext): CommandResult {
  const [rawName, ...args] = input.trim().split(/\s+/)
  if (!rawName) return { lines: [] }
  const name = rawName.replace(/^\.\//, '')

  // 1) direct command match
  const cmd = HANDLERS[name]
  if (cmd) return cmd.run(args, ctx)

  // 2) file in current directory (e.g. `hello-world.mdx` inside /writing)
  const file = runFile(name, ctx)
  if (file) return file

  // 3) relative path (e.g. `writing/hello-world.mdx` from home)
  if (name.includes('/')) {
    const target = resolvePath(ctx.cwd, name)
    const parent = target.slice(0, target.lastIndexOf('/')) || HOME
    const base = target.slice(target.lastIndexOf('/') + 1)
    const result = runFile(base, { ...ctx, cwd: parent })
    if (result) return result
  }

  return { lines: [text(`command not found: ${rawName}. try: help`)], fallback: true }
}

export function listCommands(): string[] {
  return Object.keys(HANDLERS)
}

function pathCompletions(arg: string, cwd: string, ctx: CommandContext): { prefix: string; matches: string[] } {
  const lastSlash = arg.lastIndexOf('/')
  let parent: string
  let partial: string
  let pathPrefix: string
  if (lastSlash === -1) {
    parent = cwd
    partial = arg
    pathPrefix = ''
  } else if (arg.startsWith('/')) {
    parent = resolvePath(cwd, arg.slice(0, lastSlash + 1))
    partial = arg.slice(lastSlash + 1)
    pathPrefix = arg.slice(0, lastSlash + 1)
  } else {
    parent = resolvePath(cwd, arg.slice(0, lastSlash))
    partial = arg.slice(lastSlash + 1)
    pathPrefix = arg.slice(0, lastSlash + 1)
  }
  const entries = listDir(parent, ctx) ?? []
  return {
    prefix: pathPrefix,
    matches: entries.filter((e) => e.startsWith(partial) || e.replace(/\/$/, '') === partial),
  }
}

export function getCompletions(prefix: string, ctx: CommandContext): string[] {
  const tokens = prefix.split(/\s+/)

  if (tokens.length === 1) {
    const token = tokens[0]
    const commands = listCommands().filter((c) => c.startsWith(token) && !HANDLERS[c].hidden)
    const filesInCwd = (listDir(ctx.cwd, ctx) ?? [])
      .filter((e) => e.startsWith(token))
    return Array.from(new Set([...commands, ...filesInCwd]))
  }

  const [cmd, ...rest] = tokens
  const arg = rest.length > 0 ? rest[rest.length - 1] : ''

  if (cmd === 'cd' || cmd === 'ls' || cmd === 'cat') {
    const { prefix: pathPrefix, matches } = pathCompletions(arg, ctx.cwd, ctx)
    return matches.map((m) => `${cmd} ${pathPrefix}${m}`)
  }

  if (cmd === 'writing') {
    return ctx.articles
      .map((a) => a.slug)
      .filter((s) => s.startsWith(arg))
      .map((s) => `writing ${s}`)
  }
  if (cmd === 'reading') {
    return ctx.books
      .map((_, i) => String(i + 1))
      .filter((n) => n.startsWith(arg))
      .map((n) => `reading ${n}`)
  }

  return []
}
