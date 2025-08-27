// src/pages/index.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import TrainingTeaser from "@/components/TrainingTeaser";

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#003B49] text-white font-sans flex flex-col">
      {/* NAVBAR (landing-only) */}
      <nav className="w-full flex items-center justify-between px-6 py-4 shadow bg-[#003B49] relative z-20 h-auto">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logos/logo.png"
            alt="Rewmo Logo"
            width={80}
            height={80}
            className="w-[80px] h-[80px] object-contain"
            priority
          />
          <span className="text-[#FF9151] font-extrabold text-xl">RewmoAI</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/features" className="hover:underline">Features</Link>
          <Link href="/shopping" className="hover:underline">Shopping</Link>
          <Link href="/lean-lab" className="hover:underline">Lean Lab</Link>
          <Link href="/rewards" className="hover:underline">Rewards</Link>

          {currentUser ? (
            <>
              <Link
                href="/dashboard"
                className="bg-[#FF9151] text-[#003B49] px-4 py-2 rounded-lg font-bold hover:bg-[#FFA36C]"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* BODY */}
      <main className="flex-1 flex flex-col items-center text-center px-4 py-12">
        <Image src="/logos/logo.png" alt="Rewmo Logo" width={100} height={100} />
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#FF9151] mt-6">
          Welcome to Rewards Mobile AI
        </h1>
        <p className="text-white mt-4 max-w-xl">
          The AI-powered hub for rewards, savings, and smarter financial growth.
          Earn for shopping, referrals, and every dollar you manage smarter.
        </p>

        {/* Training promo (now includes Finance) */}
        <section className="mt-8 w-full max-w-2xl">
          <div className="mx-auto rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Training</h3>
            <p className="mt-1 text-sm text-white/80">
              Hands-on learning tracks with short modules.
            </p>

            <div className="mt-4 flex items-center justify-center gap-2">
              <Link
                href="/learn/genai"
                className="rounded-full bg-teal-600/90 px-3 py-1 text-sm font-semibold text-white hover:bg-teal-500"
              >
                GenAI
              </Link>
              <Link
                href="/learn/tqm"
                className="rounded-full bg-slate-600/90 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-500"
              >
                TQM
              </Link>
              <Link
                href="/learn/finance"
                className="rounded-full bg-amber-500/90 px-3 py-1 text-sm font-semibold text-white hover:bg-amber-400"
              >
                Finance
              </Link>
            </div>
          </div>
        </section>

        {/* Primary CTA */}
        <Link
          href="/join"
          className="mt-8 inline-block bg-[#FF9151] text-[#003B49] px-6 py-3 rounded-lg font-bold hover:bg-[#FFA36C]"
        >
          Get Started & Earn Now
        </Link>

        {/* Beta note */}
        <div className="mt-8 border border-white rounded p-4 max-w-lg w-full text-sm">
          <p className="text-red-400 font-bold">🔴 Beta is LIVE!</p>
          <p>Your rewards and referrals are being tracked. Withdrawals open after launch.</p>
          <p>
            All points follow the{" "}
            <Link href="/reward-rules" className="underline">Reward Rules</Link>.
          </p>
        </div>

        {/* Two-up feature tiles */}
        <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-4xl w-full">
          <div className="border border-orange-400 p-4 rounded">
            <h2 className="text-[#FF9151] font-bold">Personal Shopping Rewards</h2>
            <p className="text-sm mt-2">
              Earn instant cash back & bonus points when you shop your favorite brands.
              Simple, secure, automatic savings—groceries, Amazon, and more!
            </p>
            <Link href="/shopping" className="mt-2 inline-block text-orange-300 underline">
              See eligible stores →
            </Link>
          </div>

          <div className="border border-teal-400 p-4 rounded">
            <h2 className="text-teal-300 font-bold">Business Shopping Rewards</h2>
            <p className="text-sm mt-2">
              Unlock rewards on business essentials, bulk orders, and expense tracking.
              Earn more for your business!
            </p>
            <Link href="/enterpriseai" className="mt-2 inline-block text-teal-300 underline">
              Shop for your business →
            </Link>
          </div>
        </div>

        {/* Lean Lab promo */}
        <div className="mt-12 p-4 border border-teal-400 rounded max-w-xl w-full">
          <h2 className="text-teal-300 font-bold">Lean Lab – RewmoAI Process Management</h2>
          <p className="text-sm mt-2">
            <strong>NEW:</strong> AI-powered process improvement tools for individuals and businesses.
            Map your routines, eliminate waste, and unlock continuous improvement.
          </p>
          <Link href="/lean-lab" className="mt-2 inline-block text-teal-300 underline">
            Learn about Lean Lab →
          </Link>
        </div>

        {/* Optional: teaser tiles for training tracks (kept, but moved below the hero content) */}
        <div className="mt-12 w-full max-w-5xl">
          <TrainingTeaser />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-sm text-white/70 py-4">
        © 2025 RewmoAI |{" "}
        <Link href="/affiliate-disclosure" className="underline">Affiliate Disclosure</Link>{" "} |{" "}
        <Link href="/privacy" className="underline">Privacy</Link>{" "} |{" "}
        <Link href="/terms" className="underline">Terms</Link>
      </footer>
    </div>
  );
}
