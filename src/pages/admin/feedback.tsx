import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebaseClient";
import Layout from "../../components/Layout";
import { useAuth } from "../../lib/AuthProvider";
import React from "react";

export default function FeedbackPage() {
  const { currentUser } = useAuth(); // Get current user from context
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await addDoc(collection(db, "feedback"), {
        rating,
        comment,
        submittedAt: serverTimestamp(),
        userId: currentUser?.uid || currentUser?.email || "guest", // <--- Use signed-in user if available
        version: "beta-0.1.0",
      });
      setSubmitted(true);
      setComment("");
      setRating(5);
    } catch (error: any) {
      setErr(error.message || "Error submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErr(null);
  };

  return (
    <Layout>
      <div className="p-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Feedback</h2>
        {submitted ? (
          <div className="text-green-600 flex flex-col items-center space-y-3">
            <p>✅ Thank you for your feedback!</p>
            <button
              className="bg-orange-500 text-white px-3 py-1 rounded"
              onClick={handleReset}
            >
              Submit More Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-6 shadow-md">
            {err && <p className="text-red-500">{err}</p>}
            <label className="block">
              <span className="text-sm font-medium">Rate your experience (1–5):</span>
              <input
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                min={1}
                max={5}
                required
                className="w-full border px-3 py-2 mt-1 rounded"
                disabled={loading}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Comments:</span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border px-3 py-2 mt-1 rounded"
                rows={4}
                required
                disabled={loading}
              />
            </label>
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}
