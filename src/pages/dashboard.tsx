// src/pages/dashboard.tsx
import React from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/AuthProvider"; // adjust import path as needed

// Dynamically import your referral card (avoids SSR errors with Firebase)
const ShareReferralCard = dynamic(() => import("@/components/ShareReferralCard"), { ssr: false });

export default function DashboardPage() {
  const { currentUser, referralLink } = useAuth();

  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col items-center">
      <main className="w-full max-w-2xl flex flex-col items-center pt-12 px-4">
        <h1 className="text-3xl md:text-4xl font-black mb-6 text-[#FF9151] tracking-tight text-center">
          Your Dashboard
        </h1>

        {/* Referral Card */}
        {currentUser && referralLink && (
          <ShareReferralCard referralLink={referralLink} userId={currentUser.uid} />
        )}

        {/* Add more dashboard widgets here */}
        {/* Example placeholder: */}
        <div className="w-full bg-[#072b33] rounded-2xl p-8 mt-6 shadow-xl border border-[#15C5C1] text-[#B6E7EB]">
          <h2 className="text-xl font-bold text-[#15C5C1] mb-2">Welcome to RewmoAI</h2>
          <p>Your rewards and referrals are being tracked. Stay tuned for more features!</p>
        </div>
      </main>

      <footer className="mt-auto w-full text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] bg-[#003B49]">
        <span>
          © {new Date().getFullYear()} RewmoAI |{" "}
          <a href="/affiliate-disclosure" className="underline hover:text-[#FFA36C] text-[#FF9151]">Affiliate Disclosure</a> |{" "}
          <a href="/privacy" className="underline hover:text-[#FFA36C] text-[#FF9151]">Privacy</a> |{" "}
          <a href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">Terms</a>
        </span>
      </footer>
    </div>
  );
}
