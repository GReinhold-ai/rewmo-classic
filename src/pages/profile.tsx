import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-2xl font-bold mb-2">Your Financial Insights</h1>
      <p className="text-gray-600 mb-6">
        Welcome, <span className="font-medium">{user?.displayName || user?.email}</span>
      </p>

      <p className="text-gray-500 mb-12">No insights saved yet.</p>

      <button
        onClick={handleSignOut}
        className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
      >
        Sign Out
      </button>
    </main>
  );
}
