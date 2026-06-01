import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-navy/10 bg-navy text-warm">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.3fr_0.7fr_0.7fr] lg:px-8">
        <section aria-labelledby="footer-brand">
          <h2 className="font-display text-3xl" id="footer-brand">
            Fulatelier
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-warm/80">
            A Mississippi digital workshop for practical software, launch-ready
            templates, and custom web systems.
          </p>
        </section>
        <section aria-labelledby="footer-marketplace">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em]" id="footer-marketplace">
            Marketplace
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-warm/80">
            <li>
              <Link className="rounded-sm hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" href="/products">
                Products
              </Link>
            </li>
            <li>
              <Link className="rounded-sm hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" href="/build-log">
                Build log
              </Link>
            </li>
            <li>
              <Link className="rounded-sm hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" href="/tools/permit-tracker">
                Permit Tracker
              </Link>
            </li>
            <li>
              <Link className="rounded-sm hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" href="/contact">
                Custom build intake
              </Link>
            </li>
          </ul>
        </section>
        <section aria-labelledby="footer-location">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em]" id="footer-location">
            Based in Mississippi
          </h2>
          <p className="mt-4 text-sm leading-6 text-warm/80">
            Serving founders, makers, agencies, and local operators across the
            Delta, Coast, Pine Belt, and beyond.
          </p>
        </section>
      </div>
    </footer>
  );
}
