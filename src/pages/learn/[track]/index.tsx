import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import Link from "next/link";

type Course = { id: string; title?: string; summary?: string; url?: string; order?: number };

export default function TrackPage() {
  const router = useRouter();
  const { track } = router.query as { track?: string };
  const [list, setList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!track) return;
    (async () => {
      const qref = query(collection(db, "catalog", track, "courses"), orderBy("order", "asc"));
      const snap = await getDocs(qref);
      setList(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      setLoading(false);
    })();
  }, [track]);

  const title = {
    "genai-foundations": "Generative AI Foundations",
    "tqm-essentials": "TQM Essentials",
  }[track || ""] || "Courses";

  return (
    <div className="min-h-screen bg-[#003B49]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link href="/learn" className="text-[#FF9151] underline">&larr; Back to Learn</Link>
        <h1 className="text-3xl md:text-4xl font-black text-[#FF9151] mt-3 mb-6">{title}</h1>

        {loading ? (
          <div className="text-[#B6E7EB]">Loading…</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <article key={c.id} className="rounded-2xl border border-white/10 bg-[#072b33] p-4 shadow">
                <h3 className="text-lg font-bold text-white mb-1">{c.title ?? c.id}</h3>
                <p className="text-sm text-[#B6E7EB] mb-3">{c.summary || "Self-paced lesson"}</p>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg bg-[#FF6B00] px-3 py-2 text-sm font-bold text-white hover:bg-[#ff7d22]"
                  >
                    Open Lesson
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
