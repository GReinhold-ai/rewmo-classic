import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useAuth } from "@/lib/AuthProvider";
import Image from "next/image";
import Link from "next/link";

// ----- Referral History Hook -----
function useReferralHistory(userId: string | undefined) {
  const [referralHistory, setReferralHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const fetchReferrals = async () => {
      const q = query(
        collection(db, "users", userId, "referrals"),
        orderBy("date", "desc")
      );
      const snap = await getDocs(q);
      setReferralHistory(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchReferrals();
  }, [userId]);
  return { referralHistory, loading };
}

// ----- Shopping Rewards Hook -----
function useShoppingRewards(userId: string | undefined) {
  const [shoppingRewards, setShoppingRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const fetchRewards = async () => {
      const q = query(
        collection(db, "users", userId, "rewards"),
        where("type", "==", "shopping"),
        orderBy("date", "desc")
      );
      const snap = await getDocs(q);
      setShoppingRewards(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchRewards();
  }, [userId]);
  return { shoppingRewards, loading };
}

// ----- UI Components -----
function ReferralTracker({ data }: { data: any[] }) {
  if (!data.length)
    return <div className="text-[#B6E7EB]">No referrals yet. Share your link to start earning bonus points!</div>;
  return (
    <div>
      <h3 className="text-lg font-bold text-[#15C5C1] mb-2">Referral History</h3>
      <ul className="space-y-2">
        {data.map((r) => (
          <li key={r.id} className="bg-[#003B49] rounded p-3 flex flex-col md:flex-row md:items-center gap-2">
            <span className="font-semibold text-[#FF9151]">+{r.points || 1000} pts</span>
            <span className="flex-1 text-[#B6E7EB]">
              <b>{r.email || r.referredEmail}</b> {r.status || "Joined"}
            </span>
            <span className="text-xs text-[#15C5C1]">{r.date ? new Date(r.date.seconds * 1000).toLocaleDateString() : ""}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShoppingRewardHistory({ data }: { data: any[] }) {
  if (!data.length)
    return <div className="text-[#B6E7EB]">No Amazon shopping rewards yet. Shop using RewmoAI to earn!</div>;
  return (
    <div>
      <h3 className="text-lg font-bold text-[#FF9151] mb-2">Amazon Reward History</h3>
      <ul className="space-y-2">
        {data.map((reward) => (
          <li key={reward.id} className="bg-[#072b33] rounded p-3 flex flex-col md:flex-row md:items-center gap-2">
            <span className="font-semibold text-[#15C5C1]">+{reward.points} pts</span>
            <span className="flex-1 text-[#B6E7EB]">
              {reward.description || "Amazon Purchase"}
            </span>
            <span className="text-xs text-[#FF9151]">{reward.date ? new Date(reward.date.seconds * 1000).toLocaleDateString() : ""}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ----- MAIN DASHBOARD PAGE -----
export default function DashboardPage() {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  // Firestore hooks
  const { referralHistory, loading: loadingReferrals } = useReferralHistory(userId);
  const { shoppingRewards, loading: loadingRewards } = useShoppingRewards(userId);

  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col items-center px-2">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-4 md:px-12 py-2 bg-[#003B49] shadow">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/logo.png"
            alt="Rewmo Logo"
            width={48}
            height={48}
            className="rounded-none"
            priority
          />
          <span className="text-[#FF9151] font-extrabold text-xl tracking-tight hidden sm:inline">
            RewmoAI
          </span>
        </Link>
        <div className="flex gap-6">
          <Link href="/rewards" className="text-[#B6E7EB] font-semibold hover:text-[#FF9151]">Rewards</Link>
          <Link href="/shopping" className="text-[#B6E7EB] font-semibold hover:text-[#FF9151]">Shopping</Link>
          <Link href="/lean-lab" className="text-[#B6E7EB] font-semibold hover:text-[#15C5C1]">Lean Lab</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full max-w-2xl mx-auto py-8 flex flex-col gap-8">
        <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-8 mb-4 text-center">
          <h1 className="text-2xl md:text-3xl font-black text-[#FF9151] mb-2">
            Dashboard
          </h1>
          <p className="text-[#B6E7EB] mb-2">
            Welcome, <span className="text-[#15C5C1] font-semibold">{currentUser?.displayName || currentUser?.email || "Member"}</span>!
          </p>
          <p className="text-[#FFA36C] mb-2">Your rewards, referrals, and savings all in one place.</p>
        </div>

        {/* Referral Tracker */}
        <div className="bg-[#072b33] rounded-xl border border-[#15C5C1] p-6 mb-2">
          {loadingReferrals ? (
            <div className="text-[#B6E7EB]">Loading referrals…</div>
          ) : (
            <ReferralTracker data={referralHistory} />
          )}
        </div>

        {/* Amazon Reward History */}
        <div className="bg-[#072b33] rounded-xl border border-[#FF9151] p-6">
          {loadingRewards ? (
            <div className="text-[#B6E7EB]">Loading shopping rewards…</div>
          ) : (
            <ShoppingRewardHistory data={shoppingRewards} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] w-full">
        <span>
          © {new Date().getFullYear()} RewmoAI |{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-[#FFA36C] text-[#FF9151]">Affiliate Disclosure</Link> |{" "}
          <Link href="/privacy" className="underline hover:text-[#FFA36C] text-[#FF9151]">Privacy</Link> |{" "}
          <Link href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">Terms</Link>
        </span>
      </footer>
    </div>
  );
}
