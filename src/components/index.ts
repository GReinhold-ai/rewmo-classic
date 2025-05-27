// src/pages/index.tsx

import React from "react";
import { Navbar } from "@/components";
import { useAuth } from "@/lib/AuthProvider";

export default function LandingPage() {
  const { signInWithGoogle, currentUser } = useAuth();

  const handleJoin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      alert("Sign in failed: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <img
          src="/logos/logo.png"
          alt="RewmoAI Logo"
          className="h-16 md:h-20 w-auto mb-5"
          style={{ maxWidth: 180 }}
        />

        {/* Welcome text */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-orange-500 text-center tracking-tight">
          Welcome to RewmoAI
        </h1>
        <p className="text-base md:text-lg text-gray-300 text-center mb-8 max-w-xl">
          Groundbreaking financial education and guidance, powered by AI.<br />
          Unlock rewards for shopping, rent, and more—customized for you!
        </p>

        {/* Join button */}
        <button
          onClick={handleJoin}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-7 rounded-2xl text-lg shadow transition mb-10"
          style={{ minWidth: 220 }}
        >
          Join Rewmo Now
        </button>

        {/* Already signed in? */}
        {currentUser && (
          <div className="text-green-400 text-center">
            You're already signed in as <b>{currentUser.email}</b>!
          </div>
        )}
      </main>
    </>
  );
}
