import React, { useState } from "react";
import { useAIChat } from "@/lib/useAIChat";

// Demo TQM + personal finance prompt starters
const starters = [
  {
    label: "What is process management?",
    prompt: "Explain process management in simple terms for small businesses.",
  },
  {
    label: "TQM for individuals",
    prompt: "How can Total Quality Management help individuals improve their daily finances?",
  },
  {
    label: "Savings habit tips",
    prompt: "What are three practical ways to build a consistent savings habit?",
  },
  {
    label: "Start the TQM mini-course",
    prompt: "Give me Module 1 of the RewmoAI Process Management mini-course for beginners.",
  },
];

export default function LearningLab() {
  const [input, setInput] = useState("");
  const { ask, loading, answer, error, setAnswer } = useAIChat();

  const handleAsk = async (prompt?: string) => {
    setAnswer(null);
    await ask(prompt ?? input);
    setInput("");
  };

  return (
    <main className="min-h-screen bg-[#003B49] flex flex-col items-center px-2 py-12">
      <div className="w-full max-w-2xl bg-[#072b33] rounded-xl shadow-lg p-6 border border-[#15C5C1]">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#15C5C1] mb-3">
          <span className="text-[#FF9151]">Learning Lab</span> — AI Chat
        </h1>
        <p className="mb-6 text-[#15C5C1] font-medium">
          Get instant answers and training on process management, TQM, personal finance, and more—powered by AI!
        </p>
        
        {/* Prompt Starters */}
        <div className="flex flex-wrap gap-3 mb-4">
          {starters.map((s, i) => (
            <button
              key={i}
              className="bg-[#FF9151] text-[#003B49] font-bold px-4 py-2 rounded-full shadow hover:bg-[#FFA36C] transition text-sm"
              onClick={() => handleAsk(s.prompt)}
              disabled={loading}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* AI Input & Submit */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            disabled={loading}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => (e.key === "Enter" && input && handleAsk())}
            placeholder="Type your question…"
            className="flex-1 px-3 py-2 rounded-lg border border-[#15C5C1] bg-[#02272f] text-[#15C5C1] placeholder:text-[#15C5C1]/60"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !input}
            className="bg-[#FF9151] text-[#003B49] font-bold px-5 py-2 rounded-lg shadow hover:bg-[#FFA36C] transition"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>

        {/* AI Response */}
        <div className="min-h-[100px] bg-[#02272f] rounded-md p-4 text-[#15C5C1] font-mono shadow-inner border border-[#15C5C1]/40">
          {error && <span className="text-red-400">{error}</span>}
          {answer && <span>{answer}</span>}
          {!answer && !error && !loading && (
            <span className="text-[#15C5C1]/50">AI answers will appear here…</span>
          )}
        </div>
      </div>
    </main>
  );
}
