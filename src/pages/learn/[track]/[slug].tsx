import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { useProgress } from "@/lib/useTraining";

type Course = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  html?: string;          // optional pre-rendered HTML from API
  content?: string;       // optional markdown/plain text fallback
};

type CourseProgress = { status?: string; percent?: number } | null;

// Try to pull a single course's progress out of a few possible shapes
function extractProgressShape(raw: any, courseId: string): CourseProgress {
  if (!raw || !courseId) return null;

  // 1) Flat map keyed by courseId
  if (raw[courseId] && (typeof raw[courseId] === "object")) {
    const { status, percent } = raw[courseId] || {};
    return { status, percent };
  }

  // 2) Nested: raw.courses[courseId]
  if (raw.courses && raw.courses[courseId]) {
    const { status, percent } = raw.courses[courseId] || {};
    return { status, percent };
  }

  // 3) Array of items: [{ courseId, status, percent }]
  const list =
    raw.items || raw.progress || raw.list || raw.entries || Array.isArray(raw) ? raw : null;
  if (Array.isArray(list)) {
    const hit = list.find((x: any) => x?.courseId === courseId);
    if (hit) return { status: hit.status, percent: hit.percent };
  }

  // 4) Maybe wrapped: { data: {...} }
  if (raw.data) return extractProgressShape(raw.data, courseId);

  return null;
}

