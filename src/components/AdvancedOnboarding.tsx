// src/components/AdvancedOnboarding.tsx

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useAuth } from "@/lib/AuthProvider";

const ADVANCED_QUESTIONS = [
  { label: "Age range", key: "age", options: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"] },
  { label: "Do you own or rent?", key: "home", options: ["Own", "Rent", "Live with family", "Other"] },
  { label: "Total savings amount?", key: "savings", options: ["<$1k", "$1-10k", "$10-50k", "$50k+"] },
  { label: "Total debt (all types)?", key: "debt", options: ["None", "<$5k", "$5-25k", "$25-100k", "$100k+"] },
  { label: "Which statement fits you if your investments dropped 10%?", key: "risk", options: ["Sell", "Hold", "Buy more", "Panic"] },
  { label: "Which topics do you want to learn more about?", key: "topics", options: ["Investing", "Budgeting", "Credit", "Retirement", "Other"], multi: true },
  { label: "Any values/causes you want your money to support?", key: "values", textarea: true },
];

export default function AdvancedOnboarding({ onComplete }: { onComplete: () => void }) {
  const { currentUser } = useAuth();
  const [answers, setAnswers] = useState<any>({});
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    if (step < ADVANCED_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setSaving(true);
      await setDoc(
        doc(db, "users", currentUser.uid, "profile", "advanced"),
        { ...answers, advancedProfileComplete: true },
        { merge: true }
      );
      setSaving(false);
      onComplete();
    }
  };

  const q = ADVANCED_QUESTIONS[step];

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Tell us more!</h2>
      <p className="mb-6">{q.label}</p>
      {q.options && !q.textarea && (
        <div className="flex flex-col gap-3">
          {q.options.map(opt => (
            <button
              key={opt}
              className={`py-2 px-4 rounded-lg border transition ${q.multi
                ? answers[q.key]?.includes(opt)
                  ? "bg-orange-500 text-white border-orange-600"
                  : "bg-gray-100 border-gray-300"
                : answers[q.key] === opt
                  ? "bg-orange-500 text-white border-orange-600"
                  : "bg-gray-100 border-gray-300"
                }`}
              onClick={() =>
                q.multi
                  ? setAnswers(a => ({
                      ...a,
                      [q.key]: a[q.key]?.includes(opt)
                        ? a[q.key].filter((o: string) => o !== opt)
                        : [...(a[q.key] || []), opt],
                    }))
                  : setAnswers(a => ({ ...a, [q.key]: opt }))
              }
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      {q.textarea && (
        <textarea
          className="w-full border border-gray-300 rounded p-2 mt-2"
          rows={3}
          value={answers[q.key] || ""}
          onChange={e => setAnswers(a => ({ ...a, [q.key]: e.target.value }))}
          placeholder="Type your answer here..."
        />
      )}
      <button
        className="mt-8 w-full py-2 bg-orange-600 text-white rounded font-semibold disabled:bg-gray-300"
        disabled={
          q.textarea
            ? !answers[q.key]
            : q.multi
            ? !answers[q.key] || answers[q.key].length === 0
            : !answers[q.key] || saving
        }
        onClick={handleNext}
      >
        {step === ADVANCED_QUESTIONS.length - 1 ? (saving ? "Saving..." : "Finish") : "Next"}
      </button>
    </div>
  );
}
