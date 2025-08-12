import { Container } from '@/components/Container';
import { SectionHeading } from '@/components/SectionHeading';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'About',
  description: 'Brayden May — reliable, outcomes-focused redesigns for Ohio small businesses.',
};

export default function AboutPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading eyebrow="About" title="Hi, I’m Brayden May" subtitle="Reliable, outcomes-focused, and easy to work with." />
        <div className="mt-8 prose prose-neutral max-w-none">
          <p>
            I help Ohio small businesses ship modern sites that drive calls and appointments. My approach is
            simple: clear goals, fast turns, and dependable communication. I’ve worked across home services,
            clinics, professional services, and light manufacturing.
          </p>
          <p>
            Every project focuses on speed, mobile usability, and a clear path to contact. You get clean code,
            transparent pricing, and a site that’s easy to maintain.
          </p>
        </div>
      </Container>
    </section>
  );
}

