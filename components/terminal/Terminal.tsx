'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { runCommand, getCompletions } from './commands'
import { OutputLineView } from './Output'
import { Prompt } from './Prompt'
import { ModeSwitch } from '@/components/ModeSwitch'
import { setModeCookie } from '@/lib/mode'
import type { CommandContext, CommandResult, OutputLine } from './types'
import { HOME } from './types'

function promptFor(cwd: string): string {
  const rel = cwd === HOME ? '~' : cwd.startsWith(HOME + '/') ? '~' + cwd.slice(HOME.length) : cwd
  return `braydenmay@portfolio:${rel}$`
}

// Homebrew-style phosphor green theme, applied to the terminal surface only
const RETRO_STYLE: React.CSSProperties = {
  ['--bg' as string]: '#000000',
  ['--fg' as string]: '#00ff00',
  ['--muted' as string]: '#00aa00',
  ['--border' as string]: '#003300',
  background: 'var(--bg)',
  color: 'var(--fg)',
  textShadow: '0 0 2px rgba(0, 255, 0, 0.35)',
}

type Entry =
  | { kind: 'input'; text: string; id: number; cwd: string }
  | { kind: 'output'; line: OutputLine; id: number; typewriter: boolean }

const HINT = 'type help to get started, or try: about, work, blog'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  if (typeof window.matchMedia !== 'function') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Terminal({ ctx: ctxProp, initialCommand }: { ctx: Omit<CommandContext, 'cwd'>; initialCommand?: string }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showFallback, setShowFallback] = useState(false)
  const [fallbackDismissed, setFallbackDismissed] = useState(false)
  const [cwd, setCwd] = useState(HOME)
  const ctx: CommandContext = { ...ctxProp, cwd }
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)
  const ranInitial = useRef(false)

  const reducedMotion = useMemo(() => prefersReducedMotion(), [])

  function nextId() { idRef.current += 1; return idRef.current }

  function pushCommand(raw: string) {
    const text = raw.trim()
    if (!text) return
    const result: CommandResult = runCommand(text, ctx)
    setHistory((h) => [...h, text])
    setHistoryIndex(-1)
    if (result.clear) {
      setEntries([])
    } else {
      const typewriter = !reducedMotion
      setEntries((e) => [
        ...e,
        { kind: 'input', text, id: nextId(), cwd: ctx.cwd },
        ...result.lines.map((line) => ({ kind: 'output' as const, line, id: nextId(), typewriter })),
      ])
    }
    if (result.fallback && !fallbackDismissed) setShowFallback(true)
    if (result.cwd) setCwd(result.cwd)
    if (result.open) {
      if (result.open.startsWith('mailto:')) {
        window.location.href = result.open
      } else {
        window.open(result.open, '_blank', 'noopener,noreferrer')
      }
    }
    if (result.switchToGui) {
      setModeCookie('gui')
      window.location.href = '/gui'
    }
    setValue('')

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('cmd', text.replace(/\s+/g, '+'))
      window.history.pushState({ cmd: text }, '', url.toString())
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next); setValue(history[next]); return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const next = historyIndex + 1
      if (next >= history.length) { setHistoryIndex(-1); setValue(''); return }
      setHistoryIndex(next); setValue(history[next]); return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const matches = getCompletions(value, ctx)
      if (matches.length === 0) return
      if (matches.length === 1) {
        setValue(matches[0])
        return
      }
      // partial completion to the common prefix, if it advances value
      const common = matches.reduce((p, m) => {
        let i = 0
        while (i < p.length && i < m.length && p[i] === m[i]) i++
        return p.slice(0, i)
      })
      if (common.length > value.length) {
        setValue(common)
        return
      }
      // otherwise, list the matches
      setEntries((es) => [
        ...es,
        { kind: 'input', text: value, id: nextId(), cwd: ctx.cwd },
        ...matches.map((m) => ({
          kind: 'output' as const,
          line: { kind: 'text' as const, text: '  ' + m },
          id: nextId(),
          typewriter: false,
        })),
      ])
      return
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault()
      setEntries([])
    }
  }

  useEffect(() => {
    if (ranInitial.current) return
    ranInitial.current = true
    if (initialCommand) pushCommand(initialCommand)
  }, [initialCommand])

  useEffect(() => {
    if (scrollRef.current && typeof scrollRef.current.scrollTo === 'function') {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight })
    }
    inputRef.current?.focus()
  }, [entries.length])

  useEffect(() => {
    if (fallbackDismissed || entries.length > 0) return
    const t = setTimeout(() => setShowFallback(true), 8000)
    return () => clearTimeout(t)
  }, [entries.length, fallbackDismissed])

  function refocus() { inputRef.current?.focus() }

  return (
    <div
      ref={scrollRef}
      onClick={refocus}
      style={RETRO_STYLE}
      className="min-h-screen max-h-screen overflow-y-auto p-6 font-mono text-sm leading-relaxed relative"
    >
      <div className="absolute top-4 right-6">
        <ModeSwitch to="gui" />
      </div>
      <div className="text-[var(--muted)] mb-4">{HINT}</div>
      <div>
        {entries.map((entry) =>
          entry.kind === 'input' ? (
            <div key={entry.id}>
              <span className="text-[var(--muted)]">{promptFor(entry.cwd)}</span> {entry.text}
            </div>
          ) : (
            <OutputLineView key={entry.id} line={entry.line} typewriter={entry.typewriter} />
          ),
        )}
      </div>
      <Prompt
        ref={inputRef}
        value={value}
        onChange={setValue}
        onSubmit={() => pushCommand(value)}
        onKeyDown={onKeyDown}
        label={promptFor(cwd)}
      />
      {showFallback && (
        <div className="fixed bottom-6 right-6 bg-[var(--bg)] border border-[var(--border)] rounded p-3 text-xs flex items-center gap-3">
          <span className="text-[var(--muted)]">not sure what to type?</span>
          <ModeSwitch to="gui" />
          <button
            aria-label="dismiss"
            onClick={() => { setShowFallback(false); setFallbackDismissed(true) }}
            className="text-[var(--muted)] hover:text-[var(--fg)]"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
