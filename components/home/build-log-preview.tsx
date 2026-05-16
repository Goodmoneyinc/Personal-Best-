import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { PlayCircle } from "lucide-react";

import type { VideoLog } from "@/lib/types";

type VideoRecord = Record<string, unknown>;

function getString(value: unknown, fallback = "") {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function getNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeVideo(record: VideoRecord): VideoLog {
  return {
    id: getString(record.id),
    title: getString(record.title, "Untitled build log"),
    description: getString(record.description),
    video_url: getString(record.video_url),
    thumbnail_url: getString(record.thumbnail_url, "/placeholder-product.jpg"),
    tiktok_url: typeof record.tiktok_url === "string" ? record.tiktok_url : null,
    linked_product_id:
      typeof record.linked_product_id === "string"
        ? record.linked_product_id
        : null,
    linked_product_type: null,
    views: getNumber(record.views),
    is_active: record.is_active !== false,
    order_index: getNumber(record.order_index),
    created_at: getString(record.created_at, new Date(0).toISOString()),
  };
}

async function fetchLatestVideos() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase
    .from("video_logs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    return [];
  }

  return ((data ?? []) as VideoRecord[]).map(normalizeVideo);
}

export async function BuildLogPreview() {
  const videos = await fetchLatestVideos();

  return (
    <section
      id="build-log-preview"
      aria-labelledby="build-log-preview-heading"
      className="bg-white px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
              Build in public
            </p>
            <h2
              id="build-log-preview-heading"
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Follow along as we build in public
            </h2>
          </div>
          <Link
            href="/feed"
            className="rounded-md font-semibold hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
          >
            View all build logs
          </Link>
        </div>

        {videos.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {videos.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden rounded-2xl border bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] shadow-sm"
              >
                <div className="relative aspect-video">
                  <Image
                    src={video.thumbnail_url}
                    alt={`${video.title} thumbnail`}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                    unoptimized
                  />
                  <PlayCircle
                    aria-hidden="true"
                    className="absolute bottom-4 left-4 h-8 w-8 text-white drop-shadow"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold">{video.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
                    {video.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] p-6 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
            Build log videos are coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
