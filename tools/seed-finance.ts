New-Item -ItemType Directory -Force tools | Out-Null
Set-Content -Encoding UTF8 tools/seed-finance.ts @'
import fs from "fs";
import path from "path";
import { getDb } from "@/lib/firebaseAdmin";

type Course = {
  id: string;
  title: string;
  summary?: string;
  duration?: string;
  kind?: "document" | "link" | "lesson";
  href?: string;
  order?: number;
  slug?: string;
};

type TrackDoc = {
  path: { id: string; title: string };
  courses: Course[];
};

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const db = getDb();
  const trackId = "finance";

  // Prefer local JSON fallback (public/training/finance.json)
  const localPath = path.join(process.cwd(), "public", "training", "finance.json");
  let payload: TrackDoc;

  if (fs.existsSync(localPath)) {
    const raw = JSON.parse(fs.readFileSync(localPath, "utf8"));
    payload = {
      path: raw.path ?? { id: trackId, title: raw.title ?? "Finance Training" },
      courses: raw.courses ?? raw.lessons ?? [],
    };
  } else {
    // Minimal inline fallback
    payload = {
      path: { id: trackId, title: "Finance Training" },
      courses: [
        { id: "pf-101", title: "Personal Finance 101", summary: "Budgeting, emergency funds, goals.", duration: "15m", kind: "link", href: "https://www.investopedia.com/personal-finance-4427768", order: 1 },
        { id: "invest-101", title: "Investing Basics", summary: "Risk vs. return, diversification.", duration: "15m", kind: "link", href: "https://www.investopedia.com/investing-4689743", order: 2 },
        { id: "val-101", title: "Intro to Valuation", summary: "DCF, multiples, when to use what.", duration: "20m", kind: "link", href: "https://www.investopedia.com/terms/v/valuation.asp", order: 3 }
      ]
    };
  }

  console.log(`Seeding track: ${payload.path.title} (${trackId})`);
  if (dryRun) {
    console.log("— Dry run — no writes will be performed.");
    console.table(payload.courses.map(c => ({ id: c.id, title: c.title, order: c.order })));
    return;
  }

  // Upsert the path doc
  await db.collection("paths").doc(trackId).set(
    { title: payload.path.title, updatedAt: new Date() },
    { merge: true }
  );

  // Upsert courses subcollection
  const batch = db.batch();
  payload.courses.forEach((c) => {
    const ref = db.collection("paths").doc(trackId).collection("courses").doc(c.id);
    batch.set(ref, {
      title: c.title,
      summary: c.summary ?? "",
      duration: c.duration ?? "",
      kind: c.kind ?? "lesson",
      href: c.href ?? "",
      order: c.order ?? 999,
      slug: c.slug ?? c.id,
      updatedAt: new Date(),
    }, { merge: true });
  });

  await batch.commit();
  console.log(`✅ Seeded ${payload.courses.length} finance course(s).`);
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
'@
