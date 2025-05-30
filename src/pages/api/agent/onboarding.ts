// src/pages/api/agent/onboarding.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai"; // npm install openai

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { profile } = req.body;

  const prompt = `
Here is a user's onboarding profile: ${JSON.stringify(profile, null, 2)}
Based on this info, give 3 tailored financial tips or next steps to help them succeed.
Make suggestions friendly, actionable, and specific.
Respond as a list with bullet points like:
• Pay yourself first every month.
• Try RewmoAI's "Made in America" shopping filter.
• Invite a friend to boost your rewards.
  `; // <-- notice no backslashes before • or . needed

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    const tips = completion.choices[0].message.content || "No suggestions found.";
    res.status(200).json({ suggestions: tips });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
