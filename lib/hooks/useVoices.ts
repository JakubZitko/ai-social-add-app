import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Voice } from '@/types';

export function useVoices() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const voicesRef = collection(db, 'voices');
      const q = query(voicesRef);
      const snapshot = await getDocs(q);

      const voicesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Voice[];

      setVoices(voicesData);
    } catch (err: any) {
      console.error('Error fetching voices:', err);
      setError(err.message || 'Failed to load voices');
    } finally {
      setLoading(false);
    }
  };

  const getVoiceById = (id: string): Voice | undefined => {
    return voices.find((voice) => voice.id === id);
  };

  const filterVoicesByLanguage = (language: string): Voice[] => {
    return voices.filter((voice) => voice.language === language);
  };

  const filterVoicesByAccent = (accent: string): Voice[] => {
    return voices.filter((voice) => voice.accent === accent);
  };

  return {
    voices,
    loading,
    error,
    getVoiceById,
    filterVoicesByLanguage,
    filterVoicesByAccent,
    refetch: fetchVoices,
  };
}
