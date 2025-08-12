import React from 'react';
import type { IconType } from 'react-icons';

export function Badge({ Icon, label }: { Icon: IconType; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border hairline bg-white/80 px-3 py-1 text-xs">
      <Icon aria-hidden className="opacity-70" />
      {label}
    </span>
  );
}


