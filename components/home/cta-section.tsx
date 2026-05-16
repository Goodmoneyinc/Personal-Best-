import Link from "next/link";

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

export function CtaSection() {
  return (
    <section
      id="start-project"
      aria-labelledby="start-project-heading"
      className="bg-[var(--navy,var(--color-navy,#0A0F1E))] px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2
          id="start-project-heading"
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Ready to automate your business?
        </h2>
        <p className="mt-4 text-[var(--warm-white,var(--color-warm-white,#F5F0E8))]">
          Start with a product, adapt a template, or bring Fulatelier a workflow
          that needs a custom build.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className={`inline-flex items-center justify-center rounded-md bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] px-5 py-3 text-sm font-semibold text-[var(--navy,var(--color-navy,#0A0F1E))] transition-colors hover:bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] ${focusRingClasses}`}
          >
            Browse Products
          </Link>
          <Link
            href="/contact"
            className={`inline-flex items-center justify-center rounded-md border border-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--navy,var(--color-navy,#0A0F1E))] ${focusRingClasses}`}
          >
            Start a Project
          </Link>
        </div>
      </div>
    </section>
  );
}
