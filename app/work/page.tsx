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
};

type Project = {
  id: string;
  name: string;
  industry: string;
  oldStack: string;
  newStack: string;
  improvements: string[];
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
  improvements: [
    'Image optimization and clear contact on every page',
    'Mobile-first layout and quicker TTFB',
  ],
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
          title="A recent example of my work"
          subtitle="An industrial services website redesign that improved calls and emails."
        />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="order-2 md:order-1">
            <div className="card p-6">
              <span className="inline-block mb-2 text-[11px] font-medium text-neutral-700 bg-neutral-100 border border-neutral-200 rounded px-2 py-0.5">Case study</span>
              <h3 className="text-xl font-semibold">{caseStudy.name}</h3>
              <p className="text-sm text-neutral-600">{caseStudy.industry}</p>

              <div className="mt-4">
                <ul className="text-sm text-neutral-700 list-disc pl-5">
                  <li>Old: {caseStudy.oldStack}</li>
                  <li>New: {caseStudy.newStack}</li>
                </ul>
              </div>

              <div className="mt-3">
                <ul className="text-sm text-neutral-700 list-disc pl-5">
                  {caseStudy.improvements.map((imp) => (
                    <li key={imp}>{imp}</li>
                  ))}
                </ul>
              </div>

              <p className="mt-3 text-sm text-neutral-700">Result: more calls and email inquiries.</p>

              <div className="mt-4">
                <a
                  href={caseStudy.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill bg-accent-gradient text-white no-underline hover:opacity-95"
                >
                  View live
                </a>
              </div>
            </div>

            <div className="mt-8 prose prose-neutral max-w-none">
              <h3>What I did</h3>
              <ul>
                <li>Redesigned the site with a mobile-first layout using Next.js and Tailwind for speed and maintainability.</li>
                <li>Optimized images and improved performance to reduce time-to-first-byte and speed up page loads.</li>
                <li>Made contact info and calls-to-action clearly visible on every page, including click-to-call and email links.</li>
                <li>Clarified services and navigation so visitors quickly find what they need.</li>
                <li>Improved accessibility and contrast to make forms and links easier to use.</li>
              </ul>
              <h3>Impact</h3>
              <p>
                With faster pages and clearer CTAs, the site now generates more phone calls and email inquiries for the shop. Making contact effortless—in the header and throughout the pages—reduced friction and helped convert more visitors into customers.
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2 md:sticky md:top-24">
            <BeforeAfterTabs
              beforeSrc={caseStudy.before}
              afterSrc={caseStudy.after}
              alt={`${caseStudy.name}`}
              width={1200}
              height={800}
              defaultTab="after"
            />
            <p className="mt-2 text-[12px] text-pink-600 italic">*This is scrollable</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

