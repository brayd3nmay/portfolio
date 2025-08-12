import { Container } from '@/components/Container';
import { SectionHeading } from '@/components/SectionHeading';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Pricing details',
  description: 'Detailed pricing breakdown with fixed setup and unit-priced items.',
};

type FixedItem = { name: string; covers: string; fee: number };
type UnitItem = { name: string; unit: string; covers: string; price: number };
type ChangeRequest = { situation: string; billing: string; price: string };

const currency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fixedItems: FixedItem[] = [
  { name: 'Project discovery and setup', covers: 'Requirements, repo, environment, roadmap', fee: 200 },
  { name: 'Branding and Tailwind theme', covers: 'Brand colors, typography, tokens, global styles', fee: 400 },
  { name: 'Global layout and base UI', covers: 'App layout, NavBar, Footer, buttons, fonts', fee: 400 },
  { name: 'Security baseline', covers: 'CSP, HSTS, permissions policies', fee: 150 },
  { name: 'Performance baseline', covers: 'next/image config, caching, build checks', fee: 150 },
  { name: 'Deployment and domain', covers: 'Vercel project, env vars, domain and DNS', fee: 200 },
  { name: 'Analytics setup', covers: 'GA4 or Plausible, basic events', fee: 100 },
  { name: 'Legal pages scaffold', covers: 'Privacy and Terms shells, footer links', fee: 100 },
  { name: 'Favicons and share images', covers: 'Favicon set, default Open Graph image', fee: 100 },
  { name: 'Error pages', covers: 'Custom 404 plus friendly error page', fee: 100 },
  { name: 'Monitoring setup', covers: 'Vercel alerts and basic uptime check', fee: 100 },
  { name: 'Code quality baseline', covers: 'ESLint, Prettier, CI check on push', fee: 100 },
];

const unitItems: UnitItem[] = [
  { name: 'Static page implementation', unit: 'per page', covers: 'Sections assembled, responsive layout, internal links', price: 180 },
  { name: 'Custom component', unit: 'per component', covers: 'Hero, services cards, testimonials, logo carousel, CTA block', price: 140 },
  { name: 'Content migration', unit: 'per page', covers: 'Move and clean copy and images from old site', price: 40 },
  { name: 'Copywriting from scratch', unit: 'per page', covers: 'Net-new copy when none is provided', price: 110 },
  { name: 'On-page SEO', unit: 'per page', covers: 'Title, meta, Open Graph, sitemap and robots updates', price: 35 },
  { name: 'Accessibility pass and fixes', unit: 'per page', covers: 'Keyboard nav, focus states, ARIA checks', price: 20 },
  { name: 'Content polish', unit: 'per page', covers: 'Light edits for clarity and keywords', price: 20 },
  { name: 'Cross-browser and device QA', unit: 'per page', covers: 'Desktop and mobile checks', price: 15 },
  { name: 'Image optimization', unit: 'per image', covers: 'Cleanup, filenames, alt text, optimized sizes', price: 10 },
  { name: 'Stock photo sourcing', unit: 'per image', covers: 'Licensed or free stock selection with credits', price: 8 },
  { name: 'Icon set curation', unit: 'per 10 icons', covers: 'Consistent family, sizing, a11y labels', price: 30 },
  { name: 'Contact or map integration', unit: 'per integration', covers: 'Click to call and email, Google Map embed', price: 80 },
  { name: 'Form wiring to provider', unit: 'per form', covers: 'Formspree or similar, spam protection, tests', price: 80 },
  { name: 'Third party embed', unit: 'per embed', covers: 'Chat widget, reviews badge, Calendly, and similar', price: 50 },
  { name: 'Calendar or booking integration', unit: 'per embed', covers: 'Calendly or similar with options', price: 75 },
  { name: 'Social feed embed', unit: 'per embed', covers: 'Instagram or Facebook feed with performance guardrails', price: 60 },
  { name: 'Gallery setup', unit: 'per gallery', covers: 'Responsive grid, captions or alt text, titles', price: 120 },
  { name: 'LocalBusiness schema', unit: 'per location', covers: 'JSON-LD for NAP, hours, phone', price: 40 },
  { name: 'Redirect mapping', unit: 'per 10 redirects', covers: '301s for old URLs', price: 25 },
  { name: 'Analytics custom events', unit: 'per event', covers: 'Key buttons or CTA clicks beyond basics', price: 12 },
  { name: 'Extra revision round', unit: 'per round', covers: 'After the 2 included review rounds', price: 150 },
  { name: 'Post-launch support', unit: 'per hour', covers: 'Small changes after support window', price: 85 },
];

const changeRequests: ChangeRequest[] = [
  {
    situation: 'Change request after scope lock, during build',
    billing: 'Flat evaluation and coordination plus any unit items needed',
    price: '120 per request + unit rates',
  },
  {
    situation: 'Post-approval request after launch',
    billing: 'Time-based for tweaks or updates not covered by units',
    price: '85 per hour, 1 hour minimum',
  },
];

