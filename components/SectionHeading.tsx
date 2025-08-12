import React from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function SectionHeading({ eyebrow, title, subtitle, titleClassName, subtitleClassName }: Props) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs tracking-widest uppercase text-neutral-500">{eyebrow}</p>
      ) : null}
      <h2 className={`mt-1 text-2xl md:text-3xl font-bold tracking-tight ${titleClassName || ''}`}>{title}</h2>
      {subtitle ? (
        <p className={`mt-2 text-neutral-600 ${subtitleClassName || ''}`}>{subtitle}</p>
      ) : null}
    </div>
  );
}


