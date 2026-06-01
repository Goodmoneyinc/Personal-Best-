import Link from 'next/link';

const adminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/a11y-checklist', label: 'A11y checklist' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-navy px-6 py-12 text-warm lg:px-8" aria-labelledby="admin-shell-title">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-warm/15 bg-warm/10 p-6 shadow-glow">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
            Protected admin
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold" id="admin-shell-title">
            Fulatelier operations
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-warm/80">
            This route group is guarded by Basic Auth middleware. Configure
            ADMIN_BASIC_PASSWORD before exposing it outside local preview.
          </p>
          <nav aria-label="Admin navigation" className="mt-6 flex flex-wrap gap-3">
            {adminLinks.map((item) => (
              <Link
                className="rounded-full border border-warm/20 bg-navy/50 px-4 py-2 text-sm font-semibold text-warm transition hover:-translate-y-0.5 hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
