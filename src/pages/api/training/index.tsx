import Head from "next/head";
import Link from "next/link";
import { usePaths, useCoursesByPath } from "@/lib/useTraining";
import { useState } from "react";

export default function TrainingHome() {
  const { paths } = usePaths();
  const [active, setActive] = useState<string>("genai-foundations");
  const { path, courses, loading } = useCoursesByPath(active);

  return (
    <>
      <Head>
        <title>Training | RewmoAI</title>
      </Head>
      <div className="min-h-screen bg-[#003B49] text-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-black text-[#FF9151] mb-6">
            Training Paths
          </h1>

          <div className="flex flex-wrap gap-3 mb-8">
            {paths.map(p => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={`rounded-lg px-4 py-2 border ${
                  active === p.id
                    ? "bg-[#FF6B00] border-[#FF6B00]"
                    : "border-white/20 hover:bg-white/5"
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>

          {path && (
            <div className="mb-4 text-[#B6E7EB]">
              <h2 className="text-2xl font-bold text-white">{path.title}</h2>
              <p className="text-sm opacity-80">Microsoft Generative AI (link-out)</p>
            </div>
          )}

          {loading ? (
            <div className="text-[#B6E7EB]">Loading modules…</div>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {courses.map((c: any) => (
                <li key={c.id} className="rounded-xl border border-white/10 bg-[#072b33] p-5">
                  <div className="text-sm text-white/70 mb-1">Module {c.moduleNo}</div>
                  <h3 className="text-xl font-bold">{c.title}</h3>
                  <p className="text-[#B6E7EB] mt-2 line-clamp-2">{c.summary || "Curated Microsoft Learn module"}</p>
                  <div className="mt-4 flex gap-3">
                    <Link
                      className="inline-flex items-center rounded-lg bg-[#FF6B00] px-4 py-2 text-sm font-bold text-white hover:bg-[#ff7d22]"
                      href={`/training/${encodeURIComponent(c.id)}`}
                    >
                      Open Module
                    </Link>
                    <a
                      className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Microsoft Page ↗
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
