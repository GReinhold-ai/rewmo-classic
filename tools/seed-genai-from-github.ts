// tools/seed-genai-from-github.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// ----- Firebase Admin init (same pattern you already use) -----
function initDb() {
  const hasKeyPath = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const hasEnvTriplet =
    !!process.env.FB_ADMIN_PROJECT_ID &&
    !!process.env.FB_ADMIN_CLIENT_EMAIL &&
    !!process.env.FB_ADMIN_PRIVATE_KEY;

  if (!hasKeyPath && !hasEnvTriplet) {
    throw new Error(
      "Missing Firebase Admin creds. Set GOOGLE_APPLICATION_CREDENTIALS or FB_ADMIN_* envs."
    );
  }

  if (!getApps().length) {
    if (hasKeyPath) {
      initializeApp(); // GOOGLE_APPLICATION_CREDENTIALS handles it
    } else {
      initializeApp({
        credential: cert({
          projectId: process.env.FB_ADMIN_PROJECT_ID!,
          clientEmail: process.env.FB_ADMIN_CLIENT_EMAIL!,
          privateKey: (process.env.FB_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        }),
      });
    }
  }
  return getFirestore();
}

// ----- Helpers -----
function titleCase(s: string) {
  return s.replace(/\b[a-z]/g, (m) => m.toUpperCase());
}
function folderToLesson(folder: string) {
  // folder like "01-introduction-to-genai"
  const match = /^(\d+)-(.*)$/.exec(folder);
  const order = match ? parseInt(match[1], 10) : 999;
  const namePart = match ? match[2] : folder;
  const title = titleCase(namePart.replace(/-/g, " "));
  const id = `ms-${folder}`; // keep the folder name for traceability

  const ghPagesBase = "https://microsoft.github.io/generative-ai-for-beginners";
  const repoUrlBase = "https://github.com/microsoft/generative-ai-for-beginners";

  return {
    id,
    title,
    description: "Microsoft Generative AI for Beginners",
    url: `${ghPagesBase}/${folder}/`,
    repoUrl: `${repoUrlBase}/tree/main/${folder}`,
    provider: "Microsoft",
    license: "MIT",
    tags: ["GenAI", "Microsoft Course"],
    order,
    pathKey: "genai-foundations" as const,
  };
}

// ----- GitHub fetch -----
async function listRootDirs() {
  // Tip: set GITHUB_TOKEN to raise rate limits if you hit anonymous caps
  const headers: Record<string, string> = { "User-Agent": "rewmo-seeder" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(
    "https://api.github.com/repos/microsoft/generative-ai-for-beginners/contents",
    { headers }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }
  const json = (await res.json()) as Array<{ name: string; type: string }>;
  // Keep only number-prefixed lesson folders
  return json.filter((i) => i.type === "dir" && /^\d+-.+/.test(i.name)).map((i) => i.name);
}

// ----- Main -----
async function main() {
  const db = initDb();

  console.log("Fetching lesson folders from GitHub…");
  const folders = await listRootDirs();
  folders.sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  console.log(`Found ${folders.length} lesson folders.`);
  const batch = db.batch();

  for (const f of folders) {
    const lesson = folderToLesson(f);
    const ref = db
      .collection("learnPaths")
      .doc(lesson.pathKey)
      .collection("courses")
      .doc(lesson.id);

    batch.set(
      ref,
      {
        title: lesson.title,
        description: lesson.description,
        url: lesson.url,
        repoUrl: lesson.repoUrl,
        provider: lesson.provider,
        license: lesson.license,
        tags: lesson.tags,
        order: lesson.order,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log(`Queued: ${lesson.id} -> ${lesson.title}`);
  }

  await batch.commit();
  console.log(`\n✅ Imported ${folders.length} lessons into path: genai-foundations\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
