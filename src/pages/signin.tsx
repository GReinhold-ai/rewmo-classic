import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";

export default function SignInPage() {
  const { currentUser, signInWithGoogle } = useAuth();

  return (
    <>
      <Head>
        <title>Sign in | Rewmo</title>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#003B49]">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          {!currentUser ? (
            <>
              <h1 className="text-2xl font-bold mb-6">Sign in to Rewmo</h1>
              <button
                onClick={signInWithGoogle}
                className="px-5 py-3 rounded-lg bg-[#FF6A00] text-white font-semibold hover:opacity-90 transition"
              >
                Sign in with Google
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-3">You’re signed in</h1>
              <p className="mb-6 text-gray-600">
                {currentUser.email ?? "Authenticated user"}
              </p>
              <Link
                href="/account"
                className="inline-block px-5 py-3 rounded-lg bg-[#15C5C1] text-white font-semibold hover:opacity-90 transition"
              >
                Go to Account
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
