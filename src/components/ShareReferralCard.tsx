import React, { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";

type Props = {
  referralLink: string;
  className?: string;
};

const ShareReferralCard: React.FC<Props> = ({ referralLink, className }) => {
  const { currentUser } = useAuth(); // now fully typed
  const [shareError, setShareError] = useState<string | null>(null);

  const shareMsg = `Join RewmoAI and earn rewards for shopping, rent, and referrals! Use my link: ${referralLink}`;

  const handleShare = async () => {
    setShareError(null);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "RewmoAI",
          text: shareMsg,
          url: referralLink,
        });
        return;
      }
      // fallback: copy full message
      await navigator.clipboard.writeText(shareMsg);
    } catch (e: any) {
      setShareError(e?.message ?? "Unable to share. Link copied instead.");
      try {
        await navigator.clipboard.writeText(shareMsg);
      } catch {
        /* ignore */
      }
    }
  };

  const handleCopy = async () => {
    setShareError(null);
    try {
      await navigator.clipboard.writeText(referralLink);
    } catch (e: any) {
      setShareError(e?.message ?? "Copy failed");
    }
  };

  return (
    <div
      className={
        className ??
        "rounded-xl border border-teal-800 bg-teal-900/30 p-4 text-white"
      }
    >
      <div className="mb-2 text-sm opacity-80">
        {currentUser
          ? "Share your link and earn when friends join."
          : "Sign in to get your personal referral link."}
      </div>

      <div className="flex items-center gap-2">
        <input
          className="w-full rounded-md bg-teal-950 px-3 py-2 text-sm outline-none"
          readOnly
          value={referralLink}
        />
        <button
          onClick={handleCopy}
          className="rounded-md bg-amber-400 px-3 py-2 font-semibold text-black"
          type="button"
        >
          Copy
        </button>
        <button
          onClick={handleShare}
          className="rounded-md bg-amber-500 px-3 py-2 font-semibold text-black"
          type="button"
        >
          Share
        </button>
      </div>

      {shareError && (
        <div className="mt-2 text-xs text-red-400">{shareError}</div>
      )}
    </div>
  );
};

export default ShareReferralCard;
