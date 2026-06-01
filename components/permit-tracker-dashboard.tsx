'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

type PermitStage = 'intake' | 'documents' | 'submitted' | 'approved';

const stages: Array<{
  id: PermitStage;
  label: string;
  description: string;
}> = [
  {
    id: 'intake',
    label: 'Intake',
    description: 'Capture project location, work type, and responsible contact.',
  },
  {
    id: 'documents',
    label: 'Documents',
    description: 'Collect plans, contractor details, photos, and fee notes.',
  },
  {
    id: 'submitted',
    label: 'Submitted',
    description: 'Track office submission date, reviewer, and follow-up tasks.',
  },
  {
    id: 'approved',
    label: 'Approved',
    description: 'Store permit numbers, inspection windows, and renewal reminders.',
  },
];

export function PermitTrackerDashboard() {
  const [stage, setStage] = useState<PermitStage>('intake');
  const [permitName, setPermitName] = useState('Jackson storefront sign permit');

  const activeIndex = useMemo(
    () => stages.findIndex((item) => item.id === stage),
    [stage],
  );

  return (
    <section
      aria-labelledby="permit-dashboard-title"
      className="rounded-[2rem] border border-navy/10 bg-white/85 p-6 shadow-card md:p-8"
    >
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
            Dashboard preview
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold text-navy" id="permit-dashboard-title">
            Permit workflow board
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/75">
            This starter dashboard models the first micro-SaaS workflow before
            connecting authenticated Supabase records.
          </p>
        </div>
        <div className="rounded-2xl bg-navy px-5 py-4 text-warm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
            Current stage
          </p>
          <p className="mt-2 font-display text-2xl">{stages[activeIndex]?.label}</p>
        </div>
      </div>

      <div className="mt-8">
        <label className="text-sm font-semibold text-navy" htmlFor="permit-name">
          Permit name
        </label>
        <input
          className="mt-2 min-h-12 w-full rounded-xl border border-navy/20 bg-warm px-4 text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          id="permit-name"
          onChange={(event) => setPermitName(event.target.value)}
          type="text"
          value={permitName}
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4" role="list" aria-label="Permit stages">
        {stages.map((item, index) => {
          const isActive = item.id === stage;
          const isComplete = index < activeIndex;

          return (
            <button
              aria-pressed={isActive}
              className={`rounded-3xl border p-5 text-left transition duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                isActive
                  ? 'border-gold bg-gold/20 shadow-glow'
                  : 'border-navy/10 bg-warm hover:border-gold'
              }`}
              key={item.id}
              onClick={() => setStage(item.id)}
              type="button"
            >
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#6F5921]">
                {isComplete ? 'Complete' : isActive ? 'Active' : 'Upcoming'}
              </span>
              <span className="mt-3 block font-display text-2xl font-bold text-navy">
                {item.label}
              </span>
              <span className="mt-3 block text-sm leading-6 text-ink/75">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-navy p-6 text-warm md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-warm/80">
          <strong className="text-gold">{permitName || 'Untitled permit'}</strong> is
          ready for the {stages[activeIndex]?.label.toLowerCase()} checklist.
        </p>
        <Button
          onClick={() => {
            const nextStage = stages[Math.min(activeIndex + 1, stages.length - 1)];
            setStage(nextStage.id);
          }}
          type="button"
        >
          Move to next stage
        </Button>
      </div>
    </section>
  );
}
