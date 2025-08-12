import Image from 'next/image';
import Link from 'next/link';
import { BeforeAfterSlider } from './BeforeAfterSlider';

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

export function ProjectCard({ project, withSlider = false }: { project: Project; withSlider?: boolean }) {
  return (
    <article className="card p-6 flex flex-col gap-4">
      <header>
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="text-sm text-neutral-600">{project.industry}</p>
      </header>

      <div className="rounded-lg overflow-hidden bg-neutral-100">
        {withSlider ? (
          <BeforeAfterSlider
            beforeSrc={project.before}
            afterSrc={project.after}
            alt={`Before and after for ${project.name}`}
            width={1200}
            height={800}
          />
        ) : (
          <div className="grid grid-cols-2 gap-2 p-2">
            <Image src={project.before} alt={`Before - ${project.name}`} width={600} height={400} className="rounded" />
            <Image src={project.after} alt={`After - ${project.name}`} width={600} height={400} className="rounded" />
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
        Result: more calls and form submissions.
      </p>

      <div className="mt-auto">
        <Link href={project.liveUrl} className="btn-secondary no-underline" target="_blank" rel="noopener noreferrer">
          View live
        </Link>
      </div>
    </article>
  );
}


