import { createClient } from "@supabase/supabase-js";

import { VideoFeed } from "@/components/video/video-feed";
import type { ProductType, VideoLog } from "@/lib/types";

type VideoLogRecord = Record<string, unknown>;

const productTypes: ProductType[] = ["saas", "template", "custom"];

function getString(value: unknown, fallback = "") {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function getNullableString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function getNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function getBoolean(value: unknown, fallback = true) {
  return typeof value === "boolean" ? value : fallback;
}

function getProductType(value: unknown) {
  return typeof value === "string" && productTypes.includes(value as ProductType)
    ? (value as ProductType)
    : null;
}

function normalizeVideoLog(record: VideoLogRecord): VideoLog {
  return {
    id: getString(record.id),
    title: getString(record.title, "Untitled build log"),
    description: getString(record.description),
    video_url: getString(record.video_url),
    thumbnail_url: getString(record.thumbnail_url, "/placeholder-product.jpg"),
    tiktok_url: getNullableString(record.tiktok_url),
    linked_product_id: getNullableString(record.linked_product_id),
    linked_product_type: getProductType(record.linked_product_type),
    views: getNumber(record.views),
    is_active: getBoolean(record.is_active),
    order_index: getNumber(record.order_index),
    created_at: getString(record.created_at, new Date(0).toISOString()),
  };
}

async function fetchVideoLogs() {
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
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return ((data ?? []) as VideoLogRecord[]).map(normalizeVideoLog);
}

export default async function FeedPage() {
  const videos = await fetchVideoLogs();

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] text-[var(--navy,var(--color-navy,#0A0F1E))]"
    >
      <section
        aria-labelledby="build-log-heading"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]">
            Build in public
          </p>
          <h1
            id="build-log-heading"
            className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{
              fontFamily:
                "var(--font-playfair-display, 'Playfair Display', serif)",
            }}
          >
            Build Log
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
            Follow the Fulatelier workshop in motion: product experiments,
            behind-the-scenes decisions, and practical lessons from building
            digital tools in public.
          </p>
        </div>

        <VideoFeed videos={videos} />
      </section>
    </main>
  );
}
