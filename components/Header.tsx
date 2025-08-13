"use client";

import Link from 'next/link';
import React from 'react';
import { createPortal } from 'react-dom';

const nav = [
  { href: '/work', label: 'Work' },
  { href: '/process', label: 'Process' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    if (menuOpen) {
      const previousOverflow = root.style.overflow;
      root.style.overflow = 'hidden';
      return () => {
        root.style.overflow = previousOverflow;
      };
    }
    return undefined;
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 header-surface border-b hairline">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold tracking-tight text-lg no-underline">
          Brayden May
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
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-sm border hairline"
          aria-label="Open menu"
          aria-expanded={menuOpen ? 'true' : 'false'}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {menuOpen && typeof window !== 'undefined'
        ? createPortal(
            <div className="md:hidden fixed inset-0 z-[999] bg-white">
              <div className="flex items-center justify-between px-4 py-3 border-b hairline">
                <span className="font-semibold">Menu</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="p-2 -m-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <nav aria-label="Mobile" className="px-4 py-2">
                <ul className="space-y-1">
                  {nav.map((n) => (
                    <li key={n.href}>
                      <Link
                        href={n.href}
                        className="block no-underline text-base py-3"
                        onClick={() => setMenuOpen(false)}
                      >
                        {n.label}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-2">
                    <Link
                      href="/contact"
                      className="btn-secondary w-full text-center no-underline"
                      onClick={() => setMenuOpen(false)}
                    >
                      Get Proposal
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}


