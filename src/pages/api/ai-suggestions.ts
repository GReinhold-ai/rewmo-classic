import type { NextApiRequest, NextApiResponse } from "next";

// Mock AI suggestion generator based on goal
const suggestionMap: Record<string, string[]> = {
  "Save more": [
    "Set up automated transfers to your savings account.",
    "Review your monthly subscriptions and cancel unused services.",
    "Try the 52-week savings challenge."
  ],
  "Pay off debt": [
    "Make more than the minimum payment on your highest-interest debt.",
    "Consider debt consolidation to reduce your rates.",
    "Track your expenses to find extra funds to pay off debt."
  ],
  "Invest": [
    "Start with a low-cost index fund or a target-date retirement account.",
    "Review your risk tolerance before investing.",
    "Set investment goals for the next 5 years."
  ],
  "Other": [
    "Schedule a 1:1 with a RewmoAI coach for personalized planning.",
    "Explore all the features in your RewmoAI dashboard."
  ],
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { goal } = req.body;
  const suggestions = suggestionMap[goal] || ["Keep going! RewmoAI will guide you step by step."];
  res.status(200).json({ suggestions });
}
