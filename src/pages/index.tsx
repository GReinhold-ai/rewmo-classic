// pages/index.tsx

import Link from "next/link";
import Image from "next/image";
import { Button } from "../components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white px-4 py-8">
      {/* Hero section */}
      <div className="flex flex-col items-center w-full max-w-lg">
        {/* Logo */}
        <Image
          src="/rewmo-logo.png"
          alt="RewmoAI Logo"
          width={160}
          height={112}
          className="mb-6 mx-auto"
        />

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Welcome to <span className="text-orange-600">RewmoAI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base text-center mb-6 max-w-md text-gray-200">
          Where your everyday spending unlocks real rewards.
          <br />
          Sign in to start earning and experience smarter financial insights.
        </p>

        {/* Sign-In Button */}
        <Link href="/login">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md border-2 border-white mt-4">
            Sign In to Start Earning
          </Button>
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-4xl">
        <div className="bg-white text-black p-6 rounded-xl shadow text-center">
          <h2 className="font-semibold text-lg mb-2">Shop & Earn</h2>
          <p className="text-sm">
            Earn rewards when you shop at Amazon, Target, and more.
          </p>
        </div>
        <div className="bg-gray-300 text-black p-6 rounded-xl shadow text-center">
          <h2 className="font-semibold text-lg mb-2">Smart AI Insights</h2>
          <p className="text-sm">
            Coming Soon — Personalized financial recommendations powered by AI.
          </p>
        </div>
        <div className="bg-gray-300 text-black p-6 rounded-xl shadow text-center">
          <h2 className="font-semibold text-lg mb-2">Rent & Mortgage Rewards</h2>
          <p className="text-sm">
            Coming Soon — Get rewarded for your biggest monthly expenses.
          </p>
        </div>
      </div>

      <footer className="mt-12 text-xs text-gray-400 flex flex-col items-center">
  <p className="mb-2">Your data is safe. We never sell your personal information.</p>
  <div className="flex space-x-4 justify-center">
    <Link href="/about" className="hover:text-white">About</Link>
    <Link href="/contact" className="hover:text-white">Contact</Link>
    <Link href="/terms" className="hover:text-white">Terms</Link>
    <Link href="/privacy" className="hover:text-white">Privacy</Link>
  </div>
</footer>

    </main>
  );
}
