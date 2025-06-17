import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await addDoc(collection(db, "users"), {
        name,
        email,
        phone,
        createdAt: new Date(),
      });
      setSuccess(true);
    } catch (e) {
      setError("There was a problem—please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#003B49] flex flex-col items-center justify-center px-4 py-12 font-sans">
      <div className="max-w-md w-full bg-[#072b33] border border-[#15C5C1] rounded-2xl p-8 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-[#FF9151] mb-4">Create Your RewmoAI Account</h1>
        {success ? (
          <div className="text-[#15C5C1] font-bold text-lg">
            ✅ Welcome! Check your email for next steps.
            <br />
            <Link href="/dashboard" className="underline text-[#FF9151] font-semibold">Go to Dashboard →</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="rounded-md p-3 bg-[#003B49] text-[#B6E7EB] border border-[#15C5C1] focus:outline-none"
              placeholder="First Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              className="rounded-md p-3 bg-[#003B49] text-[#B6E7EB] border border-[#15C5C1] focus:outline-none"
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              className="rounded-md p-3 bg-[#003B49] text-[#B6E7EB] border border-[#15C5C1] focus:outline-none"
              placeholder="Phone Number (optional)"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold py-3 rounded-xl transition"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Sign Up"}
            </button>
            {error && <div className="text-[#FF9151]">{error}</div>}
          </form>
        )}
        <div className="mt-4">
          <Link href="/preview" className="text-[#15C5C1] underline font-semibold hover:text-[#FFA36C]">
            Try a Peek Preview →
          </Link>
        </div>
      </div>
    </div>
  );
}
