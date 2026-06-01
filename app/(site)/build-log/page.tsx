import Image from 'next/image';
import Link from 'next/link';

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
            Each entry connects back to a product or operational pattern that
            can become a launch-ready system.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {buildLogEntries.map((entry) => (
            <article
              className="overflow-hidden rounded-[2rem] border border-navy/10 bg-white/85 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow"
              key={entry.id}
            >
              <div className="relative aspect-video bg-navy">
                <Image
                  alt={`${entry.title} video thumbnail`}
                  className="object-cover"
                  fill
                  src={entry.thumbnail_url}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-6">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6F5921]">
                  {entry.views.toLocaleString()} views
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold text-navy">
                  {entry.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink/75">{entry.description}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    className="rounded-full border border-navy/20 bg-warm px-4 py-2 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    href={entry.video_url}
                  >
                    Watch walkthrough
                  </Link>
                  {entry.product ? (
                    <Link
                      className="rounded-full border border-navy/20 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                      href={`/products/${entry.product.slug}`}
                    >
                      View linked product
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
