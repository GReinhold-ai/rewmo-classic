import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

type PathItem = { id: string; title?: string };
type ApiResp = { paths: PathItem[] };

function resolveBaseUrl(req: Parameters<GetServerSideProps>[0]["req"]) {
  // Prefer explicit env; otherwise honor Vercel proxy headers
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/$/, "");
  const proto =
    (req.headers["x-forwarded-proto"] as string) ||
    (req.headers["x-forwarded-protocol"] as string) ||
    "http";
  const host = req.headers.host;
  return `${proto}://${host}`;
}

export const getServerSideProps: GetServerSideProps<{ data: ApiResp | null }> = async ({ req }) => {
  try {
    const base = resolveBaseUrl(req);
    const r = await fetch(`${base}/api/training/paths`, {
      // avoid CDN caches and make it explicit this is server → server
      headers: { "x-ssr": "1" },
    });
    if (!r.ok) throw new Error(`API ${r.status}`);
    const data = (await r.json()) as ApiResp;
    return { props: { data } };
  } catch {
    return { props: { data: null } };
  }
};

const META: Record<
  string,
  { title: string; blurb: string; pill: string }
> = {
  genai: {
    title: "AI Training",
    blurb: "Build practical GenAI skills—prompting, safety, and fast prototyping.",
    pill: "GenAI",
  },
  rpm: {
    title: "R-Process Management (R-PM)",
    blurb:
      "Map routines, reduce waste, and ship reliable processes with RewmoAI.",
    pill: "R-PM",
  },
  finance: {
    title: "Finance Training",
    blurb: "Personal & business finance fundamentals with actionable modules.",
    pill: "Finance",
  },
};

export default function TrainingIndex({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!data)
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-2">RewmoAI Lean Lab University</h1>
        <p className="text-white/80">Failed to load training paths.</p>
      </main>
    );

  // Normalize legacy ids/titles (e.g., "tqm" → "rpm")
  const paths = (data.paths || []).map((p) => {
    const id = p.id === "tqm" ? "rpm" : p.id;
    const meta = META[id];
    return {
      id,
      title: meta?.title || p.title || id,
      blurb: meta?.blurb || "",
      pill: meta?.pill || "",
    };
  });

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <Head>
        <title>RewmoAI Lean Lab University</title>
        <meta
          name="description"
          content="Hands-on tracks with short, practical modules: GenAI, R-Process Management (R-PM), and Finance."
        />
      </Head>

      <h1 className="text-3xl font-bold">RewmoAI Lean Lab University</h1>
      <p className="mt-2 text-white/80">
        Pick a track to get started—or continue where you left off.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {paths.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-white/20 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold">{p.title}</h2>
              {p.pill ? (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                  {p.pill}
                </span>
              ) : null}
            </div>

            {p.blurb ? (
              <p className="mt-1 text-sm text-white/80">{p.blurb}</p>
            ) : null}

            <div className="mt-4">
              {/* IMPORTANT: link to your existing track pages under /learn/[track] */}
              <Link
                href={`/learn/${encodeURIComponent(p.id)}`}
                className="inline-block rounded-lg bg-orange-500 text-white px-4 py-2 hover:bg-orange-600"
              >
                Open
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
