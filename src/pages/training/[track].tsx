import fs from "fs";
import path from "path";
import { useEffect, useState } from "react";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

type Tier = "free" | "pro" | "business";
type Kind = "embed" | "document" | "link" | "store";

type Item = {
  id: string;
  title: string;
  description?: string;          // prefer this
  summary?: string;              // legacy support
  duration?: string;
  kind?: Kind;                   // default: "link"
  href: string;                  // iframe src or external URL
  order?: number;
  locked?: boolean;              // default: false
  tier?: Tier;                   // default: "free"
  tags?: string[];
};

type TrackDoc = {
  path: { id: string; title: string; blurb?: string };
  // Support both new `items` and legacy `courses`
  items?: Item[];
  courses?: Item[];
};

type PageProps = {
  track: string;
  data: TrackDocNormalized;
};

type TrackDocNormalized = {
  id: string;
  title: string;
  blurb?: string;
  items: Required<Pick<Item, "id" | "title" | "href">> &
    Omit<Item, "id" | "title" | "href">[];
};

const RANK: Record<Tier, number> = { free: 0, pro: 1, business: 2 };
function canAccess(userTier: Tier, itemTier: Tier, locked: boolean) {
  if (!locked) return true;
  return RANK[userTier] >= RANK[itemTier];
}

// TODO: wire to your auth / Firebase user document.
// For now: default to "free"; if you store a tier in localStorage, we pick it up.
function useUserTier(): Tier {
  const [tier, setTier] = useState<Tier>("free");
  useEffect(() => {
    try {
      const t = (window.localStorage.getItem("rewmo.tier") || "free") as Tier;
      if (t === "free" || t === "pro" || t === "business") setTier(t);
    } catch {}
  }, []);
  return tier;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dir = path.join(process.cwd(), "public", "training");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const paths = files
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ params: { track: f.replace(/\.json$/, "") } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const track = String(params?.track);
  const filePath = path.join(process.cwd(), "public", "training", `${track}.json`);
  const raw = fs.readFileSync(filePath, "utf8");
  const json = JSON.parse(raw) as TrackDoc;

  // Normalize: prefer `items`, fallback to `courses`
  const srcItems = (json.items && json.items.length ? json.items : json.courses) || [];

  const normItems: TrackDocNormalized["items"] = srcItems
    .map((it) => ({
      id: it.id,
      title: it.title,
      href: it.href,
      description: it.description ?? it.summary,   // legacy support
      duration: it.duration,
      kind: (it.kind as Kind) ?? "link",
      order: it.order ?? 9999,
      locked: it.locked ?? false,
      tier: (it.tier as Tier) ?? "free",
      tags: it.tags ?? [],
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const data: TrackDocNormalized = {
    id: json.path?.id ?? track,
    title: json.path?.title ?? track,
    blurb: json.path?.blurb,
    items: normItems,
  };

  return { props: { track, data } };
};

export default function TrainingTrack(
  { data }: InferGetStaticPropsType<typeof getStaticProps>
) {
  const userTier = useUserTier();

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        {data.blurb && <p className="opacity-80 mt-2">{data.blurb}</p>}
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {data.items.map((item) => {
          const allowed = canAccess(userTier, item.tier ?? "free", !!item.locked);

          return (
            <section key={item.id} className="rounded-xl p-5 border border-white/10 bg-white/5 relative overflow-hidden">
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                {item.duration && <span className="text-sm opacity-70">{item.duration}</span>}
              </div>
              {item.description && <p className="text-sm opacity-80 mb-3">{item.description}</p>}

              {/* Content / CTA */}
              {allowed ? (
                item.kind === "embed" ? (
                  <div className="w-full aspect-video">
                    <iframe
                      src={item.href}
                      className="w-full h-full rounded-lg"
                      frameBorder={0}
                      allow="fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-4 py-2 rounded-lg bg-orange-500 text-white"
                  >
                    Open
                  </a>
                )
              ) : (
                <div className="rounded-lg bg-black/30 p-4 border border-white/10">
                  <div className="mb-2">
                    🔒 {item.tier === "business" ? "Business" : "Pro"} members only.
                  </div>
                  <div className="flex gap-2">
                    {item.tier !== "business" && (
                      <a href="/account/upgrade?plan=PRO" className="inline-block px-4 py-2 rounded-lg bg-orange-500 text-white">
                        Upgrade for $10/mo
                      </a>
                    )}
                    {item.tier === "business" && (
                      <a href="/account/upgrade?plan=BUSINESS" className="inline-block px-4 py-2 rounded-lg bg-indigo-500 text-white">
                        Business plan
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Tag row */}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
