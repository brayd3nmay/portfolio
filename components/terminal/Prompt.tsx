'use client'

import { forwardRef } from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  label?: string
}

export const Prompt = forwardRef<HTMLInputElement, Props>(function Prompt(
  { value, onChange, onSubmit, onKeyDown, label = 'brayden@portfolio:~$' }, ref
) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} className="flex items-baseline gap-2">
      <span className="text-[var(--muted)] select-none">{label}</span>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        aria-label="terminal input"
        className="flex-1 bg-transparent border-0 outline-none text-[var(--fg)] caret-[var(--fg)]"
      />
    </form>
  )
})
