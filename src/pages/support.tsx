import React, { useState } from "react";
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
    <main className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">Support</h1>
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-3">
        <textarea
          className="w-full border rounded p-2"
          placeholder="Describe your issue or question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          disabled={submitted || !message.trim()}
        >
          {submitted ? "Submitted!" : "Submit"}
        </button>
        {submitted && (
          <p className="text-green-600 text-sm mt-2">
            Thank you for reaching out! We&apos;ll get back to you soon.
          </p>
        )}
      </form>
    </main>
  );
}
