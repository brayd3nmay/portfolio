import { Container } from '@/components/Container';
import { SectionHeading } from '@/components/SectionHeading';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Get a modern, fast marketing site with clear scope and predictable pricing. Choose a package, then add only what you need.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Pricing"
          subtitle="Get a modern, fast marketing site with clear scope and predictable pricing. Choose a package, then add only what you need."
        />

        {/* Packages: summary table */}
        <div className="mt-10 card p-6">
          <h3 className="text-lg font-semibold">Packages</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-neutral-500">
                <tr className="border-b">
                  <th className="py-2 pr-3 font-medium">Package</th>
                  <th className="py-2 pr-3 font-medium">Who it fits</th>
                  <th className="py-2 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b/50">
                  <td className="py-2 pr-3 font-medium text-neutral-900">Starter Site</td>
                  <td className="py-2 pr-3 text-neutral-700">New or very small businesses with simple needs</td>
                  <td className="py-2 text-right text-neutral-900">$3,500 flat</td>
                </tr>
                <tr className="border-b/50">
                  <td className="py-2 pr-3 font-medium text-neutral-900">Core Site</td>
                  <td className="py-2 pr-3 text-neutral-700">Most small to mid businesses that want a strong marketing site</td>
                  <td className="py-2 text-right text-neutral-900">$5,200 flat</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-medium text-neutral-900">Growth Site</td>
                  <td className="py-2 pr-3 text-neutral-700">Growing teams that want more pages and options</td>
                  <td className="py-2 text-right text-neutral-900">$7,800 flat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Package details */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Starter Site - $3,500</h3>
            <p className="mt-1 text-sm text-neutral-600">Who it fits: New or very small businesses with simple needs</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
              <li>Up to 6 pages</li>
              <li>3 custom components</li>
              <li>1 contact form</li>
              <li>Per-page work includes on-page SEO, accessibility pass, content polish, and cross-device QA</li>
              <li>Foundational setup included</li>
              <li>2 review rounds</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Core Site - $5,200</h3>
            <p className="mt-1 text-sm text-neutral-600">Who it fits: Most small to mid businesses that want a strong marketing site</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
              <li>8 to 10 pages</li>
              <li>5 custom components</li>
              <li>1 form and 1 map click-to-call or map embed</li>
              <li>1 gallery</li>
              <li>LocalBusiness schema for 1 location</li>
              <li>Up to 10 redirects</li>
              <li>5 analytics events</li>
              <li>Per-page work includes on-page SEO, accessibility pass, content polish, and cross-device QA</li>
              <li>Foundational setup included</li>
              <li>2 review rounds</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Growth Site - $7,800</h3>
            <p className="mt-1 text-sm text-neutral-600">Who it fits: Growing teams that want more pages and options</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
              <li>12 to 16 pages</li>
              <li>8 custom components</li>
              <li>2 forms and optional booking integration</li>
              <li>2 locations for LocalBusiness schema</li>
              <li>Up to 30 redirects</li>
              <li>10 analytics events</li>
              <li>Per-page work includes on-page SEO, accessibility pass, content polish, and cross-device QA</li>
              <li>Foundational setup included</li>
              <li>2 review rounds</li>
            </ul>
          </div>
        </div>

        {/* end selected sections for main pricing page */}
      </Container>
    </section>
  );
}

