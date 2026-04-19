'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    if (next === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    try { localStorage.setItem('portfolio_theme', next) } catch {}
    setTheme(next)
  }

  return (
    <button
      onClick={toggle}
      className="text-xs text-[var(--muted)] hover:text-[var(--fg)]"
      aria-label="toggle theme"
    >
      [{theme === 'dark' ? '☾ dark' : '☼ light'}]
    </button>
  )
}
