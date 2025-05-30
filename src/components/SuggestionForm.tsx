import React, { useState } from 'react'; // <--- Add React import for JSX

interface SuggestionFormProps {
  userId: string;
}

export default function SuggestionForm({ userId }: SuggestionFormProps) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('');

  const submitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, suggestion: value }),
    });
    if (res.ok) {
      setValue('');
      setStatus('Thanks for your suggestion!');
    } else {
      setStatus('Something went wrong.');
    }
  };

  return (
    <form onSubmit={submitSuggestion} className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Share your suggestion..."
        className="w-full border rounded p-2"
      />
      <button
        type="submit"
        className="bg-orange-500 text-white rounded px-4 py-1"
        disabled={!value.trim()}
      >
        Submit
      </button>
      {status && <div className="text-sm text-green-500 mt-2">{status}</div>}
    </form>
  );
}
