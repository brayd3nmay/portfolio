import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="p-6 font-mono text-sm">
      <div className="text-[var(--muted)]">braydenmay@portfolio:~$ cat /requested/path</div>
      <div className="mt-1">cat: /requested/path: No such file or directory</div>
      <div className="mt-6 space-x-4">
        <Link href="/" className="underline">terminal</Link>
        <Link href="/gui" className="underline">gui</Link>
      </div>
    </div>
  )
}
