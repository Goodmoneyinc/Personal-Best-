import Link from 'next/link';

const footerColumns = [
  {
    title: 'Explore',
    links: [
      { href: '/', label: 'Home' },
      { href: '/products', label: 'Products' },
      { href: '/build-log', label: 'Build Log' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Workshop',
    links: [
      { href: '/tools/permit-tracker', label: 'Permit Tracker' },
      { href: '/admin', label: 'Admin' },
      { href: '/admin/a11y-checklist', label: 'A11y Checklist' },
    ],
  },
];

const socialLinks = [
  { href: 'https://www.tiktok.com/@fulatelier', label: 'TikTok' },
  { href: 'https://www.instagram.com/fulatelier', label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/fulatelier', label: 'LinkedIn' },
];

const currentYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-navy/10 bg-navy text-warm" role="contentinfo">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.2fr_1fr_0.8fr] lg:px-8">
        <section aria-labelledby="footer-brand">
          <Link
            className="inline-flex rounded-sm font-display text-3xl font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            href="/"
          >
            Fulatelier
          </Link>
          <h2 className="sr-only" id="footer-brand">
            Fulatelier brand information
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-warm/80">
            A Mississippi digital workshop for practical software, launch-ready
            templates, and custom web systems.
          </p>
          <p className="mt-5 text-sm leading-6 text-warm/70">
            Serving founders, makers, agencies, and local operators across the
            Delta, Coast, Pine Belt, and beyond.
          </p>
        </section>

        <nav aria-label="Footer navigation" className="grid gap-8 sm:grid-cols-2">
          {footerColumns.map((column) => (
            <section aria-labelledby={`footer-${column.title.toLowerCase()}`} key={column.title}>
              <h2
                className="text-sm font-semibold uppercase tracking-[0.2em] text-gold"
                id={`footer-${column.title.toLowerCase()}`}
              >
                {column.title}
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-warm/80">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="rounded-sm hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>

        <section aria-labelledby="footer-social">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold" id="footer-social">
            Social
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-warm/80">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  className="rounded-sm hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  href={link.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-6 text-warm/70">
            &copy; {currentYear} Fulatelier. Built in Mississippi.
          </p>
        </section>
      </div>
    </footer>
  );
}
