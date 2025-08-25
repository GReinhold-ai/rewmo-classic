// tools/seed-tqm.ts
import { initializeApp, cert, ServiceAccount, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

type Lesson = {
  id: string;
  track: "tqm";
  title: string;
  summary: string;
  slug: string;
  order: number;
  content?: string;
};

const lessons: Lesson[] = [
  { id: "tqm-01-introduction",      track: "tqm", title: "Introduction to TQM",          summary: "What is TQM and why it matters.", slug: "introduction",      order: 1 },
  { id: "tqm-02-lean-basics",       track: "tqm", title: "Lean Basics",                   summary: "Waste, value, and flow.",         slug: "lean-basics",       order: 2 },
  { id: "tqm-03-six-sigma",         track: "tqm", title: "Six Sigma",                     summary: "DMAIC overview.",                 slug: "six-sigma",         order: 3 },
  { id: "tqm-04-pdca",              track: "tqm", title: "PDCA Cycle",                    summary: "Plan-Do-Check-Act.",              slug: "pdca",              order: 4 },
  { id: "tqm-05-voice-of-customer", track: "tqm", title: "Voice of the Customer (VoC)",   summary: "Gathering and using VoC.",        slug: "voice-of-customer", order: 5 },
  { id: "tqm-06-spc",               track: "tqm", title: "SPC",                           summary: "Control charts and variation.",   slug: "spc",               order: 6 },
  { id: "tqm-07-qc-tools",          track: "tqm", title: "7 QC Tools",                    summary: "Pareto, Ishikawa, etc.",          slug: "qc-tools",          order: 7 },
  { id: "tqm-08-kaizen",            track: "tqm", title: "Kaizen",                         summary: "Small continual improvements.",   slug: "kaizen",            order: 8 },
  { id: "tqm-09-hoshin",            track: "tqm", title: "Hoshin Kanri",                  summary: "Strategy deployment.",            slug: "hoshin",            order: 9 },
  { id: "tqm-10-standard-work",     track: "tqm", title: "Standard Work",                 summary: "Stability and consistency.",      slug: "standard-work",     order: 10 },
];

async function initApp(): Promise<App> {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp();
  }
  const pid   = process.env.FB_ADMIN_PROJECT_ID;
  const email = process.env.FB_ADMIN_CLIENT_EMAIL;
  const key   = process.env.FB_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!pid || !email || !key) {
    throw new Error("Missing Firebase Admin creds. Set GOOGLE_APPLICATION_CREDENTIALS or FB_ADMIN_* env vars.");
  }

  return initializeApp({
    credential: cert({
      projectId: pid,
      clientEmail: email,
      privateKey: key,
    } as ServiceAccount),
  });
}

async function upsertPaths() {
  const db   = getFirestore();
  const ref  = db.collection("paths").doc("tqm");
  const data = {
    id: "tqm",
    title: "TQM Essentials",
    description: "Total Quality Management fundamentals, Lean, Six Sigma, SPC, and more.",
    order: 2,
    slug: "tqm",
  };
  await ref.set(data, { merge: true });
  console.log("Upserted path: tqm");
}

async function upsertCourses() {
  const db = getFirestore();
  for (const l of lessons) {
    await db.collection("courses").doc(l.id).set(l, { merge: true });
    console.log(`Upserted course: ${l.id}`);
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  await initApp();

  if (dryRun) {
    console.log("🔎 Dry run — no writes. Would upsert path 'tqm' and", lessons.length, "lessons.");
    return;
  }

  await upsertPaths();
  await upsertCourses();
  console.log("✅ Seed complete. Path: tqm");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
