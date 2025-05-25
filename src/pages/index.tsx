// src/pages/index.tsx

import React from "react";
import { useAuth } from "@/lib/AuthProvider";
import Navbar from "@/components/Navbar";
import BottomTabBar from "@/components/BottomTabBar";

export default function LandingPage() {
  const { signInWithGoogle, currentUser } = useAuth();

  const handleJoin = async () => {
    alert("Button click handler fired!");
    try {
      await signInWithGoogle();
    } catch (err: any) {
      alert("signInWithGoogle failed: " + err?.message || err);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-black font-sans">
        {/* Logo */}
        <img
          src="/logos/logo.png"
          alt="RewmoAI Logo"
          className="h-16 w-auto mb-4 mt-4"
          style={{ maxWidth: 160 }}
        />

        {/* Welcome text */}
        <div className="mb-2 text-lg md:text-xl font-semibold text-orange-400 text-center tracking-wide drop-shadow">
          Welcome to
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-orange-500 text-center mb-2 drop-shadow">
          RewmoAI
        </h1>

        <p className="text-gray-200 text-base md:text-lg max-w-md text-center mb-6">
          Unlock smarter financial rewards, personalized insights, and next-level savings—powered by AI.
        </p>

        {/* Join Button */}
        <button
          onClick={handleJoin}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow transition mb-4 w-full max-w-xs text-lg"
        >
          Join Rewmo Now
        </button>

        <div className="mt-8 w-full flex flex-col items-center">
          <span className="text-xs text-gray-400 text-center max-w-xs">
            Already a member? Just tap <b>Join</b> and log in to access your account!
          </span>
        </div>
      </main>
      <BottomTabBar />
    </>
  );
}
