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
      {referralCode && (
        <p className="mt-4 text-xs text-orange-600">
          You’re signing up with a referral! Code: {referralCode}
        </p>
      )}
    </div>
  );
}
