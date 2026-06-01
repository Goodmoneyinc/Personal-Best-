import Link from 'next/link';

import { ButtonLink } from '@/components/ui/button';

const navItems = [
  { href: '/products', label: 'Marketplace' },
  { href: '/contact', label: 'Custom builds' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-navy/10 bg-warm/90 backdrop-blur">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8"
      >
        <Link
          className="rounded-sm font-display text-2xl font-bold tracking-tight text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          href="/"
        >
          Fulatelier
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              className="rounded-sm text-sm font-semibold text-navy transition hover:text-[#6F5921] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <ButtonLink className="hidden md:inline-flex" href="/contact" variant="secondary">
          Start a project
        </ButtonLink>
        <ButtonLink className="md:hidden" href="/products" variant="ghost">
          Browse
        </ButtonLink>
      </nav>
    </header>
  );
}
