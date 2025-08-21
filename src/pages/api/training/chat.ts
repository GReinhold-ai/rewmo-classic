// src/pages/api/training/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set in Vercel/your env
});

function setCors(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin || "*";
  // If you want to restrict, set CORS_ALLOW_ORIGIN in env.
  const allow = process.env.CORS_ALLOW_ORIGIN || origin;

  res.setHeader("Access-Control-Allow-Origin", allow);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (setCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(200).json({
      ok: true,
      hint: "POST { messages:[{role:'user'|'ai',content:string}], system?:string } to chat.",
    });
  }

  try {
    const body = (req.body ?? {}) as {
      messages?: Array<{ role: "user" | "ai"; content: string }>;
      system?: string;
    };

    const system =
      body.system ??
      "You are a helpful RewmoAI training tutor. Be concise, correct, and encouraging.";

    const uiMessages = Array.isArray(body.messages) ? body.messages : [];

    // Narrow the role type so it matches OpenAI's union (and cannot be "function" or "tool").
    const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: system },
      ...uiMessages.map((m) => {
        const role: "user" | "assistant" = m.role === "ai" ? "assistant" : "user";
        return {
          role,
          content: m.content,
        } as OpenAI.Chat.Completions.ChatCompletionMessageParam;
      }),
    ];

    const model = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model,
      messages: chatMessages,
      temperature: 0.3,
    });

    const reply = completion.choices?.[0]?.message?.content ?? "";
    return res.status(200).json({ reply, usage: completion.usage, model });
  } catch (err: any) {
    console.error("chat error:", err);
    return res.status(500).json({ error: err?.message || "Chat failed" });
  }
}
