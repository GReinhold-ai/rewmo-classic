// File: src/pages/login.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/AuthProvider';
import BottomTabBar from '@/components/BottomTabBar';

export default function LoginPage() {
  const { currentUser, signInWithGoogle } = useAuth(); // <- CHANGED
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      // 1. Trigger backend onboarding once user logs in
      fetch(`/api/agent/reward?userId=${currentUser.uid}`)
        .then(res => res.json())
        .then(data => {
          console.log("✅ Reward onboarding completed:", data);
          // 2. Redirect to dashboard
          router.push('/dashboard');
        })
        .catch(err => {
          console.error("❌ Failed to onboard rewards:", err);
          router.push('/dashboard'); // Still redirect, even if reward fails
        });
    }
  }, [currentUser, router]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle(); // CHANGED
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-semibold mb-4">Sign in to Rewmo</h1>
      <button
        onClick={handleLogin}
        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded shadow"
      >
        Sign in with Google
      </button>

      <BottomTabBar />
    </div>
  );
}
