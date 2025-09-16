// src/pages/learn/rpm.tsx
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";

const FILE_PATH = "/training/rpm-module1-foundations.pptx";

type Q = {
  id: string;
  prompt: string;
  choices: string[];
  answer: number; // index into choices
};

const QUIZ: Q[] = [
  {
    id: "q1",
    prompt: "What is the best first step before automating with AI?",
    choices: [
      "Buy an AI tool",
      "Define & fix the workflow",
      "Hire more people",
      "Write a policy",
    ],
    answer: 1,
  },
  {
    id: "q2",
    prompt: "Who defines quality?",
    choices: ["The owner", "The loudest person", "The customer", "Finance"],
    answer: 2,
  },
  {
    id: "q3",
    prompt: "Inspection mostly finds defects after the fact. Improvement:",
    choices: [
      "Hopes errors go away",
      "Fixes the process so errors don’t occur",
      "Adds more approvals",
      "Isn’t measurable",
    ],
    answer: 1,
  },
  {
    id: "q4",
    prompt:
      "In the quality chain reaction, improving quality usually leads to:",
    choices: [
      "Higher costs and delays",
      "More rework",
      "Lower costs and faster delivery",
      "Fewer customers",
    ],
    answer: 2,
  },
  {
    id: "q5",
    prompt: "A workflow is:",
    choices: [
      "Any single task",
      "A series of steps that delivers value to a customer",
      "A job title",
      "A budget category",
    ],
    answer: 1,
  },
];

const BADGE_ID = "rpm_m1_bronze";
const BADGE_LOCAL_KEY = `badge_${BADGE_ID}`;

