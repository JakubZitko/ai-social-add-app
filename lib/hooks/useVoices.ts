import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Voice } from '@/types';
import { demoVoices } from '@/lib/data/demoData';

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

      // Use demo data as fallback if no voices in database
      if (voicesData.length === 0) {
        console.log('No voices in database, using demo data');
        setVoices(demoVoices);
      } else {
        setVoices(voicesData);
      }
    } catch (err: any) {
      console.error('Error fetching voices:', err);
      // Use demo data on error
      console.log('Error fetching voices, using demo data');
      setVoices(demoVoices);
      setError(null); // Clear error since we have fallback data
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
