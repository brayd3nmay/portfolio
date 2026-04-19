import { ModeSwitch } from '@/components/ModeSwitch'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Footer() {
  return (
    <footer className="mt-16 pt-6 border-t border-[var(--border)] text-sm text-[var(--muted)] flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-6">
        <a href="mailto:brayd3nmay@gmail.com" className="hover:text-[var(--fg)]">brayd3nmay@gmail.com</a>
        <a href="https://github.com/brayd3nmay" className="hover:text-[var(--fg)]">GitHub</a>
        <a href="https://www.linkedin.com/in/braydenmay/" className="hover:text-[var(--fg)]">LinkedIn</a>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <ModeSwitch to="terminal" />
      </div>
    </footer>
  )
}
