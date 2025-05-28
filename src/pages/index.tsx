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
      // Show a toast instead of alert
    }
  };

  return (
    <>
      {/* Show Navbar ONLY if signed in */}
      {currentUser && <Navbar />}
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <img
          src="/logos/logo.png"
          alt="RewmoAI Logo"
          className="h-16 md:h-20 w-auto mb-5 mx-auto block"
          style={{ maxWidth: 180 }}
        />

        {/* Welcome text */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-orange-500 text-center">
          Welcome to RewmoAI
        </h1>
        <p className="mb-4 text-center max-w-md">
          Groundbreaking financial education and guidance, powered by AI.<br />
          Unlock rewards for shopping, rent, and more—customized for you!
        </p>

        {/* Show Join Button if NOT signed in */}
        {!currentUser && (
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl mt-6 text-lg"
            onClick={handleJoin}
          >
            Join Rewmo Now
          </button>
        )}

        {/* Show Signed-In Message if signed in */}
        {currentUser && (
          <p className="mt-6 text-green-400 text-lg font-bold text-center">
            You're already signed in as <span className="underline">{currentUser.email}</span>!
          </p>
        )}
      </main>
    </>
  );
}
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
      // Show a toast instead of alert
    }
  };

  return (
    <>
      {/* Show Navbar ONLY if signed in */}
      {currentUser && <Navbar />}
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <img
          src="/logos/logo.png"
          alt="RewmoAI Logo"
          className="h-16 md:h-20 w-auto mb-5 mx-auto block"
          style={{ maxWidth: 180 }}
        />

        {/* Welcome text */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-orange-500 text-center">
          Welcome to RewmoAI
        </h1>
        <p className="mb-4 text-center max-w-md">
          Groundbreaking financial education and guidance, powered by AI.<br />
          Unlock rewards for shopping, rent, and more—customized for you!
        </p>

        {/* Show Join Button if NOT signed in */}
        {!currentUser && (
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl mt-6 text-lg"
            onClick={handleJoin}
          >
            Join Rewmo Now
          </button>
        )}

        {/* Show Signed-In Message if signed in */}
        {currentUser && (
          <p className="mt-6 text-green-400 text-lg font-bold text-center">
            You're already signed in as <span className="underline">{currentUser.email}</span>!
          </p>
        )}
      </main>
    </>
  );
}
