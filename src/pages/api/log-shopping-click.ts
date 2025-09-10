// src/pages/shopping.tsx
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Tier = "free" | "pro" | "business";
type Kind = "store";

type Item = {
  id: string;
  title: string;
  description?: string;
  kind: Kind;
  href: string;
  order?: number;
  locked?: boolean;
  tier?: Tier;
  tags?: string[];
  logo?: string;          // e.g., /brands/amazon.svg
  multiplier?: string;    // e.g., "2x"
  notes?: string;
  active?: boolean;
};

type TrackDoc = {
  path: { id: string; title: string; blurb?: string };
  items: Item[];
};

const badgeClass =
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium";

function TagBadge({ label }: { label: string }) {
  return (
    <span className={`${badgeClass} bg-white/5 text-[#9bd1d6] border border-white/10`}>
      {label}
    </span>
  );
}

function LockBadge({ tier }: { tier: Tier }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-[#9bd1d6]">
      <span className="inline-block h-3 w-3 rounded-sm bg-white/20" />
      {tier === "pro" ? "Pro members only" : "Business members only"}
    </span>
  );
}

function Multiplier({ m, tier }: { m?: string; tier?: Tier }) {
  if (!m) return null;
  const color =
    tier === "business" ? "bg-[#FF9151] text-[#003B49]" : "bg-[#15C5C1] text-[#003B49]";
  return (
    <span className={`${badgeClass} ${color} shadow-sm`}>{m}</span>
  );
}

export default function ShoppingPage() {
  const [doc, setDoc] = useState<TrackDoc | null>(null);
  const [loading, setLoading] = useState(true);

  // You can replace this with real auth/stripe membership later.
  const tier: Tier =
    (typeof window !== "undefined" &&
      ((localStorage.getItem("rewmo.tier") as Tier) || "free")) ||
    "free";

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const r = await fetch("/training/shopping.json", { cache: "no-store" });
        const j = (await r.json()) as TrackDoc;
        if (!ignore) setDoc(j);
      } catch {
        if (!ignore) setDoc(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const items = useMemo(() => {
    const arr = doc?.items ?? [];
    return [...arr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [doc]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#003B49] text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">Loading…</div>
      </main>
    );
  }

  if (!doc) {
    return (
      <main className="min-h-screen bg-[#003B49] text-white">
        <div className="max-w-6xl mx-auto px-6 py-10">Couldn’t load rewards.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#003B49] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black mb-2">{doc.path.title}</h1>
        {doc.path.blurb && (
          <p className="text-[#B6E7EB] mb-6">{doc.path.blurb}</p>
        )}

        {/* Free tier banner */}
        <div className="mb-6 rounded-2xl border border-[#15C5C1]/40 bg-[#072b33] p-4 text-[#B6E7EB]">
          Amazon is free for all members. Unlock more stores with{" "}
          <Link
            href="/account/upgrade?plan=PRO"
            className="text-[#15C5C1] underline hover:text-white"
          >
            Pro ($10/mo)
          </Link>
          .
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((it) => {
            const isLocked = !!it.locked && (tier === "free" || tier !== it.tier);
            return (
              <div
                key={it.id}
                className="rounded-2xl border border-white/10 bg-[#072b33] p-4 relative"
              >
                {/* Top right multiplier */}
                <div className="absolute right-3 top-3">
                  <Multiplier m={it.multiplier} tier={it.tier} />
                </div>

                <div className="flex items-center gap-3">
                  {/* Logo */}
                  <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center overflow-hidden">
                    {it.logo ? (
                      <Image
                        src={it.logo}
                        alt={it.title}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xs text-[#9bd1d6]">🏬</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-lg">{it.title}</div>
                    {it.description ? (
                      <div className="text-xs text-[#9bd1d6] mt-1">
                        {it.description}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Lock & notes */}
                <div className="mt-3 space-y-2">
                  {isLocked ? (
                    <div className="flex items-center gap-2">
                      <LockBadge tier={it.tier ?? "pro"} />
                      <Link
                        href={`/account/upgrade?plan=${(it.tier ?? "pro").toUpperCase()}`}
                        className="text-[#15C5C1] text-xs underline hover:text-white"
                      >
                        Upgrade
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <a
                        href={it.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-lg bg-[#FF9151] px-3 py-1.5 text-sm font-bold text-[#003B49] hover:bg-[#FFA36C]"
                      >
                        Shop & earn →
                      </a>
                    </div>
                  )}

                  {it.notes ? (
                    <div className="text-xs text-[#9bd1d6]">{it.notes}</div>
                  ) : null}

                  {/* Tags */}
                  {it.tags && it.tags.length ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {it.tags.map((t) => (
                        <TagBadge key={t} label={t} />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
