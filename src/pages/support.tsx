// src/pages/support.tsx
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseClient"; // update path as needed

export default function Support() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim()) {
      await addDoc(collection(db, "supportMessages"), {
        message,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setMessage("");
    }
  }

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-5">Contact Support</h1>
      {submitted && (
        <div className="bg-green-100 text-green-700 rounded p-3 mb-5">
          Thanks! We received your message and will respond soon.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border border-gray-300 rounded p-2 mb-4"
          rows={5}
          placeholder="Your question or message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 font-semibold"
        >
          Submit
        </button>
      </form>
      <p className="text-sm text-gray-400 mt-5">
        Or email us at <a href="mailto:support@rewmo.ai" className="underline">support@rewmo.ai</a>
      </p>
    </div>
  );
}
