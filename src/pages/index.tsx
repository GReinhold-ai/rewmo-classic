// src/pages/index.tsx

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSignupWithReferral } from "@/lib/useSignupWithReferral";
import { useAuth } from "@/lib/AuthProvider";

export default function LandingPage() {
  const router = useRouter();
  const { currentUser } = useAuth(); // This should be null if not signed in, user object if signed in
  const { signInWithGoogleAndProfile, loading, error } = useSignupWithReferral();

  // If already signed in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  const handleJoin = async () => {
    const result = await signInWithGoogleAndProfile();
    if (result) {
      router.replace("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-x-hidden">
      {/* Logo */}
      <Image
        src="/logos/logo.png"
        alt="RewmoAI Logo"
        width={180}
        height={80}
        className="mb-6 mx-auto block rounded-full drop-shadow-lg"
        priority
      />

      {/* Welcome Headline */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-orange-500 text-center tracking-tight drop-shadow">
        Welcome to Rewards Mobile AI
      </h1>
      <p className="mb-5 text-center max-w-md text-lg text-orange-100">
        Groundbreaking financial education and guidance, powered by AI.<br />
        <span className="text-orange-300 font-semibold">
          Unlock rewards for shopping, rent, and more—customized for you!
        </span>
      </p>

      {/* CTA Button */}
      <button
        onClick={handleJoin}
        disabled={loading}
        aria-busy={loading}
        className={`
          bg-orange-500 hover:bg-orange-600 active:bg-orange-700
          transition text-white font-bold py-3 px-8 rounded-2xl
          mt-6 text-lg shadow-xl outline-none
          ${loading ? "opacity-60 cursor-not-allowed animate-pulse" : ""}
        `}
      >
        {loading ? (
          <span>
            <span className="inline-block w-4 h-4 mr-2 rounded-full border-2 border-t-2 border-white border-t-orange-600 animate-spin align-middle" /> 
            Signing in...
          </span>
        ) : (
          <>Join Rewmo Now</>
        )}
      </button>
      {error && (
        <p
          className="text-red-400 mt-4 font-semibold bg-white/10 px-4 py-2 rounded-lg shadow"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Beta/tester Info */}
      <div className="mt-12 max-w-lg bg-white/10 rounded-xl p-4 text-center text-base text-orange-200 shadow-md border border-orange-300/20">
        🚀 Your rewards and referrals are being tracked. Withdrawals open after launch.
        <br />
        All points follow the{" "}
        <a
          href="/reward-rules"
          className="underline text-orange-400 hover:text-orange-200 transition"
        >
          Reward Rules
        </a>.
      </div>

      {/* Gradient glow (for modern visual polish) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-gradient-to-tr from-orange-500/30 via-orange-600/20 to-orange-500/0 rounded-full blur-2xl z-0"
      />
    </main>
  );
}
