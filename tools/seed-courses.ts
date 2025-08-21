// tools/seed-courses.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

/**
 * Init Firebase Admin from GOOGLE_APPLICATION_CREDENTIALS (recommended)
 * or from FB_ADMIN_* env vars fallback.
 */
function initDb() {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (keyPath && fs.existsSync(keyPath) && fs.statSync(keyPath).isFile()) {
    // GAuth will pick this up automatically, no need to pass credential again
    if (!getApps().length) initializeApp();
  } else {
    const projectId = process.env.FB_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FB_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FB_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Missing Firebase Admin envs. Set FB_ADMIN_PROJECT_ID, FB_ADMIN_CLIENT_EMAIL, FB_ADMIN_PRIVATE_KEY OR set GOOGLE_APPLICATION_CREDENTIALS to a service-account.json path."
      );
    }
    if (!getApps().length) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    }
  }
  return getFirestore();
}

type Course = {
  id: string;
  title: string;
  description: string;
  url: string;       // external link or internal path
  order: number;
  tags?: string[];
};

async function upsertPathWithCourses(
  db: FirebaseFirestore.Firestore,
  pathId: string,
  pathTitle: string,
  blurb: string,
  courses: Course[]
) {
  const pathRef = db.collection("learnPaths").doc(pathId);
  await pathRef.set(
    {
      id: pathId,
      title: pathTitle,
      blurb,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const batch = db.batch();
  courses.forEach((c) => {
    const ref = pathRef.collection("courses").doc(c.id);
    batch.set(
      ref,
      {
        ...c,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  await batch.commit();
  courses.forEach((c) => console.log(`Upserted course: ${c.id}`));
}

// ---------- DATA ----------

// GEN-AI track (Microsoft course links you provided)
const GENAI: Course[] = [
  { id: "ms-00-course-setup", title: "Course Setup", order: 0, url: "https://lnkd.in/du5cFnSC", description: "Set up your dev environment." },
  { id: "ms-01-intro-genai-llms", title: "Intro to Generative AI & LLMs", order: 1, url: "https://lnkd.in/dPSzr2CT", description: "Foundations of Gen-AI and how LLMs work." },
  { id: "ms-02-exploring-llms", title: "Exploring & Comparing LLMs", order: 2, url: "https://lnkd.in/dkafWHZt", description: "Pick the right model for your use case." },
  { id: "ms-03-responsible-ai", title: "Responsible AI", order: 3, url: "https://lnkd.in/dUceTrBn", description: "Build Gen-AI responsibly." },
  { id: "ms-04-prompt-fundamentals", title: "Prompt Engineering Fundamentals", order: 4, url: "https://lnkd.in/dsTgJ33T", description: "Hands-on prompt best practices." },
  { id: "ms-05-advanced-prompts", title: "Advanced Prompting", order: 5, url: "https://lnkd.in/dzdRD2DE", description: "Apply techniques to improve outcomes." },
  { id: "ms-06-text-gen-apps", title: "Build Text Generation Apps", order: 6, url: "https://lnkd.in/dszEqXhS", description: "Azure OpenAI / OpenAI API." },
  { id: "ms-07-chat-apps", title: "Build Chat Applications", order: 7, url: "https://lnkd.in/d62eCmXd", description: "Efficient chat patterns & integrations." },
  { id: "ms-08-vector-search", title: "Vector Search & Embeddings", order: 8, url: "https://lnkd.in/dfjNnnkU", description: "Build a search app with embeddings." },
  { id: "ms-09-image-gen", title: "Image Generation Apps", order: 9, url: "https://lnkd.in/dGz3qAKu", description: "From prompts to pixels." },
  { id: "ms-10-low-code", title: "Low-Code Gen-AI", order: 10, url: "https://lnkd.in/davKKzfx", description: "Ship quickly with low-code tools." },
];

// TQM track
const TQM: Course[] = [
  { id: "tqm-01-introduction", title: "Introduction to TQM", order: 1, url: "/learn/tqm/introduction", description: "What Total Quality Management is and why it matters." },
  { id: "tqm-02-lean-basics", title: "Lean Basics", order: 2, url: "/learn/tqm/lean-basics", description: "Value, waste (Muda), flow, pull, perfection." },
  { id: "tqm-03-six-sigma", title: "Six Sigma Essentials (DMAIC)", order: 3, url: "/learn/tqm/six-sigma", description: "Define-Measure-Analyze-Improve-Control." },
  { id: "tqm-04-pdca", title: "PDCA & A3 Thinking", order: 4, url: "/learn/tqm/pdca-a3", description: "Plan-Do-Check-Act and structured problem solving." },
  { id: "tqm-05-voice-of-customer", title: "Voice of Customer", order: 5, url: "/learn/tqm/voc", description: "Gather, translate, and prioritize customer needs." },
  { id: "tqm-06-spc", title: "SPC & Basic Stats", order: 6, url: "/learn/tqm/spc", description: "Control charts, variation, capability." },
  { id: "tqm-07-qc-tools", title: "Seven QC Tools", order: 7, url: "/learn/tqm/qc-tools", description: "Pareto, fishbone, checksheets, histograms, scatter, control charts, flowcharts." },
  { id: "tqm-08-kaizen", title: "Kaizen & Daily Improvement", order: 8, url: "/learn/tqm/kaizen", description: "Small changes, fast cycles, team empowerment." },
  { id: "tqm-09-hoshin", title: "Hoshin Kanri (Strategy Deployment)", order: 9, url: "/learn/tqm/hoshin", description: "Align goals across the org, catchball." },
  { id: "tqm-10-standard-work", title: "Standard Work & Visual Mgmt", order: 10, url: "/learn/tqm/standard-work", description: "Stability, repeatability, visual controls." },
];

async function main() {
  const db = initDb();

  await upsertPathWithCourses(
    db,
    "genai-foundations",
    "Generative AI Foundations",
    "Microsoft’s free Gen-AI curriculum: from prompts to production apps.",
    GENAI
  );

  await upsertPathWithCourses(
    db,
    "tqm-essentials",
    "TQM Essentials",
    "Lean, Six Sigma, PDCA, and everyday quality tools to improve outcomes.",
    TQM
  );

  console.log("\n✅ Seed complete. Paths: genai-foundations, tqm-essentials");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
