import Link from "next/link";

export default function TrainingTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-12">
      <div className="rounded-2xl border border-white/10 bg-[#043846] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-white text-2xl font-bold">Training</h2>
            <p className="text-white/80 mt-1">
              Hands-on learning: GenAI & TQM tracks with short modules.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/learn/genai"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-[#15C5C1] text-white font-semibold hover:opacity-90"
            >
              GenAI
            </Link>
            <Link
              href="/learn/tqm"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15"
            >
              TQM
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
