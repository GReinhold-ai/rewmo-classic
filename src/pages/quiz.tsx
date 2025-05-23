import { useState } from "react";
import { useRouter } from "next/router";
import { collection, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useAuth } from "@/lib/AuthProvider";
import React from "react";
import BottomTabBar from "@/components/BottomTabBar"; 

export default function QuizPage() {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [income, setIncome] = useState("");
  const [savingsRate, setSavingsRate] = useState("");
  const [debt, setDebt] = useState("");
  const [goal, setGoal] = useState("");
  const [riskTolerance, setRiskTolerance] = useState("");
  const [age, setAge] = useState("");
  const [householdSize, setHouseholdSize] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be signed in to submit the quiz.");
      return;
    }

    const quizData = {
      income,
      savingsRate,
      debt,
      goal,
      riskTolerance,
      age,
      householdSize,
      submittedAt: serverTimestamp(),
    };

    try {
      const userRef = doc(db, "users", currentUser.uid);
      const quizRef = collection(userRef, "quizResponses");
      await addDoc(quizRef, quizData);
      router.push("/insights");
    } catch (error) {
      console.error("Error saving quiz data:", error);
      alert("There was a problem saving your answers.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Financial Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Savings Rate (%)"
          value={savingsRate}
          onChange={(e) => setSavingsRate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Debt"
          value={debt}
          onChange={(e) => setDebt(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Financial Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Risk Tolerance (Low/Med/High)"
          value={riskTolerance}
          onChange={(e) => setRiskTolerance(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Household Size"
          value={householdSize}
          onChange={(e) => setHouseholdSize(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
          Submit Quiz
        </button>
      </form>
    </div>
    <BottomTabBar />
  );
}
