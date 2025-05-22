// src/components/LoginButton.tsx
'use client';

import { useAuth } from "@/lib/AuthProvider";

export default function LoginButton() {
  const auth = useAuth();

  if (!auth) return null;

  const { currentUser, login, logout } = auth;

  return (
    <div className="flex items-center gap-4">
      {currentUser ? (
        <>
          <span className="text-sm text-gray-600">Hello, {currentUser.displayName}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={login}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign In with Google
        </button>
      )}
    </div>
  );
}
