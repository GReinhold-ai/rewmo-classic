import React, { useState } from "react";

const MOCK_ACHIEVEMENTS = [
  { name: "Starter", earned: true },
  { name: "Conversationalist", earned: false },
  { name: "Quiz Master", earned: false },
  { name: "AI Pro", earned: false },
];

export default function TrainingModule() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(10); // Example progress
  const [feedback, setFeedback] = useState<null | string>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setLoading(true);

    // TODO: Replace this with real backend call
    setTimeout(() => {
      setMessages(msgs => [...msgs, { role: "ai", content: "This is a demo response. (Replace with OpenAI/your API)" }]);
      setLoading(false);
      setFeedback(null);
      setProgress(p => Math.min(100, p + 10));
    }, 700);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#003B49] flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-2xl p-8 rounded-2xl shadow-xl bg-[#02404d] border border-[#15C5C1]">
        <h2 className="text-3xl font-black mb-4 text-[#FF9151] text-center">AI Training Lab</h2>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-[#15C5C1]">Progress</span>
            <span className="text-sm font-medium text-[#15C5C1]">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-[#FF9151] h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="mb-4 h-64 overflow-y-auto border rounded bg-[#003B49] p-3 shadow-inner">
          {messages.length === 0 && (
            <div className="text-[#B6E7EB] text-center mt-20">Start chatting to begin your AI training…</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <span className={m.role === "user" ? "font-semibold text-[#15C5C1]" : "font-semibold text-[#FF9151]"}>
                {m.role === "user" ? "You: " : "AI: "}
              </span>
              {m.content}
            </div>
          ))}
        </div>

        {/* Feedback */}
        {messages.length > 0 && !feedback && (
          <div className="mb-4 flex gap-2 items-center">
            <span className="text-[#B6E7EB]">Was this answer helpful?</span>
            <button className="px-2 py-1 bg-green-200 rounded" onClick={() => setFeedback("good")}>👍</button>
            <button className="px-2 py-1 bg-red-200 rounded" onClick={() => setFeedback("bad")}>👎</button>
          </div>
        )}
        {feedback && (
          <div className="mb-4 text-green-400 font-semibold">Thanks for your feedback!</div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            className="flex-1 border px-2 py-1 rounded text-[#003B49]"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask your next question..."
            disabled={loading}
          />
          <button
            className="px-4 py-1 rounded bg-[#FF9151] text-white font-bold"
            onClick={sendMessage}
            disabled={loading}
          >
            Send
          </button>
        </div>

        {/* Achievements */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2 text-[#15C5C1]">Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {MOCK_ACHIEVEMENTS.map(a => (
              <div
                key={a.name}
                className={`px-4 py-2 rounded-lg text-sm font-bold shadow ${
                  a.earned ? "bg-yellow-300 text-gray-900" : "bg-gray-200 text-gray-400"
                }`}
              >
                {a.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
