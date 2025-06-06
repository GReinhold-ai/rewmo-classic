import React from "react";

export default function RewmoAIMiniQuizSlide() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#003B49] font-sans p-8">
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
    </div>
  );
}
