import { Container } from '@/components/Container';
import { SectionHeading } from '@/components/SectionHeading';
import { BeforeAfterTabs } from '@/components/BeforeAfterTabs';
import type { Metadata } from 'next';
import type { StaticImageData } from 'next/image';
import SchaefferBefore from '../../public/images/projects/schaeffer-before.png';
import SchaefferAfter from '../../public/images/projects/schaeffer-after.png';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Work',
  description: 'A recent example of my work: an industrial services website redesign that increased calls and emails.',
  alternates: { canonical: '/work' },
};

type Project = {
  id: string;
  name: string;
  industry: string;
  oldStack: string;
  newStack: string;
  liveUrl: string;
  before: string | StaticImageData;
  after: string | StaticImageData;
};

const caseStudy: Project = {
  id: 'schaeffer',
  name: "Schaeffer's Tank and Truck Service",
  industry: 'Industrial Services',
  oldStack: 'WordPress theme',
  newStack: 'Next.js + Tailwind',
  liveUrl: 'https://schaeffertank.com/',
  before: SchaefferBefore,
  after: SchaefferAfter,
};

// (Explorations removed to focus on one recent example)

export default function WorkPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Work"
          title="Recent work"
          subtitle="An industrial services website that increased customer inquiries."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Project Details - Left Side */}
          <div className="order-2 lg:order-1">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-2">{caseStudy.name}</h3>
              <p className="text-neutral-600 mb-4">{caseStudy.industry}</p>
              
              <div className="space-y-3 text-sm text-neutral-700">
                <p>Rebuilt from {caseStudy.oldStack} to {caseStudy.newStack}</p>
                <p className="font-medium">Result: More phone calls and email inquiries</p>
              </div>

              <div className="mt-6">
                <a
                  href={caseStudy.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill bg-accent-gradient text-white no-underline hover:opacity-95"
                >
                  View live site
                </a>
              </div>
            </div>
          </div>

          {/* Before/After Visual - Right Side */}
          <div className="order-1 lg:order-2">
            <BeforeAfterTabs
              beforeSrc={caseStudy.before}
              afterSrc={caseStudy.after}
              alt={`${caseStudy.name}`}
              width={1200}
              height={800}
              defaultTab="after"
            />
            <p className="mt-2 text-xs text-neutral-500 text-center">*This is scrollable</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

