import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { ExternalLink } from "lucide-react";

import type { CaseStudy } from "@/lib/types";

type CaseStudyRecord = Record<string, unknown>;

function getString(value: unknown, fallback = "") {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function getNullableString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function getTechStack(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizeCaseStudy(record: CaseStudyRecord): CaseStudy {
  return {
    id: getString(record.id),
    title: getString(record.title, "Untitled project"),
    description: getString(record.description),
    hero_media_url: getString(record.hero_media_url, "/placeholder-product.jpg"),
    media_type: record.media_type === "video" ? "video" : "image",
    tech_stack: getTechStack(record.tech_stack),
    live_site_url: getNullableString(record.live_site_url),
    client_name: getNullableString(record.client_name),
    completed_date: getNullableString(record.completed_date),
    featured: record.featured === true,
    display_order:
      typeof record.display_order === "number" ? record.display_order : 0,
  };
}

async function fetchCaseStudies() {
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
    .from("case_studies")
    .select("*")
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .limit(3);

  if (error) {
    return [];
  }

  return ((data ?? []) as CaseStudyRecord[]).map(normalizeCaseStudy);
}

export async function CaseStudies() {
  const caseStudies = await fetchCaseStudies();

  return (
    <section
      id="recent-work"
      aria-labelledby="recent-work-heading"
      className="bg-[var(--warm-white,var(--color-warm-white,#F5F0E8))] px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="recent-work-heading"
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Recent Work
        </h2>

        {caseStudies.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {caseStudies.map((caseStudy) => (
              <article
                key={caseStudy.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] bg-[var(--navy,var(--color-navy,#0A0F1E))]">
                  {caseStudy.media_type === "video" ? (
                    <video
                      controls
                      preload="metadata"
                      className="h-full w-full object-cover"
                      aria-label={`${caseStudy.title} project video`}
                    >
                      <source src={caseStudy.hero_media_url} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={caseStudy.hero_media_url}
                      alt={`${caseStudy.title} project preview`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{caseStudy.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
                    {caseStudy.description}
                  </p>
                  {caseStudy.tech_stack.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {caseStudy.tech_stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full bg-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] px-3 py-1 text-xs font-semibold text-[var(--navy,var(--color-navy,#0A0F1E))]"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {caseStudy.live_site_url ? (
                    <Link
                      href={caseStudy.live_site_url}
                      className="mt-6 inline-flex items-center gap-2 rounded-md text-sm font-semibold hover:text-[var(--accent-gold,var(--color-accent-gold,#C9A84C))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold,var(--color-accent-gold,#C9A84C))]"
                    >
                      View live site
                      <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl bg-white p-6 text-[var(--slate-gray,var(--color-slate-gray,#64748B))]">
            Recent work previews are coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
