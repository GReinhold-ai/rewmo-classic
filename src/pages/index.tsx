import React from "react";
import { useAuth } from "@/lib/AuthProvider";
import Navbar from "@/components/Navbar"; // Optional, if you want your top nav
import Image from "next/image";
import logo from "@/../public/logos/logo.png"; // Adjust path if needed

export default function LandingPage() {
  const { signInWithGoogle, currentUser } = useAuth();

  // Handles sign-in when "Join Rewmo Now" is clicked
  const handleJoin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      // Optionally, handle or display error
    }
  };

  return (
    <>
      {/* Optional: <Navbar /> */}
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white pb-20">
        <Image
          src={logo}
          alt="RewmoAI Logo"
          width={110}
          height={110}
          className="mb-2 rounded-full border border-orange-500 shadow-lg mt-12"
          priority
        />
        <h1 className="text-3xl md:text-4xl font-bold mb-2 mt-2 text-orange-500 text-center">
          Welcome to RewmoAI
        </h1>
        <p className="text-gray-300 text-center mb-6 max-w-md">
          The smart, AI-powered rewards app for turning every payment into real wealth. Join now for the beta!
        </p>
        {/* Main CTA */}
        {!currentUser && (
          <button
            onClick={handleJoin}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition mb-6"
          >
            Join Rewmo Now
          </button>
        )}
        {currentUser && (
          <div className="text-sm text-green-400 mb-4">
            Signed in as <span className="font-bold">{currentUser.email}</span>
          </div>
        )}
      </main>

      {/* Footer with menu links */}
      <footer className="w-full py-5 flex flex-col items-center bg-black border-t border-orange-600">
        <div className="flex gap-6 mb-1 text-sm text-gray-300">
          <a href="/about" className="hover:text-orange-400 transition">About</a>
          <a href="/contact" className="hover:text-orange-400 transition">Contact</a>
          <a href="/terms" className="hover:text-orange-400 transition">Terms</a>
          <a href="/privacy" className="hover:text-orange-400 transition">Privacy</a>
        </div>
        <div className="text-xs text-gray-500">&copy; {new Date().getFullYear()} RewmoAI. All rights reserved.</div>
      </footer>
    </>
  );
}
