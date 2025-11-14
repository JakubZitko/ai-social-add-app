import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface VideoConfig {
  title: string;
  script: string;
  avatar: string;
  voice: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  background: string;
  tags?: string[];
}

interface GenerationResult {
  success: boolean;
  projectId?: string;
  message?: string;
  error?: string;
}

export function useVideoGeneration() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async (config: VideoConfig): Promise<GenerationResult> => {
    if (!user) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Get Firebase auth token
      const token = await user.getIdToken();

      // Call video generation API
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Video generation failed');
      }

      return {
        success: true,
        projectId: data.projectId,
        message: data.message,
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate video';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateVideo,
    isGenerating,
    error,
  };
}
