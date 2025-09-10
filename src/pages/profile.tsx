// src/pages/profile.tsx
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";
import RewardHistory from "@/components/RewardHistory";

export default function Profile() {
  const { currentUser } = useAuth();

  // Logged-out view
  if (!currentUser) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Head>
          <title>Profile • Rewmo</title>
        </Head>
        <h1 className="text-2xl font-bold mb-3">Profile</h1>
        <p className="mb-6">Please sign in to view your profile and rewards.</p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-orange-500 text-white px-4 py-2"
        >
          Log in
        </Link>
      </main>
    );
  }

  // Logged-in view
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Head>
        <title>Profile • Rewmo</title>
      </Head>

      <header className="mb-8">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="opacity-80">
          Signed in as <span className="font-mono">{currentUser.email}</span>
        </p>
      </header>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold mb-3">Reward history</h2>
        {/* Renders live updates from Firestore via useUserRewards(uid) */}
        <RewardHistory />
      </section>

      <div className="mt-8 flex gap-4">
        <Link href="/rewards/shopping" className="underline">
          Browse shopping partners →
        </Link>
        <Link href="/training" className="underline">
          Go to Training →
        </Link>
      </div>
    </main>
  );
}
