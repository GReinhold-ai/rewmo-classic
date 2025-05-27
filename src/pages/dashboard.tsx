import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import BottomTabBar from "@/components/BottomTabBar";
// import SuggestionForm from "@/components/SuggestionForm"; // Uncomment if you have this component

const REFERRAL_BONUS_MILESTONES = [5, 10, 25, 50, 100];
const BONUS_POINTS = 1000;

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const [referralCount, setReferralCount] = useState<number>(0);
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const [points, setPoints] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const inviteLink = currentUser
    ? `https://rewmo.ai/?ref=${currentUser.uid}`
    : "";

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const data = userDoc.data() || {};
        setReferralCount(data.referralCount || 0);
        setPoints(data.points || 0);
      }
    }
    fetchUserData();
  }, [currentUser]);

  // Bonus milestone UI feedback
  useEffect(() => {
    if (REFERRAL_BONUS_MILESTONES.includes(referralCount)) {
      setBonusUnlocked(true);
      setTimeout(() => setBonusUnlocked(false), 3000);
    }
  }, [referralCount]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Simulate referral for demo (REMOVE in prod)
  const simulateReferral = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(userRef);
      if (!snap.exists()) return;
      const prevCount = snap.data()?.referralCount || 0;
      const newCount = prevCount + 1;
      let bonus = 0;
      if (REFERRAL_BONUS_MILESTONES.includes(newCount)) {
        bonus = BONUS_POINTS;
      }
      transaction.update(userRef, {
        referralCount: newCount,
        ...(bonus ? { points: (snap.data()?.points || 0) + bonus } : {}),
        lastReferral: serverTimestamp(),
      });
    });
    const userDoc = await getDoc(userRef);
    setReferralCount(userDoc.data()?.referralCount || 0);
    setPoints(userDoc.data()?.points || 0);
  };

  return (
    <>
      <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 pb-16 pt-8">
        {/* Logo */}
        <img src="/logos/logo.png" alt="RewmoAI Logo" className="h-12 mb-4" />

        <h1 className="text-3xl font-bold text-orange-500 mb-2">RewmoAI Dashboard</h1>
        <div className="mb-4 text-gray-300 text-center max-w-md">
          Your hub for rewards, referrals, and account stats.
        </div>

        {currentUser ? (
          <>
            <div className="w-full max-w-md mb-4">
              <div className="bg-gray-900/60 p-4 rounded-xl shadow text-center">
                <span className="font-medium text-gray-200">Welcome, </span>
                <span className="font-semibold text-orange-400">{currentUser.email}</span>
                <button
                  onClick={logout}
                  className="ml-4 px-2 py-1 rounded bg-orange-500 text-white text-xs"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Referrals */}
            <div className="w-full max-w-md mb-4 bg-orange-50/90 p-4 rounded-xl shadow text-center">
              <h3 className="font-bold text-orange-700 mb-2">Invite Friends & Earn Rewards</h3>
              <div className="flex flex-col md:flex-row items-center gap-2 justify-center">
                <input
                  value={inviteLink}
                  readOnly
                  className="w-full max-w-xs px-2 py-1 rounded border border-gray-300 text-sm bg-gray-100 text-gray-700"
                />
                <button
                  onClick={handleCopy}
                  className="ml-0 md:ml-2 mt-2 md:mt-0 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs mt-2 text-gray-500">
                Share your link. Earn bonus points for each friend who joins!
              </p>
            </div>

            {/* Referral stats & bonus */}
            <div className="mb-6 w-full max-w-md text-center">
              <div className="flex flex-col gap-2 md:flex-row items-center justify-center">
                <span className="text-base font-semibold text-orange-500">
                  Referrals: {referralCount}
                </span>
                <span className="text-base font-semibold text-orange-300 md:ml-8">
                  Reward Points: {points}
                </span>
              </div>
              {bonusUnlocked && (
                <div className="mt-3 px-4 py-2 rounded bg-green-200 text-green-800 font-semibold text-sm animate-bounce">
                  🎉 Bonus Unlocked! +{BONUS_POINTS} Points!
                </div>
              )}
            </div>

            {/* Simulate referral for testing */}
            <div className="w-full max-w-md text-center">
              <button
                className="px-4 py-1 rounded bg-blue-600 text-white text-sm mb-2"
                onClick={simulateReferral}
              >
                Simulate Referral (for testing)
              </button>
              <p className="text-xs text-gray-400 mb-2">
                <em>Remove this button in production!</em>
              </p>
            </div>

            {/* Account Overview */}
            <section className="mb-8 w-full flex flex-col items-center">
              <div className="bg-white rounded-xl shadow p-6 mb-6 text-black w-full">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                  Your Account Overview
                </h2>
                <div className="text-gray-600 text-center">
                  Account stats and latest activities will show here.
                </div>
              </div>
            </section>

            {/* Uncomment if you have a SuggestionForm */}
            {/* <section className="w-full flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-2 text-orange-700 text-center">
                Have an idea or feedback?
              </h2>
              {currentUser?.uid ? (
                <SuggestionForm userId={currentUser.uid} />
              ) : (
                <div className="text-gray-500 text-center">Sign in to submit suggestions.</div>
              )}
            </section> */}
          </>
        ) : (
          <div className="bg-red-100 text-red-700 px-6 py-3 rounded-lg mt-10">
            Please sign in to access your dashboard.
          </div>
        )}
      </main>
      <BottomTabBar />
    </>
  );
}