const includedItems: string[] = [
  'Two review rounds during build',
  '30 days of post-launch support for wording tweaks and bug fixes',
  'Analytics hookup, XML sitemap, and robots directives',
  'README and short walkthrough video',
  'Hosting is separate. I deploy to Vercel and you pay Vercel directly',
];

const notes: string[] = [
  'Timeline: standard 3 to 4 weeks depending on content readiness. Rush delivery under 2 weeks adds 20 percent of the project subtotal',
  'Reviews and approvals: 2 review rounds included. After each approval the scope is frozen. Extra rounds are billed at the unit rate',
  'Client responsibilities: provide brand assets, final copy, legal text, account access, and timely feedback within 2 business days',
  'Hosting and domains: client-owned accounts. You pay Vercel and your registrar directly',
  'Browser and device support: latest 2 versions of Chrome, Safari, Edge, and Firefox on common desktop and mobile sizes. Older browsers or special devices are out of scope',
  'Accessibility target: WCAG 2.1 AA best effort for static content',
  'SEO scope: on-page only. Rankings are not guaranteed. No paid ads or link building',
  'Performance budget: images under 200 KB when possible, LCP target under 2.5 seconds on typical 4G. Heavy embeds may reduce scores and can require change requests to meet targets',
  'Ownership and license: upon final payment you own the site code and provided assets. I may showcase non-confidential work in my portfolio',
  'Cancellation or pause: work completed is billable to date. Deposits are non-refundable. Pauses over 14 days may incur a restart fee of $150',
  'Late payment: 1.5 percent monthly fee on overdue balances after 15 days',
  'Privacy and security: no storage of sensitive data. Static sites only. Any future forms that collect sensitive data must use a compliant third party',
];

export default function PricingDetailsPage() {
  const fixedSubtotal = fixedItems.reduce((sum, item) => sum + item.fee, 0);

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Detailed breakdown"
          subtitle="Full line items and terms used for precise proposals."
        />

        {/* Fixed setup */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Fixed setup</h3>
            <p className="mt-1 text-sm text-neutral-600">Foundational work included up front.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-neutral-500">
                  <tr className="border-b">
                    <th className="py-2 pr-3 font-medium">Item</th>
                    <th className="py-2 pr-3 font-medium">Covers</th>
                    <th className="py-2 text-right font-medium">Fee</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {fixedItems.map((item) => (
                    <tr key={item.name} className="border-b/50">
                      <td className="py-2 pr-3 font-medium text-neutral-900">{item.name}</td>
                      <td className="py-2 pr-3 text-neutral-700">{item.covers}</td>
                      <td className="py-2 text-right text-neutral-900">{currency(item.fee)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2} className="py-2 pr-3 font-semibold text-neutral-900">
                      Fixed subtotal
                    </td>
                    <td className="py-2 text-right font-semibold text-neutral-900">
                      {currency(fixedSubtotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <Link href="/contact" className="btn-primary no-underline">
                Request a proposal
              </Link>
            </div>
          </div>

          {/* Unit work */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Unit-priced work</h3>
            <p className="mt-1 text-sm text-neutral-600">Scale by page, component, or integration.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-neutral-500">
                  <tr className="border-b">
                    <th className="py-2 pr-3 font-medium">Item</th>
                    <th className="py-2 pr-3 font-medium">Unit</th>
                    <th className="py-2 pr-3 font-medium">Covers</th>
                    <th className="py-2 text-right font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {unitItems.map((item) => (
                    <tr key={item.name} className="border-b/50">
                      <td className="py-2 pr-3 font-medium text-neutral-900">{item.name}</td>
                      <td className="py-2 pr-3 text-neutral-700">{item.unit}</td>
                      <td className="py-2 pr-3 text-neutral-700">{item.covers}</td>
                      <td className="py-2 text-right text-neutral-900">{currency(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Change requests and included */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Change requests</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-neutral-500">
                  <tr className="border-b">
                    <th className="py-2 pr-3 font-medium">Situation</th>
                    <th className="py-2 pr-3 font-medium">Billing</th>
                    <th className="py-2 text-right font-medium">Price</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {changeRequests.map((row) => (
                    <tr key={row.situation} className="border-b/50">
                      <td className="py-2 pr-3 font-medium text-neutral-900">{row.situation}</td>
                      <td className="py-2 pr-3 text-neutral-700">{row.billing}</td>
                      <td className="py-2 text-right text-neutral-900">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold">Included</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
              {includedItems.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6 card p-6">
          <h3 className="text-lg font-semibold">Scope notes and terms</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <Link href="/contact" className="btn-primary no-underline">Request a proposal</Link>
        </div>
      </Container>
    </section>
  );
}


