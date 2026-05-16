import Link from "next/link";
import { Bell, ClipboardCheck, FileArchive, NotebookPen } from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    title: "Track permit status",
    description:
      "Keep every county, city, and state permit in one organized dashboard.",
  },
  {
    icon: Bell,
    title: "Deadline reminders",
    description:
      "Stay ahead of renewal dates, inspection windows, and expiration deadlines.",
  },
  {
    icon: FileArchive,
    title: "Document storage",
    description:
      "Attach approvals, plan sets, receipts, and supporting files to each permit.",
  },
  {
    icon: NotebookPen,
    title: "Inspector notes",
    description:
      "Capture inspection feedback and follow-up tasks before details get lost.",
  },
] as const;

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

export default function PermitTrackerLandingPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] text-[var(--navy,var(--color-navy,#0A0F1E))]"
    >
      <section
        id="permit-tracker-hero"
        aria-labelledby="permit-tracker-heading"
        className="bg-[var(--navy,var(--color-navy,#0A0F1E))] px-4 py-24 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
              First Fulatelier Micro SaaS
            </p>
            <h1
              id="permit-tracker-heading"
              className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl"
              style={{
                fontFamily:
                  "var(--font-playfair-display, 'Playfair Display', serif)",
              }}
            >
              Permit Tracker for Mississippi contractors
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--warm-white,var(--color-warm-white,#F5F0E8))]">
              A lightweight tool for Mississippi small businesses, builders,
              and contractors who need one place to track permit status,
              documents, deadlines, and inspection notes.
            </p>
            <div className="mt-10">
              <Link
                href="/admin/login"
                className={`inline-flex rounded-md bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] px-5 py-3 text-sm font-semibold text-[var(--navy,var(--color-navy,#0A0F1E))] transition-colors hover:bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] ${focusRingClasses}`}
              >
                Start Free Trial
              </Link>
            </div>
          </div>

          <aside
            aria-labelledby="permit-tracker-pricing"
            className="rounded-3xl border border-[color-mix(in_srgb,var(--accent-gold,var(--color-accent-gold,#C9A84C))_35%,transparent)] bg-white/10 p-6 shadow-xl"
          >
            <h2 id="permit-tracker-pricing" className="text-2xl font-semibold">
              Simple pricing
            </h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-sm uppercase tracking-[0.2em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
                  Solo
                </dt>
                <dd className="mt-1 text-3xl font-semibold">$29/mo</dd>
                <dd className="text-sm text-[var(--warm-white,var(--color-warm-white,#F5F0E8))]">
                  Per user
                </dd>
              </div>
              <div className="border-t border-white/20 pt-5">
                <dt className="text-sm uppercase tracking-[0.2em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
                  Teams
                </dt>
                <dd className="mt-1 text-3xl font-semibold">$79/mo</dd>
                <dd className="text-sm text-[var(--warm-white,var(--color-warm-white,#F5F0E8))]">
                  Shared access for contractors and office staff
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section
        id="permit-tracker-features"
        aria-labelledby="permit-tracker-features-heading"
        className="px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="permit-tracker-features-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Built for permit work that cannot slip.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <Icon
                    aria-hidden="true"
                    className="h-8 w-8 text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
                  />
                  <h3 className="mt-5 font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
