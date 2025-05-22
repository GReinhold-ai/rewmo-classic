import { useEffect, useState } from "react";

interface RewardSuggestion {
  title: string;
  points: number;
}

export default function RewardSuggestions() {
  const [suggestions, setSuggestions] = useState<RewardSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch("/api/rewards/suggestions");

        // Check if response is OK and content-type is JSON
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        } else if (!contentType?.includes("application/json")) {
          throw new Error("Expected JSON response, but got HTML or something else");
        }

        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch suggestions");
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading reward suggestions...</p>;
  if (error) return <p className="text-sm text-red-500">Error: {error}</p>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Suggested Ways to Earn</h2>
      <ul className="space-y-2">
        {suggestions.map((sug, index) => (
          <li
            key={index}
            className="bg-white text-black p-4 rounded shadow-md flex justify-between"
          >
            <span>{sug.title}</span>
            <span className="font-semibold text-orange-600">+{sug.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
