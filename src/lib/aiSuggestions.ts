export async function getAISuggestions(answers: any): Promise<string[]> {
  const res = await fetch("/api/ai-suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });
  if (!res.ok) throw new Error("Failed to fetch suggestions");
  const data = await res.json();
  return data.suggestions as string[];
}
