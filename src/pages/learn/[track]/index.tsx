// src/pages/learn/index.tsx
import Head from "next/head";
import Link from "next/link";

const url = `/api/training/courses?path=${encodeURIComponent(track)}&source=local`;

export default function LearnIndex() {
  return (
    <>
      <Head>
        <title>Training | Rewmo</title>
      </Head>
      <div className="mx-auto max-w-6xl px-4 py-8 text-slate-100">
        <h1 className="text-3xl font-bold">Training</h1>
        <p className="mt-2 text-slate-300">Pick a track to get started.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { id: "genai", title: "AI Training", blurb: "Short, practical GenAI modules." },
            { id: "tqm", title: "TQM Training", blurb: "Process + quality basics." },
            { id: "finance", title: "Finance Training", blurb: "Personal & business finance." },
          ].map(t => (
            <Link
              key={t.id}
              href={`/learn/${t.id}`}
              className="rounded-xl border border-white/10 bg-slate-800/50 p-4 hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t.title}</h3>
                <span className="text-xs rounded-full bg-slate-700/70 px-2 py-1">track</span>
              </div>
              <p className="mt-2 text-slate-300">{t.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
