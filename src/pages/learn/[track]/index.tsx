import Head from "next/head";
import Link from "next/link";
import { usePaths } from "@/lib/useTraining";

const FALLBACK = [
  { id: "genai", title: "AI Training", blurb: "GenAI basics, prompts, apps" },
  { id: "tqm", title: "TQM Training", blurb: "Lean, Six Sigma, Kaizen" },
  { id: "finance", title: "Finance Training", blurb: "Modeling, valuation, risk" },
];

export default function LearnIndex() {
  const { paths, loading } = usePaths();

  const list = (paths?.length ? paths : FALLBACK).map((p: any) => ({
    id: p.id,
    title: p.title || p.id.toUpperCase(),
    blurb:
      p.blurb ||
      (p.id === "genai"
        ? "GenAI basics, prompts, apps"
        : p.id === "tqm"
        ? "Lean, Six Sigma, Kaizen"
        : p.id === "finance"
        ? "Modeling, valuation, risk"
        : "Training track"),
  }));

  return (
    <>
      <Head>
        <title>Learn | Rewmo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="mx-auto max-w-6xl px-4 py-8 text-slate-100">
        <h1 className="text-3xl font-bold">Training</h1>
        <p className="mt-2 text-slate-300">Pick a track to get started.</p>

        {loading && (
          <div className="mt-6 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
            Loading…
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {list.map((t) => (
            <Link
              key={t.id}
              href={`/learn/${t.id}`}
              className="block rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold">{t.title}</h3>
                {t.id === "finance" && (
                  <span className="text-[10px] uppercase tracking-wide rounded-full bg-emerald-600/20 border border-emerald-400/30 px-2 py-1">
                    new
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-300">{t.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
