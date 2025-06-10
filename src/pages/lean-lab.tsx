import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const individualProcesses = [
  "Automated Bill Pay & Budgeting",
  "Meal Planning & Grocery Shopping (with Amazon Fresh)",
  "Subscription Review & Cancellation",
  "Automated Savings & Investing",
  "Energy Use & Utility Optimization",
  "Travel/Commute Cost Reduction",
];

const businessProcesses = [
  "Automated Expense Tracking",
  "Vendor & Supply Management (Amazon Business, Office Depot)",
  "Subscription & SaaS Audit",
  "Payroll & Contractor Automation",
  "Client Billing/Receivables Process",
  "Inventory Replenishment/Stock Control",
];

export default function LeanLabPage() {
  const [showQuality, setShowQuality] = useState(false);
  const [showIndividual, setShowIndividual] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans">
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-black mb-7 text-[#FF9151] tracking-tight text-center">
          LeanAI Lab
        </h1>

        {/* Intro */}
        <section className="max-w-3xl mx-auto mb-8">
          <div className="bg-[#02404d] rounded-2xl px-8 py-6 shadow text-center border border-[#15C5C1]">
            <h2 className="text-2xl md:text-3xl font-black mb-3 text-[#15C5C1] tracking-tight">
              Intro to RewmoAI Process Management
            </h2>
            <p className="text-[#B6E7EB] text-lg mb-2">
              Whether you’re running a business, managing a household, or just trying to do more with less—how you <span className="text-[#FF9151] font-bold">manage your process</span> is the secret to bigger savings, less stress, and better results.
            </p>
            <p className="text-[#F7F6F2] text-base mb-3">
              <span className="text-[#FF9151] font-bold">LeanAI Lab</span> makes world-class process improvement simple, visual, and accessible for everyone. Our AI-driven tools help you map out routines, spot waste, and unlock continuous improvement—so you can focus on what matters most.
            </p>
            <p className="text-[#B6E7EB] text-base mt-4">
              <span className="font-semibold text-[#15C5C1]">Ready to get started?</span> Jump into the resources below!
            </p>
          </div>
        </section>

        {/* --- Interactive Button Grid --- */}
        <section className="w-full max-w-3xl flex flex-wrap justify-center gap-4 mb-8">
          {/* Quality Approach Module */}
          <button
            className="px-6 py-4 bg-[#072b33] border-2 border-[#15C5C1] rounded-2xl text-[#15C5C1] font-bold text-lg shadow hover:bg-[#02404d] hover:text-[#FF9151] transition"
            onClick={() => setShowQuality((v) => !v)}
          >
            {showQuality ? "Hide" : "Show"} Quality Approach Module
          </button>

          {/* Deep Financial Research (OpenAI) */}
          <a
            className="px-6 py-4 bg-[#15C5C1] border-2 border-[#072b33] rounded-2xl text-[#003B49] font-bold text-lg shadow hover:bg-[#FF9151] hover:text-[#003B49] transition"
            href="https://chat.openai.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deep Financial Research (OpenAI)
          </a>

          {/* Individual/Family Process Improvement */}
          <button
            className="px-6 py-4 bg-[#072b33] border-2 border-[#15C5C1] rounded-2xl text-[#15C5C1] font-bold text-lg shadow hover:bg-[#02404d] hover:text-[#FF9151] transition"
            onClick={() => setShowIndividual((v) => !v)}
          >
            {showIndividual ? "Hide" : "Show"} Individual/Family Process Ideas
          </button>

          {/* Small Business Process Improvement */}
          <button
            className="px-6 py-4 bg-[#072b33] border-2 border-[#15C5C1] rounded-2xl text-[#15C5C1] font-bold text-lg shadow hover:bg-[#02404d] hover:text-[#FF9151] transition"
            onClick={() => setShowBusiness((v) => !v)}
          >
            {showBusiness ? "Hide" : "Show"} Small Business Process Ideas
          </button>
        </section>

        {/* --- Show/Hide Sections --- */}
        {showQuality && (
          <section className="w-full max-w-3xl mb-10">
  <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8">
    <h2 className="text-2xl font-bold mb-2 text-[#FF9151]">
      Module 1: RewmoAI Quality Approach
    </h2>
    <p className="text-lg text-[#15C5C1] mb-4 font-semibold">
      Total Quality Management for Individuals & Small Businesses
    </p>
    <ul className="list-disc pl-5 text-[#B6E7EB] mb-4">
      <li>Quality isn’t just about the end result—it’s about improving how you do things.</li>
      <li>Your customer (or you) decides what “quality” really means.</li>
      <li>Focus first on your most critical processes.</li>
      <li>Prevention is better (and cheaper) than fixing mistakes later.</li>
      <li>RewmoAI is your partner in automating and improving quality in business and life.</li>
    </ul>
    <a
      href="/rewmoai-module-1.pptx"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold px-5 py-2 rounded-lg mt-3 transition"
      download
    >
      View Full Module &rarr;
    </a>
  </div>
</section>

        )}

        {showIndividual && (
          <section className="w-full max-w-3xl mb-8">
            <div className="bg-[#02404d] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8">
              <h2 className="text-2xl font-bold text-[#FF9151] mb-4">Individual & Family Process Improvements</h2>
              <ul className="list-disc pl-6 text-[#B6E7EB] text-lg space-y-2">
                {individualProcesses.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className="mt-3 text-[#15C5C1] text-sm">
                <b>Tip:</b> Select one area each month and let RewmoAI track your progress!
              </div>
            </div>
          </section>
        )}

        {showBusiness && (
          <section className="w-full max-w-3xl mb-8">
            <div className="bg-[#02404d] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8">
              <h2 className="text-2xl font-bold text-[#FF9151] mb-4">Small Business Process Improvements</h2>
              <ul className="list-disc pl-6 text-[#B6E7EB] text-lg space-y-2">
                {businessProcesses.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className="mt-3 text-[#15C5C1] text-sm">
                <b>Tip:</b> Start with recurring expenses—small wins add up fast!
              </div>
            </div>
          </section>
        )}

        {/* MODULE 2: Placeholder */}
        <section className="w-full max-w-3xl mb-10">
          <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#FFA36C] mb-2">Module 2: Intro to Tool Flow Charting</h2>
              <p className="text-lg text-[#B6E7EB]">
                Coming Soon: Learn how to map and measure your most important processes, then optimize them with RewmoAI’s visual tools.
              </p>
            </div>
            <div>
              <Image src="/icons/flowchart.svg" alt="Flowcharting" width={50} height={50} />
            </div>
          </div>
        </section>
      </main>

      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] bg-[#003B49]">
        <span>
          © {new Date().getFullYear()} RewmoAI |{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-[#FFA36C] text-[#FF9151]">Affiliate Disclosure</Link> |{" "}
          <Link href="/privacy" className="underline hover:text-[#FFA36C] text-[#FF9151]">Privacy</Link> |{" "}
          <Link href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">Terms</Link>
        </span>
      </footer>
    </div>
  );
}
