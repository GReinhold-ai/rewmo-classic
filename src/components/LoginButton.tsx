// src/components/LoginButton.tsx

import React from "react";
import { useSignupWithReferral } from "@/lib/useSignupWithReferral";
import { useAuth } from "@/lib/AuthProvider";

export default function LoginButton() {
  const { currentUser } = useAuth();
  const { signInWithGoogleAndProfile, loading } = useSignupWithReferral();

  return (
    <div className="flex items-center gap-4">
      {currentUser ? (
        <span className="text-orange-700 font-semibold">
          Signed in as {currentUser.displayName || currentUser.email}
        </span>
      ) : (
        <button
          className="px-4 py-2 rounded bg-orange-600 text-white font-semibold"
          onClick={signInWithGoogleAndProfile}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Signing In..." : "Sign In with Google"}
        </button>
      )}
    </div>
  );
}
