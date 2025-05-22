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
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: prompt }],
    max_tokens: 256,
  });

  const aiText = completion.choices[0].message.content;
  // Split on newlines, remove blank lines
  const suggestions = aiText
    ? aiText
        .split(/\n/)
        .map(s => s.replace(/^[0-9\.\-\•]+\s*/, "").trim())
        .filter(Boolean)
    : [];
  res.status(200).json({ suggestions });
}
