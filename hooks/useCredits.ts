import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to get real-time user credits from Firestore
 */
export function useCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setCredits(0);
      return;
    }

    setLoading(true);

    // Set up real-time listener for user document
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setCredits(userData.credits || 0);
        } else {
          setCredits(0);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to credits:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return {
    credits,
    loading,
  };
}
