import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCoursesByPath } from "@/lib/useTraining";

const TRACK_TITLES: Record<string, string> = {
  genai: "AI Training",
  tqm: "TQM Training",
  finance: "Finance Training",
};

export default function TrackPage() {
  const router = useRouter();
  const track = typeof router.query.track === "string" ? router.query.track : "";
  const { path, courses, loading } = useCoursesByPath(track); // <-- no `error`
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
        <h1 className="text-3xl font-bold">{path?.title ?? title}</h1>
        <p className="mt-2 text-slate-300">Short, practical modules.</p>

        <div className="mt-6">
          {loading ? (
            <div className="rounded-xl bg-slate-800/60 px-4 py-3">Loading…</div>
          ) : !courses?.length ? (
            <div className="rounded-xl bg-slate-800/60 px-4 py-3">
              No lessons found for this track yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {courses.map((c: any) => {
                const href = c.href as string | undefined;
                const slug = c.slug || c.id;

                const TileInner = (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{c.title}</h3>
                      <span className="text-xs rounded-full bg-slate-700/70 px-2 py-1">
                        {c.duration ?? "lesson"}
                      </span>
                    </div>
                    {c.summary ? (
                      <p className="mt-2 text-slate-300">{c.summary}</p>
                    ) : null}
                  </>
                );

                // External links (documents/videos) use <a>; internal lessons use <Link>
                return href ? (
                  <a
                    key={c.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-white/10 bg-slate-800/50 p-4 hover:border-white/20 block"
                  >
                    {TileInner}
                  </a>
                ) : (
                  <Link
                    key={c.id}
                    href={{
                      pathname: "/learn/[track]/[slug]",
                      query: { track, slug, id: c.id },
                    }}
                    className="rounded-xl border border-white/10 bg-slate-800/50 p-4 hover:border-white/20 block"
                  >
                    {TileInner}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
