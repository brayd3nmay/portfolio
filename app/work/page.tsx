import { Container } from '@/components/Container';
import { SectionHeading } from '@/components/SectionHeading';
import { ProjectCard } from '@/components/ProjectCard';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Before and after examples across Ohio small businesses.',
};

type Project = {
  id: string;
  name: string;
  industry: string;
  oldStack: string;
  newStack: string;
  improvements: string[];
  liveUrl: string;
  before: string;
  after: string;
};

const projects: Project[] = [
  {
    id: 'schaeffer',
    name: "Schaeffer's Tank and Truck Service",
    industry: 'Industrial Services',
    oldStack: 'WordPress theme',
    newStack: 'Next.js + Tailwind',
    improvements: [
      'Image optimization and clear contact on every page',
      'Mobile-first layout and quicker TTFB',
    ],
    liveUrl: 'https://schaeffertank.com/',
    before: '/images/projects/schaeffer-before.png',
    after: '/images/projects/schaeffer-after.png',
  },
  {
    id: 'hvac',
    name: 'Summit Heating & Cooling',
    industry: 'HVAC',
    oldStack: 'Old CMS, heavy plugins',
    newStack: 'Next.js static',
    improvements: ['Calls-to-action above the fold', 'Faster loads on mobile'],
    liveUrl: 'https://example.com',
    before: '/images/projects/hvac-before.svg',
    after: '/images/projects/hvac-after.svg',
  },
  {
    id: 'dental',
    name: 'Riverbend Dental',
    industry: 'Clinic',
    oldStack: 'Template site',
    newStack: 'Next.js + Tailwind',
    improvements: ['Clear services and insurance info', 'ADA-friendly contrast and focus'],
    liveUrl: 'https://example.com',
    before: '/images/projects/dental-before.svg',
    after: '/images/projects/dental-after.svg',
  },
  {
    id: 'auto',
    name: 'Union Auto Body',
    industry: 'Auto',
    oldStack: 'Outdated HTML',
    newStack: 'Next.js static',
    improvements: ['Estimate CTA prominent', 'Before/after gallery'],
    liveUrl: 'https://example.com',
    before: '/images/projects/auto-before.svg',
    after: '/images/projects/auto-after.svg',
  },
  {
    id: 'accounting',
    name: 'Maple Accounting',
    industry: 'Professional Services',
    oldStack: 'WordPress with bloated theme',
    newStack: 'Next.js static',
    improvements: ['Service pages for SEO', 'Simple contact and appointment links'],
    liveUrl: 'https://example.com',
    before: '/images/projects/accounting-before.svg',
    after: '/images/projects/accounting-after.svg',
  },
  {
    id: 'landscaping',
    name: 'Oak Ridge Landscaping',
    industry: 'Home Services',
    oldStack: 'Wix',
    newStack: 'Next.js static',
    improvements: ['Project gallery and reviews', 'Clear phone and quote CTA'],
    liveUrl: 'https://example.com',
    before: '/images/projects/landscaping-before.svg',
    after: '/images/projects/landscaping-after.svg',
  },
];

export default function WorkPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Work"
          title="Before and after redesigns"
          subtitle="Six quick examples. Old → new → result."
        />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, idx) => (
            <ProjectCard
              key={p.id}
              project={p}
              // first two: new tabs toggle, rest: side-by-side grid
              display={idx < 2 ? 'tabs' : 'grid'}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

