import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { useProgress } from "@/lib/useTraining";

type Course = {
  id: string;
  slug?: string;
  title: string;
  summary?: string;
  description?: string;
  kind?: string;          // "lesson" | "document" | ...
  href?: string;          // external or static resource
  order?: number;
  content?: string;       // optional inline lesson content
};

type PathData = { id: string; title?: string } | null;

function storageKey(courseId: string) {
  return `progress:${courseId}`;
}

function readLocalProgress(courseId: string) {
  try {
    const raw = localStorage.getItem(storageKey(courseId));
    if (!raw) return { percent: 0, status: "not_started" };
    const j = JSON.parse(raw);
    return {
      percent: typeof j.percent === "number" ? Math.max(0, Math.min(100, j.percent)) : 0,
      status: typeof j.status === "string" ? j.status : "not_started",
    };
  } catch {
    return { percent: 0, status: "not_started" };
  }
}

function writeLocalProgress(courseId: string, data: { percent?: number; status?: string }) {
  try {
    const prev = readLocalProgress(courseId);
    const merged = {
      percent: data.percent ?? prev.percent ?? 0,
      status: data.status ?? prev.status ?? "not_started",
    };
    localStorage.setItem(storageKey(courseId), JSON.stringify(merged));
  } catch {
    // ignore
  }
}

