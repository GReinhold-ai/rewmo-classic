// tools/seed-finance.ts
import fs from "fs";
import path from "path";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "../src/lib/firebaseAdmin";

type Course = {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  duration?: string;
  kind?: string;
  href?: string;
  order?: number;
  slug?: string;
};

type FinanceJSON = {
  path: { id: string; title: string };
  courses: Course[];
};

async function main() {
  const dry = process.argv.includes("--dry-run");
  const file = path.join(process.cwd(), "public", "training", "finance.json");
  if (!fs.existsSync(file)) {
    throw new Error(`Missing ${file}`);
  }

  const data = JSON.parse(fs.readFileSync(file, "utf8")) as FinanceJSON;
  const pathId = data.path?.id || "finance";
  const title = data.path?.title || "Finance Training";

  if (dry) {
    console.log(`[DRY RUN] Would upsert path '${pathId}' (${title})`);
    for (const c of data.courses || []) {
      console.log(`  - course ${c.id}: ${c.title}`);
    }
    return;
  }

  const db = getDb();

  // Upsert path
  await db.collection("paths").doc(pathId).set(
    {
      id: pathId,
      title,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // Upsert courses (batch)
  const batch = db.batch();
  const coll = db.collection("paths").doc(pathId).collection("courses");
  for (const c of data.courses || []) {
    const ref = coll.doc(c.id);
    batch.set(ref, { ...c, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  }
  await batch.commit();

  console.log(`✅ Seed complete. Path: ${pathId} (${data.courses?.length ?? 0} courses)`);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err?.message || err);
  process.exit(1);
});
