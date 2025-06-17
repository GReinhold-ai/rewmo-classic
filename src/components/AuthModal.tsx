// src/components/AuthModal.tsx
import React, { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
      onClose();
    } catch (err: any) {
      setError(err.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg relative">
        <button className="absolute top-4 right-4 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4 text-[#003B49]">Sign in or Join</h2>
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
      </div>
    </div>
  );
}
