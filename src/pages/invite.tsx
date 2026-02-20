// src/pages/invite.tsx
import Head from "next/head";
import { useAuth } from "@/lib/AuthProvider";
import SignInOverlay from "@/components/SignInOverlay";

export default function InvitePage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>Invite Friends | RewmoAI</title>
      </Head>

      {!currentUser && (
        <SignInOverlay 
          title="Sign in to invite friends"
          description="Share your referral link and earn bonus points for each friend who joins."
        />
      )}

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#FF9151] mb-6">Invite Friends</h1>
        <p className="text-[#B6E7EB]">Your referral tools coming soon...</p>
      </main>
    </div>
  );
}
