import React, { useState } from "react";

const slides = [
  {
    key: "cover",
    content: (
      <div className="w-full max-w-xl bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-10 text-center">
        <img
          src="/rewmo-logo.png"
          alt="RewmoAI Logo"
          className="mx-auto mb-6"
          style={{ height: 64, width: "auto" }}
        />
        <h1 className="text-4xl font-black mb-4 text-[#FF9151]">RewmoAI Process Management</h1>
        <h2 className="text-2xl font-semibold mb-3 text-[#15C5C1]">Unlocking Quality in Everything You Do</h2>
        <p className="text-[#B6E7EB] text-lg">
          A practical, AI-powered guide to continuous improvement for life and business
        </p>
      </div>
    ),
  },
  {
    key: "table",
    content: (
      <div className="w-full max-w-xl bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-8">
        <div className="flex items-center mb-4">
          <img
            src="/rewmo-logo.png"
            alt="RewmoAI Logo"
            style={{ height: 32, width: "auto", marginRight: 12 }}
          />
          <h2 className="text-2xl font-bold text-[#FF9151] text-left">Inspection vs. Process Improvement</h2>
        </div>
        <div className="grid grid-cols-2 gap-0 bg-[#003B49] rounded-xl overflow-hidden border border-[#15C5C1]">
          <div className="py-3 px-4 text-[#15C5C1] font-bold text-center bg-[#003B49] border-r border-[#15C5C1]">
            Inspection
          </div>
          <div className="py-3 px-4 text-[#15C5C1] font-bold text-center bg-[#003B49]">
            Process Improvement
          </div>
          <div className="py-3 px-4 text-[#B6E7EB] border-t border-[#15C5C1] border-r border-[#15C5C1]">
            Check results after the fact
          </div>
          <div className="py-3 px-4 text-[#B6E7EB] border-t border-[#15C5C1]">
            Fix the process at the source
          </div>
          <div className="py-3 px-4 text-[#B6E7EB] border-t border-[#15C5C1] border-r border-[#15C5C1]">
            Finds mistakes late
          </div>
          <div className="py-3 px-4 text-[#B6E7EB] border-t border-[#15C5C1]">
            Prevents mistakes early
          </div>
          <div className="py-3 px-4 text-[#B6E7EB] border-t border-[#15C5C1] border-r border-[#15C5C1]">
            Costly, reactive
          </div>
          <div className="py-3 px-4 text-[#B6E7EB] border-t border-[#15C5C1]">
            Proactive, saves time/money
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "quiz",
    content: (
      <div className="w-full max-w-xl bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-8">
        <div className="flex items-center mb-4">
          <img
            src="/rewmo-logo.png"
            alt="RewmoAI Logo"
            style={{ height: 32, width: "auto", marginRight: 12 }}
          />
          <h2 className="text-2xl font-bold text-[#15C5C1] text-left">Mini-Quiz / Reflection</h2>
        </div>
        <div className="bg-[#ff915114] rounded-xl p-5 mb-4 text-[#FF9151]">
          <ol className="list-decimal pl-6 space-y-2 text-[#B6E7EB]">
            <li>What does “quality” mean for your business or personal finances?</li>
            <li>Name one process you want to improve this month.</li>
            <li>How could RewmoAI help automate or track that process?</li>
          </ol>
        </div>
      </div>
    ),
  },
];

export default function SlideDemo() {
  const [index, setIndex] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#003B49] font-sans p-8">
      {slides[index].content}
      <div className="flex space-x-3 mt-8">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="rounded-xl px-6 py-2 font-bold bg-[#15C5C1] text-[#003B49] hover:bg-[#FFA36C] transition disabled:opacity-40"
          disabled={index === 0}
        >
          Back
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(slides.length - 1, i + 1))}
          className="rounded-xl px-6 py-2 font-bold bg-[#FF9151] text-[#003B49] hover:bg-[#FFA36C] transition disabled:opacity-40"
          disabled={index === slides.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
