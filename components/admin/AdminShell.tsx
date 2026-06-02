'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const adminLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/a11y-checklist', label: 'A11y Checklist' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <section className="bg-navy px-6 py-12 text-warm lg:px-8" aria-labelledby="admin-shell-title">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[17rem_1fr]">
        <aside className="rounded-[2rem] border border-warm/15 bg-warm/10 p-6 shadow-glow lg:sticky lg:top-6 lg:self-start">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
            Protected admin
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold" id="admin-shell-title">
            Fulatelier operations
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-warm/80">
            Supabase-authenticated operations for the Fulatelier marketplace.
          </p>
          <nav aria-label="Admin navigation" className="mt-6">
            <ul className="flex flex-wrap gap-3 lg:flex-col">
              {adminLinks.map((item) => {
                const isActive =
                  item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'block rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                        isActive
                          ? 'border-gold bg-gold text-navy'
                          : 'border-warm/20 bg-navy/50 text-warm',
                      )}
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </section>
  );
}
