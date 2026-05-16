"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { Eye, Film } from "lucide-react";

import type { ProductType, VideoLog } from "@/lib/types";

type VideoFeedProps = {
  videos: VideoLog[];
};

type FilterValue = ProductType | "all";

const filters: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "saas", label: "SaaS" },
  { value: "template", label: "Templates" },
  { value: "custom", label: "Custom Work" },
];

const productTypeLabels: Record<ProductType, string> = {
  saas: "SaaS",
  template: "Template",
  custom: "Custom Work",
};

const focusRingClasses =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatViews(views: number) {
  return new Intl.NumberFormat("en-US", {
    notation: views >= 1000 ? "compact" : "standard",
  }).format(views);
}

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
  } catch {
    return null;
  }

  return null;
}

function isYouTubeUrl(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function createBrowserSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function incrementViewCount(video: VideoLog) {
  const supabase = createBrowserSupabaseClient();

  if (!supabase) {
    return;
  }

  void supabase
    .from("video_logs")
    .update({ views: video.views + 1 })
    .eq("id", video.id);
}

function VideoEntry({ video }: { video: VideoLog }) {
  const [hasIncrementedView, setHasIncrementedView] = useState(false);
  const youtubeEmbedUrl = isYouTubeUrl(video.video_url)
    ? getYouTubeEmbedUrl(video.video_url)
    : null;

  function handleVideoViewed() {
    if (hasIncrementedView) {
      return;
    }

    setHasIncrementedView(true);
    incrementViewCount(video);
  }

  return (
    <article
      role="article"
      aria-label={video.title}
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
    >
      <div className="relative aspect-video bg-[var(--navy,var(--color-navy,#0A0F1E))]">
        {youtubeEmbedUrl ? (
          <iframe
            title={`Video: ${video.title}`}
            src={youtubeEmbedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={handleVideoViewed}
          />
        ) : video.video_url ? (
          <video
            controls
            poster={video.thumbnail_url}
            preload="metadata"
            className="h-full w-full object-cover"
            onPlay={handleVideoViewed}
          >
            <source src={video.video_url} />
            <track
              kind="captions"
              src=""
              label="English"
              srcLang="en"
              default
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={video.thumbnail_url}
            alt={`${video.title} thumbnail`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          {video.linked_product_type ? (
            <span className="rounded-full bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--navy,var(--color-navy,#0A0F1E))]">
              {productTypeLabels[video.linked_product_type]}
            </span>
          ) : (
            <span className="rounded-full bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]">
              Workshop
            </span>
          )}
          <time
            dateTime={video.created_at}
            className="text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]"
          >
            {formatDate(video.created_at)}
          </time>
          <span className="inline-flex items-center gap-1 text-sm text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
            <Eye aria-hidden="true" className="h-4 w-4" />
            {formatViews(video.views)} views
          </span>
        </div>

        <h2 className="mt-4 text-xl font-semibold">{video.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
          {video.description}
        </p>

        {!youtubeEmbedUrl ? (
          <p className="mt-4 rounded-md bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] px-3 py-2 text-sm">
            Captions coming soon — contact us for a transcript
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function VideoFeed({ videos }: VideoFeedProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [isPending, startTransition] = useTransition();

  const filteredVideos = useMemo(() => {
    if (activeFilter === "all") {
      return videos;
    }

    return videos.filter(
      (video) => video.linked_product_type === activeFilter,
    );
  }, [activeFilter, videos]);

  function handleFilterChange(nextFilter: FilterValue) {
    startTransition(() => {
      setActiveFilter(nextFilter);
    });
  }

  return (
    <div className="mt-12">
      <div
        role="group"
        aria-label="Filter build log by product type"
        className="flex flex-wrap gap-3"
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={isActive}
              className={[
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                focusRingClasses,
                isActive
                  ? "border-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] bg-[var(--navy,var(--color-navy,#0A0F1E))] text-white"
                  : "border-[color-mix(in_srgb,var(--navy,var(--color-navy,#0A0F1E))_18%,transparent)] bg-white hover:border-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]",
              ].join(" ")}
              onClick={() => handleFilterChange(filter.value)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div
        role="feed"
        aria-busy={isPending}
        aria-label="Build log videos"
        className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoEntry key={video.id} video={video} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed bg-white px-6 py-16 text-center md:col-span-2 lg:col-span-3">
            <Film
              aria-hidden="true"
              className="mx-auto h-10 w-10 text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
            />
            <p className="mt-4 text-lg font-semibold">
              No build log videos match this filter yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
