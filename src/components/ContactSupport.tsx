import React, { useState } from "react";
import { submitSupportMessage } from "../utils/supportSubmit";

export default function ContactSupport() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitSupportMessage(form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      alert("Error sending message. Please try again.");
    }
    setSending(false);
  };

  if (sent) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Thank You!</h2>
        <p>Your message has been received. Our team will respond soon.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow mt-10"
    >
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Contact Support</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-bold w-full"
      >
        {sending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
