import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'border-gold bg-gold text-navy shadow-glow hover:-translate-y-0.5 hover:bg-[#D9BC68]',
        secondary:
          'border-navy bg-navy text-warm shadow-card hover:-translate-y-0.5 hover:bg-[#111A30]',
        ghost:
          'border-navy/20 bg-warm/70 text-navy hover:-translate-y-0.5 hover:border-gold hover:bg-white',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

interface ButtonLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  href: string;
  children: ReactNode;
}

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}

export function ButtonLink({ className, href, variant, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant }), className)} href={href} {...props} />
  );
}
