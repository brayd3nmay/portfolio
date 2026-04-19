import Link from 'next/link'
import { ModeSwitch } from '@/components/ModeSwitch'

export function Header() {
  return (
    <header className="relative flex items-baseline justify-between py-6 border-b border-[var(--border)]">
      <Link href="/gui" className="text-base font-semibold">Brayden May</Link>
      <nav className="flex gap-6 text-sm">
        <Link href="/gui/writing" className="hover:underline">Writing</Link>
        <Link href="/gui/reading" className="hover:underline">Reading</Link>
        <a href="mailto:brayd3nmay@gmail.com" className="hover:underline">Contact</a>
      </nav>
      <div className="absolute top-4 right-0">
        <ModeSwitch to="terminal" />
      </div>
    </header>
  )
}
