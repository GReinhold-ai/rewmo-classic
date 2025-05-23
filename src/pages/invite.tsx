// src/pages/invite.tsx

import { useState } from "react";
import BottomTabBar from "@/components/BottomTabBar";
import { useAuth } from "@/lib/AuthProvider";

export default function InvitePage() {
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState(false);

  // Example referral code logic (replace with your actual logic)
  const referralCode = currentUser?.uid
    ? currentUser.uid.slice(0, 8)
    : "rewmoai123";
  const referralLink = `https://rewmo.ai/invite?code=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#fafbfc] px-4 pt-10">
        <h1 className="text-3xl font-bold text-orange-600 mb-2 text-center">
          Invite Friends
        </h1>
        <p className="mb-6 text-center text-gray-700">
          Share RewmoAI and earn bonus rewards for each friend who signs up!
        </p>
        <div className="w-full max-w-md bg-white rounded-xl shadow p-5 flex flex-col items-center">
          <div className="mb-3 text-gray-800 font-semibold text-sm">
            Your Referral Link:
          </div>
          <div className="flex w-full items-center gap-2 mb-4">
            <input
              className="flex-1 px-3 py-1 rounded border border-gray-300 bg-gray-100 text-xs text-gray-600"
              value={referralLink}
              readOnly
            />
            <button
              onClick={handleCopy}
              className={`px-2 py-1 rounded bg-orange-500 text-white text-xs font-semibold transition ${
                copied ? "bg-green-500" : ""
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="text-xs text-gray-500 text-center mb-2">
            Give your code to friends or share this link. You’ll both earn rewards!
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-orange-400 max-w-sm">
          Invite as many friends as you like — every successful sign-up boosts your rewards.
        </div>
      </div>
      <BottomTabBar />
    </>
  );
}
