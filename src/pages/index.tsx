import Link from "next/link";
import Image from "next/image";
import { Button } from "../components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-black text-white text-center">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/rewmo-logo.png"
          alt="RewmoAI Logo"
          width={160}
          height={160}
          className="mx-auto"
        />
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Welcome to <span className="text-orange-500">RewmoAI</span>
      </h1>

      {/* Subheading */}
      <p className="text-lg text-gray-300 max-w-xl mb-8">
        Where your everyday spending unlocks real rewards. Sign in to start earning and experience smarter financial insights.
      </p>

      {/* Sign In Button */}
      <Link href="/profile">
        <Button className="text-lg px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 transition text-white">
          Sign In to Start Earning
        </Button>
      </Link>

      {/* Features */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div className="p-6 bg-white text-black rounded-2xl shadow-md border">
          <h3 className="text-xl font-semibold mb-2">Shop & Earn</h3>
          <p className="text-gray-700">Earn rewards when you shop at Amazon, Target, and more.</p>
        </div>
        <div className="p-6 bg-white text-black rounded-2xl shadow-md border opacity-60">
          <h3 className="text-xl font-semibold mb-2">Smart AI Insights</h3>
          <p className="text-gray-700">Coming Soon — Personalized financial recommendations powered by AI.</p>
        </div>
        <div className="p-6 bg-white text-black rounded-2xl shadow-md border opacity-60">
          <h3 className="text-xl font-semibold mb-2">Rent & Mortgage Rewards</h3>
          <p className="text-gray-700">Coming Soon — Get rewarded for your biggest monthly expenses.</p>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="mt-12 text-sm text-gray-400">
        Your data is safe. We never sell your personal information.
      </div>

      {/* Footer Links */}
      <footer className="mt-10 text-sm text-gray-500 space-x-4">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
      </footer>
    </main>
  );
}
