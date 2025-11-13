export interface Project {
  id: string;
  userId: string;
  type: 'talking_actor' | 'gesture_only';
  status: 'draft' | 'processing' | 'completed' | 'failed';
  scriptText: string;
  gesturePrompt?: string;
  selectedAvatarId: string;
  selectedVoiceId?: string;
  voiceSettings: VoiceSettings;
  audioType: 'tts' | 'sts';
  audioUrl?: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  outputUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  creditsUsed: number;
  errorMessage?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  completedAt?: FirebaseFirestore.Timestamp;
}

export interface VoiceSettings {
  speed: number;
  stability: number;
  similarity: number;
  styleExaggeration: number;
}

export interface User {
  uid: string;
  email: string;
  credits: number;
  plan: 'free' | 'starter' | 'creator' | 'pro';
}

export interface ContentModerationResult {
  isValid: boolean;
  flaggedCategories?: string[];
  message?: string;
}

export interface AudioGenerationResult {
  audioUrl: string;
  duration: number;
}

export interface VideoGenerationResult {
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  jobId?: string;
}
