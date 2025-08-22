// src/pages/learn/[track]/[slug].tsx
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
  content?: string;       // optional HTML/markdown (rendered simply here)
  videoUrl?: string;
  pathId?: string;
  order?: number;
};

type ProgressShape = {
  percent: number;
  status: "not_started" | "in_progress" | "completed";
};

const DEFAULT_PROGRESS: ProgressShape = { percent: 0, status: "not_started" };

function extractProgressShape(raw: any, id: string): ProgressShape {
  // Defensive parsing — accept a few shapes
  const node =
    raw?.[id] ??
    raw?.courses?.[id] ??
    raw?.progress?.[id] ??
    null;

  const percent = Number(node?.percent ?? 0) || 0;
  const status: ProgressShape["status"] =
    (node?.status as ProgressShape["status"]) ??
    (percent >= 100 ? "completed" : percent > 0 ? "in_progress" : "not_started");

  return { percent, status };
}

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`Failed request: ${r.status}`);
  }
  return r.json();
}

function mapTrackToPathId(track?: string): string | null {
  if (!track) return null;
  // Known paths from seeding:
  // - "genai-foundations"
  // - "tqm-essentials"
  if (track === "genai") return "genai-foundations";
  if (track === "tqm") return "tqm-essentials";
  return track; // fallback: treat track as pathId if already exact
}

export default function LessonPage() {
  const router = useRouter();
  const { track: trackParam, slug } = router.query as { track?: string; slug?: string };

  const pathId = useMemo(() => mapTrackToPathId(trackParam), [trackParam]);

  const { currentUser } = useAuth();
  const { get: getProgress, set: setProgress } = useProgress(currentUser?.email ?? undefined);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courses, setCourses] = useState<Lesson[]>([]);
  const [loadingLesson, setLoadingLesson] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progressState, setProgressState] = useState<ProgressShape>(DEFAULT_PROGRESS);
  const [error, setError] = useState<string | null>(null);

  // Load the lesson by slug
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoadingLesson(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchJson<{ lesson: Lesson }>(`/api/training/${encodeURIComponent(slug)}`);
        if (!cancelled) setLesson(data.lesson ?? null);
      } catch (e: any) {
        if (!cancelled) {
          setLesson(null);
          setError("Could not load lesson.");
        }
      } finally {
        if (!cancelled) setLoadingLesson(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Load the course list for this track/path (to compute prev/next)
  useEffect(() => {
    if (!pathId) return;
    let cancelled = false;
    setLoadingList(true);

    (async () => {
      try {
        const data = await fetchJson<{ courses: Lesson[]; path?: any }>(
          `/api/training/courses?path=${encodeURIComponent(pathId)}`
        );
        if (!cancelled) setCourses(data.courses ?? []);
      } catch {
        if (!cancelled) setCourses([]);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathId]);

  // Load progress once we have a lesson
  useEffect(() => {
    if (!lesson) return; // guard until loaded
    let cancelled = false;

    (async () => {
      try {
        const raw = await getProgress();
        if (cancelled) return;
        const p = extractProgressShape(raw, lesson.id);
        setProgressState(p);
      } catch {
        if (!cancelled) setProgressState(DEFAULT_PROGRESS);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lesson, getProgress]);

  const currentIndex = useMemo(() => {
    if (!slug || courses.length === 0) return -1;
    const idx = courses.findIndex((c) => c.slug === slug || c.id === lesson?.id);
    return idx;
  }, [courses, lesson?.id, slug]);

  const prevSlug = currentIndex > 0 ? courses[currentIndex - 1]?.slug : null;
  const nextSlug =
    currentIndex >= 0 && currentIndex < courses.length - 1 ? courses[currentIndex + 1]?.slug : null;

  const prevHref = prevSlug ? `/learn/${trackParam}/${prevSlug}` : `/learn/${trackParam}`;
  const nextHref = nextSlug ? `/learn/${trackParam}/${nextSlug}` : `/learn/${trackParam}`;

  const handleComplete = async () => {
    if (!lesson) return; // guard
    try {
      setSaving(true);
      await setProgress(lesson.id, { status: "completed", percent: 100 });
      setProgressState({ status: "completed", percent: 100 });
      router.push(nextHref);
    } catch {
      // Keep user on the page; you can surface a toast/snackbar here
      setSaving(false);
    }
  };

  const title = lesson?.title ?? "Lesson";

  return (
    <>
      <Head>
        <title>{title} | Rewmo Training</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="min-h-[calc(100vh-5rem)] bg-[#003B49] text-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumbs */}
          <div className="mb-4 text-sm text-[#B6E7EB]">
            <Link href="/learn" className="hover:underline">
              Training
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/learn/${trackParam}`} className="hover:underline">
              {String(trackParam || "").toUpperCase()}
            </Link>
            {lesson && (
              <>
                <span className="mx-2">/</span>
                <span className="opacity-90">{lesson.title}</span>
              </>
            )}
          </div>

          {/* Status & Title */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#15C5C1]">
              {loadingLesson ? "Loading…" : title}
            </h1>

            {/* Simple progress pill */}
            <div className="rounded-full bg-black/20 px-3 py-1 text-sm">
              {progressState.status.replace("_", " ")} · {progressState.percent}%
            </div>
          </div>

          {/* Summary */}
          {lesson?.summary && (
            <p className="mb-6 text-[#B6E7EB]">{lesson.summary}</p>
          )}

          {/* Video (if provided) */}
          {lesson?.videoUrl && (
            <div className="mb-6 aspect-video w-full overflow-hidden rounded-xl border border-[#15C5C1]/40 bg-black/20">
              <iframe
                className="h-full w-full"
                src={lesson.videoUrl}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Content */}
          {!loadingLesson && !lesson && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-100">
              {error ?? "Lesson not found."}
            </div>
          )}

          {lesson?.content && (
            <div className="prose prose-invert max-w-none prose-headings:text-[#15C5C1] prose-a:text-[#FF6A00]">
              {/* If content is trusted HTML. Otherwise, render markdown via a renderer. */}
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>
          )}

          {/* Nav + Complete */}
          <div className="mt-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2">
              <Link
                href={prevHref}
                className="rounded-md border border-[#15C5C1]/40 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                ← {prevSlug ? "Previous Lesson" : "Back to Track"}
              </Link>
              {nextSlug && (
                <Link
                  href={nextHref}
                  className="rounded-md border border-[#15C5C1]/40 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                >
                  Next Lesson →
                </Link>
              )}
            </div>

            <button
              onClick={handleComplete}
              disabled={!lesson || saving}
              className={`rounded-md bg-[#FF6A00] px-5 py-2 text-sm font-semibold text-white transition ${
                !lesson || saving ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {saving ? "Saving…" : progressState.status === "completed" ? "Completed ✓" : "Mark complete & continue"}
            </button>
          </div>

          {/* Course index (optional quick jump) */}
          {!loadingList && courses.length > 0 && (
            <div className="mt-10 rounded-xl border border-[#15C5C1]/30 bg-white/5 p-4">
              <h2 className="mb-3 text-lg font-bold text-[#15C5C1]">Lessons in this track</h2>
              <ol className="grid gap-2 md:grid-cols-2">
                {courses.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/learn/${trackParam}/${c.slug}`}
                      className={`inline-block rounded px-2 py-1 text-sm hover:underline ${
                        c.slug === slug ? "font-semibold text-white" : "text-[#B6E7EB]"
                      }`}
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
