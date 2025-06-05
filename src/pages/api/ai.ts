// src/pages/api/ai.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // DO NOT use NEXT_PUBLIC_ for backend secret keys
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "No prompt provided." });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Or "gpt-4" or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
    });
    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "OpenAI request failed" });
  }
}
