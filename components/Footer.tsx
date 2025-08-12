import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t hairline bg-white/70">
      <div className="container mx-auto px-4 py-8 text-sm text-neutral-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {year} Brayden May. All rights reserved.</p>
        <nav aria-label="Footer">
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/work" className="no-underline hover:underline">Work</Link>
            </li>
            <li>
              <Link href="/process" className="no-underline hover:underline">Process</Link>
            </li>
            <li>
              <Link href="/pricing" className="no-underline hover:underline">Pricing</Link>
            </li>
            <li>
              <Link href="/contact" className="no-underline hover:underline">Contact</Link>
            </li>
          </ul>
        </nav>
        <p className="text-neutral-500">Site by Brayden May</p>
      </div>
    </footer>
  );
}


