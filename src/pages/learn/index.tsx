// src/pages/learn/index.tsx
import Head from "next/head";
import Link from "next/link";

type Track = {
  id: "genai" | "tqm" | "finance";
  title: string;
  blurb: string;
  cta: string;
};

const TRACKS: Track[] = [
  {
    id: "genai",
    title: "GenAI",
    blurb:
      "Learn how to plan, prompt, and prototype with modern AI tools.",
    cta: "Start learning →",
  },
  {
    id: "tqm",
    title: "TQM",
    blurb:
      "Practical Total Quality Management tools to reduce waste and improve processes.",
    cta: "Explore the track →",
  },
  {
    id: "finance",
    title: "Finance",
    blurb:
      "Personal finance, investing fundamentals, and valuation basics.",
    cta: "Build money skills →",
  },
];

export default function LearnIndex() {
  return (
    <>
      <Head>
        <title>Training | Rewmo</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>

      <div className="mx-auto max-w-6xl px-4 py-8 text-slate-100">
        <h1 className="text-3xl font-bold">Training</h1>
        <p className="mt-2 text-slate-300">
          Learn practical skills with short, focused modules. Pick a track, or
          continue where you left off.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {TRACKS.map((t) => (
            <Link
              key={t.id}
              href={`/learn/${t.id}`}
              className="rounded-xl border border-white/10 bg-slate-800/50 p-4 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="mt-2 text-slate-300">{t.blurb}</p>
              <span className="mt-3 inline-block text-sm text-teal-300">
                {t.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
