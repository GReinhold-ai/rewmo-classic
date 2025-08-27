// src/pages/learn/[track]/index.tsx
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCoursesByPath } from "@/lib/useTraining";

const TRACK_TITLES: Record<string, string> = {
  genai: "AI Training",
  tqm: "TQM Training",
  finance: "Finance Training",
};

export default function LearnIndex() {
  const router = useRouter();
  const track =
    typeof router.query.track === "string" ? router.query.track : "";

  const { path, courses, loading, error } = useCoursesByPath(track);
  const title = TRACK_TITLES[track] ?? "Training";

  return (
    <>
      <Head>
        <title>{title} | Rewmo</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>

      <div className="mx-auto max-w-6xl px-4 py-8 text-slate-100">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-slate-300">Short, practical modules.</p>

        <div className="mt-6">
          {!track ? (
            <div className="rounded-xl bg-slate-800/60 px-4 py-3">
              Loading track…
            </div>
          ) : loading ? (
            <div className="rounded-xl bg-slate-800/60 px-4 py-3">
              Loading…
            </div>
          ) : error ? (
            <div className="rounded-xl bg-slate-800/60 px-4 py-3">
              Could not load lessons.
            </div>
          ) : !courses?.length ? (
            <div className="rounded-xl bg-slate-800/60 px-4 py-3">
              No lessons found for this track yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {courses.map((c: any) => {
                const slug = c.slug || c.id;
                const isExternal = !!c.href;

                // Internal lesson link (goes to /learn/[track]/[slug])
                if (!isExternal) {
                  return (
                    <Link
                      key={c.id}
                      href={{
                        pathname: "/learn/[track]/[slug]",
                        query: { track, slug, id: c.id },
                      }}
                      className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{c.title}</h3>
                        <span className="text-xs rounded-full bg-slate-700/70 px-2 py-1">
                          not started · 0%
                        </span>
                      </div>
                      {c.summary ? (
                        <p className="mt-2 text-slate-300">{c.summary}</p>
                      ) : null}
                    </Link>
                  );
                }

                // External resource link (opens new tab)
                return (
                  <a
                    key={c.id}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{c.title}</h3>
                      <span className="text-xs rounded-full bg-slate-700/70 px-2 py-1">
                        external
                      </span>
                    </div>
                    {c.summary ? (
                      <p className="mt-2 text-slate-300">{c.summary}</p>
                    ) : null}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