export default function LessonPage() {
  const router = useRouter();
  const track = typeof router.query.track === "string" ? router.query.track : "";
  const slugParam = typeof router.query.slug === "string" ? router.query.slug : "";
  const idParam = typeof router.query.id === "string" ? router.query.id : "";

  const { currentUser } = useAuth();
  const { get: getProgress, set: setProgress } = useProgress(currentUser?.email || undefined);

  const [pathInfo, setPathInfo] = useState<PathData>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all courses for the given track, then pick the requested lesson
  useEffect(() => {
    if (!track) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/training/courses?path=${encodeURIComponent(track)}`);
        const data = await res.json();
        if (cancelled) return;
        setPathInfo(data?.path ?? null);
        const arr: Course[] = Array.isArray(data?.courses) ? data.courses : [];
        // Stable sort by "order" then title
        arr.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999) || a.title.localeCompare(b.title));
        setCourses(arr);
      } catch {
        if (!cancelled) {
          setPathInfo(null);
          setCourses([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [track]);

  // Resolve the current lesson from slug or id
  const lesson: Course | null = useMemo(() => {
    if (!courses.length) return null;
    if (slugParam) {
      const bySlug = courses.find((c) => (c.slug || c.id) === slugParam);
      if (bySlug) return bySlug;
    }
    if (idParam) {
      const byId = courses.find((c) => c.id === idParam);
      if (byId) return byId;
    }
    // fallback to first
    return courses[0] ?? null;
  }, [courses, slugParam, idParam]);

  const currentIndex = useMemo(() => {
    if (!lesson) return -1;
    return courses.findIndex((c) => c.id === lesson.id);
  }, [courses, lesson]);

  const prevCourse = currentIndex > 0 ? courses[currentIndex - 1] : null;
  const nextCourse = currentIndex >= 0 && currentIndex < courses.length - 1 ? courses[currentIndex + 1] : null;

  // Local progress state for this lesson
  const [percent, setPercent] = useState<number>(0);
  const [status, setStatus] = useState<string>("not_started");
  const isComplete = status === "completed" || percent >= 100;

  // Sync progress: prefer Firestore if signed in; otherwise use localStorage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!lesson) return;
      // Start with local
      const local = readLocalProgress(lesson.id);
      if (!cancelled) {
        setPercent(local.percent);
        setStatus(local.status);
      }
      // If signed in, try server
      try {
        const raw = await getProgress();
        if (cancelled) return;
        // raw.progress is shape { [courseId]: {...} }
        const serverRec = raw?.progress?.[lesson.id];
        if (serverRec) {
          const p = typeof serverRec.percent === "number" ? serverRec.percent : local.percent;
          const s = typeof serverRec.status === "string" ? serverRec.status : local.status;
          setPercent(p);
          setStatus(s);
          // also refresh local
          writeLocalProgress(lesson.id, { percent: p, status: s });
        }
      } catch {
        // silently keep local
      }
    })();
    return () => { cancelled = true; };
  }, [lesson, getProgress]);

  const goToCourse = useCallback(
    (c: Course) => {
      const destSlug = c.slug || c.id;
      router.push({
        pathname: "/learn/[track]/[slug]",
        query: { track, slug: destSlug, id: c.id },
      });
    },
    [router, track]
  );

  const markComplete = useCallback(async () => {
    if (!lesson) return;
    // Update local immediately
    setPercent(100);
    setStatus("completed");
    writeLocalProgress(lesson.id, { percent: 100, status: "completed" });

    // Try Firestore if signed in
    try {
      await setProgress(lesson.id, { status: "completed", percent: 100 }, currentUser?.email || undefined);
    } catch {
      // ignore—local already updated
    }
  }, [lesson, currentUser?.email, setProgress]);

  const markCompleteAndNext = useCallback(async () => {
    await markComplete();
    if (nextCourse) goToCourse(nextCourse);
    else router.push(`/learn/${encodeURIComponent(track)}`);
  }, [markComplete, nextCourse, goToCourse, router, track]);

  // Render helpers for a resource lesson (PDF/link)
  function ResourceBlock({ href }: { href: string }) {
    const isPdf = /\.pdf(\b|#|\?)/i.test(href);
    return (
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-slate-200">
          Open the course material in a new tab, then come back and mark complete.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#FF9151] px-4 py-2 font-semibold text-white hover:brightness-110"
        >
          {isPdf ? "Open PDF" : "Open Resource"}
          <span aria-hidden>↗</span>
        </a>
      </div>
    );
  }

  const pageTitle = `${lesson?.title ?? "Lesson"} | ${pathInfo?.title ?? "Training"}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="mx-auto max-w-4xl px-4 py-8 text-slate-100">
        <div className="mb-6">
          <Link href={`/learn/${encodeURIComponent(track)}`} className="text-slate-300 hover:text-white">
            ← Back to {pathInfo?.title ?? "Training"}
          </Link>
        </div>

        {loading ? (
          <div className="rounded-xl bg-slate-800/60 px-4 py-3">Loading…</div>
        ) : !lesson ? (
          <div className="rounded-xl bg-slate-800/60 px-4 py-3">Lesson not found.</div>
        ) : (
          <>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            {lesson.summary && <p className="mt-2 text-slate-300">{lesson.summary}</p>}
            {lesson.description && <p className="mt-2 text-slate-400">{lesson.description}</p>}

            {/* Progress pill */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-3 py-1 text-sm">
              <span className="font-medium">{isComplete ? "Completed" : "In Progress"}</span>
              <span className="opacity-80">·</span>
              <span>{Math.round(percent)}%</span>
            </div>

            {/* Content or external resource */}
            {lesson.href ? (
              <ResourceBlock href={lesson.href} />
            ) : lesson.content ? (
              <div className="prose prose-invert mt-6">
                {/* If content is markdown in future, render via a MD component.
                   For now, display as simple paragraphs. */}
                <p>{lesson.content}</p>
              </div>
            ) : null}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {!isComplete && (
                <button
                  onClick={markCompleteAndNext}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#15C5C1] px-4 py-2 font-semibold text-[#003B49] hover:brightness-110"
                >
                  Mark complete & continue
                </button>
              )}
              {isComplete && nextCourse && (
                <button
                  onClick={() => goToCourse(nextCourse)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#FF9151] px-4 py-2 font-semibold text-white hover:brightness-110"
                >
                  Next: {nextCourse.title}
                </button>
              )}
            </div>

            {/* Prev / Next nav */}
            <div className="mt-10 flex items-center justify-between">
              <div>
                {prevCourse ? (
                  <button
                    onClick={() => goToCourse(prevCourse)}
                    className="text-slate-300 hover:text-white"
                  >
                    ← {prevCourse.title}
                  </button>
                ) : (
                  <span />
                )}
              </div>
              <div>
                {nextCourse ? (
                  <button
                    onClick={() => goToCourse(nextCourse)}
                    className="text-slate-300 hover:text-white"
                  >
                    {nextCourse.title} →
                  </button>
                ) : (
                  <Link
                    href={`/learn/${encodeURIComponent(track)}`}
                    className="text-slate-300 hover:text-white"
                  >
                    Done — Back to track
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
