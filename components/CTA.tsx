import Link from 'next/link';
import { Container } from './Container';

export function CTA() {
  return (
    <section className="relative isolate mt-12 overflow-hidden">
      <div className="absolute inset-0 bg-accent-gradient" />
      <div className="absolute inset-0 grid-overlay" />
      <Container className="relative z-10 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Ready to ship a faster, cleaner site?
        </h2>
        <p className="mt-2 text-neutral-700">View more examples or request a proposal.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/contact" className="btn-primary no-underline">Contact</Link>
          <Link href="/work" className="btn-secondary no-underline">View Work</Link>
        </div>
      </Container>
    </section>
  );
}


