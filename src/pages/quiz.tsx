// src/pages/quiz.tsx

import { useState } from "react";
import { db } from "@/lib/firebaseClient";
import { useAuth } from "@/lib/AuthProvider";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

const questions: QuizQuestion[] = [
  {
    id: "goal",
    question: "What is your primary financial goal?",
    options: [
      "Save for a big purchase",
      "Pay off debt",
      "Invest and grow wealth",
      "Build an emergency fund",
    ],
  },
  {
    id: "confidence",
    question: "How confident do you feel about managing your money?",
    options: [
      "Very confident",
      "Somewhat confident",
      "Not very confident",
      "Totally lost!",
    ],
  },
  {
    id: "experience",
    question: "Which best describes your investing experience?",
    options: [
      "Beginner",
      "Some experience",
      "Experienced",
      "Expert/Pro",
    ],
  },
];

export default function QuizPage() {
 const { currentUser, signInWithGoogle } = useAuth();
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.uid) {
      setError("You must be signed in to submit the quiz.");
      return;
    }
    const unanswered = questions.find((q) => !answers[q.id]);
    if (unanswered) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setSaving(true);
    try {
      await addDoc(
        collection(db, "users", currentUser.uid, "quizResponses"),
        {
          answers,
          createdAt: serverTimestamp(),
          email: currentUser.email,
        }
      );
      setSaving(false);
      setSubmitted(true);
    } catch (err) {
      setSaving(false);
      setError("Failed to save your answers. Please try again.");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] px-4">
        <img src="/logos/logo.png" alt="RewmoAI" className="h-12 mb-4" />
        <h2 className="text-2xl font-bold text-orange-600 mb-2">Sign In Required</h2>
        <p className="text-center text-gray-700 mb-4">
          Please sign in to take the RewmoAI quiz and personalize your experience.
        </p>
        <button
          onClick={login}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-6 py-2 mt-4"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] px-4">
        <img src="/logos/logo.png" alt="RewmoAI" className="h-12 mb-4" />
        <h2 className="text-2xl font-bold text-orange-600 mb-2">Thank You!</h2>
        <p className="text-center text-gray-700 mb-4">
          Your responses have been saved and will help us personalize your RewmoAI experience.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] px-4 py-8">
      <img src="/logos/logo.png" alt="RewmoAI" className="h-12 mb-4" />
      <h1 className="text-2xl font-bold text-orange-600 mb-1">Quick Financial Quiz</h1>
      <p className="mb-6 text-center text-gray-700 max-w-md">
        Take a minute to answer these questions. We’ll use your responses to tailor financial insights, rewards, and education for you!
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-6">
        {questions.map((q) => (
          <div key={q.id}>
            <label className="font-medium text-gray-900">{q.question}</label>
            <div className="flex flex-col gap-2 mt-2">
              {q.options.map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleChange(q.id, opt)}
                    className="accent-orange-500"
                  />
                  <span className="text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg py-2 transition flex items-center justify-center"
          disabled={saving}
        >
          {saving ? (
            <span className="animate-spin mr-2 w-5 h-5 border-2 border-white border-t-orange-500 rounded-full"></span>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}
