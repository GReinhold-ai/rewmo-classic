// src/pages/api/training/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const { trackKey, courseId, messages } = req.body as {
      trackKey: string;
      courseId: string;
      messages: { role: "user" | "ai"; content: string }[];
    };

    const system = [
      `You are a concise tutor for the track "${trackKey}" and course "${courseId}".`,
      `Teach step-by-step, give short examples, and end with a single actionable next step for the learner.`,
      `If asked for code, keep it minimal and runnable.`,
    ].join(" ");

    const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: system },
      ...messages.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content })),
    ];

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      temperature: 0.4,
    });

    const reply = resp.choices[0]?.message?.content ?? "No response.";
    res.json({ reply });
  } catch (err: any) {
    console.error("[training/chat] error", err?.message || err);
    res.status(500).json({ error: "Failed to generate reply" });
  }
}
