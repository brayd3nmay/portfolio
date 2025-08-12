import { Container } from '@/components/Container';
import { SectionHeading } from '@/components/SectionHeading';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, upfront pricing for busy small business owners.',
};

export default function PricingPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, upfront pricing"
          subtitle="Most projects are $5,000 or less. No long contracts, no surprises."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Built for busy owners</h3>
            <p className="mt-2 text-neutral-700 text-sm">
              I make it easy to get a new website live without the hassle. You’ll get a clear
              proposal with the total price and scope up front, explained in plain English.
            </p>
            <p className="mt-3 text-neutral-700 text-sm">
              Most small‑business projects come in at or under <strong>$5,000</strong>. If scope
              changes, we talk first—no surprise invoices.
            </p>
            <div className="mt-6">
              <Link href="/contact" className="btn-primary no-underline">Request a proposal</Link>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold">Want the line items?</h3>
            <p className="mt-2 text-neutral-700 text-sm">
              I keep a detailed pricing breakdown for teams who need it. It covers the fixed setup
              and unit rates used to estimate projects.
            </p>
            <div className="mt-4">
              <Link href="/pricing/details" className="btn-secondary no-underline">View detailed pricing</Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

