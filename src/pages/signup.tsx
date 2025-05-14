import React, { useState } from "react"; // required for JSX + state
import { useRouter } from "next/router"; // if routing
import { createUserWithEmailAndPassword } from "firebase/auth"; // if using Firebase
import { auth } from "@/lib/firebase"; // your Firebase config
import { Button } from "@/components/ui/button"; // your custom button
import Link from "next/link"; // for navigation

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/profile");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          className="w-full p-2 border"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 border"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Create Account</Button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <Link href="/signin">Sign In</Link>
      </p>
    </div>
  );
}
