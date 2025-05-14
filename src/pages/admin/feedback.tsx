import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // updated path
import Layout from '../../components/Layout';
import React from "react";

export default function FeedbackPage() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'feedback'), {
      rating,
      comment,
      submittedAt: serverTimestamp(),
      userId: 'demo-user',
      version: 'beta-0.1.0'
    });
    setSubmitted(true);
  };

  return (
    <Layout>
      <div className="p-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Feedback</h2>
        {submitted ? (
          <p className="text-green-600">✅ Thank you for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </label>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}
