// src/pages/index.tsx

import React from "react";
import { useAuth } from "@/lib/AuthProvider";
import BottomTabBar from "@/components/BottomTabBar";

export default function LandingPage() {
  const { signInWithGoogle } = useAuth();

  // Handles button click for all platforms
  const handleJoin = async () => {
    alert("Button click handler fired!");
    try {
      alert("Attempting signInWithGoogle...");
      await signInWithGoogle();
      alert("Google sign-in success!");
    } catch (err: any) {
      alert("signInWithGoogle error: " + (err?.message || err));
    }
  };

  return (
    <>
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <img
          src="/logos/logo.png"
          alt="RewmoAI Logo"
          className="h-20 w-auto mt-10 mb-6"
          style={{ maxWidth: 200 }}
        />

        <h1 className="text-3xl md:text-4xl font-bold text-orange-500 mb-3 text-center">
          Welcome to <span className="text-orange-400">RewmoAI</span>
        </h1>
        <p className="text-lg md:text-xl mb-7 text-center max-w-md">
          Unlock real rewards with every payment and personalized insights powered by AI.
        </p>

        <button
          onClick={handleJoin}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg mb-6 transition"
        >
          Join Rewmo Now
        </button>

        <div className="text-gray-400 text-center mb-20">
          Already a member? Just tap <span className="font-bold text-white">Join</span> and log in to access your account!
        </div>
      </main>
      <BottomTabBar />
    </>
  );
}
