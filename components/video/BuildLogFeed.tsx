import { VideoCard } from '@/components/video/VideoCard';
import type { VideoLog } from '@/lib/types';

interface BuildLogFeedProps {
  videos: VideoLog[];
}

export function BuildLogFeed({ videos }: BuildLogFeedProps) {
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

      {videos.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard entry={video} key={video.id} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-[2rem] border border-navy/10 bg-white/80 p-6 text-sm leading-6 text-ink/75" role="status">
          Build log videos are being prepared. Please check back soon.
        </p>
      )}
    </section>
  );
}
