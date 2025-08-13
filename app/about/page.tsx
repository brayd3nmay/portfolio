import { Container } from '@/components/Container';
import { SectionHeading } from '@/components/SectionHeading';
import type { Metadata } from 'next';
import Image from 'next/image';
import headshot from '../../public/images/brayden-may.png';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'About',
  description: 'Brayden May — reliable, outcomes-focused redesigns for Ohio small businesses.',
};

export default function AboutPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] items-start gap-8 md:gap-12">
          {/* Headshot */}
          <div className="flex justify-center md:justify-start">
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

          {/* Heading + Story */}
          <div className="flex flex-col gap-6">
            <SectionHeading
              eyebrow="About"
              title="Hi, I'm Brayden May"
              subtitle="Computer Science student at The Ohio State University, building clean, modern sites for Ohio small businesses."
              subtitleClassName="mt-6"
            />
            <div className="prose prose-neutral max-w-none">
            <p>
              I’m a developer who cares about clarity, speed, and real-world results. I love taking outdated or
              clunky sites and turning them into simple, easy-to-navigate experiences that feel professional and
                approachable without unnecessary complexity.
            </p>
            <p>
              I partner with Ohio small businesses to refresh their online presence so they can stand out and
              thrive in their communities. My belief is simple: small teams deserve the same level of design
              quality and technical excellence as big companies.
            </p>
            <p>
              When I’m not coding, you’ll find me connecting with local business owners, learning their stories,
              and finding practical ways technology can make their work easier and more impactful. On campus, I
              help lead entrepreneurship efforts at Ohio State and enjoy contributing to the growth of small
              businesses across the state.
            </p>
            </div>
          </div>
        </div>

        {/* Text-only contact CTA */}
        <div className="mt-12">
          <p className="font-semibold">If you think I can help your small business, reach out to me.</p>
          <p className="mt-2 text-sm text-neutral-700">
            Phone: <a className="underline" href="tel:+16145550134">+1 (614) 555‑0134</a>
            <br />
            Email: <a className="underline" href="mailto:brayden@example.com">brayden@example.com</a>
          </p>
        </div>
      </Container>
    </section>
  );
}

