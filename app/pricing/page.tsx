import { Container } from '@/components/Container';
import { SectionHeading } from '@/components/SectionHeading';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Transparent, flat fee with practical add-ons.',
};

export default function PricingPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading eyebrow="Pricing" title="Transparent, flat fee" subtitle="No surprises. Everything you need to launch." />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="card p-6 md:col-span-2 flex flex-col">
            <h3 className="text-xl font-bold">Core Redesign — $4,800</h3>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700 list-disc pl-5">
              <li>Up to 8 pages (Home, Services, About, Contact, etc.)</li>
              <li>Next.js + Tailwind build with image optimization</li>
              <li>Content guidance and simple copy edits</li>
              <li>Secure headers and basic analytics hookup</li>
              <li>Launch on Vercel with redirects</li>
            </ul>
            <div className="mt-6">
              <Link href="/contact" className="btn-primary no-underline">Request a proposal</Link>
            </div>
          </div>
          <div className="card p-6">
            <h4 className="font-semibold">Add-ons</h4>
            <ul className="mt-3 text-sm text-neutral-700 space-y-2 list-disc pl-5">
              <li>Extra pages beyond 8</li>
              <li>Logo refresh and brand kit</li>
              <li>Photo sourcing or light edits</li>
              <li>Blog setup (static)</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

