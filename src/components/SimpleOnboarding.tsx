import { useState } from "react";
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
    <div className="bg-white rounded-xl shadow p-8 w-full max-w-md text-center mx-auto mt-12">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Welcome to RewmoAI!</h2>
      <p className="mb-6">What's your top financial goal?</p>
      <div className="space-y-3 mb-6">
        {["Save more", "Pay off debt", "Invest", "Other"].map((g) => (
          <button
            key={g}
            className={`w-full rounded py-2 font-semibold border ${goal === g ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-800"} transition`}
            onClick={() => setGoal(g)}
            type="button"
          >
            {g}
          </button>
        ))}
      </div>
      <button
        className="btn w-full bg-orange-500 text-white py-2 rounded mt-2 disabled:bg-gray-300"
        disabled={!goal || loading}
        onClick={handleNext}
      >
        {loading ? "Saving..." : "Next"}
      </button>
    </div>
  );
}
