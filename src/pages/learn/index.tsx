import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

type Course = {
  id: string;
  title?: string;
  summary?: string;
  url?: string;      // external URL (LinkedIn/Microsoft/etc.)
  order?: number;
};

type TrackKey = "genai-foundations" | "tqm-essentials";
const TRACKS: { key: TrackKey; label: string; blurb: string }[] = [
  {
    key: "genai-foundations",
    label: "Generative AI Foundations",
    blurb: "Microsoft’s best free GenAI course series — curated and ready to learn.",
  },
  {
    key: "tqm-essentials",
    label: "TQM Essentials",
    blurb: "Lean, Six Sigma, PDCA, SPC, and more — practical quality skills.",
  },
];

export default function LearnIndex() {
  const [courses, setCourses] = useState<Record<string, Course[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const out: Record<string, Course[]> = {};
      for (const track of TRACKS) {
        const qref = query(
          collection(db, "catalog", track.key, "courses"),
          orderBy("order", "asc")
        );
        const snap = await getDocs(qref);
        out[track.key] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      }
      setCourses(out);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#003B49]">
      <Head>
        <title>Learn | RewmoAI</title>
      </Head>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-black text-[#FF9151] mb-2">Learn</h1>
        <p className="text-[#B6E7EB] max-w-2xl mb-8">
          Curated training to level up fast — from Microsoft’s GenAI track to TQM fundamentals.
        </p>

        {loading && (
          <div className="text-[#B6E7EB]">Loading courses…</div>
        )}

        {!loading && TRACKS.map((t) => {
          const list = courses[t.key] || [];
          return (
            <section key={t.key} className="mb-12">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#15C5C1]">{t.label}</h2>
                  <p className="text-[#B6E7EB]">{t.blurb}</p>
                </div>
                <Link
                  href={`/learn/${t.key}`}
                  className="text-sm font-semibold text-[#FF9151] hover:text-[#FFB98E] underline"
                >
                  View all →
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.slice(0, 6).map((c) => (
                  <article
                    key={c.id}
                    className="rounded-2xl border border-white/10 bg-[#072b33] p-4 shadow hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-bold text-white mb-1">{c.title ?? c.id}</h3>
                    <p className="text-sm text-[#B6E7EB] mb-3 line-clamp-3">
                      {c.summary || "Self-paced lesson"}
                    </p>
                    <div className="flex gap-2">
                      {c.url ? (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg bg-[#FF6B00] px-3 py-2 text-sm font-bold text-white hover:bg-[#ff7d22]"
                        >
                          Open Lesson
                        </a>
                      ) : (
                        <span className="text-xs text-[#B6E7EB]">No link</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
