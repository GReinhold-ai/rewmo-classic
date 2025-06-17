// src/pages/join.tsx
import React, { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import Link from "next/link";

export default function JoinPage() {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(form.email, form.password);
      // Optionally redirect to dashboard
    } catch (err: any) {
      setError(err.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#003B49] px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
        <h1 className="text-2xl font-black text-[#FF9151] mb-2">Join RewmoAI</h1>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button
          onClick={signInWithGoogle}
          className="w-full mb-4 py-2 bg-[#FF9151] text-[#003B49] rounded font-semibold hover:bg-[#FFA36C] transition"
          disabled={loading}
        >
          Continue with Google
        </button>
        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded p-2"
            value={form.email}
            onChange={handleInput}
            required
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border rounded p-2"
            value={form.password}
            onChange={handleInput}
            required
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#003B49] text-white rounded font-semibold hover:bg-[#15C5C1] transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#003B49]">
          Already a member?{" "}
          <Link href="/" className="underline text-[#FF9151]">
            Go to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
