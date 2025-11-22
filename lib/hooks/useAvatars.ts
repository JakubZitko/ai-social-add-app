import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Avatar, AvatarFilters } from '@/types';
import { demoAvatars } from '@/lib/data/demoData';

export function useAvatars() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    try {
      setLoading(true);
      setError(null);

      const avatarsRef = collection(db, 'avatars');
      const q = query(avatarsRef, orderBy('isPopular', 'desc'));
      const snapshot = await getDocs(q);

      const avatarsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Avatar[];

      // Use demo data as fallback if no avatars in database
      if (avatarsData.length === 0) {
        console.log('No avatars in database, using demo data');
        setAvatars(demoAvatars);
      } else {
        setAvatars(avatarsData);
      }
    } catch (err: any) {
      console.error('Error fetching avatars:', err);
      // Use demo data on error
      console.log('Error fetching avatars, using demo data');
      setAvatars(demoAvatars);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
    }
  };

  const filterAvatars = (filters: AvatarFilters): Avatar[] => {
    return avatars.filter((avatar) => {
      // Gender filter
      if (filters.gender && filters.gender.length > 0) {
        if (!filters.gender.includes(avatar.gender)) return false;
      }

      // Age filter
      if (filters.age && filters.age.length > 0) {
        if (!filters.age.includes(avatar.age)) return false;
      }

      // Experience filter
      if (filters.experience && filters.experience.length > 0) {
        if (!filters.experience.includes(avatar.experience)) return false;
      }

      // Accessories filter
      if (filters.accessories && filters.accessories.length > 0) {
        const hasAccessory = filters.accessories.some((acc) =>
          avatar.accessories.includes(acc)
        );
        if (!hasAccessory) return false;
      }

      // Emotions filter
      if (filters.emotions && filters.emotions.length > 0) {
        const hasEmotion = filters.emotions.some((emotion) =>
          avatar.emotions.includes(emotion)
        );
        if (!hasEmotion) return false;
      }

      // Skin tone filter
      if (filters.skinTone && filters.skinTone.length > 0) {
        if (!filters.skinTone.includes(avatar.skinTone)) return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = avatar.name.toLowerCase().includes(searchLower);
        const tagMatch = avatar.tags.some((tag) =>
          tag.toLowerCase().includes(searchLower)
        );
        if (!nameMatch && !tagMatch) return false;
      }

      // Popular only filter
      if (filters.showPopularOnly && !avatar.isPopular) {
        return false;
      }

      return true;
    });
  };

  return {
    avatars,
    loading,
    error,
    filterAvatars,
    refetch: fetchAvatars,
  };
}
