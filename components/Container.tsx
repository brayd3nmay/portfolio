import React from 'react';

type Props = React.PropsWithChildren<{ className?: string }>;

export function Container({ children, className }: Props) {
  const classes = ['container mx-auto px-4', className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}


