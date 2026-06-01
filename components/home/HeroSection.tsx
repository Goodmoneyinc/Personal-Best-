import { ButtonLink } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden bg-navy text-warm"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(201,168,76,0.28),transparent_28rem)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
            Mississippi digital workshop
          </p>
          <h1
            className="mt-5 max-w-4xl font-display text-5xl font-bold leading-tight text-balance md:text-7xl"
            id="home-hero-title"
          >
            Practical web products for local operators with big plans.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-warm/80">
            Fulatelier packages booking flows, storefront starters, and custom
            portals for makers, consultants, agencies, and neighborhood teams
            across Mississippi.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/products">Browse marketplace</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Request a custom build
            </ButtonLink>
          </div>
        </div>
        <aside
          aria-label="Fulatelier service highlights"
          className="rounded-[2rem] border border-warm/15 bg-warm/10 p-6 shadow-glow backdrop-blur"
        >
          <div className="grid gap-4">
            {[
              ['01', 'Launch-ready templates with Mississippi-specific copy'],
              ['02', 'Custom builds scoped around operations, not buzzwords'],
              ['03', 'Stripe and Supabase paths ready for paid workflows'],
            ].map(([number, text]) => (
              <div className="rounded-3xl border border-warm/15 bg-navy/55 p-5" key={number}>
                <p className="font-display text-4xl text-gold">{number}</p>
                <p className="mt-3 text-sm leading-6 text-warm/80">{text}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
