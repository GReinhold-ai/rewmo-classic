// src/pages/signin.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/lib/AuthProvider";

export default function SignInPage() {
  const { currentUser, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Welcome to RewMo</h1>
      <button
        onClick={handleLogin}
        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
      >
        Sign in with Google
      </button>
    </div>
  );
}
