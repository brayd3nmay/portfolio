'use client'

import { useEffect, useState } from 'react'
import type { OutputLine } from './types'

function Text({ line, reveal }: { line: Extract<OutputLine, { kind: 'text' }>; reveal: string }) {
  const cls =
    line.tone === 'muted' ? 'text-[var(--muted)]' :
    line.tone === 'accent' ? 'font-semibold' : ''
  return <span className={cls}>{reveal || '\u00a0'}</span>
}

export function OutputLineView({ line, typewriter }: { line: OutputLine; typewriter: boolean }) {
  if (line.kind === 'text') {
    const full = line.text
    const [reveal, setReveal] = useState(typewriter ? '' : full)
    useEffect(() => {
      if (!typewriter) { setReveal(full); return }
      let i = 0
      const t = setInterval(() => {
        i++
        setReveal(full.slice(0, i))
        if (i >= full.length) clearInterval(t)
      }, 10)
      return () => clearInterval(t)
    }, [full, typewriter])
    return <div><Text line={line} reveal={reveal} /></div>
  }

  if (line.kind === 'link') {
    const external = line.href.startsWith('http')
    return (
      <div>
        <a
          href={line.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noreferrer' : undefined}
          className="underline hover:text-[var(--muted)]"
        >
          {line.text}
        </a>
      </div>
    )
  }

  if (line.kind === 'copy') {
    return (
      <div>
        <span>{line.text}</span>{' '}
        <button
          onClick={async () => {
            try { await navigator.clipboard.writeText(line.value) } catch {}
          }}
          className="underline text-[var(--muted)] hover:text-[var(--fg)]"
        >
          [{line.label}]
        </button>
      </div>
    )
  }

  if (line.kind === 'heading') {
    const size = line.level === 1 ? 'text-lg' : line.level === 2 ? 'text-base font-semibold' : 'font-semibold'
    return <div className={size}>{line.text}</div>
  }

  if (line.kind === 'code') {
    return (
      <pre className="bg-[var(--border)] p-2 rounded text-xs whitespace-pre-wrap overflow-x-auto my-1">
        {line.text}
      </pre>
    )
  }

  return null
}
