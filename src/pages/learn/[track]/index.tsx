import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/lib/AuthProvider";
import { useCoursesByPath, useProgress } from "@/lib/useTraining";

type ProgressMap = Record<
  string,
  { percent?: number; status?: string } | undefined
>;

const TRACK_LABEL: Record<string, string> = {
  genai: "GenAI",
  tqm: "TQM",
};

export default function TrackPage() {
  const router = useRouter();
  const track = (router.query.track as string) || "";

  const title = TRACK_LABEL[track?.toLowerCase?.()] ?? "Training";

  const { currentUser } = useAuth();

  // 1) fetch courses for this track (uses your /api/training/courses?path=...)
  const { path, courses = [], loading } = useCoursesByPath(track);

  // 2) pull progress when signed in
  const { get } = useProgress(currentUser?.email ?? undefined);
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!currentUser) {
        setProgress({});
        return;
      }
      try {
        const p = await get(); // expecting an object; we’ll defensively map it
        if (!cancelled) {
          const map: ProgressMap =
            p?.progress && typeof p.progress === "object" ? p.progress : {};
          setProgress(map);
        }
      } catch (_e) {
        if (!cancelled) setProgress({});
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const breadcrumb = useMemo(
    () => [
      { label: "Training", href: "/learn" },
      { label: title, href: `/learn/${track}` },
    ],
    [title, track]
  );

  return (
    <>
      <Head>
        <title>{title} Training | Rewmo</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>

      <div className="min-h-screen bg-[#003B49]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-white/60 text-sm">
            <ol className="flex items-center gap-1">
              {breadcrumb.map((b, idx) => (
                <li key={b.href} className="flex items-center">
                  {idx > 0 && <span className="px-1">/</span>}
                  <Link
                    href={b.href}
                    className="hover:text-white transition-colors"
                  >
                    {b.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          {/* Header */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">
                {title}
              </h1>
              <p className="text-white/80 mt-2 max-w-2xl">
                {path?.description ??
                  (title === "GenAI"
                    ? "Plan, prompt, and prototype with modern AI tools."
                    : title === "TQM"
                    ? "Total Quality Management—practical tools to reduce waste and improve processes."
                    : "Short, practical modules.")}
              </p>
            </div>

            {!currentUser ? (
              <Link
                href={`/signin?redirect=/learn/${encodeURIComponent(track)}`}
                className="inline-flex items-center rounded-lg bg-[#FF6A00] px-4 py-2 text-white font-semibold hover:opacity-90"
              >
                Sign in to track progress
              </Link>
            ) : (
              <div className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-white">
                <span className="text-sm">
                  Signed in as <strong>{currentUser.email}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Courses / Lessons */}
          <div className="mt-10">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 rounded-2xl border border-white/10 bg-[#043846] animate-pulse"
                  />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#043846] p-6 text-white/80">
                No lessons found for this track yet.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((c: any) => {
                  const slug = c?.slug || c?.id || "";
                  const href = `/learn/${encodeURIComponent(
                    track
                  )}/${encodeURIComponent(slug)}`;

                  const p = progress?.[c?.id || c?.slug || ""] || {};
                  const percent =
                    typeof p?.percent === "number" && p.percent >= 0
                      ? Math.min(100, Math.max(0, Math.round(p.percent)))
                      : 0;
                  const status = p?.status || (percent >= 100 ? "done" : "");

                  return (
                    <Link
                      key={slug}
                      href={href}
                      className="group rounded-2xl border border-white/10 bg-[#043846] p-5 hover:bg-[#064256] transition flex flex-col"
                    >
                      <div className="text-white text-lg font-semibold">
                        {c?.title || "Untitled Lesson"}
                      </div>
                      <p className="text-white/70 mt-2 line-clamp-3">
                        {c?.summary || c?.description || " "}
                      </p>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                          <span>
                            {status === "done"
                              ? "Completed"
                              : percent > 0
                              ? `Progress: ${percent}%`
                              : "Not started"}
                          </span>
                          {c?.durationMins ? (
                            <span>{c.durationMins} min</span>
                          ) : null}
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#15C5C1] transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 text-[#15C5C1] font-semibold">
                        Open lesson →
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
