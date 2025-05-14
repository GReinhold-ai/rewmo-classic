import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getFirestore, collection, getDocs, type DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { saveAs } from "file-saver";

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState<DocumentData[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    async function fetchInsights() {
      const snapshot = await getDocs(collection(db, "insights"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInsights(data);
    }
    fetchInsights();
  }, []);

  function downloadCSV() {
    const csvHeader = Object.keys(insights[0] || {}).join(",") + "\n";
    const csvRows = insights.map((row) =>
      Object.values(row).map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "insights.csv");
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-orange-500">Admin: Insights Dashboard</h1>
        <div className="flex justify-end mb-4">
          <Button onClick={downloadCSV} className="bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-2">
            <Download size={16} /> Download CSV
          </Button>
        </div>
        <div className="overflow-auto rounded-lg shadow border border-gray-700">
          <table className="min-w-full text-sm text-left text-white">
            <thead className="bg-gray-800 text-xs uppercase">
              <tr>
                {Object.keys(insights[0] || {}).map((key) => (
                  <th key={key} className="px-4 py-3 border-r border-gray-700">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-900">
              {insights.map((row, idx) => (
                <tr key={idx} className="border-t border-gray-700">
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="px-4 py-2 border-r border-gray-800">{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
