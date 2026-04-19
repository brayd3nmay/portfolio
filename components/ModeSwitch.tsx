'use client'

import { setModeCookie, type Mode } from '@/lib/mode'
import { useRouter } from 'next/navigation'

export function ModeSwitch({ to }: { to: Mode }) {
  const router = useRouter()
  const label = to === 'terminal' ? 'switch to terminal →' : 'switch to GUI →'
  const href = to === 'terminal' ? '/' : '/gui'
  return (
    <a
      href={href}
      className="text-xs text-muted hover:text-fg"
      onClick={(e) => {
        e.preventDefault()
        setModeCookie(to)
        router.push(href)
      }}
    >
      [{label}]
    </a>
  )
}
