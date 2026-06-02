import Image from 'next/image';
import Link from 'next/link';

import type { VideoLog } from '@/lib/types';

interface VideoCardProps {
  entry: VideoLog;
}

export function VideoCard({ entry }: VideoCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-navy/10 bg-white/85 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-video bg-navy">
        <Image
          alt={`Thumbnail for the ${entry.title} build log video`}
          className="object-cover"
          fill
          src={entry.thumbnail_url}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="p-6">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6F5921]">
          {entry.views.toLocaleString()} views
        </p>
        <h3 className="mt-3 font-display text-2xl font-bold text-navy">
          {entry.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/75">{entry.description}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            className="rounded-full border border-navy/20 bg-warm px-4 py-2 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            href={entry.video_url}
          >
            Watch walkthrough
          </Link>
          {entry.tiktok_url ? (
            <Link
              aria-label="Watch on TikTok"
              className="rounded-full border border-gold/50 bg-gold/20 px-4 py-2 text-sm font-bold text-[#6F5921] transition hover:-translate-y-0.5 hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              href={entry.tiktok_url}
              rel="noopener noreferrer"
              target="_blank"
            >
              TikTok
            </Link>
          ) : null}
          {entry.linked_product_id ? (
            <Link
              className="rounded-full border border-navy/20 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              href={`/products/${entry.linked_product_id}`}
            >
              View Product
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
