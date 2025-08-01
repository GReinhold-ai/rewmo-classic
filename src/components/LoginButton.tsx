import { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { useSignupWithReferral } from "@/lib/useSignupWithReferral";
import { useRouter } from "next/router";

export default function LoginButton() {
  const auth = useAuth();
  const { signInWithGoogleAndProfile, loading } = useSignupWithReferral();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  if (!auth) return null;
  const { currentUser, signInWithEmail, signUpWithEmail } = auth;

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogleAndProfile();
      router.push("/profile");
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmail(email, password);
      router.push("/profile");
    } catch (error: any) {
      setEmailError(error.message || "Email login failed.");
    }
  };

  const handleEmailSignUp = async () => {
    try {
      await signUpWithEmail(email, password);
      router.push("/profile");
    } catch (error: any) {
      setEmailError(error.message || "Email sign-up failed.");
    }
  };

  if (currentUser) return null;

  return (
    <div className="bg-white border p-6 rounded-lg shadow-lg max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold text-[#003B49] text-center">
        Sign In to RewMoAI
      </h2>

      {/* Google Sign In */}
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-[#FF9151] text-white font-semibold py-2 px-4 rounded hover:bg-orange-600 transition"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>

      {/* Divider */}
      <div className="flex items-center justify-center my-2 text-sm text-gray-500">
        <span className="px-2">or</span>
      </div>

      {/* Email + Password Form */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#003B49]"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#003B49]"
      />

      {emailError && (
        <p className="text-sm text-red-500 text-center">{emailError}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleEmailSignIn}
          className="w-1/2 bg-[#003B49] text-white font-semibold py-2 px-4 rounded hover:bg-[#002833] transition"
        >
          Sign In
        </button>
        <button
          onClick={handleEmailSignUp}
          className="w-1/2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-300 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
