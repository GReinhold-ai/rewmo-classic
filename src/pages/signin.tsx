// pages/signin.tsx
import React from "react";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';

export default function SignIn() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/profile');
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">Sign In to RewMo</h1>
      <button className="bg-orange-600 text-white px-4 py-2 rounded" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
}
