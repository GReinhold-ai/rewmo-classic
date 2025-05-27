// File: src/pages/quiz.tsx

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import Navbar from "@/components/Navbar";
import BottomTabBar from "@/components/BottomTabBar";

const questions = [
  {
    id: "q1",
    question: "What is your main financial goal?",
    options: ["Save for retirement", "Buy a house", "Travel more", "Pay off debt"],
  },
  {
    id: "q2",
    question: "What is your biggest money challenge?",
    options: ["Spending", "Saving", "Investing", "Credit Score"],
  },
];

export default function QuizPage() {
  const { currentUser, signInWithGoogle } = useAuth();
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would save answers to Firestore if desired.
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-50 py-6 flex flex-col items-center">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow px-6 py-8 mb-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-orange-600">
            RewmoAI Wealth Journey Quiz
          </h1>
          {!currentUser ? (
            <div className="flex flex-col items-center my-6">
              <p className="mb-4 text-gray-700 text-center">
                Please sign in with Google to take your personalized financial journey quiz!
              </p>
              <button
                onClick={signInWithGoogle}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-6 py-2 mt-4"
              >
                Sign In
              </button>
            </div>
          ) : !submitted ? (
            <form onSubmit={handleSubmit}>
              {questions.map((q) => (
                <div className="mb-5" key={q.id}>
                  <div className="font-medium mb-2">{q.question}</div>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className={`px-3 py-1 rounded-full border cursor-pointer ${
                          answers[q.id] === opt
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={answers[q.id] === opt}
                          onChange={() => handleAnswer(q.id, opt)}
                          className="hidden"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold mt-4"
                disabled={Object.keys(answers).length < questions.length}
              >
                Submit Quiz
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2 text-green-600">
                Thank you for completing your Wealth Journey Quiz!
              </h2>
              <p className="text-gray-700 mb-4">
                Your personalized results will appear soon in your dashboard.
              </p>
            </div>
          )}
        </div>
      </main>
      <BottomTabBar />
    </>
  );
}
