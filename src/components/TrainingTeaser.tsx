import Link from "next/link";

export default function TrainingTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-[#043846] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-white text-2xl font-bold">Training</h2>
            <p className="text-white/80 mt-1">
              Hands-on learning tracks with short, practical modules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* GenAI */}
            <Link
              href="/learn/genai"
              className="inline-flex items-center rounded-lg bg-[#15C5C1] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              GenAI
            </Link>

            {/* R-PM (formerly TQM) */}
            <Link
              href="/learn/rpm"
              className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              R-PM
            </Link>

            {/* Finance */}
            <Link
              href="/learn/finance"
              className="inline-flex items-center rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              Finance
            </Link>

            {/* All Training */}
            <Link
              href="/learn"
              className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#003B49] hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              All Training
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
