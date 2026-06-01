import { BuildLogFeed } from '@/components/video/BuildLogFeed';
import { buildLogEntries } from '@/lib/data/build-log';

export const metadata = {
  title: 'Build log',
  description:
    'Watch Fulatelier product walkthroughs and notes from the Mississippi digital workshop.',
};

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
      <BuildLogFeed entries={buildLogEntries} />
    </>
  );
}
