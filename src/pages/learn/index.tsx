import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";

export default function LearnHub() {
  const { currentUser } = useAuth();

  return (
    <>
      <Head>
        <title>Training | Rewmo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <div className="min-h-screen bg-[#003B49]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          <h1 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">
            Training
          </h1>
          <p className="text-white/80 mt-2 max-w-2xl">
            Learn practical skills with short, focused modules. Start a track, or continue where you left off.
          </p>

          {currentUser ? (
            <div className="mt-6">
              <div className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-white">
                <span className="text-sm">
                  Signed in as <strong>{currentUser.email}</strong>
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <Link
                href="/signin?redirect=/learn"
                className="inline-flex items-center rounded-lg bg-[#FF6A00] px-4 py-2 text-white font-semibold hover:opacity-90"
              >
                Sign in to track progress
              </Link>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            {/* GenAI card */}
            <Link
              href="/learn/genai"
              className="rounded-2xl border border-white/10 bg-[#043846] p-6 hover:bg-[#064256] transition"
            >
              <div className="text-white text-xl font-semibold">GenAI</div>
              <p className="text-white/80 mt-2">
                Learn how to plan, prompt, and prototype with modern AI tools.
              </p>
              <div className="mt-4 inline-flex items-center text-[#15C5C1] font-semibold">
                Start learning →
              </div>
            </Link>

            {/* TQM card */}
            <Link
              href="/learn/tqm"
              className="rounded-2xl border border-white/10 bg-[#043846] p-6 hover:bg-[#064256] transition"
            >
              <div className="text-white text-xl font-semibold">TQM</div>
              <p className="text-white/80 mt-2">
                Total Quality Management: practical tools to reduce waste and improve processes.
              </p>
              <div className="mt-4 inline-flex items-center text-[#15C5C1] font-semibold">
                Explore the track →
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
