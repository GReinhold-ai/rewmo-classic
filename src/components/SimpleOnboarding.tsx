import React, { useState } from "react";
import { getAISuggestions } from "@/lib/aiSuggestions";

export default function SimpleOnboarding({ onComplete }: { onComplete: () => void }) {
  const [goal, setGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!goal) return;
    setLoading(true);
    try {
      const aiSuggestions = await getAISuggestions({ goal });
      localStorage.setItem("rewmo-ai-suggestions", JSON.stringify(aiSuggestions));
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-xl font-semibold mb-4 text-orange-500">Let's set your first goal!</h2>
      <input
        type="text"
        value={goal || ""}
        onChange={e => setGoal(e.target.value)}
        placeholder="Enter your savings goal (e.g. $10,000)"
        className="w-full border rounded px-3 py-2 mb-4"
      />
      <button
        onClick={handleNext}
        disabled={loading || !goal}
        className="bg-orange-500 text-white font-semibold px-4 py-2 rounded w-full disabled:opacity-60"
      >
        {loading ? "Saving..." : "Next"}
      </button>
      {/* Example of fixing an apostrophe (if used in JSX) */}
      <div className="text-xs text-gray-500 mt-2">
        You can&apos;t change your goal after setup.
      </div>
    </div>
  );
}
