import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LeanLabPage() {
  // State to show/hide Module 1 content
  const [showModule1, setShowModule1] = useState(false);
  const [showModule2, setShowModule2] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans">
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

        {/* --- Button Grid --- */}
        <section className="w-full max-w-3xl flex flex-wrap justify-center gap-4 mb-8">
          {/* Deep Financial Research (OpenAI) */}
          <Link href="/deep-research" legacyBehavior>
            <a className="px-6 py-4 bg-[#FF9151] border-2 border-[#15C5C1] rounded-2xl text-[#003B49] font-bold text-lg shadow hover:bg-[#FFA36C] hover:text-[#003B49] transition">
              Deep Financial Research (OpenAI)
            </a>
          </Link>

          {/* Download Module 1 PDF */}
          <a
            href="/rewmoai-module-1.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 bg-[#15C5C1] border-2 border-[#15C5C1] rounded-2xl text-[#003B49] font-bold text-lg shadow hover:bg-[#072b33] hover:text-[#FF9151] transition text-center"
          >
            Download Module 1 PDF
          </a>

          {/* Module 1: Quality Approach */}
          <button
            className="px-6 py-4 bg-[#072b33] border-2 border-[#15C5C1] rounded-2xl text-[#15C5C1] font-bold text-lg shadow hover:bg-[#02404d] hover:text-[#FF9151] transition"
            onClick={() => setShowModule1((v) => !v)}
          >
            {showModule1 ? "Hide" : "Show"} Module 1: Quality Approach
          </button>

          {/* Module 2: Coming Soon */}
          <button
            className="px-6 py-4 bg-[#072b33] border-2 border-[#FF9151] rounded-2xl text-[#FF9151] font-bold text-lg shadow hover:bg-[#02404d] hover:text-[#15C5C1] transition"
            onClick={() => setShowModule2((v) => !v)}
          >
            {showModule2 ? "Hide" : "Show"} Module 2 & More
          </button>
        </section>

        {/* --- Module 1 Info --- */}
        {showModule1 && (
          <section className="w-full max-w-3xl mb-10">
            <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8">
              <h2 className="text-2xl font-bold mb-2 text-[#FF9151]">Module 1: RewmoAI Quality Approach</h2>
              <p className="text-lg text-[#15C5C1] mb-4 font-semibold">
                Total Quality Management for Individuals & Small Businesses
              </p>
              {/* ...Rest of Module 1 content, as before... */}
              {/* You can paste your detailed module content here, or remove if only using PDF */}
              <p className="text-[#B6E7EB] mb-2">
                For the full learning experience, download the PDF above.
              </p>
            </div>
          </section>
        )}

        {/* --- Module 2 Coming Soon --- */}
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
      </main>

      {/* --- Footer --- */}
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
