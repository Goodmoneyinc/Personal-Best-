type VideoPlayerProps = {
  title: string;
  videoUrl: string;
};

function isEmbeddableVideo(videoUrl: string) {
  return (
    videoUrl.includes("youtube.com") ||
    videoUrl.includes("youtu.be") ||
    videoUrl.includes("vimeo.com")
  );
}

export function VideoPlayer({ title, videoUrl }: VideoPlayerProps) {
  if (isEmbeddableVideo(videoUrl)) {
    return (
      <iframe
        title={`${title} video demo`}
        src={videoUrl}
        className="aspect-video w-full rounded-2xl border border-[color-mix(in_srgb,var(--accent-gold,var(--color-accent-gold,#C9A84C))_24%,transparent)]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <video
      controls
      preload="metadata"
      className="aspect-video w-full rounded-2xl border border-[color-mix(in_srgb,var(--accent-gold,var(--color-accent-gold,#C9A84C))_24%,transparent)] bg-[var(--navy,var(--color-navy,#0A0F1E))]"
      aria-label={`${title} video demo`}
    >
      <source src={videoUrl} />
      Your browser does not support the video tag. Use the product preview link
      or contact Fulatelier for a transcript.
    </video>
  );
}
