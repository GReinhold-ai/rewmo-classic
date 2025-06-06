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
    <div className="w-full max-w-md mx-auto bg-[#072b33] shadow-2xl rounded-2xl p-6 mb-6 border border-[#15C5C1]">
      <div className="flex items-center gap-3 mb-2">
        <Share2 className="w-7 h-7 text-[#FF9151]" />
        <h2 className="text-xl font-bold text-[#FF9151]">Share Your Referral Link</h2>
      </div>
      <p className="text-[#B6E7EB] mb-4">
        Invite friends to RewmoAI! Get <span className="font-semibold text-[#FF9151]">bonus rewards</span> every time someone joins with your link.
      </p>
      <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
        <input
          readOnly
          className="w-full font-mono text-sm bg-[#003B49] border border-[#15C5C1] rounded-md px-3 py-2 text-[#15C5C1] shadow-inner"
          value={referralLink}
        />
        <button
          onClick={() => { navigator.clipboard.writeText(referralLink); }}
          className="ml-0 md:ml-2 mt-2 md:mt-0 px-4 py-2 bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-semibold rounded-lg transition"
        >
          Copy
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          onClick={handleWebShare}
          className="flex-1 bg-[#15C5C1] hover:bg-[#FF9151] text-[#003B49] px-3 py-2 rounded-lg font-semibold transition"
        >
          Share on Device
        </button>
        <button
          onClick={() => handleSocialShare("x")}
          className="flex-1 bg-[#15202b] hover:bg-[#0a0a14] text-white px-3 py-2 rounded-lg font-semibold"
        >
          X
        </button>
        <button
          onClick={() => handleSocialShare("whatsapp")}
          className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-[#003B49] px-3 py-2 rounded-lg font-semibold"
        >
          WhatsApp
        </button>
        <button
          onClick={() => handleSocialShare("email")}
          className="flex-1 bg-[#B6E7EB] hover:bg-[#15C5C1] text-[#003B49] px-3 py-2 rounded-lg font-semibold"
        >
          Email
        </button>
      </div>
      {shareError && <p className="text-[#FF9151] text-sm mt-2">{shareError}</p>}
      <p className="mt-2 text-[#B6E7EB] text-xs text-center">
        Track your shares and referrals in your dashboard. <UserPlus className="inline w-4 h-4" />
      </p>
    </div>
  );
}
