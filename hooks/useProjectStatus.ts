import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface ProjectStatus {
  id: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  title: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  errorMessage?: string;
  updatedAt: any;
}

/**
 * Hook to get real-time project status updates from Firestore
 */
export function useProjectStatus(projectId: string | null) {
  const [project, setProject] = useState<ProjectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      doc(db, 'projects', projectId),
      (doc) => {
        if (doc.exists()) {
          setProject({
            id: doc.id,
            ...doc.data(),
          } as ProjectStatus);
          setLoading(false);
        } else {
          setError('Project not found');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to project:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [projectId]);

  return {
    project,
    loading,
    error,
    isProcessing: project?.status === 'processing',
    isCompleted: project?.status === 'completed',
    isFailed: project?.status === 'failed',
  };
}
