import Link from 'next/link';
import type { ReactNode } from 'react';

import { VideoCard } from '@/components/video/VideoCard';
import { getLatestVideoLogs } from '@/lib/supabase/queries';

function BuildLogPreviewSection({ children }: { children: ReactNode }) {
  return (
    <section aria-labelledby="proof-title" className="bg-white/60">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
              Build log
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-navy" id="proof-title">
              Recent workshop videos
            </h2>
          </div>
          <Link
            className="rounded-sm text-sm font-bold text-navy underline decoration-gold decoration-2 underline-offset-8 hover:text-[#6F5921] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            href="/build-log"
          >
            View the build log
          </Link>
        </div>
        {children}
      </div>
    </section>
  );
}

export function BuildLogPreviewSkeleton() {
  return (
    <BuildLogPreviewSection>
      <div aria-live="polite" className="mt-10" role="status">
        <span className="sr-only">Loading workshop video previews.</span>
        <div aria-hidden="true" className="grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              className="h-[25rem] animate-pulse rounded-[2rem] border border-navy/10 bg-white/70 shadow-card"
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
    </BuildLogPreviewSection>
  );
}

export async function BuildLogPreview() {
  try {
    const entries = await getLatestVideoLogs(3);

    if (entries.length === 0) {
      return (
        <BuildLogPreviewSection>
          <p className="mt-10 rounded-[2rem] border border-navy/10 bg-white/80 p-6 text-sm leading-6 text-ink/75" role="status">
            Workshop video previews are being prepared. Please check back soon.
          </p>
        </BuildLogPreviewSection>
      );
    }

    return (
      <BuildLogPreviewSection>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {entries.map((entry) => (
            <VideoCard entry={entry} key={entry.id} />
          ))}
        </div>
      </BuildLogPreviewSection>
    );
  } catch {
    return (
      <BuildLogPreviewSection>
        <p className="mt-10 rounded-[2rem] border border-[#8A3A2B]/30 bg-[#FFF6F2] p-6 text-sm font-semibold leading-6 text-[#7A2E23]" role="status">
          Workshop video previews could not be loaded right now. Please refresh the page or visit the build log.
        </p>
      </BuildLogPreviewSection>
    );
  }
}
