import { Container } from '@/components/Container';
import { SectionHeading } from '@/components/SectionHeading';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Pricing details',
  description: 'Detailed breakdown of foundational setup, add-ons, inclusions, terms, and examples.',
};

export default function PricingDetailsPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Detailed breakdown"
          subtitle="All the specifics: foundational setup, add-ons and unit pricing, what’s included, terms, and examples."
        />

        {/* Foundational setup */}
        <div className="mt-10 card p-6">
          <h3 className="text-lg font-semibold">What “foundational setup” includes</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
            <li>Discovery and project setup</li>
            <li>Branding tokens for colors and typography</li>
            <li>Global layout and base UI</li>
            <li>Technical baseline for security and performance</li>
            <li>Deployment and domain configuration</li>
            <li>Analytics hookup</li>
            <li>Legal page shells and footer links</li>
            <li>Favicons and share images</li>
            <li>Error pages</li>
            <li>Monitoring alerts</li>
            <li>Code quality checks and CI on push</li>
          </ul>
        </div>

        {/* Add-ons and unit pricing */}
        <div className="mt-6 card p-6">
          <h3 className="text-lg font-semibold">Add-ons and unit pricing</h3>
          <p className="mt-1 text-sm text-neutral-600">Optional when projects need more than a package includes.</p>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">Per page or component</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 space-y-2">
                <li>Static page implementation - $260 per page</li>
                <li className="list-none pl-0 text-neutral-600">Includes on-page SEO, accessibility pass, content polish, and cross-device QA</li>
                <li>Custom component - Simple $175, Standard $250, Complex $400</li>
                <li>Content migration - $40 per page</li>
                <li>Copywriting from scratch - $180 per page</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">Media and assets</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 space-y-2">
                <li>Image optimization - $15 per image</li>
                <li>Stock photo sourcing - $20 per image plus license at cost</li>
                <li>Icon set curation - $90 per 10 icons</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">Integrations</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 space-y-2">
                <li>Contact or map integration - $100 per integration</li>
                <li>Form wiring to provider - $140 per form</li>
                <li>Third party embed - $120 per embed</li>
                <li>Calendar or booking integration - $140 per embed</li>
                <li>Social feed embed - $120 per embed</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">SEO and structure</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 space-y-2">
                <li>LocalBusiness schema - $90 per location</li>
                <li>Redirect mapping - $80 per 10 redirects</li>
                <li>Analytics custom events - $30 per event or 5 for $120</li>
              </ul>
          </div>
            <div className="rounded-lg border p-4">
              <h4 className="font-medium">Revisions and support</h4>
              <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 space-y-2">
                <li>Extra review round - $225 per round</li>
                <li>Post-launch support - $85 per hour, 1 hour minimum</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Included with every project */}
        <div className="mt-6 card p-6">
          <h3 className="text-lg font-semibold">What is included with every project</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
            <li>Two review rounds during build</li>
            <li>30 days of post-launch support for wording tweaks and bug fixes</li>
            <li>Analytics hookup, XML sitemap, and robots directives</li>
            <li>README and a short walkthrough video</li>
            <li>Hosting is client owned and billed directly to your provider</li>
          </ul>
        </div>

        {/* Change requests */}
        <div className="mt-6 card p-6">
            <h3 className="text-lg font-semibold">Change requests</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
            <li>During build after scope lock: $200 per request for evaluation and coordination, plus any unit items</li>
            <li>After launch: billed at $85 per hour, 1 hour minimum</li>
            <li>Bug vs enhancement: a bug is when a delivered feature does not match approved scope or fails in supported browsers. Enhancements and new content use the add-on menu or hourly</li>
          </ul>
        </div>

        {/* Timeline and process */}
        <div className="mt-6 card p-6">
          <h3 className="text-lg font-semibold">Timeline and process</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
            <li>Typical timeline: 3 to 4 weeks, depends on content readiness</li>
            <li>Rush under 2 weeks adds 20 percent of the project subtotal</li>
            <li>Milestones: content freeze date and design sign-off. Changes after sign-off follow the change request path</li>
          </ul>
            </div>

        {/* Client responsibilities */}
        <div className="mt-6 card p-6">
          <h3 className="text-lg font-semibold">Client responsibilities</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
            <li>Provide brand assets, final copy, legal text, account access, and feedback within 2 business days</li>
          </ul>
          </div>

        {/* Scope and quality targets */}
        <div className="mt-6 card p-6">
          <h3 className="text-lg font-semibold">Scope and quality targets</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
            <li>Supported browsers and devices: latest 2 versions of Chrome, Safari, Edge, and Firefox on common desktop and mobile sizes</li>
            <li>Accessibility target: WCAG 2.1 AA best effort for static content</li>
            <li>SEO scope: on-page only. Rankings are not guaranteed</li>
            <li>Performance budget: images under 200 KB when possible, LCP target under 2.5 seconds on typical 4G. Heavy embeds may require changes to meet targets</li>
            </ul>
          </div>

        {/* Ownership, cancellations, and payments */}
        <div className="mt-6 card p-6">
          <h3 className="text-lg font-semibold">Ownership, cancellations, and payments</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
            <li>Ownership and license: after final payment, you own the site code and provided assets. Non-confidential work may be shown in the portfolio</li>
            <li>Payment schedule: 50 percent deposit to start, 40 percent at design sign-off, 10 percent before launch</li>
            <li>Cancellation or pause: work completed is billable to date. Deposits are non-refundable. Pauses over 14 days may incur a $150 restart fee</li>
            <li>Late payment: 1.5 percent monthly fee on overdue balances after 15 days</li>
          </ul>
        </div>

        {/* Privacy and security */}
        <div className="mt-6 card p-6">
          <h3 className="text-lg font-semibold">Privacy and security</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
            <li>No storage of sensitive data. Static sites only</li>
            <li>Any future forms that collect sensitive data must use a compliant third party</li>
          </ul>
        </div>

        {/* Simple examples */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Example 1: 8-page Core Site</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
              <li>Core Site package - $5,200</li>
            </ul>
            <p className="mt-3 text-sm font-semibold text-neutral-900">Total - $5,200</p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Example 2: 12-page Growth Site with extras</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-2">
              <li>Growth Site package - $7,800</li>
              <li>1 extra form - $140</li>
              <li>10 extra redirects - $80</li>
            </ul>
            <p className="mt-3 text-sm font-semibold text-neutral-900">Total - $8,020</p>
          </div>
        </div>
      </Container>
    </section>
  );
}


