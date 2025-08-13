import Image from 'next/image';
import Link from 'next/link';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { BeforeAfterTabs } from './BeforeAfterTabs';

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

type DisplayVariant = 'slider' | 'grid' | 'tabs';

export function ProjectCard({
  project,
  withSlider = false,
  display,
  hideCta,
  ctaLabel,
  ctaHref,
  tag,
}: {
  project: Project;
  withSlider?: boolean; // backward-compat
  display?: DisplayVariant;
  hideCta?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  tag?: string;
}) {
  const variant: DisplayVariant = display || (withSlider ? 'slider' : 'grid');
  const resolvedCtaHref = ctaHref ?? project.liveUrl;
  const resolvedCtaLabel = ctaLabel ?? 'View live';
  return (
    <article className="card p-6 flex flex-col gap-4">
      <header>
        {tag ? (
          <span className="inline-block mb-2 text-[11px] font-medium text-neutral-700 bg-neutral-100 border border-neutral-200 rounded px-2 py-0.5">
            {tag}
          </span>
        ) : null}
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="text-sm text-neutral-600">{project.industry}</p>
      </header>

      <div className="rounded-lg overflow-hidden bg-neutral-100">
        {variant === 'slider' ? (
          <BeforeAfterSlider
            beforeSrc={project.before}
            afterSrc={project.after}
            alt={`Before and after for ${project.name}`}
            width={1200}
            height={800}
          />
        ) : variant === 'tabs' ? (
          <BeforeAfterTabs
            beforeSrc={project.before}
            afterSrc={project.after}
            alt={`Before and after for ${project.name}`}
            width={1200}
            height={800}
            defaultTab="after"
          />
        ) : (
          <div className="grid grid-cols-2 gap-2 p-2 h-96">
            <div className="overflow-y-auto rounded border">
              <Image src={project.before} alt={`Before - ${project.name}`} width={600} height={400} className="w-full h-auto" />
            </div>
            <div className="overflow-y-auto rounded border">
              <Image src={project.after} alt={`After - ${project.name}`} width={600} height={400} className="w-full h-auto" />
            </div>
          </div>
        )}
      </div>

      <ul className="text-sm text-neutral-700 list-disc pl-5">
        <li>Old: {project.oldStack}</li>
        <li>New: {project.newStack}</li>
      </ul>

      <ul className="text-sm text-neutral-700 list-disc pl-5">
        {project.improvements.map((imp) => (
          <li key={imp}>{imp}</li>
        ))}
      </ul>

      <p className="text-sm text-neutral-700">
        Result: more calls and email inquiries.
      </p>

      {!hideCta && resolvedCtaHref ? (
        <div className="mt-auto">
          <Link href={resolvedCtaHref} className="btn-secondary no-underline" target="_blank" rel="noopener noreferrer">
            {resolvedCtaLabel}
          </Link>
        </div>
      ) : null}
    </article>
  );
}


