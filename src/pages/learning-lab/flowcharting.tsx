import React, { useState } from "react";
import { useChatCompletion } from "@/lib/useChatCompletion";
import { Hammer, Zap } from "lucide-react";

export default function FlowchartingModule() {
  const [input, setInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const { response, sendPrompt } = useChatCompletion();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const prompt = `Act as a process consultant. User described: "${input}". Generate a simple step-by-step flowchart with bullet points.`;
    await sendPrompt(prompt);
    setLoading(false);
    setAiOutput(response || "AI couldn't generate a flowchart."); // For the demo version, response updates after render
  }

  return (
    <main className="min-h-screen bg-[#003B49] text-[#15C5C1] flex flex-col items-center py-10">
      <h1 className="text-2xl font-bold mb-3 flex items-center gap-2">
        <Hammer /> Process Flowcharting <Zap className="text-[#FF9151]" />
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#072b33] p-6 rounded-xl shadow mb-4 flex flex-col gap-3">
        <label className="font-semibold text-[#FF9151]">Describe your process or goal:</label>
        <input
          className="rounded p-2 bg-[#003B49] text-[#15C5C1] border border-[#FF9151]/40 focus:ring-[#FF9151] focus:ring-2 outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="E.g., Onboard new clients"
        />
        <button
          type="submit"
          disabled={loading || !input}
          className="mt-2 py-2 px-4 rounded bg-[#FF9151] text-[#003B49] font-bold hover:bg-[#FFA36C] disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Flowchart"}
        </button>
      </form>
      <div className="w-full max-w-lg bg-[#072b33] rounded-lg shadow px-6 py-4 min-h-[120px]">
        <h2 className="font-semibold mb-1 text-[#15C5C1]">AI Output:</h2>
        <pre className="whitespace-pre-wrap text-[#B6E7EB] text-sm">
          {aiOutput || "Enter a process and click Generate to see your AI-powered flowchart."}
        </pre>
      </div>
    </main>
  );
}
