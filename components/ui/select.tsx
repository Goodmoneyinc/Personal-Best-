import { forwardRef, type SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      className={cn(
        'mt-2 min-h-12 w-full rounded-xl border border-navy/20 bg-warm px-4 text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);

Select.displayName = 'Select';
