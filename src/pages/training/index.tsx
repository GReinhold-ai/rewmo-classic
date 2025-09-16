// src/pages/training/index.tsx
import Head from "next/head";
import Link from "next/link";

function ArrowRight() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function TrainingIndexPage() {
  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>Training — RewmoAI</title>
        <meta
          name="description"
          content="Hands-on learning tracks with short, focused modules. Learn GenAI, R-Process Management, and Finance basics."
        />
      </Head>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-[#FF9151]">Training</h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Hands-on learning tracks with short modules. Build practical skills and unlock more
            rewards by leveling up your processes.
          </p>
        </header>

        {/* Track grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* RPM / TQM Module 1 (NEW) */}
          <Link
            href="/learn/rpm"
            className="group block rounded-2xl border border-[#15C5C1]/40 bg-white/[0.05] p-5 hover:bg-white/[0.08] transition"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[#15C5C1]/20 px-2 py-0.5 text-xs font-semibold text-[#15C5C1]">
                NEW
              </span>
              <span className="text-xs text-white/70">Updated deck</span>
            </div>
            <h2 className="text-lg font-bold text-teal-300">
              R-Process Management — Module 1
            </h2>
            <p className="mt-1 text-sm text-white/80">
              Foundations: define workflows, focus on customers, fix problems, then automate. Includes
              the latest slide deck.
            </p>

            <ul className="mt-3 space-y-1 text-sm text-white/80">
              <li>• What a workflow is (and isn’t)</li>
              <li>• Customers define quality</li>
              <li>• Inspection vs. improvement</li>
              <li>• Quality chain reaction</li>
            </ul>

            <div className="mt-4 inline-flex items-center gap-2 text-[#FF9151] font-semibold">
              Open module <ArrowRight />
            </div>
          </Link>

          {/* GenAI */}
          <Link
            href="/learn/genai"
            className="group block rounded-2xl border border-white/10 bg-white/[0.05] p-5 hover:bg-white/[0.08] transition"
          >
            <h2 className="text-lg font-bold text-teal-300">GenAI Quickstart</h2>
            <p className="mt-1 text-sm text-white/80">
              Practical prompts, patterns, and guardrails. Ship value with small, safe experiments.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-white/80">
              <li>• Prompt patterns that work</li>
              <li>• Safety + review loops</li>
              <li>• Measuring usefulness</li>
            </ul>
            <div className="mt-4 inline-flex items-center gap-2 text-[#FF9151] font-semibold">
              Open module <ArrowRight />
            </div>
          </Link>

          {/* Finance */}
          <Link
            href="/learn/finance"
            className="group block rounded-2xl border border-white/10 bg-white/[0.05] p-5 hover:bg-white/[0.08] transition"
          >
            <h2 className="text-lg font-bold text-teal-300">Finance Mini-Courses</h2>
            <p className="mt-1 text-sm text-white/80">
              Cash flow, budgeting, and simple models that help decisions—not paperwork.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-white/80">
              <li>• Personal + small-biz cash flow</li>
              <li>• Budgeting that sticks</li>
              <li>• “Is it worth it?” mini-models</li>
            </ul>
            <div className="mt-4 inline-flex items-center gap-2 text-[#FF9151] font-semibold">
              Open module <ArrowRight />
            </div>
          </Link>

          {/* (Optional) Coming soon slot */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-bold text-teal-300">Business Rewards Playbook</h2>
            <p className="mt-1 text-sm text-white/80">
              Bulk purchasing, travel, and expense optimization. Turn routine spend into compounding
              value.
            </p>
            <span className="mt-4 inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
              Coming soon
            </span>
          </div>
        </section>

        {/* Footer nav */}
        <div className="mt-10 text-sm text-white/70">
          <Link href="/" className="underline hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
