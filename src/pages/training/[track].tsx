// src/pages/training/[track].tsx
import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

type Course = {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  duration?: string;
  kind?: string;       // "link" | "document" | "lesson" etc.
  href?: string;       // external or internal asset link
  slug?: string;
  order?: number;
};

type ApiResp = {
  path: { id: string; title?: string } | null;
  courses: Course[];
};

const TITLE_BY_TRACK: Record<string, string> = {
  genai: "AI Training",
  tqm: "R-Process Management (Lean Lab)",
  rpm: "R-Process Management (Lean Lab)", // alias, displayed name
  finance: "Finance Training",
};

export const getServerSideProps: GetServerSideProps<{
  data: ApiResp | null;
  trackParam: string;
}> = async ({ params, req }) => {
  const trackParam = typeof params?.track === "string" ? params.track : "";
  // Map display alias rpm -> tqm for the API / local files
  const apiTrack = trackParam === "rpm" ? "tqm" : trackParam;

  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      `http://${req.headers.host}`;
    const r = await fetch(
      `${base}/api/training/courses?path=${encodeURIComponent(apiTrack)}`
    );
    const data = (await r.json()) as ApiResp;
    return { props: { data, trackParam } };
  } catch {
    return { props: { data: null, trackParam } };
  }
};

export default function TrackPage(
  { data, trackParam }: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const title = TITLE_BY_TRACK[trackParam] ?? "Training";

  return (
    <>
      <Head>
        <title>{title} • RewmoAI</title>
        <meta name="description" content={`${title} modules and resources`} />
      </Head>

      <main className="mx-auto max-w-6xl px-4 py-8 text-white">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-1 text-white/80">Short, practical modules.</p>
          </div>
          <Link
            href="/training"
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
          >
            ← All Training
          </Link>
        </div>

        {!data ? (
          <div className="mt-6 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
            Failed to load modules. Please try again.
          </div>
        ) : data.courses?.length ? (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {data.courses.map((c) => {
              const displaySummary = c.summary || c.description;
              const displayDuration = c.duration ? String(c.duration) : undefined;

              // If course provides an explicit href (external link or a PDF in /public),
              // open in a new tab. Otherwise, route to our lesson page.
              const hasHref = !!c.href;
              const targetTrackForLinks = trackParam; // keep "rpm" in the URL for display
              const lessonHref = hasHref
                ? c.href!
                : `/learn/${encodeURIComponent(targetTrackForLinks)}/${encodeURIComponent(
                    c.slug || c.id
                  )}`;

              const CardInner = (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{c.title}</h3>
                    {displayDuration ? (
                      <span className="text-xs rounded-full bg-white/10 px-2 py-1">
                        {displayDuration}
                      </span>
                    ) : null}
                  </div>
                  {displaySummary ? (
                    <p className="mt-2 text-sm text-white/80">{displaySummary}</p>
                  ) : null}
                </>
              );

              return (
                <li key={c.id} className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                  {hasHref ? (
                    // External (or asset) link: use <a> with rel="noreferrer"
                    <a
                      href={lessonHref}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-4"
                    >
                      {CardInner}
                    </a>
                  ) : (
                    // Internal lesson page
                    <Link href={lessonHref} className="block p-4">
                      {CardInner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-6 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
            No lessons found for this track yet.
          </div>
        )}

        {/* Quick track switcher */}
        <div className="mt-10 flex flex-wrap items-center gap-2">
          <span className="text-sm text-white/70">Switch track:</span>
          <Link
            href="/training/genai"
            className="rounded-full bg-teal-600/90 px-3 py-1 text-sm font-semibold hover:bg-teal-500"
          >
            GenAI
          </Link>
          <Link
            href="/training/rpm"
            className="rounded-full bg-slate-600/90 px-3 py-1 text-sm font-semibold hover:bg-slate-500"
          >
            R-PM
          </Link>
          <Link
            href="/training/finance"
            className="rounded-full bg-amber-500/90 px-3 py-1 text-sm font-semibold hover:bg-amber-400"
          >
            Finance
          </Link>
        </div>
      </main>
    </>
  );
}
