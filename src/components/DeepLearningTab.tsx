import React, { useState } from "react";

const STARTERS = [
  "How can I improve quality in my small business?",
  "What are the main principles of TQM?",
  "Give me an example of a Pareto analysis in finance.",
  "How does AI improve operational efficiency?",
  "Explain root cause analysis with a practical example.",
  "Suggest 3 daily habits for better personal finances.",
];

export default function DeepLearningTab() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(e?: React.FormEvent, starter?: string) {
    if (e) e.preventDefault();
    const msg = starter ?? input;
    if (!msg.trim()) return;
    setMessages((msgs) => [...msgs, { role: "user", content: msg }]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    setMessages((msgs) => [...msgs, { role: "assistant", content: data.reply }]);
    setInput("");
    setLoading(false);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-[#15C5C1]">Ask the AI Coach</h2>
      <div className="flex flex-wrap gap-2 mb-3">
        {STARTERS.map((starter, i) => (
          <button
            key={i}
            className="bg-[#15C5C1]/10 text-[#15C5C1] px-3 py-1 rounded-xl text-xs hover:bg-[#15C5C1]/30 transition"
            onClick={() => sendMessage(undefined, starter)}
            disabled={loading}
          >
            {starter}
          </button>
        ))}
      </div>
      <div className="flex flex-col mb-3 space-y-2 min-h-[200px] max-h-[260px] overflow-y-auto bg-[#003B49] rounded-lg px-3 py-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${
              msg.role === "user"
                ? "text-right text-[#FF9151]"
                : "text-left text-[#15C5C1]"
            }`}
          >
            <span className="inline-block px-2 py-1 rounded bg-[#0a5868]/70 mb-1">{msg.content}</span>
          </div>
        ))}
        {loading && <div className="text-gray-400">Thinking…</div>}
      </div>
      <form className="flex gap-2" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border-none bg-[#003B49] text-[#15C5C1] placeholder-[#15C5C1]/60 focus:outline-none"
          placeholder="Ask about TQM, financial coaching, rewards…"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-[#FF9151] text-[#003B49] font-bold px-5 py-2 rounded-xl"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
