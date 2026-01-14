import React, { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebaseClient";
import { useAuth } from "../lib/AuthProvider.tsx.backup";

const questions = [
  { name: "investmentExperience", label: "How would you rate your investment experience?", options: ["Beginner", "Intermediate", "Advanced"] },
  { name: "riskTolerance", label: "What is your risk tolerance?", options: ["Low", "Medium", "High"] },
  // ...add more advanced questions here
];

export default function AdvancedOnboarding({ onComplete }: { onComplete?: () => void }) {
  const auth = useAuth();
const currentUser = auth?.currentUser;
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.uid) {
      alert("You must be signed in to submit this form.");
      return;
    }
    setSaving(true);
    try {
      await setDoc(
        doc(db, "users", currentUser.uid, "profile", "advanced"),
        { ...answers, advancedProfileComplete: true },
        { merge: true }
      );
      setSubmitted(true);
      if (typeof onComplete === "function") onComplete();
    } catch (err) {
      alert("An error occurred saving your answers.");
    }
    setSaving(false);
  };

  if (submitted) {
    return <div className="p-6 text-center text-green-700 font-semibold">Thank you! Your advanced profile is complete.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow max-w-xl mx-auto mt-6">
      <h2 className="text-lg font-bold text-center mb-2">Advanced Profile</h2>
      {questions.map((q) => (
        <div key={q.name}>
          <label className="block font-semibold mb-1">{q.label}</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={answers[q.name] || ""}
            onChange={e => handleChange(q.name, e.target.value)}
            required
          >
            <option value="" disabled>Select...</option>
            {q.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ))}
      <button
        type="submit"
        className={`w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save & Complete"}
      </button>
    </form>
  );
}
