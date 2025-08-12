"use client";

import Image from 'next/image';
import React from 'react';

type Props = {
  beforeSrc: string;
  afterSrc: string;
  alt: string;
  width: number;
  height: number;
};

export function BeforeAfterSlider({ beforeSrc, afterSrc, alt, width, height }: Props) {
  const [pos, setPos] = React.useState(50); // percentage
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(pct);
  };

  return (
    <div
      ref={containerRef}
      className="relative select-none touch-none h-96 overflow-hidden rounded border"
      style={{ width: '100%' }}
      onPointerDown={onPointerMove}
      onPointerMove={(e) => e.buttons === 1 && onPointerMove(e)}
      role="region"
      aria-label={`Before and after comparison: ${alt}`}
    >
      <div className="absolute inset-0 overflow-y-auto">
        <Image src={beforeSrc} alt={`Before: ${alt}`} width={width} height={height} className="block w-full h-auto" />
      </div>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
        aria-hidden
      >
        <div className="overflow-y-auto h-full">
          <Image src={afterSrc} alt="" width={width} height={height} className="block w-full h-auto" />
        </div>
      </div>
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{ left: `calc(${pos}% - 1px)` }}
        aria-hidden
      >
        <div className="h-full w-0.5 bg-black/60" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow px-3 py-1 text-xs pointer-events-auto">
          Drag
        </div>
      </div>
    </div>
  );
}


