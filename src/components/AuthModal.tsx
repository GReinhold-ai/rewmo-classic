// src/components/AuthModal.tsx

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { X } from "lucide-react";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        await signUpWithEmail(form.email, form.password);
      } else {
        await signInWithEmail(form.email, form.password);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col sm:flex-row overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black z-10"
        >
          <X size={22} />
        </button>

        {/* Google Sign-In Side */}
        <div className="sm:w-1/2 bg-[#003B49] text-white flex flex-col justify-center items-center p-6">
          <h2 className="text-xl font-bold mb-3 text-center">Sign in with Google</h2>
          <button
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                await signInWithGoogle();
                onClose();
              } catch (err: any) {
                setError(err?.message || "Google sign in failed");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="bg-[#FF9151] hover:bg-[#ffa76d] text-[#003B49] font-bold px-4 py-2 rounded-lg shadow-lg transition flex items-center gap-2"
          >
            <svg width={20} height={20} viewBox="0 0 48 48" fill="currentColor">
              <path fill="#4285F4" d="M43.6 20.5H42V20H24v8h11.3A10.9 10.9 0 0 1 13 25c0-6.1 4.9-11 11-11 2.6 0 5 .9 6.9 2.4l6.4-6.4C37.2 6.5 30.9 4 24 4 12.3 4 3 13.3 3 25s9.3 21 21 21c10.8 0 20-8 20-21 0-1.4-.1-2.8-.4-4.1z"/>
            </svg>
            {loading ? "Loading..." : "Continue with Google"}
          </button>
        </div>

        {/* Email Side */}
        <div className="sm:w-1/2 p-6 bg-white">
          <h2 className="text-xl font-bold text-[#003B49] text-center">
            {isSignUp ? "Create an Account" : "Sign in with Email"}
          </h2>
          <p className="text-sm text-center text-[#FF9151] mb-4">
            {isSignUp ? "Start earning rewards today!" : "Welcome back to RewmoAI"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#15C5C1] outline-none"
              value={form.email}
              onChange={handleInput}
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#15C5C1] outline-none"
              value={form.password}
              onChange={handleInput}
              disabled={loading}
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#003B49] text-white py-2 rounded-lg hover:bg-[#15C5C1] transition font-bold"
            >
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-4 text-sm">
            {isSignUp ? "Already have an account?" : "New to RewmoAI?"}{" "}
            <button
              onClick={() => setIsSignUp((prev) => !prev)}
              className="text-[#15C5C1] font-semibold hover:text-[#FF9151]"
              disabled={loading}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
