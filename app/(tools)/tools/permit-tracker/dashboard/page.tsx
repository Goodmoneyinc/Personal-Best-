import { PermitTrackerDashboard } from '@/components/permit-tracker-dashboard';

export const metadata = {
  title: 'Permit Tracker dashboard',
  description:
    'Preview the Fulatelier Permit Tracker dashboard workflow for local permit operations.',
};

export default function PermitTrackerDashboardPage() {
  return (
    <>
      <section aria-labelledby="permit-dashboard-hero" className="bg-navy px-6 py-16 text-warm lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
            Permit Tracker
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-tight text-balance md:text-6xl" id="permit-dashboard-hero">
            Dashboard preview for permit operations.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-warm/80">
            A keyboard-friendly prototype for the core workflow: intake,
            documents, submission, and approval.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <PermitTrackerDashboard />
      </div>
    </>
  );
}
