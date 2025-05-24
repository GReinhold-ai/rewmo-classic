import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle } from "@/lib/firebaseAuth";

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Grab first name or display name for "Welcome back"
        const name =
          user.displayName?.split(" ")[0] ||
          user.email?.split("@")[0] ||
          "Back";
        setUserName(name);
        setShowWelcome(true);
        // Show welcome for 1.5s then redirect
        setTimeout(() => {
          router.replace("/about");
        }, 1500);
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) {
    // Show loader during auth check
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <img src="/logos/logo.png" alt="RewmoAI Logo" className="w-22 h-16 mb-4" />
        <span className="animate-pulse text-lg">Checking your account...</span>
      </main>
    );
  }

  if (showWelcome && userName) {
    // Show welcome back message before redirecting
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <img src="/logos/logo.png" alt="RewmoAI Logo" className="w-20 h-20 mb-5" />
        <div className="text-2xl font-bold text-orange-400 mb-2">
          Welcome back, {userName}!
        </div>
        <span className="text-lg text-gray-200 mb-8">Redirecting to your dashboard...</span>
        <div className="animate-spin rounded-full border-4 border-orange-400 border-t-transparent h-8 w-8"></div>
      </main>
    );
  }

  // Not signed in, show the public homepage
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black text-white">
      <img
        src="/logos/logo.png"
        alt="RewmoAI Logo"
        className="w-24 h-24 mb-4"
      />
      <h1 className="text-xl font-bold mb-2 text-white">Welcome to</h1>
      <h2 className="text-3xl font-extrabold mb-8 text-orange-500">RewmoAI</h2>
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg mb-6"
        onClick={signInWithGoogle}
      >
        Join Rewmo Now
      </button>
    </main>
  );
}
