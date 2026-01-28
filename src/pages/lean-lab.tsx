// src/pages/lean-lab.tsx
import React, { useState } from "react";
import Link from "next/link";

export default function LeanLabPage() {
  // UI state
  const [showModule1, setShowModule1] = useState(false);
  const [showModule2, setShowModule2] = useState(false);

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
              Whether you're running a business, managing a household, or just trying to do more with less—how you{" "}
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

          {/* Module 2 & More (toggle) */}
          <button
            className="px-6 py-4 bg-[#072b33] border-2 border-[#FF9151] rounded-2xl text-[#FF9151] font-bold text-lg shadow hover:bg-[#02404d] hover:text-[#15C5C1] transition"
            onClick={() => setShowModule2((v) => !v)}
          >
            {showModule2 ? "Hide" : "Show"} Modules 2–5
          </button>

          {/* AI Training - Direct Link (no modal) */}
          <Link
            href="/learn/genai"
            className="px-6 py-4 bg-gradient-to-r from-[#15C5C1] to-[#FF9151] border-2 border-[#FF9151] rounded-2xl text-[#003B49] font-bold text-lg shadow hover:opacity-90 transition"
          >
            🚀 AI Training Courses
          </Link>

          {/* Finance Training - NEW */}
          <Link
            href="/learn/finance"
            className="px-6 py-4 bg-[#072b33] border-2 border-[#15C5C1] rounded-2xl text-[#15C5C1] font-bold text-lg shadow hover:bg-[#02404d] hover:text-[#FF9151] transition"
          >
            💰 Finance Training
          </Link>

          {/* All Training Tracks */}
          <Link
            href="/training"
            className="px-6 py-4 bg-[#072b33] border-2 border-white/30 rounded-2xl text-white/80 font-bold text-lg shadow hover:bg-[#02404d] hover:text-[#FF9151] transition"
          >
            📚 All Training Tracks
          </Link>
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

        {/* Modules 2-5 */}
        {showModule2 && (
          <section className="w-full max-w-3xl mb-10 space-y-6">
            {/* Module 2: Quality Improvement Teams - AVAILABLE */}
            <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#15C5C1] text-[#003B49] text-xs font-bold px-3 py-1 rounded-full">NEW</span>
                <h2 className="text-2xl font-bold text-[#FF9151]">
                  Module 2: Quality Improvement Teams
                </h2>
              </div>
              <p className="text-lg text-[#15C5C1] mb-4 font-semibold">
                Team Structure for Continuous Improvement
              </p>
              <p className="text-[#B6E7EB] mb-4">
                Learn the roles and responsibilities of quality improvement teams. Understand the three-tier 
                structure (Leadership Council → QMB → PAT), support roles, and how even solo entrepreneurs 
                can apply these principles to systematically improve their processes.
              </p>
              <div className="text-[#B6E7EB] mb-4">
                <p className="font-semibold text-[#15C5C1] mb-2">What you'll learn:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Purpose and structure of quality improvement teams</li>
                  <li>Benefits of the team-based approach</li>
                  <li>Roles: Leadership Council, QMB, and Process Action Team</li>
                  <li>Support roles: Process Coordinator, Quality Advisor, Downward Link</li>
                  <li>How to apply team concepts as a solo entrepreneur</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/leanai/fundamentals"
                  className="inline-block px-5 py-2 bg-[#15C5C1] text-[#003B49] font-bold rounded-xl hover:bg-[#FF9151] transition"
                >
                  📥 Download Module 2
                </Link>
                <span className="text-[#B6E7EB] text-sm self-center">19 slides with discussion notes</span>
              </div>
            </div>

            {/* Module 3: System of Profound Knowledge - AVAILABLE */}
            <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#15C5C1] text-[#003B49] text-xs font-bold px-3 py-1 rounded-full">NEW</span>
                <h2 className="text-2xl font-bold text-[#FF9151]">
                  Module 3: System of Profound Knowledge
                </h2>
              </div>
              <p className="text-lg text-[#15C5C1] mb-4 font-semibold">
                Dr. Deming's Four Pillars for Transformation
              </p>
              <p className="text-[#B6E7EB] mb-4">
                Discover the theoretical foundation that makes lasting improvement possible. Learn how Systems Thinking, 
                Psychology, Variation, and Theory of Knowledge work together to transform how you see and improve 
                your processes.
              </p>
              <div className="text-[#B6E7EB] mb-4">
                <p className="font-semibold text-[#15C5C1] mb-2">What you'll learn:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Systems Thinking: See interconnections, not isolated parts</li>
                  <li>Psychology: Understand motivation and human behavior in processes</li>
                  <li>Variation: Distinguish common cause from special cause variation</li>
                  <li>Theory of Knowledge: Make predictions and learn from results</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/leanai/fundamentals"
                  className="inline-block px-5 py-2 bg-[#15C5C1] text-[#003B49] font-bold rounded-xl hover:bg-[#FF9151] transition"
                >
                  📥 Download Module 3
                </Link>
                <span className="text-[#B6E7EB] text-sm self-center">26 slides with discussion notes</span>
              </div>
            </div>

            {/* Module 4: The Fourteen Obligations - AVAILABLE */}
            <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#15C5C1] text-[#003B49] text-xs font-bold px-3 py-1 rounded-full">NEW</span>
                <h2 className="text-2xl font-bold text-[#FF9151]">
                  Module 4: The Fourteen Obligations
                </h2>
              </div>
              <p className="text-lg text-[#15C5C1] mb-4 font-semibold">
                Management Principles for Small Business Success
              </p>
              <p className="text-[#B6E7EB] mb-4">
                Deming's famous 14 Points, reimagined for individuals and small businesses. Learn practical 
                management obligations that drive quality, reduce waste, and build trust with customers.
              </p>
              <div className="text-[#B6E7EB] mb-4">
                <p className="font-semibold text-[#15C5C1] mb-2">What you'll learn:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Create constancy of purpose for improvement</li>
                  <li>Adopt a philosophy of continuous learning</li>
                  <li>Drive out fear and build trust</li>
                  <li>Break down barriers between areas</li>
                  <li>Institute training and self-improvement</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/leanai/fundamentals"
                  className="inline-block px-5 py-2 bg-[#15C5C1] text-[#003B49] font-bold rounded-xl hover:bg-[#FF9151] transition"
                >
                  📥 Download Module 4
                </Link>
                <span className="text-[#B6E7EB] text-sm self-center">23 slides with discussion notes</span>
              </div>
            </div>

            {/* Module 5: Process Improvement Tools - AVAILABLE */}
            <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-[#15C5C1] text-[#003B49] text-xs font-bold px-3 py-1 rounded-full">NEW</span>
                <h2 className="text-2xl font-bold text-[#FF9151]">
                  Module 5: Process Improvement Tools
                </h2>
              </div>
              <p className="text-lg text-[#15C5C1] mb-4 font-semibold">
                Hands-On Tools for the PDCA Cycle
              </p>
              <p className="text-[#B6E7EB] mb-4">
                Master the practical tools that bring process improvement to life. From flowcharts to control charts, 
                learn how to visualize, measure, analyze, and improve any process.
              </p>
              <div className="text-[#B6E7EB] mb-4">
                <p className="font-semibold text-[#15C5C1] mb-2">What you'll learn:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Flowcharts: Map and visualize your processes</li>
                  <li>Brainstorming & Affinity Diagrams: Generate and organize ideas</li>
                  <li>Pareto Charts: Focus on the vital few</li>
                  <li>Cause & Effect Diagrams: Find root causes</li>
                  <li>Control Charts: Monitor variation and stability</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/leanai/fundamentals"
                  className="inline-block px-5 py-2 bg-[#15C5C1] text-[#003B49] font-bold rounded-xl hover:bg-[#FF9151] transition"
                >
                  📥 Download Module 5
                </Link>
                <span className="text-[#B6E7EB] text-sm self-center">30 slides with discussion notes</span>
              </div>
            </div>
          </section>
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