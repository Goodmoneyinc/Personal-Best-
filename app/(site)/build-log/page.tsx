import { Suspense } from 'react';

import { BuildLogFeed } from '@/components/video/BuildLogFeed';
import { getAllVideoLogs } from '@/lib/supabase/queries';

export const metadata = {
  title: 'Build log',
  description:
    'Watch Fulatelier product walkthroughs and notes from the Mississippi digital workshop.',
};

function BuildLogFeedSkeleton() {
  return (
    <section aria-labelledby="build-log-list-title" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
            Latest entries
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold text-navy" id="build-log-list-title">
            From the bench
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-ink/75">
          Each entry connects back to a product or operational pattern that can
          become a launch-ready system.
        </p>
      </div>
      <div aria-live="polite" className="mt-10" role="status">
        <span className="sr-only">Loading build log videos.</span>
        <div aria-hidden="true" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              className="h-[24rem] animate-pulse rounded-[2rem] border border-navy/10 bg-white/70 shadow-card"
              key={item}
            >
              <div className="aspect-video rounded-t-[2rem] bg-navy/15" />
              <div className="space-y-4 p-6">
                <div className="h-4 w-24 rounded-full bg-gold/20" />
                <div className="h-8 w-3/4 rounded-full bg-navy/15" />
                <div className="h-4 rounded-full bg-slate/20" />
                <div className="h-4 w-5/6 rounded-full bg-slate/20" />
                <div className="h-10 w-40 rounded-full bg-warm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function BuildLogFeedContent() {
  try {
    const videos = await getAllVideoLogs();

    return <BuildLogFeed videos={videos} />;
  } catch {
    return (
      <section aria-labelledby="build-log-list-title" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
            Latest entries
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold text-navy" id="build-log-list-title">
            From the bench
          </h2>
        </div>
        <p className="mt-10 rounded-[2rem] border border-[#8A3A2B]/30 bg-[#FFF6F2] p-6 text-sm font-semibold leading-6 text-[#7A2E23]" role="status">
          Build log videos could not be loaded right now. Please refresh the page or check back soon.
        </p>
      </section>
    );
  }
}

export default function BuildLogPage() {
  return (
    <>
      <section aria-labelledby="build-log-title" className="bg-navy px-6 py-16 text-warm lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">
            Build log
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-tight text-balance md:text-6xl" id="build-log-title">
            Workshop notes, demos, and product walkthroughs.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-warm/80">
            Follow along as Fulatelier turns repeatable Mississippi business
            needs into useful templates, SaaS starters, and custom systems.
          </p>
        </div>
      </section>
      <Suspense fallback={<BuildLogFeedSkeleton />}>
        <BuildLogFeedContent />
      </Suspense>
    </>
  );
}
