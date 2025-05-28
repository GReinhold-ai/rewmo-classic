import { useAuth } from "@/lib/AuthProvider";

export default function SignInPage() {
  const { signInWithGoogle, currentUser } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-semibold mb-4">Sign in to Rewmo</h1>
      <button
        onClick={handleLogin}
        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded shadow"
      >
        Sign in with Google
      </button>
    </div>
  );
}
