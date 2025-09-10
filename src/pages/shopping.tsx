// src/pages/shopping.tsx
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
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
  // gating & metadata
  locked?: boolean;
  tier?: Tier;               // which tier unlocks this item (default: free)
  tags?: string[];
  logo?: string;             // /brands/xxx.svg or /logos/xxx.png
  multiplier?: string;       // "1x" | "2x" | "3x" | ...
  notes?: string;
  active?: boolean;
};

type TrackDoc = {
  path: { id: string; title: string; blurb?: string };
  items: Item[];
};

export default function ShoppingRewardsPage() {
  const [doc, setDoc] = useState<TrackDoc | null>(null);
  const [loading, setLoading] = useState(true);

  // Read member tier from localStorage; default to 'free'
  const [tier, setTier] = useState<Tier>("free");
  useEffect(() => {
    try {
      const v = (localStorage.getItem("rewmo.tier") as Tier) || "free";
      setTier(v);
    } catch {
      setTier("free");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/training/shopping.json", { cache: "no-store" });
        const j = (await r.json()) as TrackDoc;
        if (!cancelled) {
          // sort by explicit order, then title
          const items = [...(j.items || [])].sort((a, b) => {
            const ao = a.order ?? 1e9;
            const bo = b.order ?? 1e9;
            return ao !== bo ? ao - bo : a.title.localeCompare(b.title);
          });
          setDoc({ ...j, items });
        }
      } catch {
        if (!cancelled) setDoc(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const canAccess = (required: Tier | undefined, _locked?: boolean) => {
    const need = required ?? "free";
    if (_locked === false) return true;
    if (need === "free") return true;
    if (need === "pro") return tier === "pro" || tier === "business";
    if (need === "business") return tier === "business";
    return false;
  };

  const multiplierClasses = (required: Tier | undefined) => {
    const need = required ?? "free";
    if (need === "business") return "bg-[#FF9151] text-[#003B49]";
    if (need === "pro") return "bg-[#15C5C1] text-[#003B49]";
    return "bg-white/10 text-white";
  };

  const lockBadge = (required: Tier | undefined) => {
    const need = required ?? "free";
    if (need === "business") return "Business members only";
    if (need === "pro") return "Pro members only";
    return "Free for all members";
  };

  const upgradeHref = (required: Tier | undefined) => {
    const need = required ?? "free";
    if (need === "business") return "/account/upgrade?plan=business";
    if (need === "pro") return "/account/upgrade?plan=pro";
    return "/account/upgrade";
  };

  const upgradeLabel = (required: Tier | undefined) => {
    const need = required ?? "free";
    if (need === "business") return "Upgrade to Business ($20/mo)";
    if (need === "pro") return "Upgrade to Pro ($10/mo)";
    return "Upgrade";
  };

  const unlockedItems = useMemo(() => {
    if (!doc?.items) return [];
    return doc.items.map((it) => ({
      ...it,
      _unlocked: canAccess(it.tier, it.locked) && (it.active ?? true),
    }));
  }, [doc, tier]);

  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>Shopping Rewards</title>
      </Head>

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-black mb-3">Shopping Rewards</h1>
        {doc?.path?.blurb ? (
          <p className="text-[#B6E7EB] mb-6">{doc.path.blurb}</p>
        ) : null}

        {/* Free-tier banner + nudge */}
        <div className="rounded-xl border border-[#15C5C1]/30 bg-[#072b33] px-4 md:px-6 py-4 mb-6">
          <div className="text-sm md:text-base text-[#B6E7EB]">
            Amazon is free for all members. Unlock more stores with{" "}
            <Link href="/account/upgrade?plan=pro" className="text-[#15C5C1] underline">
              Pro ($10/mo)
            </Link>
            .
          </div>
          <div className="mt-1 text-xs md:text-sm text-[#9bd1d6]">
            Upgrade to access Walmart, Delta, Business office supplies, and more.
          </div>
        </div>

        {loading && <div className="text-[#B6E7EB]">Loading offers…</div>}
        {!loading && !doc?.items?.length && (
          <div className="text-[#B6E7EB]">No offers available yet.</div>
        )}

        {/* Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {unlockedItems.map((it) => {
            const unlocked = it._unlocked;
            const need = it.tier ?? "free";

            return (
              <div
                key={it.id}
                className={`relative rounded-2xl border bg-[#072b33] p-4 transition ${
                  unlocked
                    ? "border-[#15C5C1]/30 hover:border-[#15C5C1]/60"
                    : "border-white/10"
                }`}
              >
                {/* Top-right multiplier */}
                {it.multiplier ? (
                  <div
                    className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-bold ${multiplierClasses(
                      it.tier
                    )}`}
                    title={need === "free" ? "Free" : need === "pro" ? "Pro" : "Business"}
                  >
                    {it.multiplier}
                  </div>
                ) : null}

                {/* Logo + Title */}
                <div className="flex items-center gap-3">
                  {it.logo ? (
                    <div className="h-8 w-8 relative shrink-0 rounded-md overflow-hidden bg-white/5">
                      <Image
                        src={it.logo}
                        alt={it.title}
                        fill
                        className="object-contain p-1"
                        sizes="32px"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 shrink-0 rounded-md bg-white/10" />
                  )}

                  <div className="min-w-0">
                    <div className="font-semibold truncate">{it.title}</div>
                    <div className="text-xs text-[#9bd1d6] truncate">
                      {it.description ?? lockBadge(it.tier)}
                    </div>
                  </div>
                </div>

                {/* Lock line / Notes */}
                <div className="mt-3 space-y-2">
                  {/* Lock status (if not free) */}
                  {need !== "free" && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex h-3 w-3 items-center justify-center rounded-sm bg-white/10">
                        🔒
                      </span>
                      <span className="text-[#9bd1d6]">
                        {lockBadge(it.tier)}.{" "}
                        {!unlocked && (
                          <>
                            <Link
                              className="underline text-[#15C5C1] hover:text-white"
                              href={upgradeHref(it.tier)}
                            >
                              Upgrade
                            </Link>
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Notes */}
                  {it.notes ? (
                    <div className="text-xs text-[#9bd1d6]">{it.notes}</div>
                  ) : null}

                  {/* Tags */}
                  {it.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {it.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-[#B6E7EB]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* CTA */}
                <div className="mt-4">
                  {unlocked ? (
                    <a
                      href={it.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg bg-[#FF9151] px-4 py-2 text-[#003B49] font-bold hover:bg-[#FFA36C]"
                    >
                      Shop & earn →
                    </a>
                  ) : (
                    <Link
                      href={upgradeHref(it.tier)}
                      className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
                    >
                      {upgradeLabel(it.tier)}
                    </Link>
                  )}
                </div>

                {/* Dim overlay for locked items */}
                {!unlocked && (
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[#001a1f]/20" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
