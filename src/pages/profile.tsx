import { useEffect, useState } from "react";
import SimpleOnboarding from "@/components/SimpleOnboarding";

export default function ProfilePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Show onboarding if not completed
    const data = localStorage.getItem("rewmo-ai-suggestions");
    if (!data) setShowOnboarding(true);
    else setSuggestions(JSON.parse(data));
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    const data = localStorage.getItem("rewmo-ai-suggestions");
    if (data) setSuggestions(JSON.parse(data));
  };

  if (showOnboarding) {
    return <SimpleOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="max-w-xl mx-auto mt-20 text-center">
      <h1 className="text-3xl font-bold mb-4 text-orange-600">Your Profile</h1>
      <h2 className="text-xl font-semibold mb-2">AI Suggestions</h2>
      {suggestions.length ? (
        <ul className="space-y-3 mb-8">
          {suggestions.map((s, i) => (
            <li key={i} className="bg-orange-100 text-orange-800 rounded px-4 py-3 shadow">
              {s}
            </li>
          ))}
        </ul>
      ) : (
        <p>No suggestions yet. Complete onboarding above!</p>
      )}
    </div>
  );
}
