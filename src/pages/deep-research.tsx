import React from "react";
import Link from "next/link";

const benchmarkProcesses = [
  {
    title: "Expense Analysis",
    prompt: "Analyze my past 6 months’ business expenses. Where can I save more? Give a breakdown by category."
  },
  {
    title: "Profitability Benchmarking",
    prompt: "Compare my business’s profit margins to industry averages for small retail stores."
  },
  {
    title: "Cash Flow Projection",
    prompt: "Help me create a 12-month cash flow projection based on last year’s income and expenses."
  },
  {
    title: "Personal Savings Rate",
    prompt: "Calculate my personal savings rate if I earn $5,000/month and save $800/month. How can I improve this?"
  },
  {
    title: "Debt Paydown Strategy",
    prompt: "Suggest an optimal plan for paying down these debts: $5,000 at 18%, $10,000 at 12%, $2,000 at 6%."
  }
];

export default function DeepResearchPage() {
  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col items-center px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-black text-[#15C5C1] mb-2">Deep Financial Research</h1>
      <p className="text-lg text-[#FF9151] mb-6 text-center font-bold">Use AI to analyze and improve your personal or business finances!</p>

      <div className="bg-[#072b33] border border-[#15C5C1] rounded-2xl shadow-lg p-6 max-w-2xl mb-8 w-full">
        <h2 className="text-2xl font-bold text-[#FF9151] mb-2">How to Use OpenAI (ChatGPT) for Financial Research</h2>
        <p className="text-[#B6E7EB] mb-4">
          <b>Step 1:</b> Choose a process below.<br/>
          <b>Step 2:</b> Click to copy a prompt and paste it into <a href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer" className="underline text-[#15C5C1]">ChatGPT</a> or any AI research tool.<br/>
          <b>Step 3:</b> Customize details and get smart, instant answers!
        </p>
        <div className="bg-[#15C5C114] rounded-lg p-4 mb-2 text-[#15C5C1] font-semibold">
          <span>Example Prompt:</span>
          <div className="bg-[#003B49] text-[#B6E7EB] rounded p-2 mt-2 font-mono text-sm">
            Analyze my monthly spending and recommend 3 ways I can save more money, based on current expenses.
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-[#072b33] border border-[#15C5C1] rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-[#FF9151] mb-3">Popular Benchmark Processes</h2>
        <ul className="space-y-4">
          {benchmarkProcesses.map(({ title, prompt }, idx) => (
            <li key={idx} className="bg-[#003B49] rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex-1">
                <span className="font-bold text-[#15C5C1]">{title}</span>
              </div>
              <button
                className="bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-semibold px-4 py-2 rounded-lg transition"
                onClick={() => navigator.clipboard.writeText(prompt)}
              >
                Copy Prompt
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Link href="/lean-lab" className="text-[#15C5C1] mt-8 underline font-semibold hover:text-[#FFA36C] text-base">
        ← Back to Lean Lab
      </Link>
    </div>
  );
}
