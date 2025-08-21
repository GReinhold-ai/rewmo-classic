import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useProgress } from "@/lib/useTraining";
import { useState } from "react";

// TODO: wire this to your AuthProvider (get the signed-in user's email)
const DEMO_EMAIL = "test@example.com";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function TrainingModule() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";
  const { data } = useSWR(id ? `/api/training/courses?ids=${encodeURIComponent(id)}` : null, fetcher);
  const course = data?.courses?.[0];

  const api = useProgress(DEMO_EMAIL);
  const [updating, setUpdating] = useState(false);
  const [percent, setPercent] = useState(0);

  async function markComplete() {
    setUpdating(true);
    await api.set(course.id, { status: "completed", percent: 100 }, DEMO_EMAIL);
    setPercent(100);
    setUpdating(false);
  }

  async function saveProgress(v: number) {
    setUpdating(true);
    await api.set(course.id, { status: v >= 100 ? "completed" : "in_progress", percent: v }, DEMO_EMAIL);
    setPercent(v);
    setUpdating(false);
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#003B49] text-white flex items-center justify-center">
        Loading…
      </div>
    );
  }

  const link = new URL(course.url);
  link.searchParams.set("utm_source", "rewmoai");
  link.searchParams.set("utm_medium", "training");
  link.searchParams.set("utm_campaign", "microsoft-genai");

  return (
    <>
      <Head><title>{course.title} | Training</title></Head>
      <div className="min-h-screen bg-[#003B49] text-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <button onClick={() => router.back()} className="text-[#B6E7EB] mb-4 hover:text-white">← Back</button>
          <div className="rounded-2xl border border-white/10 bg-[#072b33] p-6">
            <div className="text-sm text-white/70 mb-1">Module {course.moduleNo}</div>
            <h1 className="text-2xl md:text-3xl font-black text-[#FF9151]">{course.title}</h1>
            <p className="mt-3 text-[#B6E7EB]">{course.summary || "Curated Microsoft Learn module."}</p>

            <div className="mt-6 flex gap-3">
              <a
                className="inline-flex items-center rounded-lg bg-[#FF6B00] px-4 py-2 text-sm font-bold text-white hover:bg-[#ff7d22]"
                href={link.toString()}
                target="_blank"
                rel="noreferrer"
              >
                Open Microsoft Module ↗
              </a>
              <button
                onClick={markComplete}
                disabled={updating}
                className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-60"
              >
                Mark Complete
              </button>
            </div>

            <div className="mt-6">
              <label className="text-sm block mb-2 text-[#B6E7EB]">Progress: {percent}%</label>
              <input
                type="range"
                min={0} max={100}
                value={percent}
                onChange={(e) => saveProgress(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6 text-[#B6E7EB] text-sm">
            Licensing note: This page links to Microsoft Learn content. We store metadata and your progress only.
          </div>
        </div>
      </div>
    </>
  );
}
