import { Container } from '@/components/Container';
import { SectionHeading } from '@/components/SectionHeading';
import { CTA } from '@/components/CTA';
import type { Metadata } from 'next';
import { FaMagnifyingGlass, FaPenRuler, FaCode, FaRocket } from 'react-icons/fa6';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Process',
  description: 'Review, Design, Build, Launch in under 4 weeks.',
};

const steps = [
  {
    title: 'Review',
    text: 'Quick audit of your current site and goals. We agree on scope and pages.',
    Icon: FaMagnifyingGlass,
  },
  {
    title: 'Design',
    text: 'Tight, mobile-first layout focused on calls and appointments.',
    Icon: FaPenRuler,
  },
  {
    title: 'Build',
    text: 'Next.js + Tailwind. Optimized images, secure headers, fast loads.',
    Icon: FaCode,
  },
  {
    title: 'Launch',
    text: 'Deploy on Vercel. Redirects and tracking in place. Under 4 weeks.',
    Icon: FaRocket,
  },
];

const faqs = [
  { q: 'How fast is the timeline?', a: 'Most sites launch in 2–4 weeks depending on content readiness.' },
  { q: 'Who owns the site?', a: 'You do. The code and content are yours and portable.' },
  { q: 'Where is it hosted?', a: 'Vercel. Fast global edge network with automatic HTTPS.' },
  { q: 'Can I request edits?', a: 'Yes. Simple edits are included during the first month after launch.' },
];

export default function ProcessPage() {
  return (
    <>
      <section className="py-16 md:py-24">
        <Container>
          <SectionHeading eyebrow="Process" title="Simple and predictable" subtitle="Four clear steps to launch." />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.title} className="card p-6 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{s.text}</p>
                <div className="mt-4 relative h-24 rounded-xl overflow-hidden" aria-hidden>
                  <div className="absolute inset-0 bg-accent-gradient opacity-40" />
                  <div className="absolute inset-0 grid-overlay opacity-60" />
                  <div className="relative z-10 grid place-items-center h-full text-neutral-700">
                    {/* @ts-expect-error Icon is provided per-step */}
                    <s.Icon className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-lg font-semibold">FAQ</h3>
            <dl className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((f) => (
                <div key={f.q} className="card p-6">
                  <dt className="font-medium">{f.q}</dt>
                  <dd className="mt-2 text-sm text-neutral-600">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>
      <CTA />
    </>
  );
}

