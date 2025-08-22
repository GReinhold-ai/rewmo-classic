import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { useProgress } from "@/lib/useTraining";

type Lesson = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  order?: number;
};

function mapTrackToPathId(track?: string): string | null {
  if (!track) return null;
  if (track === "genai") return "genai-foundations";
  if (track === "tqm") return "tqm-essentials";
  return null; // unknown track -> redirect
}

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

export default function TrackIndexPage() {
  const router = useRouter();
  const { track } = router.query as { track?: string };

  const pathId = useMemo(() => mapTrackToPathId(track), [track]);

  // redirect unknown tracks to /learn
  useEffect(() => {
    if (track && !pathId) router.replace("/learn");
  }, [track, pathId, router]);

  const { currentUser } = useAuth();
  const { get: getProgress } = useProgress(currentUser?.email ?? undefined);

  const [courses, setCourses] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [prog, setProg] = useState<Record<string, { percent: number; status: string }>>({});

  // fetch lessons for the track
  useEffect(() => {
    if (!pathId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await fetchJson<{ courses: Lesson[] }>(
          `/api/training/courses?path=${encodeURIComponent(pathId)}`
        );
        if (!cancelled) setCourses((data.courses ?? []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      } catch (e: any) {
        if (!cancelled) setErr("Could not load lessons.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathId]);

  // fetch progress once we have lessons
  useEffect(() => {
    if (!courses.length) return;
    let cancelled = false;

    (async () => {
      try {
        const raw = await getProgress();
        if (cancelled) return;

        const next: Record<string, { percent: number; status: string }> = {};
        for (const c of courses) {
          const node =
            raw?.[c.id] ??
            raw?.courses?.[c.id] ??
            raw?.progress?.[c.id] ??
            null;
          const percent = Number(node?.percent ?? 0) || 0;
          const status =
            node?.status ?? (percent >= 100 ? "completed" : percent > 0 ? "in_progress" : "not_started");
          next[c.id] = { percent, status };
        }
        setProg(next);
      } catch {
        // ignore; leave progress empty
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courses, getProgress]);

  const trackTitle =
    track === "genai"
      ? "AI Training"
      : track === "tqm"
      ? "TQM Training"
      : "Training";

  return (
    <>
      <Head>
        <title>{trackTitle} | Rewmo Training</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="min-h-[calc(100vh-5rem)] bg-[#003B49] text-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          {/* Crumbs + signed-in badge */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-[#B6E7EB]">
              <Link href="/learn" className="hover:underline">Training</Link>
              {track && <><span className="mx-2">/</span><span>{trackTitle}</span></>}
            </div>
            {currentUser && (
              <span className="rounded-full bg-black/20 px-3 py-1 text-xs text-[#B6E7EB]">
                Signed in as {currentUser.email}
              </span>
            )}
          </div>

          <h1 className="mb-2 text-2xl md:text-3xl font-extrabold text-[#15C5C1]">
            {trackTitle}
          </h1>
          <p className="mb-6 text-[#B6E7EB]">Short, practical modules.</p>

          {loading && <div className="rounded-lg border border-[#15C5C1]/40 bg-white/5 p-4">Loading…</div>}
          {err && <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">{err}</div>}

          {!loading && !err && (
            <>
              {courses.length === 0 ? (
                <div className="rounded-lg border border-[#15C5C1]/40 bg-white/5 p-4">
                  No lessons found for this track yet.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {courses.map((c) => {
                    const p = prog[c.id] ?? { percent: 0, status: "not_started" };
                    return (
                      <Link
                        key={c.id}
                        href={`/learn/${track}/${c.slug}`}
                        className="block rounded-xl border border-[#15C5C1]/40 bg-white/5 p-4 hover:bg-white/10"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                          <span className="rounded-full bg-black/20 px-2 py-1 text-xs">
                            {p.status.replace("_", " ")} · {p.percent}%
                          </span>
                        </div>
                        {c.summary && <p className="mt-2 text-sm text-[#B6E7EB]">{c.summary}</p>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
