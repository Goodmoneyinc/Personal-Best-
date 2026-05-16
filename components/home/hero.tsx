import Link from "next/link";

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-[var(--navy,var(--color-navy,#0A0F1E))] px-4 py-24 text-white sm:px-6 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.16) 1px, transparent 1px), radial-gradient(circle at 25% 20%, rgba(201,168,76,0.25), transparent 28%), radial-gradient(circle at 80% 10%, rgba(245,240,232,0.14), transparent 30%)",
          backgroundSize: "42px 42px, 42px 42px, 100% 100%, 100% 100%",
        }}
      />
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
            Fulatelier LLC
          </p>
          <h1
            id="hero-heading"
            className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"
            style={{
              fontFamily:
                "var(--font-playfair-display, 'Playfair Display', serif)",
            }}
          >
            Mississippi&apos;s Digital Workshop
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--warm-white,var(--color-warm-white,#F5F0E8))]">
            Affordable Micro SaaS, templates, and custom web builds for local
            businesses and government agencies.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className={`inline-flex items-center justify-center rounded-md bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] px-5 py-3 text-sm font-semibold text-[var(--navy,var(--color-navy,#0A0F1E))] transition-colors hover:bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] ${focusRingClasses}`}
            >
              Browse Products
            </Link>
            <Link
              href="/contact"
              className={`inline-flex items-center justify-center rounded-md border border-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--navy,var(--color-navy,#0A0F1E))] ${focusRingClasses}`}
            >
              Get a Custom Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
