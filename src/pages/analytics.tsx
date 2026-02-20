// src/pages/analytics.tsx
import Head from "next/head";
import { useAuth } from "@/lib/AuthProvider";
import SignInOverlay from "@/components/SignInOverlay";

export default function AnalyticsPage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>Analytics | RewmoAI</title>
      </Head>

      {!currentUser && (
        <SignInOverlay 
          title="Sign in to view analytics"
          description="Track your earnings, shopping activity, and reward trends."
        />
      )}

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#FF9151] mb-6">Analytics</h1>
        <p className="text-[#B6E7EB]">Your analytics dashboard coming soon...</p>
      </main>
    </div>
  );
}
