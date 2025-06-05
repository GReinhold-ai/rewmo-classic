import React, { useState } from "react";
import { Hammer, Zap } from "lucide-react";
import { useChatCompletion } from "@/lib/useChatCompletion"; // Replace with your OpenAI logic

export default function FlowchartingModule() {
  const [input, setInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePrompt = async () => {
    setLoading(true);
    // Replace with your own prompt/AI integration!
    const prompt = `Act as a process consultant. User described: "${input}". Generate a simple step-by-step flowchart with bullet points.`;
    const aiResponse = await useChatCompletion(prompt); // This is your OpenAI call
    setAiOutput(aiResponse || "AI couldn't generate a flowchart.");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#003B49] text-[#15C5C1] py-10 px-4">
      <div className="max-w-2xl mx-auto bg-[#072b33] rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-2 gap-2">
          <Hammer className="w-6 h-6 text-[#FF9151]" />
          <h1 className="text-2xl font-bold text-[#FF9151]">Module: Flowcharting for Everyday Efficiency</h1>
        </div>
        <p className="mb-4 text-[#F7F6F2]">
          Visualize your routines, find bottlenecks, and get everyone on the same page. Use this module to map any process—personal or business. 
        </p>
        <h2 className="text-lg font-semibold mb-2">Try it now:</h2>
        <textarea
          className="w-full border rounded p-2 mb-2 text-black"
          placeholder="Describe a process to map (e.g. 'My morning routine', 'Customer onboarding', etc.)"
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={2}
        />
        <button
          onClick={handlePrompt}
          className="bg-[#FF9151] text-[#003B49] font-bold px-4 py-2 rounded-xl shadow hover:bg-[#FFA36C] transition"
          disabled={loading || !input.trim()}
        >
          {loading ? "Thinking..." : "AI: Generate My Flowchart"}
        </button>
        {aiOutput && (
          <div className="mt-4 bg-[#003B49] border border-[#15C5C1] rounded-xl p-4 text-[#F7F6F2] whitespace-pre-line shadow">
            <strong className="text-[#FF9151]">AI Suggestion:</strong>
            <div>{aiOutput}</div>
          </div>
        )}
        <div className="mt-6 text-xs text-[#F7F6F2]/80">
          Practice: Create a flowchart for your own routine and save it to your profile!
        </div>
      </div>
    </main>
  );
}
