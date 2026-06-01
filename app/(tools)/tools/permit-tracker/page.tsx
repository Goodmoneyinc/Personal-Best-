import { ButtonLink } from '@/components/ui/button';

export const metadata = {
  title: 'Permit Tracker',
  description:
    'A Fulatelier micro-SaaS concept for tracking local permit workflows from intake through approval.',
};

export default function PermitTrackerLandingPage() {
  return (
    <>
      <section aria-labelledby="permit-title" className="bg-navy px-6 py-16 text-warm lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
              Micro SaaS
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-balance md:text-6xl" id="permit-title">
              Permit Tracker for local buildouts and launch crews.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-warm/80">
              Track municipal permit intake, missing documents, submission
              dates, reviewer follow-ups, and approval notes in one calm board.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/tools/permit-tracker/dashboard">
                Open dashboard preview
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                Request pilot access
              </ButtonLink>
            </div>
          </div>
          <aside
            aria-label="Permit Tracker highlights"
            className="rounded-[2rem] border border-warm/15 bg-warm/10 p-6 shadow-glow"
          >
            <ul className="space-y-4 text-sm leading-6 text-warm/80">
              <li className="rounded-3xl border border-warm/15 bg-navy/55 p-5">
                Intake checklists for signage, renovation, pop-up, and event
                permit workflows.
              </li>
              <li className="rounded-3xl border border-warm/15 bg-navy/55 p-5">
                Status views for owners, contractors, and operations managers.
              </li>
              <li className="rounded-3xl border border-warm/15 bg-navy/55 p-5">
                Supabase-ready records for files, reminders, notes, and approvals.
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section aria-labelledby="permit-fit-title" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Local retailers', 'Coordinate signage, storefront, and occupancy tasks before opening day.'],
            ['Contractors', 'Keep client-facing permit updates visible without long email chains.'],
            ['Event teams', 'Track temporary permits, approvals, and inspection windows.'],
          ].map(([title, description]) => (
            <article
              className="rounded-[2rem] border border-navy/10 bg-white/85 p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow"
              key={title}
            >
              <h2 className="font-display text-2xl font-bold text-navy" id={title === 'Local retailers' ? 'permit-fit-title' : undefined}>
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink/75">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
