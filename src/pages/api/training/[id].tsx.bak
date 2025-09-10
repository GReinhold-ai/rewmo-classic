// File: src/pages/api/training/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/firebaseAdmin";

type Lesson = {
  id: string;
  title: string;
  track: string;
  slug: string;
  html?: string;      // optional HTML content
  markdown?: string;  // or markdown if you prefer
  pdfUrl?: string;    // when the lesson is a PDF
};

const FALLBACK_LESSONS: Record<string, Record<string, Lesson>> = {
  genai: {
    "course-setup": {
      id: "course-setup",
      track: "genai",
      slug: "course-setup",
      title: "Course Setup",
      html: "<p>Welcome! This module helps you get set up.</p>",
    },
    "intro-to-llms": {
      id: "intro-to-llms",
      track: "genai",
      slug: "intro-to-llms",
      title: "Introduction to Generative AI and LLMs",
      html: "<p>Basics of LLMs, tokens, embeddings, and more.</p>",
    },
  },
  tqm: {
    "module-1": {
      id: "module-1",
      track: "tqm",
      slug: "module-1",
      title: "Introduction to RewmoAI – Process Management",
      // This is your PDF file in /public
      pdfUrl: "/rewmoai-module-1.pdf",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  // Accept ?track & ?slug, or parse /api/training/[id]?track=... (id unused)
  const track = String(req.query.track || req.query.path || "").trim();
  const slug  = String(req.query.slug  || req.query.id   || "").trim();

  if (!track || !slug) return res.status(400).json({ error: "Missing ?track and/or ?slug" });

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

  // Try Firestore at paths/{track}/courses/{slug}
  try {
    const db = getDb();
    const ref = db.collection("paths").doc(track).collection("courses").doc(slug);
    const doc = await ref.get();
    if (doc.exists) {
      const data = doc.data() as Partial<Lesson> | undefined;
      if (data) {
        const lesson: Lesson = {
          id: slug,
          track,
          slug,
          title: data.title || slug,
          html: data.html,
          markdown: data.markdown,
          pdfUrl: data.pdfUrl,
        };
        return res.status(200).json({ lesson, source: "firestore" });
      }
    }
  } catch {
    // ignore → fall back
  }

  // Fallback to local lessons (includes your PDF)
  const lesson = FALLBACK_LESSONS[track]?.[slug];
  if (!lesson) return res.status(404).json({ error: "Lesson not found" });

  return res.status(200).json({ lesson, source: "fallback" });
}
