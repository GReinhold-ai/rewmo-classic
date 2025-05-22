import { useState } from 'react';

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
    <form onSubmit={submitSuggestion} className="max-w-md mx-auto my-8 p-4 rounded-xl bg-gray-100 shadow">
      <textarea
        placeholder="Your suggestion or feedback..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className="border rounded p-2 w-full min-h-[90px]"
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded"
        disabled={!value}
      >
        Submit Suggestion
      </button>
      {status && <div className="mt-2 text-center text-sm">{status}</div>}
    </form>
  );
}