export default function RpmModule1Page() {
  const { currentUser } = useAuth();

  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const absoluteUrl = useMemo(() => (origin ? origin + FILE_PATH : ""), [origin]);

  // Only allow Office viewer when we have a public HTTPS origin (not localhost).
  const isHttps = absoluteUrl.startsWith("https://");
  const isLocal =
    absoluteUrl.includes("localhost") ||
    absoluteUrl.includes("127.0.0.1") ||
    absoluteUrl.includes("0.0.0.0");
  const canPreview = Boolean(absoluteUrl && isHttps && !isLocal);

  const officeEmbedUrl = useMemo(
    () =>
      canPreview
        ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            absoluteUrl
          )}`
        : "",
    [absoluteUrl, canPreview]
  );

  // ---- Log + Download handler ----
  const logAndDownload = async () => {
    try {
      const payload = { slug: "rpm-module1-foundations", path: FILE_PATH };
      const didBeacon =
        typeof navigator !== "undefined" &&
        typeof navigator.sendBeacon === "function" &&
        navigator.sendBeacon(
          "/api/track-download",
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        );
      if (!didBeacon) {
        await fetch("/api/track-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      }
    } catch {
      // ignore
    } finally {
      window.location.href = FILE_PATH;
    }
  };

  // ---- Quiz state ----
  const [answers, setAnswers] = useState<Record<string, number | null>>(
    Object.fromEntries(QUIZ.map((q) => [q.id, null]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [badgeEarned, setBadgeEarned] = useState<boolean>(false);
  const [claiming, setClaiming] = useState(false);
  const PASSING = 4;

  useEffect(() => {
    // show badge if previously earned (local or server-synced UI pattern)
    if (typeof window !== "undefined") {
      const v = localStorage.getItem(BADGE_LOCAL_KEY);
      if (v === "1") setBadgeEarned(true);
    }
  }, []);

  const choose = (qid: string, idx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const submitQuiz = () => {
    let s = 0;
    for (const q of QUIZ) {
      const a = answers[q.id];
      if (a === q.answer) s++;
    }
    setScore(s);
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setAnswers(Object.fromEntries(QUIZ.map((q) => [q.id, null])));
    setSubmitted(false);
    setScore(null);
  };

  const claimBadge = async () => {
    if (score === null || score < PASSING) return;
    setClaiming(true);
    try {
      // Save locally no matter what
      if (typeof window !== "undefined") {
        localStorage.setItem(BADGE_LOCAL_KEY, "1");
      }
      // If signed in, record to Firestore via API
      if (currentUser?.uid) {
        await fetch("/api/claim-badge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            badgeId: BADGE_ID,
            label: "Bronze R-Process Learner (Module 1)",
            uid: currentUser.uid,
          }),
        });
      }
      setBadgeEarned(true);
    } catch {
      // non-blocking; still show earned
      setBadgeEarned(true);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>R-Process Management — Module 1 (Foundations)</title>
        <meta
          name="description"
          content="Foundations of R-Process Management: define workflows, focus on customers, and improve processes before automating with AI."
        />
      </Head>

      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-[#FF9151]">
            R-Process Management — Module 1
          </h1>
          <p className="mt-2 text-[#B6E7EB]">
            Foundations: define workflows, fix them, then automate.
          </p>
        </div>

        {/* Deck Section */}
        <section className="rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="text-xl font-bold text-teal-300">Slide Deck</h2>
          <p className="mt-1 text-sm text-white/80">
            Download the latest Module 1 deck. Learn what a workflow is, why customers
            define quality, inspection vs. improvement, and the quality chain reaction.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={logAndDownload}
              className="inline-flex items-center rounded-lg bg-[#FF9151] px-4 py-2 font-bold text-[#003B49] hover:bg-[#FFA36C]"
            >
              Download PPTX
            </button>

            {canPreview ? (
              <a
                href={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                  absoluteUrl
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2 font-semibold hover:bg-white/10"
              >
                Open in Browser
              </a>
            ) : (
              <span className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80">
                Preview available on deployed HTTPS
              </span>
            )}
          </div>

          {canPreview ? (
            <div className="mt-6 rounded-xl overflow-hidden border border-white/10 bg-[#072b33]">
              <iframe
                title="Module 1 Deck Preview"
                src={officeEmbedUrl}
                className="w-full"
                style={{ height: 620, border: 0 }}
              />
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-white/10 bg-[#072b33] p-4 text-sm text-white/80">
              Inline preview is disabled in local development. Use <b>Download PPTX</b> above,
              or deploy the site to enable the online preview.
            </div>
          )}

          <ul className="mt-6 space-y-1 text-sm text-white/80">
            <li>• Define a workflow in your business</li>
            <li>• Customers—not owners—define quality</li>
            <li>• Identify one broken/unclear workflow</li>
            <li>• Inspection vs. improvement</li>
            <li>• The quality chain reaction</li>
          </ul>
        </section>

        {/* QUIZ */}
        <section className="mt-10 rounded-2xl border border-white/15 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[#FF9151]">Quick Check: Module 1 Quiz</h2>
            {badgeEarned && (
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-sm font-semibold text-amber-300">
                🥉 Bronze badge earned
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-white/80">
            Five questions. Score {4}/5 or better to earn the{" "}
            <b>🥉 Bronze R-Process Learner</b> badge.
          </p>

          <div className="mt-4 space-y-6">
            {QUIZ.map((q, qi) => {
              const userPick = answers[q.id];
              const showFeedback = submitted && userPick !== null;
              const isCorrect = userPick === q.answer;

              return (
                <div key={q.id} className="rounded-xl border border-white/10 bg-[#072b33] p-4">
                  <div className="font-semibold">{qi + 1}. {q.prompt}</div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {q.choices.map((choice, idx) => {
                      const chosen = userPick === idx;
                      const correctStyle =
                        submitted && idx === q.answer ? "ring-2 ring-emerald-400" : "";
                      const wrongStyle =
                        submitted && chosen && idx !== q.answer ? "ring-2 ring-red-400" : "";

                      return (
                        <button
                          key={idx}
                          onClick={() => choose(q.id, idx)}
                          className={`rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left hover:bg-white/10 transition ${chosen ? "outline outline-1 outline-white/30" : ""} ${correctStyle} ${wrongStyle}`}
                          disabled={submitted}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>

                  {showFeedback && (
                    <div className={`mt-2 text-sm ${isCorrect ? "text-emerald-300" : "text-red-300"}`}>
                      {isCorrect ? "Correct!" : "Not quite—review the deck and try again."}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Controls / Results */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {!submitted ? (
              <button
                onClick={submitQuiz}
                className="rounded-lg bg-[#FF9151] px-4 py-2 font-bold text-[#003B49] hover:bg-[#FFA36C]"
              >
                Submit Answers
              </button>
            ) : (
              <>
                <button
                  onClick={resetQuiz}
                  className="rounded-lg border border-white/20 px-4 py-2 font-semibold hover:bg-white/10"
                >
                  Try Again
                </button>

                {score !== null && (
                  <span className="ml-1 text-sm text-white/80">
                    Score: <b>{score}/{QUIZ.length}</b>
                  </span>
                )}

                {score !== null && score >= PASSING && !badgeEarned && (
                  <button
                    onClick={claimBadge}
                    disabled={claiming}
                    className="rounded-lg bg-amber-500 px-4 py-2 font-bold text-[#003B49] hover:bg-amber-400 disabled:opacity-60"
                  >
                    {claiming ? "Claiming…" : "Claim Bronze Badge"}
                  </button>
                )}
              </>
            )}
          </div>

          {badgeEarned && (
            <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🥉</div>
                <div>
                  <div className="font-bold text-amber-300">
                    Bronze R-Process Learner (Module 1)
                  </div>
                  <div className="text-sm text-white/80">
                    Nice work! Your badge is saved {currentUser ? "to your account" : "in your browser"}.
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Footer nav */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/training" className="underline text-[#15C5C1]">
            ← Back to Training
          </Link>
          <Link
            href="/lean-lab"
            className="inline-flex items-center rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            Explore Lean Lab
          </Link>
        </div>
      </div>
    </div>
  );
}
