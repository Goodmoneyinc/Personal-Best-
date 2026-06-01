import type { CaseStudy, VideoLog } from '@/lib/types';

interface BuildLogPreviewProps {
  caseStudy?: CaseStudy;
  video?: VideoLog;
}

export function BuildLogPreview({ caseStudy, video }: BuildLogPreviewProps) {
  return (
    <section aria-labelledby="proof-title" className="bg-white/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-2 lg:px-8">
        <article className="rounded-[2rem] border border-navy/10 bg-warm p-8 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#6F5921]">
            Case study
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy" id="proof-title">
            {caseStudy?.title ?? 'Built for Mississippi launches'}
          </h2>
          <p className="mt-4 text-base leading-7 text-ink/75">
            {caseStudy?.description ??
              'Fulatelier turns repeatable local business needs into clean, accessible digital systems.'}
          </p>
        </article>
        <article className="rounded-[2rem] border border-navy/10 bg-navy p-8 text-warm shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-glow">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
            Video log
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold">
            {video?.title ?? 'Build notes from the workshop'}
          </h2>
          <p className="mt-4 text-base leading-7 text-warm/80">
            {video?.description ??
              'Short product walkthroughs and launch lessons will live here as the marketplace grows.'}
          </p>
        </article>
      </div>
    </section>
  );
}
