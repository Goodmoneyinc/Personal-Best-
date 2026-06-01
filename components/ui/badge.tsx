import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full bg-gold/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#6F5921]',
        className,
      )}
      {...props}
    />
  );
}
