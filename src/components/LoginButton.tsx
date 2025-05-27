// src/components/LoginButton.tsx

import React from "react";
import { useAuth } from "@/lib/AuthProvider";

export default function LoginButton() {
  const { currentUser, signInWithGoogle, logout } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {currentUser ? (
        <button
          className="px-4 py-2 rounded bg-orange-600 text-white font-semibold"
          onClick={logout}
        >
          Sign Out
        </button>
      ) : (
        <button
          className="px-4 py-2 rounded bg-orange-600 text-white font-semibold"
          onClick={signInWithGoogle}
        >
          Sign In with Google
        </button>
      )}
    </div>
  );
}
