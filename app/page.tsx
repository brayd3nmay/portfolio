import { Container } from '@/components/Container';
import { CTA } from '@/components/CTA';
import { SectionHeading } from '@/components/SectionHeading';
import { Badge } from '@/components/Badge';
import Link from 'next/link';
import Image from 'next/image';
import headshot from '../public/images/brayden-may.png';
import { FaGaugeHigh, FaLock, FaMobileScreen, FaMagnifyingGlass, FaTag, FaRocket } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

export const dynamic = 'force-static';

export default function HomePage() {
  const features: { title: string; text: string; Icon: IconType; iconClassName?: string }[] = [
    {
      title: 'Conversion first',
      text: 'Layouts and copy aimed at calls, forms, and bookings.',
      Icon: FaGaugeHigh,
    },
    {
      title: 'Mobile performance',
      text: 'Lightweight pages that load fast on 4G and look great on phones.',
      Icon: FaMobileScreen,
    },
    {
      title: 'Secure by default',
      text: 'Strict security headers and minimal scripts for a safer site.',
      Icon: FaLock,
    },
    {
      title: 'SEO basics baked in',
      text: 'Semantic HTML, metadata, sitemaps, and clean URLs.',
      Icon: FaMagnifyingGlass,
      iconClassName: 'scale-x-[-1]',
    },
    {
      title: 'Clear pricing',
      text: 'Flat, transparent rates with no surprise fees.',
      Icon: FaTag,
      iconClassName: 'scale-x-[-1]',
    },
    {
      title: 'Fast turnaround',
      text: 'Launch in 2–4 weeks with a focused scope and clear milestones.',
      Icon: FaRocket,
    },
  ];
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
      <section className="pt-16 md:pt-20 pb-8 md:pb-12">
        <Container>
          <div className="relative">
            {/* Background decoration with subtle color */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-3xl" />
            <div className="absolute inset-0 bg-accent-gradient rounded-3xl opacity-25" />
            <div className="absolute inset-0 grid-overlay rounded-3xl opacity-30" />
            
            <div className="relative card p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Headshot */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-accent-gradient rounded-full blur opacity-60" />
                    <Image
                      src={headshot}
                      alt="Brayden May headshot"
                      placeholder="blur"
                      sizes="(min-width: 1024px) 12rem, (min-width: 768px) 11rem, 10rem"
                      className="relative h-40 w-40 md:h-44 md:w-44 lg:h-48 lg:w-48 rounded-full object-cover ring-2 ring-white shadow-xl"
                      priority
                    />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 text-center lg:text-left flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
                    Hi, I'm Brayden May.
                  </h2>
                  <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 leading-relaxed max-w-2xl">
                    I design and build clean, fast websites for small businesses in Ohio while studying at The Ohio State University.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bento cards */}
      <section className="py-16 md:py-24">
        <Container>
          <SectionHeading eyebrow="Why Brayden May" title="Results-focused redesigns" subtitle="Cleaner design, faster sites, and clearer calls to action." />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card p-6 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{feature.text}</p>
                <div className="mt-4 relative h-24 rounded-xl overflow-hidden" aria-hidden>
                  <div className="absolute inset-0 bg-accent-gradient opacity-40" />
                  <div className="absolute inset-0 grid-overlay opacity-60" />
                  <div className="relative z-10 grid place-items-center h-full text-neutral-700">
                    <feature.Icon
                      aria-hidden
                      className={[
                        'h-8 w-8',
                        feature.iconClassName || '',
                      ].filter(Boolean).join(' ')}
                    />
                  </div>
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

