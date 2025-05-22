import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuth } from "@/lib/AuthProvider";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts";

// Mock sample data (replace with Firestore data as needed)
const sampleSpending = [
  { category: "Groceries", amount: 320 },
  { category: "Dining", amount: 210 },
  { category: "Shopping", amount: 180 },
  { category: "Utilities", amount: 110 },
  { category: "Travel", amount: 80 }
];

const sampleRewards = [
  { month: "Jan", points: 320 },
  { month: "Feb", points: 420 },
  { month: "Mar", points: 380 },
  { month: "Apr", points: 510 },
  { month: "May", points: 600 }
];

const COLORS = ["#FF8C00", "#FFBB28", "#00C49F", "#8884D8", "#FF8042"];

export default function InsightsPage() {
  const { currentUser } = useAuth();
  // Example hooks to load from Firestore (optional, demo uses sample data)
  const [spending, setSpending] = useState(sampleSpending);
  const [rewards, setRewards] = useState(sampleRewards);

  // --- Example Firestore loading (uncomment and adapt as needed) ---
  // useEffect(() => {
  //   if (!currentUser) return;
  //   const db = getFirestore();
  //   // Replace with your real data structure
  //   const spendingRef = collection(db, "users", currentUser.uid, "spending");
  //   getDocs(spendingRef).then(snapshot => {
  //     const data = [];
  //     snapshot.forEach(doc => data.push(doc.data()));
  //     setSpending(data.length ? data : sampleSpending);
  //   });
  // }, [currentUser]);

  return (
    <div className="flex flex-col items-center min-h-screen py-12 bg-gray-50">
      <h1 className="text-3xl font-bold text-orange-600 mb-4">Your Insights</h1>
      <p className="text-gray-600 mb-8 text-center max-w-xl">
        Track your spending trends, rewards, and more—powered by RewmoAI.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {/* Pie Chart: Spending by Category */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-gray-100">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Spending by Category</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={spending}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {spending.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart: Rewards Over Time */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border border-gray-100">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">Rewards Earned Over Time</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={rewards}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="points"
                stroke="#FF8C00"
                fill="#FFBB28"
                name="Reward Points"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-12 text-gray-500 text-center text-sm max-w-lg">
        No insights yet? As you use RewmoAI, your personalized insights and trends will appear here!
      </div>
    </div>
  );
}
