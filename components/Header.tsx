import Link from 'next/link';
import React from 'react';

const nav = [
  { href: '/work', label: 'Work' },
  { href: '/process', label: 'Process' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 header-surface border-b hairline">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold tracking-tight text-lg no-underline">
          Brayden
        </Link>
        <nav aria-label="Primary">
          <ul className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="no-underline text-sm hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="btn-secondary no-underline">Get Proposal</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}


