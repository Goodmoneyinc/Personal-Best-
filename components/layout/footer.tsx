import type { CSSProperties } from "react";
import Link from "next/link";
import { Github, Music2, Wrench } from "lucide-react";

type PaletteVariables = CSSProperties & {
  "--footer-navy": string;
  "--footer-warm-white": string;
  "--footer-gold": string;
  "--footer-muted": string;
};

const paletteVariables: PaletteVariables = {
  "--footer-navy": "var(--navy, var(--color-navy, #0A0F1E))",
  "--footer-warm-white":
    "var(--warm-white, var(--color-warm-white, #F5F0E8))",
  "--footer-gold": "var(--accent-gold, var(--color-accent-gold, #C9A84C))",
  "--footer-muted": "var(--slate-gray, var(--color-slate-gray, #94A3B8))",
};

const footerStyle: CSSProperties = {
  ...paletteVariables,
  backgroundColor: "var(--footer-navy)",
  borderColor: "color-mix(in srgb, var(--footer-gold) 18%, transparent)",
  color: "var(--footer-warm-white)",
};

const logoStyle: CSSProperties = {
  fontFamily: "var(--font-playfair-display, 'Playfair Display', serif)",
};

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--footer-gold)]";

const linkClasses = [
  "rounded-sm text-sm text-[var(--footer-muted)] transition-colors",
  "hover:text-[var(--footer-gold)]",
  focusRingClasses,
].join(" ");

const sectionTitleClasses =
  "text-sm font-semibold uppercase tracking-[0.22em] text-[var(--footer-gold)]";

const productsLinks = [
  { href: "/products?type=saas", label: "SaaS products" },
  { href: "/products?type=template", label: "Templates" },
  { href: "/products/custom-work", label: "Custom work" },
] as const;

const companyLinks = [
  { href: "/contact", label: "Contact" },
  { href: "/feed", label: "Build Log" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="border-t" style={footerStyle}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <section aria-labelledby="footer-brand-heading">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 rounded-md text-2xl font-semibold tracking-tight ${focusRingClasses}`}
            style={logoStyle}
          >
            <span id="footer-brand-heading">Fulatelier</span>
            <Wrench
              aria-hidden="true"
              className="h-4 w-4 text-[var(--footer-gold)]"
              strokeWidth={2.2}
            />
          </Link>
          <p className="mt-3 text-sm font-medium text-[var(--footer-gold)]">
            Mississippi&apos;s Digital Workshop
          </p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--footer-muted)]">
            We craft lean software, templates, and custom digital systems for
            founders and local teams ready to turn practical ideas into
            polished tools.
          </p>
        </section>

        <nav aria-label="Products links">
          <h2 className={sectionTitleClasses}>Products</h2>
          <ul className="mt-4 space-y-3">
            {productsLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClasses}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company links">
          <h2 className={sectionTitleClasses}>Company</h2>
          <ul className="mt-4 space-y-3">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClasses}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-contact-heading">
          <h2 id="footer-contact-heading" className={sectionTitleClasses}>
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--footer-muted)]">
            <li>
              <a
                href="mailto:hello@fulatelier.com"
                className={linkClasses}
              >
                Email Fulatelier at hello@fulatelier.com
              </a>
            </li>
            <li>Jackson, MS</li>
            <li>
              <ul className="flex items-center gap-3">
                <li>
                  <a
                    href="https://www.tiktok.com/@fulatelier"
                    aria-label="Follow us on TikTok"
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--footer-gold)_35%,transparent)] text-[var(--footer-muted)] transition-colors hover:border-[var(--footer-gold)] hover:text-[var(--footer-gold)] ${focusRingClasses}`}
                  >
                    <Music2 aria-hidden="true" className="h-5 w-5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/fulatelier"
                    aria-label="Follow us on GitHub"
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--footer-gold)_35%,transparent)] text-[var(--footer-muted)] transition-colors hover:border-[var(--footer-gold)] hover:text-[var(--footer-gold)] ${focusRingClasses}`}
                  >
                    <Github aria-hidden="true" className="h-5 w-5" />
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </div>

      <div className="border-t border-[color-mix(in_srgb,var(--footer-gold)_16%,transparent)] px-4 py-6 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-7xl text-sm text-[var(--footer-muted)]">
          &copy; {currentYear} Fulatelier LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
