import React, { useMemo, useState } from "react";

type Msg = { role: "user" | "ai"; content: string };

const TRACKS = [
  {
    key: "genai-foundations",
    title: "GenAI Foundations",
    courses: [
      { id: "ms-01-intro-genai-llms", name: "Intro to GenAI & LLMs" },
      { id: "ms-02-exploring-llms", name: "Exploring & Comparing LLMs" },
      { id: "ms-03-responsible-ai", name: "Responsible AI" },
      { id: "ms-04-prompt-fundamentals", name: "Prompt Fundamentals" },
      { id: "ms-05-advanced-prompts", name: "Advanced Prompts" },
      { id: "ms-06-text-gen-apps", name: "Text Generation Apps" },
      { id: "ms-07-chat-apps", name: "Chat Applications" },
      { id: "ms-08-vector-search", name: "Vector Search" },
      { id: "ms-09-image-gen", name: "Image Generation" },
      { id: "ms-10-low-code", name: "Low-Code AI Apps" },
    ],
  },
  {
    key: "tqm-essentials",
    title: "TQM Essentials",
    courses: [
      { id: "tqm-01-introduction", name: "Introduction to TQM" },
      { id: "tqm-02-lean-basics", name: "Lean Basics" },
      { id: "tqm-03-six-sigma", name: "Six Sigma" },
      { id: "tqm-04-pdca", name: "PDCA Cycle" },
      { id: "tqm-05-voice-of-customer", name: "Voice of the Customer" },
      { id: "tqm-06-spc", name: "SPC (Control Charts)" },
      { id: "tqm-07-qc-tools", name: "7 QC Tools" },
      { id: "tqm-08-kaizen", name: "Kaizen" },
      { id: "tqm-09-hoshin", name: "Hoshin Kanri" },
      { id: "tqm-10-standard-work", name: "Standard Work" },
    ],
  },
];

export default function TrainingModule() {
  const [trackKey, setTrackKey] = useState(TRACKS[0].key);
  const courses = useMemo(
    () => TRACKS.find(t => t.key === trackKey)!.courses,
    [trackKey]
  );
  const [courseId, setCourseId] = useState(courses[0].id);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(10);
  const [feedback, setFeedback] = useState<null | "good" | "bad">(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const newMsgs = [...messages, { role: "user", content: input.trim() } as Msg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/training/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackKey,
          courseId,
          messages: newMsgs,
        }),
      });
      const data = await res.json();
      const reply: string =
        data?.reply ??
        "Sorry — I couldn’t generate a response right now. Please try again.";

      setMessages(m => [...m, { role: "ai", content: reply }]);

      // bump progress & persist
      const next = Math.min(100, progress + 10);
      setProgress(next);
      void fetch("/api/training/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackKey,
          courseId,
          progress: next,
        }),
      });
    } catch (e) {
      setMessages(m => [
        ...m,
        { role: "ai", content: "Network error — please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#003B49] flex flex-col items-center py-8">
      <div className="w-full max-w-3xl p-6 md:p-8 rounded-2xl shadow-xl bg-[#02404d] border border-[#15C5C1]">
        <h2 className="text-3xl font-black mb-4 text-[#FF9151] text-center">AI Training Lab</h2>

        {/* Track / Course pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <label className="flex flex-col">
            <span className="text-sm text-[#15C5C1] mb-1">Track</span>
            <select
              className="rounded px-3 py-2 text-[#003B49] font-semibold"
              value={trackKey}
              onChange={(e) => {
                const t = e.target.value;
                setTrackKey(t);
                const firstCourse = TRACKS.find(x => x.key === t)!.courses[0].id;
                setCourseId(firstCourse);
                setMessages([]); // reset chat context when switching
              }}
            >
              {TRACKS.map(t => (
                <option key={t.key} value={t.key}>{t.title}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-[#15C5C1] mb-1">Course</span>
            <select
              className="rounded px-3 py-2 text-[#003B49] font-semibold"
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setMessages([]); // reset chat context when switching
              }}
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-[#15C5C1]">
              Progress — {courses.find(c=>c.id===courseId)?.name}
            </span>
            <span className="text-sm font-medium text-[#15C5C1]">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#FF9151] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="mb-4 h-64 overflow-y-auto border rounded bg-[#003B49] p-3 shadow-inner space-y-2">
          {messages.length === 0 && (
            <div className="text-[#B6E7EB] text-center mt-20">
              Start chatting about this course…
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <span
                className={
                  m.role === "user"
                    ? "font-semibold text-[#15C5C1]"
                    : "font-semibold text-[#FF9151]"
                }
              >
                {m.role === "user" ? "You: " : "AI: "}
              </span>
              <span className="whitespace-pre-wrap">{m.content}</span>
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
            className="flex-1 border px-3 py-2 rounded text-[#003B49] font-medium"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask your next question…"
            disabled={loading}
          />
          <button
            className="px-4 py-2 rounded bg-[#FF9151] text-white font-bold disabled:opacity-60"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "Thinking…" : "Send"}
          </button>
        </div>

        {/* Achievements */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2 text-[#15C5C1]">Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "Starter", earned: true },
              { name: "Conversationalist", earned: messages.length >= 5 },
              { name: "Quiz Master", earned: progress >= 60 },
              { name: "AI Pro", earned: progress >= 90 },
            ].map(a => (
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
