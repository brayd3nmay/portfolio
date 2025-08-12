import { Container } from '@/components/Container';
import { CTA } from '@/components/CTA';
import { SectionHeading } from '@/components/SectionHeading';
import { Badge } from '@/components/Badge';
import Link from 'next/link';
import Image from 'next/image';
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

      {/* Intro with headshot */}
      <section className="pt-10 md:pt-12 pb-14 md:pb-16">
        <Container>
          <div className="max-w-3xl flex flex-col items-start gap-3 md:gap-4">
            <Image
              src="/images/brayden-may.jpg"
              alt="Brayden May headshot"
              width={192}
              height={192}
              className="h-32 w-32 md:h-36 md:w-36 rounded-full object-cover ring-1 ring-neutral-900/5"
              priority
            />
            <p className="text-2xl md:text-3xl font-semibold text-neutral-800">Hi, I’m Brayden May.</p>
            <p className="text-neutral-700 md:text-lg">I design and build clean, fast websites for small businesses in Ohio.</p>
          </div>
        </Container>
      </section>

      {/* Bento cards */}
      <section className="py-16 md:py-24">
        <Container>
          <SectionHeading eyebrow="Why Brayden May" title="Results-focused redesigns" subtitle="Cleaner design, faster sites, and clearer calls to action." />

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