export default function LessonPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  // ——— Robust track inference (works with /learn/[track]/[slug] and wrappers like /learn/genai/[slug]) ———
  const rawTrackFromPath = useMemo(() => {
    const p = router.asPath.split("?")[0];
    const segs = p.split("/").filter(Boolean); // e.g. ["learn","genai","the-lesson"]
    const i = segs.indexOf("learn");
    return i >= 0 && segs[i + 1] ? segs[i + 1] : "";
  }, [router.asPath]);

  const track = (router.query.track as string) || rawTrackFromPath;
  const slug = router.query.slug as string;

  const { get: getProgress, set: setProgress } = useProgress(currentUser?.email || undefined);

  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState<Course | null>(null);
  const [prevLesson, setPrevLesson] = useState<Course | null>(null);
  const [nextLesson, setNextLesson] = useState<Course | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [progressLoading, setProgressLoading] = useState(false);
  const [progressState, setProgressState] = useState<CourseProgress>(null);
  const [marking, setMarking] = useState(false);

  // Fetch the list for this track, then pick the requested lesson + neighbors.
  useEffect(() => {
    if (!router.isReady || !track || !slug) return;
    let cancelled = false;

    async function run() {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/training/courses?path=${encodeURIComponent(track)}`);
        if (!res.ok) throw new Error(`Failed to load courses (${res.status})`);
        const data = await res.json();
        const courses: Course[] = data?.courses || [];

        const idx = courses.findIndex(c => c.slug === slug || c.id === slug);
        if (idx === -1) throw new Error("Lesson not found in this track.");

        const pick = courses[idx];
        const prev = idx > 0 ? courses[idx - 1] : null;
        const next = idx < courses.length - 1 ? courses[idx + 1] : null;

        // Optionally hydrate with full lesson details (if your API supports it)
        let full: Course | null = pick;
        try {
          if (pick?.id) {
            const r2 = await fetch(`/api/training/${encodeURIComponent(pick.id)}`);
            if (r2.ok) {
              const d2 = await r2.json();
              full = { ...pick, ...d2?.course };
            }
          }
        } catch {
          /* non-fatal enrichment */
        }

        if (!cancelled) {
          setLesson(full);
          setPrevLesson(prev);
          setNextLesson(next);
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load lesson.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, track, slug]);

  // Fetch progress for THIS lesson when we know its id and the user (if any).
  useEffect(() => {
    let cancelled = false;
    if (!lesson?.id || !getProgress) return;

    async function load() {
      try {
        setProgressLoading(true);
        const raw = await getProgress();
        if (!cancelled) {
          const p = extractProgressShape(raw, lesson.id);
          setProgressState(p);
        }
      } catch {
        // non-fatal: just show no progress
      } finally {
        if (!cancelled) setProgressLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [lesson?.id, getProgress]);

  const prettyTrack = useMemo(() => {
    if (!track) return "";
    return track
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }, [track]);

  const isCompleted =
    (progressState?.status?.toLowerCase() === "completed") ||
    ((progressState?.percent ?? 0) >= 100);

  async function handleMarkComplete() {
    if (!lesson?.id) return;
    setMarking(true);
    try {
      await setProgress(lesson.id, { status: "completed", percent: 100 }, currentUser?.email || undefined);
      // Optimistically update local state
      setProgressState({ status: "completed", percent: 100 });
      if (nextLesson) {
        await router.push(`/learn/${track}/${nextLesson.slug}`);
      }
    } catch (e) {
      console.error(e);
      // non-blocking
    } finally {
      setMarking(false);
    }
  }

  return (
    <>
      <Head>
        <title>{lesson?.title ? `${lesson.title} · ${prettyTrack}` : "Lesson"} | Rewmo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="min-h-screen bg-[#003B49] text-white">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-[#B6E7EB]">
            <Link href="/learn" className="hover:underline">Learning</Link>
            <span className="mx-2">/</span>
            <Link href={`/learn/${track}`} className="hover:underline">{prettyTrack || "Track"}</Link>
            {lesson?.title && (
              <>
                <span className="mx-2">/</span>
                <span className="text-white/90">{lesson.title}</span>
              </>
            )}
          </nav>

          {/* Header */}
          <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#15C5C1]">
                {lesson?.title || (loading ? "Loading…" : "Lesson")}
              </h1>
              {lesson?.summary && (
                <p className="mt-2 text-[#B6E7EB]">{lesson.summary}</p>
              )}
            </div>

            {/* Progress badge */}
            <div className="flex items-center gap-2">
              {progressLoading ? (
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 text-white/80 text-sm">
                  Checking progress…
                </span>
              ) : isCompleted ? (
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-600/80 text-white text-sm">
                  ✓ Completed
                </span>
              ) : progressState?.percent ? (
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 text-white/90 text-sm">
                  {Math.min(100, Math.round(progressState.percent))}% complete
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/10 text-white/80 text-sm">
                  Not started
                </span>
              )}
            </div>
          </header>

          {/* Body */}
          <section className="rounded-2xl bg-[#02404d] border border-[#15C5C1]/30 p-4 md:p-6 shadow-lg">
            {err && <div className="text-red-300">{err}</div>}
            {loading && !lesson && <div className="text-[#B6E7EB]">Loading lesson…</div>}

            {!loading && lesson && (
              <article className="prose prose-invert max-w-none">
                {lesson.html ? (
                  <div
                    className="[&_h2]:text-[#FF9151] [&_h3]:text-[#FF9151] [&_a]:text-[#15C5C1] [&_code]:bg-black/30"
                    dangerouslySetInnerHTML={{ __html: lesson.html }}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap text-[#B6E7EB]">{lesson.content || "No content yet."}</pre>
                )}
              </article>
            )}

            {/* CTA row */}
            {!loading && lesson && (
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  {prevLesson ? (
                    <Link
                      href={`/learn/${track}/${prevLesson.slug}`}
                      className="inline-flex items-center px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 transition"
                    >
                      ← Previous
                    </Link>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 rounded-lg border border-transparent text-white/40 cursor-not-allowed">
                      ← Previous
                    </span>
                  )}
                  {nextLesson ? (
                    <Link
                      href={`/learn/${track}/${nextLesson.slug}`}
                      className="inline-flex items-center px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 transition"
                    >
                      Next →
                    </Link>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 rounded-lg border border-transparent text-white/40 cursor-not-allowed">
                      Next →
                    </span>
                  )}
                </div>

                {/* Primary action switches based on completion */}
                {isCompleted ? (
                  nextLesson ? (
                    <Link
                      href={`/learn/${track}/${nextLesson.slug}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold bg-[#FF9151] hover:opacity-90 transition"
                    >
                      Continue →
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold bg-[#FF9151]/60 cursor-not-allowed"
                    >
                      Completed
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleMarkComplete}
                    disabled={marking || !lesson?.id}
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition
                      ${marking ? "bg-[#FF9151]/60 cursor-not-allowed" : "bg-[#FF9151] hover:opacity-90"}`}
                  >
                    {marking ? "Saving…" : nextLesson ? "Mark Complete & Continue" : "Mark Complete"}
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
