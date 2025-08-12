import { Container } from '@/components/Container';
import { CTA } from '@/components/CTA';
import { SectionHeading } from '@/components/SectionHeading';
import { Badge } from '@/components/Badge';
import Link from 'next/link';
import { FaGaugeHigh, FaLock, FaMobileScreen } from 'react-icons/fa6';

export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-accent-gradient" />
        <div className="absolute inset-0 grid-overlay" />
        <div className="absolute inset-x-0 top-0 radial-lines" />
        <Container className="relative z-10 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl/tight md:text-6xl/tight font-extrabold tracking-tight">
              Flat fee website redesigns for Ohio small businesses.
            </h1>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl">
              Modern, fast, and mobile friendly. Clear pricing, a simple process, and a launch in under 4 weeks.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/work" className="btn-primary no-underline">View Work</Link>
              <Link href="/contact" className="btn-secondary no-underline">Get Proposal</Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
              <Badge Icon={FaGaugeHigh} label="Fast loads" />
              <Badge Icon={FaMobileScreen} label="Mobile first" />
              <Badge Icon={FaLock} label="Secure headers" />
            </div>
          </div>
        </Container>
      </section>

      {/* Bento cards */}
      <section className="py-16 md:py-24">
        <Container>
          <SectionHeading eyebrow="Why Brayden" title="Results-focused redesigns" subtitle="Cleaner design, faster sites, and clearer calls to action." />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'Conversion first',
              'Mobile performance',
              'Secure by default',
              'SEO basics baked in',
              'Clear pricing',
              'Fast turnaround',
            ].map((title, i) => (
              <div key={title} className="card p-6 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-neutral-600">Simple, outcome-focused builds for small businesses.</p>
                <div className="mt-4 h-24 rounded-lg bg-neutral-100 grid place-content-center text-xs text-neutral-500">
                  UI mock #{i + 1}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}

