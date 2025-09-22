// src/pages/lean-lab.tsx
import React, { useState } from "react";
import Link from "next/link";

export default function LeanLabPage() {
  // UI state
  const [showModule1, setShowModule1] = useState(false);
  const [showModule2, setShowModule2] = useState(false);
  const [showTraining, setShowTraining] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans text-white">
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-black mb-7 text-[#FF9151] tracking-tight text-center">
          LeanAI Lab
        </h1>

        {/* Intro Box */}
        <section className="max-w-3xl mx-auto mb-8">
          <div className="bg-[#02404d] rounded-2xl px-8 py-6 shadow text-center border border-[#15C5C1]">
            <h2 className="text-2xl md:text-3xl font-black mb-3 text-[#15C5C1] tracking-tight">
              Intro to RewmoAI Process Management
            </h2>
            <p className="text-[#B6E7EB] text-lg mb-2">
              Whether you’re running a business, managing a household, or just trying to do more with less—how you{" "}
              <span className="text-[#FF9151] font-bold">manage your process</span> is the secret to bigger savings,
              less stress, and better results.
            </p>
            <p className="text-[#F7F6F2] text-base mb-3">
              <span className="text-[#FF9151] font-bold">LeanAI Lab</span> makes world-class process improvement
              simple, visual, and accessible for everyone. Our AI-driven tools help you map routines, spot waste, and
              unlock continuous improvement—so you can focus on what matters most.
            </p>
            <p className="text-[#B6E7EB] text-base mt-4">
              <span className="font-semibold text-[#15C5C1]">Ready to get started?</span> Jump into the resources
              below!
            </p>
          </div>
        </section>

        {/* Button Grid */}
        <section className="w-full max-w-3xl flex flex-wrap justify-center gap-4 mb-8">
          {/* Deep Financial Research (OpenAI) */}
          <Link href="/deep-research" className="px-6 py-4 bg-[#FF9151] border-2 border-[#15C5C1] rounded-2xl text-[#003B49] font-bold text-lg shadow hover:bg-[#FFA36C] hover:text-[#003B49] transition">
            Deep Financial Research (OpenAI)
          </Link>

          {/* Premium module CTA (Unlock / Download lives at /leanai/fundamentals) */}
          <Link
            href="/leanai/fundamentals"
            className="px-6 py-4 bg-[#15C5C1] border-2 border-[#15C5C1] rounded-2xl text-[#003B49] font-bold text-lg shadow hover:bg-[#072b33] hover:text-[#FF9151] transition text-center"
          >
            R-PM Fundamentals — Unlock / Download
          </Link>

          {/* Module 1: Quality Approach (free section toggle) */}
          <button
            className="px-6 py-4 bg-[#072b33] border-2 border-[#15C5C1] rounded-2xl text-[#15C5C1] font-bold text-lg shadow hover:bg-[#02404d] hover:text-[#FF9151] transition"
            onClick={() => setShowModule1((v) => !v)}
          >
            {showModule1 ? "Hide" : "Show"} Module 1: Quality Approach
          </button>

          {/* Module 2: Coming Soon (toggle) */}
          <button
            className="px-6 py-4 bg-[#072b33] border-2 border-[#FF9151] rounded-2xl text-[#FF9151] font-bold text-lg shadow hover:bg-[#02404d] hover:text-[#15C5C1] transition"
            onClick={() => setShowModule2((v) => !v)}
          >
            {showModule2 ? "Hide" : "Show"} Module 2 & More
          </button>

          {/* AI Training Modal button */}
          <button
            className="px-6 py-4 bg-gradient-to-r from-[#15C5C1] to-[#FF9151] border-2 border-[#FF9151] rounded-2xl text-[#003B49] font-bold text-lg shadow hover:opacity-90 transition"
            onClick={() => setShowTraining(true)}
          >
            🚀 AI Training Module
          </button>
        </section>

        {/* Module 1 Info (free teaser section) */}
        {showModule1 && (
          <section className="w-full max-w-3xl mb-10">
            <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8">
              <h2 className="text-2xl font-bold mb-2 text-[#FF9151]">
                Module 1: RewmoAI Quality Approach
              </h2>
              <p className="text-lg text-[#15C5C1] mb-4 font-semibold">
                Total Quality Management for Individuals & Small Businesses
              </p>
              <p className="text-[#B6E7EB] mb-2">
                Explore the mindset and core language of R-PM. Learn how workflows connect to the
                QUALITIES customers value—speed, reliability, affordability, ease of use, safety, trust.
              </p>
              <p className="text-[#B6E7EB]">
                Want the full deck and updates? Use the{" "}
                <Link href="/leanai/fundamentals" className="underline text-[#FF9151]">
                  R-PM Fundamentals — Unlock / Download
                </Link>{" "}
                page to purchase and download the premium PPTX.
              </p>
            </div>
          </section>
        )}

        {/* Module 2 Coming Soon */}
        {showModule2 && (
          <section className="w-full max-w-3xl mb-10">
            <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#FF9151] px-8 py-8 text-center">
              <h2 className="text-2xl font-bold mb-2 text-[#FFA36C]">Coming Soon</h2>
              <ul className="text-[#B6E7EB] text-lg font-semibold mt-4 space-y-3">
                <li>Module 2 – Quality Improvement Teams</li>
                <li>Module 3 – System of Profound Knowledge</li>
                <li>Module 4 – The Fourteen Points</li>
                <li>Module 5 – Basic Process Improvement Tools</li>
              </ul>
            </div>
          </section>
        )}

        {/* AI Training Module Modal */}
        {showTraining && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#003B49] border-4 border-[#FF9151] rounded-2xl p-8 max-w-xl w-full text-center shadow-2xl relative">
              <button
                className="absolute top-4 right-4 text-[#FF9151] text-2xl font-bold"
                onClick={() => setShowTraining(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-2xl font-black mb-3 text-[#FF9151] tracking-tight">
                🚀 AI Training Lab (Beta)
              </h2>
              <p className="text-[#B6E7EB] mb-3">
                Welcome to the RewmoAI Training Lab! Build AI literacy with a smart coach—practice tasks, take quizzes,
                and track progress as you level up.
              </p>
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-[#15C5C1] rounded-full text-[#003B49] font-bold text-lg mb-2">
                  Progress: <span className="font-mono">0%</span>
                </span>
              </div>
              <p className="text-[#F7F6F2] text-sm mb-6">
                Features coming soon: real-time chat, badges, streaks, and personalized learning paths.
              </p>
              <button
                className="px-6 py-2 rounded-lg bg-[#FF9151] font-bold text-[#003B49] hover:bg-[#FFA36C] transition"
                onClick={() => setShowTraining(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] bg-[#003B49]">
        <span>
          © {new Date().getFullYear()} RewmoAI |{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-[#FFA36C] text-[#FF9151]">
            Affiliate Disclosure
          </Link>{" "}
          |{" "}
          <Link href="/privacy" className="underline hover:text-[#FFA36C] text-[#FF9151]">
            Privacy
          </Link>{" "}
          |{" "}
          <Link href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">
            Terms
          </Link>
        </span>
      </footer>
    </div>
  );
}
