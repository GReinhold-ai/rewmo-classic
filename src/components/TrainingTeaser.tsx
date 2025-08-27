// src/components/TrainingTeaser.tsx
import Link from "next/link";

export default function TrainingTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-6">
      <div className="rounded-2xl border border-white/10 bg-[#043846] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Training</h2>
            <p className="mt-1 text-white/80">
              Hands-on learning tracks with short modules.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/learn/genai" className="inline-flex items-center rounded-lg bg-[#15C5C1] px-4 py-2 font-semibold text-white hover:opacity-90">
              GenAI
            </Link>
            <Link href="/learn/tqm" className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/15">
              TQM
            </Link>
            <Link href="/learn/finance" className="inline-flex items-center rounded-lg bg-amber-500/90 px-4 py-2 font-semibold text-white hover:bg-amber-400">
              Finance
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
