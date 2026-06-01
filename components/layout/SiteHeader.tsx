'use client';

import Link from 'next/link';
import { useId, useState } from 'react';

import { SkipNav } from '@/components/layout/SkipNav';
import { ButtonLink } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/build-log', label: 'Build Log' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuId = useId();

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="border-b border-navy/10 bg-warm/95 backdrop-blur" role="banner">
      <SkipNav />
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8"
      >
        <Link
          className="rounded-sm font-display text-2xl font-bold tracking-tight text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          href="/"
          onClick={closeMenu}
        >
          Fulatelier
        </Link>

        <ul className="hidden items-center gap-6 lg:flex" aria-label="Primary links">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                className="rounded-sm text-sm font-semibold text-navy transition hover:text-[#6F5921] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/tools/permit-tracker" variant="ghost">
            Permit Tracker
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Start a project
          </ButtonLink>
        </div>

        <button
          aria-controls={mobileMenuId}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close primary navigation menu' : 'Open primary navigation menu'}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-navy/20 bg-warm text-navy transition hover:-translate-y-0.5 hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          <span className="sr-only">
            {isMenuOpen ? 'Close menu' : 'Open menu'}
          </span>
          <span aria-hidden="true" className="flex h-5 w-5 flex-col justify-center gap-1.5">
            <span
              className={`block h-0.5 rounded-full bg-current transition ${
                isMenuOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 rounded-full bg-current transition ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 rounded-full bg-current transition ${
                isMenuOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        className={`border-t border-navy/10 bg-warm px-6 py-5 shadow-card lg:hidden ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
        id={mobileMenuId}
      >
        <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl">
          <ul className="grid gap-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  className="block rounded-2xl border border-navy/10 bg-white/70 px-4 py-3 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  href={item.href}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ButtonLink href="/tools/permit-tracker" onClick={closeMenu} variant="ghost">
              Permit Tracker
            </ButtonLink>
            <ButtonLink href="/contact" onClick={closeMenu} variant="secondary">
              Start a project
            </ButtonLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
