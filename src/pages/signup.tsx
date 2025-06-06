import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebaseClient";
import { collection, addDoc, setDoc, doc, serverTimestamp, query, where, getDocs, updateDoc, increment } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && router.query.ref) {
      setReferralCode(router.query.ref as string);
    }
  }, [router.isReady, router.query.ref]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Record referral in collection (for analytics)
      if (referralCode) {
        await addDoc(collection(db, "referrals"), {
          referrer: referralCode,
          referredEmail: email,
          referredUid: user.uid,
          joinedAt: serverTimestamp(),
          source: "referral",
        });

        // ---- FIND the referrer's user doc by referralCode ----
        // If referralCode is uid, use doc(db, "users", referralCode)
        // If it's a custom code, search for .referralCode field match:
        const q = query(collection(db, "users"), where("referralCode", "==", referralCode));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          // Update the first user that matches the referral code
          const referrerDocRef = doc(db, "users", snapshot.docs[0].id);
          await updateDoc(referrerDocRef, {
            rewardPoints: increment(1000), // auto-bonus
            referralCount: increment(1),   // track referrals
            lastReferralAt: serverTimestamp(),
          });
        }
      }

      // Write the new user's own doc
      await setDoc(doc(db, "users", user.uid), {
        email,
        createdAt: serverTimestamp(),
        referrer: referralCode || null,
        rewardPoints: 0, // start at zero
      }, { merge: true });

      router.push("/profile");
    } catch (err: any) {
      alert(err.message);
    }
  };

return (
  <div className="min-h-screen bg-[#003B49] flex flex-col items-center justify-center font-sans">
    <div className="w-full max-w-md bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-8">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-black text-[#FF9151] mb-1 tracking-tight">Sign Up</h1>
        <p className="text-[#B6E7EB] text-base text-center">Create your RewmoAI account</p>
      </div>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          className="bg-[#003B49] text-white border border-[#15C5C1] rounded-lg px-4 py-3 focus:outline-none focus:border-[#FF9151] placeholder-[#B6E7EB]"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          className="bg-[#003B49] text-white border border-[#15C5C1] rounded-lg px-4 py-3 focus:outline-none focus:border-[#FF9151] placeholder-[#B6E7EB]"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <Button
          type="submit"
          className="bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold py-3 rounded-lg transition"
        >
          Create Account
        </Button>
      </form>
      <div className="mt-5 text-center">
        <span className="text-[#B6E7EB]">Already have an account? </span>
        <Link href="/signin" className="text-[#FF9151] hover:underline font-semibold">Sign In</Link>
      </div>
      {referralCode && (
        <p className="mt-4 text-xs text-[#FF9151] text-center">
          You’re signing up with a referral! Code: {referralCode}
        </p>
      )}
    </div>
  </div>
);

}
