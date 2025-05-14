import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // ✅ CORRECT RELATIVE PATH

export default function PointsCounter({ userId }: { userId: string }) {
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPoints(docSnap.data().points || 0);
      }
    };
    if (userId) fetchPoints();
  }, [userId]);

  return (
    <div className="text-sm text-gray-500">
      Total Points: <strong>{points ?? 'Loading...'}</strong>
    </div>
  );
}
