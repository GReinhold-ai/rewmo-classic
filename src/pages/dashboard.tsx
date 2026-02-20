import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  getDoc,
  Timestamp,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

import { useAuth } from "@/lib/AuthProvider";
import SignInOverlay from "@/components/SignInOverlay";

/* =============================
   Types
============================= */
type RefItem = {
  id: string;
  referrerId?: string;
  referredUserId?: string;
  referredEmail?: string;
  email?: string;
  status?: string;
  points?: number;
  date?: Timestamp | { seconds: number };
  timestamp?: Timestamp;
};

type RewardItem = {
  id: string;
  type: string;
  points: number;
  description?: string;
  date?: Timestamp | { seconds: number };
};

/* =============================
   Helpers
============================= */
const tsToDate = (t?: Timestamp | { seconds: number }) =>
  t
    ? t instanceof Timestamp
      ? t.toDate()
      : new Date((t as any).seconds * 1000)
    : undefined;

/* =============================
   Hooks: User Stats (rewards, referralCount, referralCode)
============================= */
function useUserStats(userId?: string) {
  const [loading, setLoading] = useState(false);
  const [rewards, setRewards] = useState<number>(0);
  const [referralCount, setReferralCount] = useState<number>(0);
  const [referralCode, setReferralCode] = useState<string>("");

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const snap = await getDoc(doc(db, "users", userId));
        if (mounted && snap.exists()) {
          const d = snap.data() as any;
          setRewards(d.rewards ?? 0);
          setReferralCount(d.referralCount ?? 0);
          setReferralCode(d.referralCode ?? userId);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  return { loading, rewards, referralCount, referralCode };
}

/* =============================
   Hooks: Referral History (supports BOTH schemas)
============================= */
function useReferralHistory(userId?: string) {
  const [loading, setLoading] = useState(false);
  const [referralHistory, setReferralHistory] = useState<RefItem[]>([]);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const qRoot = query(
          collection(db, "referrals"),
          where("referrerId", "==", userId),
          orderBy("timestamp", "desc"),
          limit(100)
        );
        const rootSnap = await getDocs(qRoot);

        if (rootSnap.size > 0) {
          const items: RefItem[] = rootSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
          if (mounted) setReferralHistory(items);
          return;
        }

        const qLegacy = query(
          collection(db, "users", userId, "referrals"),
          orderBy("date", "desc"),
          limit(100)
        );
        const legacySnap = await getDocs(qLegacy);
        const items: RefItem[] = legacySnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
        if (mounted) setReferralHistory(items);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return { referralHistory, loading };
}

/* =============================
   Hooks: Shopping Rewards (legacy subcollection)
============================= */
function useShoppingRewards(userId?: string) {
  const [loading, setLoading] = useState(false);
  const [shoppingRewards, setShoppingRewards] = useState<RewardItem[]>([]);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const qRewards = query(
          collection(db, "users", userId, "rewards"),
          where("type", "==", "shopping"),
          orderBy("date", "desc"),
          limit(100)
        );
        const snap = await getDocs(qRewards);
        const items: RewardItem[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
        if (mounted) setShoppingRewards(items);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return { shoppingRewards, loading };
}

/* =============================
   UI: Stats Header
============================= */
function StatsHeader({
  rewards,
  referralCount,
}: {
  rewards: number;
  referralCount: number;
}) {
  return (
    <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-6 text-center copy-justify">
      <h1 className="text-2xl md:text-3xl font-black text-[#FF9151] mb-2">Dashboard</h1>
      <p className="text-[#B6E7EB]">
        Track your rewards and referral progress below. Keep sharing to earn more!
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-[#B6E7EB]">Total Rewards</div>
          <div className="text-2xl font-extrabold text-[#15C5C1]">{rewards}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-[#B6E7EB]">Referrals</div>
          <div className="text-2xl font-extrabold text-[#FFA36C]">{referralCount}</div>
        </div>
      </div>
    </div>
  );
}

/* =============================
   UI: Referral Link Card (copyable)
============================= */
function ReferralLinkCard({
  referralCode,
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "",
}: {
  referralCode: string;
  baseUrl?: string;
}) {
  const link = useMemo(() => {
    const cleanBase =
      baseUrl && baseUrl.startsWith("http")
        ? baseUrl
        : typeof window !== "undefined"
        ? window.location.origin
        : "";
    return `${cleanBase}/?ref=${encodeURIComponent(referralCode)}`;
  }, [referralCode, baseUrl]);

  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-[#072b33] rounded-xl border border-[#15C5C1] p-6 shadow-md copy-justify">
      <h3 className="text-lg font-bold text-[#15C5C1] mb-2">Your Referral Link</h3>
      <p className="text-[#B6E7EB]">
        Share this link with friends. When they join and make a qualifying purchase, you earn bonus
        points automatically.
      </p>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          readOnly
          value={link}
          className="flex-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm text-white"
        />
        <button
          onClick={copy}
          className="rounded-lg bg-[#FF9151] text-[#003B49] px-4 py-2 font-semibold hover:bg-[#FFA36C] transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p className="mt-2 text-xs text-[#B6E7EB]">
        Tip: post it in your group chat, email signature, or social bio.
      </p>
    </div>
  );
}

/* =============================
   UI: Referral Tracker
============================= */
function ReferralTracker({ data }: { data: RefItem[] }) {
  if (!data?.length)
    return (
      <div className="text-[#B6E7EB] copy-justify">
        No referrals yet. Share your link to start earning bonus points!
      </div>
    );

  return (
    <div className="copy-justify">
      <h3 className="text-lg font-bold text-[#15C5C1] mb-2">Referral History</h3>
      <ul className="space-y-2">
        {data.map((r) => {
          const displayDate = tsToDate(r.timestamp || (r as any).date);
          const dateStr = displayDate ? displayDate.toLocaleDateString() : "";
          const who = r.email || r.referredEmail || r.referredUserId || "New member";
          const pts = r.points ?? 500;
          const st = r.status || "Joined";
          return (
            <li
              key={r.id}
              className="bg-[#003B49] rounded p-3 flex flex-col md:flex-row md:items-center gap-2"
            >
              <span className="font-semibold text-[#FF9151]">+{pts} pts</span>
              <span className="flex-1 text-[#B6E7EB]">
                <b>{who}</b> {st}
              </span>
              <span className="text-xs text-[#15C5C1]">{dateStr}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* =============================
   UI: Shopping Reward History
============================= */
function ShoppingRewardHistory({ data }: { data: RewardItem[] }) {
  if (!data?.length)
    return (
      <div className="text-[#B6E7EB] copy-justify">
        No Amazon shopping rewards yet. Shop using RewmoAI to earn!
      </div>
    );

  return (
    <div className="copy-justify">
      <h3 className="text-lg font-bold text-[#FF9151] mb-2">Amazon Reward History</h3>
      <ul className="space-y-2">
        {data.map((reward) => {
          const displayDate = tsToDate(reward.date);
          const dateStr = displayDate ? displayDate.toLocaleDateString() : "";
          return (
            <li
              key={reward.id}
              className="bg-[#072b33] rounded p-3 flex flex-col md:flex-row md:items-center gap-2"
            >
              <span className="font-semibold text-[#15C5C1]">+{reward.points} pts</span>
              <span className="flex-1 text-[#B6E7EB]">
                {reward.description || "Amazon Purchase"}
              </span>
              <span className="text-xs text-[#FF9151]">{dateStr}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* =============================
   MAIN DASHBOARD PAGE
============================= */
export default function DashboardPage() {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;
  const router = useRouter();

  const { loading: loadingStats, rewards, referralCount, referralCode } = useUserStats(userId);
  const { referralHistory, loading: loadingReferrals } = useReferralHistory(userId);
  const { shoppingRewards, loading: loadingRewards } = useShoppingRewards(userId);

  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col items-center px-2">
      {/* Sign-in overlay for guests */}
      {!currentUser && (
        <SignInOverlay 
          title="Sign in to view your dashboard"
          description="Track your rewards, referrals, and shopping earnings all in one place."
        />
      )}

      {/* Main Content */}
      <main className="w-full max-w-2xl mx-auto py-8 flex flex-col gap-8">
        <StatsHeader rewards={rewards} referralCount={referralCount} />

        <ReferralLinkCard referralCode={referralCode} />

        {/* Referral Tracker */}
        <div className="bg-[#072b33] rounded-xl border border-[#15C5C1] p-6 shadow-md">
          {loadingReferrals ? (
            <div className="text-[#B6E7EB]">Loading referrals</div>
          ) : (
            <ReferralTracker data={referralHistory} />
          )}
        </div>

        {/* Amazon Reward History */}
        <div className="bg-[#072b33] rounded-xl border border-[#FF9151] p-6 shadow-md">
          {loadingRewards ? (
            <div className="text-[#B6E7EB]">Loading shopping rewards</div>
          ) : (
            <ShoppingRewardHistory data={shoppingRewards} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] w-full">
        <span>
           {new Date().getFullYear()} RewmoAI |{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-[#FFA36C] text-[#FF9151]">
            Affiliate Disclosure
          </Link>{" "}
          |{" "}
          <Link href="/privacy" className="underline hover:text-[#FFA36C] text-[#FF9151]">
            Privacy
          </Link>{" "}
          |{" "}
          <Link href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">
            Terms
          </Link>
        </span>
      </footer>
    </div>
  );
}
