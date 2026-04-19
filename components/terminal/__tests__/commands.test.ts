import { describe, it, expect } from 'vitest'
import { runCommand, listCommands } from '../commands'
import { HOME, type CommandContext } from '../types'

const ctx: CommandContext = {
  cwd: HOME,
  articles: [
    { slug: 'post-a', title: 'Post A', date: '2026-02-01', excerpt: 'a', readingTime: 2, body: '## Hello\n\nParagraph text.\n\n```\ncode here\n```' },
    { slug: 'post-b', title: 'Post B', date: '2026-01-01', excerpt: 'b', readingTime: 1, body: 'Plain body.' },
  ],
  books: [
    { title: 'Book One', author: 'Alice', cover: '/x.jpg', rating: 5, finishedAt: '2025-09' },
    { title: 'Book Two', author: 'Bob', cover: '/y.jpg', rating: null, finishedAt: 'reading' },
  ],
}

describe('runCommand', () => {
  it('help lists all commands', () => {
    const out = runCommand('help', ctx)
    const txt = out.lines.map((l) => (l as any).text).join('\n')
    expect(txt).toContain('about')
    expect(txt).toContain('work')
    expect(txt).toContain('writing')
  })

  it('about returns bio', () => {
    const out = runCommand('about', ctx)
    expect(out.lines.map((l) => (l as any).text).join(' ')).toMatch(/Brayden/i)
  })

  it('unknown command flags fallback', () => {
    const out = runCommand('banana', ctx)
    expect(out.fallback).toBe(true)
    expect(out.lines.some((l: any) => /command not found/i.test(l.text))).toBe(true)
  })

  it('clear returns clear signal', () => {
    expect(runCommand('clear', ctx).clear).toBe(true)
  })

  it('reading lists books with star ratings', () => {
    const out = runCommand('reading', ctx)
    const txt = out.lines.map((l: any) => l.text).join('\n')
    expect(txt).toContain('★')
    expect(txt).toContain('Book One')
    expect(txt).toContain('Alice')
  })

  it('reading <n> returns specific book', () => {
    const out = runCommand('reading 2', ctx)
    const txt = out.lines.map((l: any) => l.text).join('\n')
    expect(txt).toContain('Book Two')
  })

  it('writing lists articles', () => {
    const out = runCommand('writing', ctx)
    const txt = out.lines.map((l: any) => l.text).join('\n')
    expect(txt).toContain('Post A')
  })

  it('writing <slug> parses MDX headings and code', () => {
    const out = runCommand('writing post-a', ctx)
    const kinds = out.lines.map((l) => l.kind)
    expect(kinds).toContain('heading')
    expect(kinds).toContain('code')
  })

  it('contact includes a copy entry for email', () => {
    const out = runCommand('contact', ctx)
    const copy = out.lines.find((l) => l.kind === 'copy') as any
    expect(copy).toBeTruthy()
    expect(copy.value).toBe('brayd3nmay@gmail.com')
  })
})

describe('listCommands', () => {
  it('returns all command names', () => {
    const names = listCommands()
    for (const n of ['help', 'about', 'work', 'skills', 'writing', 'reading', 'contact', 'clear', 'source', 'email', 'github', 'linkedin']) {
      expect(names).toContain(n)
    }
  })
})
