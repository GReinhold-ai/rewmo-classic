// src/pages/profile.tsx
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";
import SignInOverlay from "@/components/SignInOverlay";
import RewardHistory from "@/components/RewardHistory";

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <main className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>Profile | RewmoAI</title>
      </Head>

      {/* Sign-in overlay for guests */}
      {!currentUser && (
        <SignInOverlay 
          title="Sign in to view your profile"
          description="Access your account details, rewards history, and settings."
        />
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-[#FF9151]">Profile</h1>
          {currentUser && (
            <p className="text-[#B6E7EB]">
              Signed in as <span className="font-mono">{currentUser.email}</span>
            </p>
          )}
        </header>

        <section className="rounded-xl border border-[#15C5C1]/40 bg-[#072b33] p-5">
          <h2 className="text-lg font-semibold text-[#15C5C1] mb-3">Reward history</h2>
          <RewardHistory />
        </section>

        <div className="mt-8 flex gap-4">
          <Link href="/shopping" className="underline text-[#B6E7EB] hover:text-[#FF9151]">
            Browse shopping partners 
          </Link>
          <Link href="/training" className="underline text-[#B6E7EB] hover:text-[#FF9151]">
            Go to Training 
          </Link>
        </div>
      </div>
    </main>
  );
}
