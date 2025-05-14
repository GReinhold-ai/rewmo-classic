import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

export default function TestFirebasePage() {
  const [data, setData] = useState<{ value?: any; error?: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'users', 'demo-user');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData({ value: docSnap.data() });
        } else {
          setData({ error: 'No document found' });
        }
      } catch (error) {
        if (error instanceof Error) {
          setData({ error: error.message });
        } else {
          setData({ error: 'An unknown error occurred.' });
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Firebase Test</h1>
      {data.error && <p className="text-red-500">Error: {data.error}</p>}
      {data.value && (
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(data.value, null, 2)}
        </pre>
      )}
    </div>
  );
}
