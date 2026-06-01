import { ButtonLink } from '@/components/ui/button';

export function ContactCTA() {
  return (
    <section aria-labelledby="home-contact-title" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="rounded-[2rem] bg-navy p-8 text-warm shadow-glow md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
          Need something custom?
        </p>
        <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h2 className="font-display text-4xl font-bold" id="home-contact-title">
              Bring a workflow to the workshop.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-warm/80">
              Share the operational knot, launch goal, or customer journey that
              needs a clearer digital system.
            </p>
          </div>
          <ButtonLink href="/contact">Start a project</ButtonLink>
        </div>
      </div>
    </section>
  );
}
