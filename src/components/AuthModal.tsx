// src/components/AuthModal.tsx

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { X } from "lucide-react"; // For close icon, install lucide-react or swap out

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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-2">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6 relative animate-in fade-in">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black">
          <X size={22} />
        </button>
        <h2 className="text-2xl font-bold text-[#003B49] text-center mb-2">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        <p className="text-center text-[#FF9151] mb-4">
          {isSignUp
            ? "Create your RewmoAI account"
            : "Sign in to start earning rewards"}
        </p>
        {/* Google */}
        <button
          className="w-full bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold py-2 rounded-lg shadow mb-3 flex items-center justify-center gap-2 transition"
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
        >
          <svg width={22} height={22} viewBox="0 0 48 48" className="inline mr-1">
            <g>
              <path fill="#4285F4" d="M43.6,20.5H42V20H24v8h11.3c-1.6,4-5.3,6.8-9.3,6.8c-5.5,0-10-4.5-10-10s4.5-10,10-10
                c2.4,0,4.6,0.9,6.3,2.3l6.2-6.2C34.3,7.6,29.5,6,24,6C13.5,6,5,14.5,5,25s8.5,19,19,19c9.5,0,18.3-6.8,18.3-19
                C44.3,23.1,44,21.7,43.6,20.5z"/>
              <path fill="#34A853" d="M6.3,14.1l6.6,4.8C14.8,16.7,19,14,24,14c2.4,0,4.6,0.9,6.3,2.3l6.2-6.2C34.3,7.6,29.5,6,24,6
                C13.5,6,5,14.5,5,25c0,4.2,1.4,8.2,3.8,11.3l6.6-5.1C12.6,28.3,11,26,11,25C11,19.5,16.2,14,24,14c2.4,0,4.6,0.9,6.3,2.3
                l6.2-6.2C34.3,7.6,29.5,6,24,6C13.5,6,5,14.5,5,25c0,4.2,1.4,8.2,3.8,11.3L6.3,14.1z"/>
            </g>
          </svg>
          {loading ? "Loading..." : "Continue with Google"}
        </button>
        <div className="flex items-center my-3">
          <span className="flex-1 border-t border-gray-200"></span>
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <span className="flex-1 border-t border-gray-200"></span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="email"
            type="email"
            required
            autoFocus
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#15C5C1] outline-none"
            value={form.email}
            onChange={handleInput}
            disabled={loading}
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#15C5C1] outline-none"
            value={form.password}
            onChange={handleInput}
            disabled={loading}
          />
          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded px-2 py-1">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-[#003B49] text-white font-bold py-2 rounded-lg hover:bg-[#15C5C1] transition"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : isSignUp
              ? "Sign Up with Email"
              : "Sign In with Email"}
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-[#003B49]">
          {isSignUp ? "Already have an account?" : "New to RewmoAI?"}{" "}
          <button
            className="underline text-[#15C5C1] hover:text-[#FF9151] font-semibold"
            onClick={() => setIsSignUp((v) => !v)}
            disabled={loading}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
