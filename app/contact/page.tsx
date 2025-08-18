import { Container } from '@/components/Container';
import { SectionHeading } from '@/components/SectionHeading';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Email or book a quick call — no forms needed.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Let’s talk about your site"
          subtitle="No forms to fill. Email or book a quick call."
        />
        <div className="mt-8 card p-6">
          <p className="text-sm text-neutral-700">
            Email:{' '}
            <a className="underline" href="mailto:brayden@example.com">brayden@example.com</a>
          </p>
          <p className="mt-2 text-sm text-neutral-700">
            Calendly:{' '}
            <a className="underline" href="https://calendly.com" target="_blank" rel="noopener noreferrer">
              Book a 20‑minute intro
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}

