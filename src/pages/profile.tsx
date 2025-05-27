import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import BottomTabBar from "@/components/BottomTabBar";

const REFERRAL_BONUS_MILESTONES = [5, 10, 25, 50, 100];
const BONUS_POINTS = 1000;

export default function ProfilePage() {
  const { currentUser } = useAuth();
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

  // (Optional) Bonus milestone UI feedback
  useEffect(() => {
    if (REFERRAL_BONUS_MILESTONES.includes(referralCount)) {
      setBonusUnlocked(true);
      setTimeout(() => setBonusUnlocked(false), 3000);
    }
  }, [referralCount]);

  // Share link copy handler
  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // --- Simulate referral on button click for demo ---
  // Remove in production! Instead, increment when someone signs up via your referral logic.
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
    // Refresh state
    const userDoc = await getDoc(userRef);
    setReferralCount(userDoc.data()?.referralCount || 0);
    setPoints(userDoc.data()?.points || 0);
  };

  return (
    <>
      <main className="min-h-screen bg-black text-white flex flex-col items-center px-3 pb-16 pt-8">
        {/* Logo */}
        <img src="/logos/logo.png" alt="RewmoAI Logo" className="h-12 mb-4" />

        <h1 className="text-2xl font-bold mb-3 text-orange-400">Profile & Referrals</h1>

        {currentUser && (
          <>
            <div className="w-full max-w-md mb-5">
              <div className="bg-gray-900/60 p-4 rounded-xl shadow text-center">
                <div className="text-base mb-1">
                  <span className="font-medium text-gray-200">Welcome,</span>{" "}
                  <span className="font-semibold text-orange-400">{currentUser.email}</span>
                </div>
                <div className="text-xs text-gray-400">User ID: {currentUser.uid}</div>
              </div>
            </div>
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
            {/* Show referral count & points */}
            <div className="mb-6 w-full max-w-md text-center">
              <div className="flex flex-col gap-2 md:flex-row items-center justify-center">
                <span className="text-base font-semibold text-orange-500">
                  Referrals: {referralCount}
                </span>
                <span className="text-base font-semibold text-orange-300 md:ml-8">
                  Reward Points: {points}
                </span>
              </div>
              {/* Show bonus unlock */}
              {bonusUnlocked && (
                <div className="mt-3 px-4 py-2 rounded bg-green-200 text-green-800 font-semibold text-sm animate-bounce">
                  🎉 Bonus Unlocked! +{BONUS_POINTS} Points!
                </div>
              )}
            </div>
            {/* Simulate referrals for demo/testing */}
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
          </>
        )}

        {!currentUser && (
          <div className="bg-red-100 text-red-700 px-6 py-3 rounded-lg mt-10">
            Please sign in to view your profile and referral rewards.
          </div>
        )}
      </main>
      <BottomTabBar />
    </>
  );
}
