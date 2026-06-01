interface VideoPlayerProps {
  title: string;
  videoUrl?: string | null;
  demoUrl?: string | null;
}

export function VideoPlayer({ title, videoUrl, demoUrl }: VideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="rounded-[2rem] border border-navy/10 bg-white/85 p-6 shadow-card">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
          Product demo
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold text-navy">
          Demo video coming soon
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink/75">
          This product does not have an embedded walkthrough yet. Use the demo
          link when available or request a guided walkthrough.
        </p>
        {demoUrl ? (
          <a
            className="mt-5 inline-flex rounded-full border border-navy/20 bg-warm px-4 py-2 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            href={demoUrl}
          >
            Open live demo
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <section aria-labelledby="product-video-title" className="rounded-[2rem] border border-navy/10 bg-white/85 p-6 shadow-card">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
        Product demo
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold text-navy" id="product-video-title">
        Watch {title} in action
      </h2>
      <div className="mt-6 aspect-video overflow-hidden rounded-3xl bg-navy">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
          src={videoUrl}
          title={`${title} product walkthrough video`}
        />
      </div>
    </section>
  );
}
