import { useState } from "react";
import { useRouter } from "next/router";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
} from "@/lib/firebaseClient";
import { claimReferralOnFirstLogin } from "@/lib/claimReferralOnFirstLogin";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string; // default: "/dashboard"
};

export default function AuthModal({ isOpen, onClose, redirectTo = "/dashboard" }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const go = async () => {
    // Avoid double pushes if already on target
    if (router.pathname !== redirectTo) await router.push(redirectTo);
    onClose();
  };

  const afterAuth = async (user: { uid: string; email?: string | null }) => {
    // Try to claim referral if this is the user's first login (no user doc yet)
    await claimReferralOnFirstLogin({ uid: user.uid, email: user.email ?? null });
    await go();
  };

  const handleGoogle = async () => {
    try {
      setBusy(true);
      setError(null);
      const cred = await signInWithGoogle();
      await afterAuth({ uid: cred.user.uid, email: cred.user.email });
    } catch (e: any) {
      setError(e?.message || "Google sign-in failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleEmailAuth = async () => {
    try {
      setBusy(true);
      setError(null);

      if (!email) throw new Error("Please enter your email.");
      if (mode === "signup" && password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      const cred =
        mode === "signup"
          ? await signUpWithEmail(email, password)
          : await signInWithEmail(email, password);

      await afterAuth({ uid: cred.user.uid, email: cred.user.email });
    } catch (e: any) {
      setError(e?.message || "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    try {
      setBusy(true);
      setError(null);
      if (!email) throw new Error("Enter your email above first.");
      await resetPassword(email);
      setError("Password reset email sent. Check your inbox.");
    } catch (e: any) {
      setError(e?.message || "Reset failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-orange-500">
            {mode === "signin" ? "Sign in to RewMoAI" : "Create your RewMoAI account"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
            disabled={busy}
          >
            ✕
          </button>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={busy}
          className="w-full rounded-xl bg-black py-3 text-white transition hover:opacity-90 disabled:opacity-50"
        >
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase tracking-wide text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Email form */}
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-orange-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={busy}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            disabled={busy}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleEmailAuth();
            }}
          />

          <button
            onClick={handleEmailAuth}
            disabled={busy}
            className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {busy
              ? "Please wait…"
              : mode === "signin"
              ? "Sign In with Email"
              : "Create Account"}
          </button>

          <div className="flex items-center justify-between text-sm">
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-teal-700 underline disabled:opacity-50"
              disabled={busy}
            >
              {mode === "signin" ? "Create an account" : "Have an account? Sign in"}
            </button>

            <button
              onClick={handleReset}
              className="text-gray-600 underline disabled:opacity-50"
              disabled={busy}
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* Error / Info */}
        {error && (
          <p
            className={`mt-4 rounded-lg p-3 text-sm ${
              error.toLowerCase().includes("sent")
                ? "bg-teal-50 text-teal-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {error}
          </p>
        )}

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-gray-500">
          By continuing, you agree to RewMoAI’s Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
