"use client";

import Link from 'next/link';
import React from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/work', label: 'Work' },
  { href: '/process', label: 'Process' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = React.useState(0);

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

  React.useEffect(() => {
    const measure = () => {
      const element = headerRef.current;
      if (element) {
        setHeaderHeight(element.getBoundingClientRect().height);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 header-surface border-b hairline">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold tracking-tight text-lg no-underline">
          Brayden May
        </Link>
        <nav aria-label="Primary">
          <ul className="hidden md:flex items-center gap-6">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="no-underline text-sm hover:underline"
                  aria-current={pathname === n.href ? 'page' : undefined}
                >
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
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen ? 'true' : 'false'}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && typeof window !== 'undefined'
        ? createPortal(
            <div
              id="mobile-menu"
              className="md:hidden fixed left-0 right-0 bottom-0 z-[9999] bg-white border-t hairline"
              style={{ top: headerHeight }}
              aria-modal="true"
              role="dialog"
            >
              <nav aria-label="Mobile" className="px-4 py-3 h-full overflow-y-auto pb-[env(safe-area-inset-bottom)]">
                <ul className="space-y-1">
                  {nav.map((n) => (
                    <li key={n.href}>
                      <Link
                        href={n.href}
                        className="block no-underline text-xl font-semibold py-4"
                        onClick={() => setMenuOpen(false)}
                      >
                        {n.label}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-2">
                    <Link
                      href="/contact"
                      className="btn-secondary w-full text-center no-underline !text-xl !font-semibold !py-4"
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


