import React from "react";
import { useAuth } from "@/lib/AuthProvider"; // Adjust if needed

export default function InvitePage() {
  const { currentUser } = useAuth();
  const referralCode = currentUser?.uid?.slice(-6) || "JOINREWMO"; // Example referral code

  const shareUrl = `https://rewmo.ai/signup?ref=${referralCode}`;
  const message = encodeURIComponent(
    `Try RewmoAI with my referral code! Sign up and get bonus rewards: ${shareUrl}`
  );

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert("Referral link copied!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#fafbfc] px-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-2 text-center">Invite Friends</h1>
      <p className="mb-6 text-center text-gray-700">
        Share RewmoAI and earn bonus rewards for each friend who signs up!
      </p>

      <div className="bg-white p-6 rounded-xl shadow max-w-md w-full flex flex-col items-center mb-4">
        <div className="mb-2 font-semibold text-lg text-gray-800">Your Referral Link</div>
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="border rounded p-2 w-full text-sm mb-2 bg-gray-100 text-center"
        />
        <button
          onClick={copyToClipboard}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded mb-2"
        >
          Copy Link
        </button>
        <div className="flex space-x-3 mt-2">
          <a
            href={`mailto:?subject=Join RewmoAI&body=${message}`}
            className="underline text-blue-500 text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Email
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${message}`}
            className="underline text-blue-500 text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            className="underline text-blue-500 text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-600 max-w-sm text-center">
        <span className="font-bold text-orange-600">Pro Tip:</span> You’ll get extra bonus points for every friend who joins using your link. Invite 5+ friends and unlock a milestone reward!
      </div>
    </div>
  );
}
