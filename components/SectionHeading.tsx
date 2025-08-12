import React from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ eyebrow, title, subtitle }: Props) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs tracking-widest uppercase text-neutral-500">{eyebrow}</p>
      ) : null}
      <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-neutral-600">{subtitle}</p>
      ) : null}
    </div>
  );
}


