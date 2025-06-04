// src/components/ShareReferralCard.tsx
import React, { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { UserPlus, Share2 } from "lucide-react";

export default function ShareReferralCard({ referralLink, userId }: { referralLink: string; userId: string }) {
  const [shareError, setShareError] = useState<string | null>(null);
  const shareMsg = `Join RewmoAI and earn rewards for shopping, rent, and referrals! Use my link: ${referralLink}`;

  async function logShare(channel: string) {
    if (!userId) return;
    await updateDoc(doc(db, "users", userId), {
      shares: arrayUnion({ channel, timestamp: Date.now() }),
    });
  }

  async function handleWebShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Join RewmoAI", text: shareMsg, url: referralLink });
        await logShare("webshare");
      } else {
        setShareError("Sharing not supported in your browser.");
      }
    } catch (e) {
      setShareError("Share canceled or failed.");
    }
  }

  function handleSocialShare(channel: string) {
    let url = "";
    if (channel === "x") url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMsg)}`;
    if (channel === "whatsapp") url = `https://wa.me/?text=${encodeURIComponent(shareMsg)}`;
    if (channel === "email") url = `mailto:?subject=Earn%20rewards%20with%20RewmoAI!&body=${encodeURIComponent(shareMsg)}`;
    if (url) window.open(url, "_blank");
    logShare(channel);
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 shadow-2xl rounded-2xl p-6 mb-6 border border-orange-200">
      <div className="flex items-center gap-3 mb-2">
        <Share2 className="w-7 h-7 text-orange-500" />
        <h2 className="text-xl font-bold text-orange-700">Share Your Referral Link</h2>
      </div>
      <p className="text-gray-700 mb-4">
        Invite friends to RewmoAI! Get <span className="font-semibold text-orange-600">bonus rewards</span> every time someone joins with your link.
      </p>
      <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
        <input
          readOnly
          className="w-full font-mono text-sm bg-orange-100 border border-orange-300 rounded-md px-3 py-2"
          value={referralLink}
        />
        <button
          onClick={() => { navigator.clipboard.writeText(referralLink); }}
          className="ml-0 md:ml-2 mt-2 md:mt-0 px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition"
        >
          Copy
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={handleWebShare}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg font-semibold"
        >
          Share on Device
        </button>
        <button
          onClick={() => handleSocialShare("x")}
          className="flex-1 bg-blue-900 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold"
        >
          X
        </button>
        <button
          onClick={() => handleSocialShare("whatsapp")}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-semibold"
        >
          WhatsApp
        </button>
        <button
          onClick={() => handleSocialShare("email")}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-semibold"
        >
          Email
        </button>
      </div>
      {shareError && <p className="text-red-500 text-sm mt-2">{shareError}</p>}
      <p className="mt-2 text-gray-500 text-xs text-center">
        Track your shares and referrals in your dashboard. <UserPlus className="inline w-4 h-4" />
      </p>
    </div>
  );
}
