"use client";

import Image from 'next/image';
import React from 'react';

type Props = {
  beforeSrc: string;
  afterSrc: string;
  alt: string;
  width: number;
  height: number;
  defaultTab?: 'before' | 'after';
};

export function BeforeAfterTabs({
  beforeSrc,
  afterSrc,
  alt,
  width,
  height,
  defaultTab = 'after',
}: Props) {
  const [active, setActive] = React.useState<'before' | 'after'>(defaultTab);

  const selectBefore = () => setActive('before');
  const selectAfter = () => setActive('after');

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive('before');
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive('after');
    }
  };

  return (
    <div className="w-full" role="region" aria-label={`Before and after images: ${alt}`}>
      <div
        role="tablist"
        aria-label={`Toggle old and new for ${alt}`}
        className="flex gap-2 p-2"
        onKeyDown={onKeyDown}
      >
        <button
          role="tab"
          aria-selected={active === 'before'}
          className={`px-3 py-1 rounded border text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${
            active === 'before' ? 'bg-white border-neutral-300 shadow-sm' : 'bg-neutral-100 border-transparent'
          }`}
          onClick={selectBefore}
        >
          Old
        </button>
        <button
          role="tab"
          aria-selected={active === 'after'}
          className={`px-3 py-1 rounded border text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${
            active === 'after' ? 'bg-white border-neutral-300 shadow-sm' : 'bg-neutral-100 border-transparent'
          }`}
          onClick={selectAfter}
        >
          New
        </button>
      </div>

      <div className="relative h-96 overflow-hidden rounded border">
        <div
          className={`transition-opacity duration-300 absolute inset-0 overflow-y-auto ${
            active === 'before' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          } `}
        >
          <Image
            src={beforeSrc}
            alt={`Before: ${alt}`}
            width={width}
            height={height}
            className="block w-full h-auto"
          />
        </div>
        <div
          className={`transition-opacity duration-300 absolute inset-0 overflow-y-auto ${
            active === 'after' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={active !== 'after'}
        >
          <Image src={afterSrc} alt={`After: ${alt}`} width={width} height={height} className="block w-full h-auto" />
        </div>
      </div>
    </div>
  );
}


