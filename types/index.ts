// User types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  credits: number;
  plan: 'free' | 'starter' | 'creator' | 'pro';
  createdAt: Date;
  updatedAt: Date;
}

// Avatar types
export type AvatarGender = 'male' | 'female' | 'non-binary';
export type AvatarAge = 'young_adult' | 'adult' | 'middle_aged' | 'senior';
export type AvatarExperience = 'beginner' | 'intermediate' | 'expert';

export type AvatarAccessory =
  | 'bags'
  | 'bathrobe'
  | 'book'
  | 'candle'
  | 'cards'
  | 'dishes'
  | 'drink'
  | 'dumbbells'
  | 'food'
  | 'fridge'
  | 'fruit'
  | 'glasses'
  | 'hat'
  | 'headphones'
  | 'hijab'
  | 'jar'
  | 'jewelry'
  | 'knit'
  | 'laptop'
  | 'mic'
  | 'mirror'
  | 'mug'
  | 'pet'
  | 'phone'
  | 'piano'
  | 'plant'
  | 'present'
  | 'scarf'
  | 'suit'
  | 'tools'
  | 'trash_can'
  | 'tree';

export type AvatarEmotion =
  | 'calm'
  | 'enthusiastic'
  | 'excited'
  | 'frustrated'
  | 'sad'
  | 'serious'
  | 'smiling'
  | 'happy'
  | 'neutral'
  | 'friendly'
  | 'professional';

export type AvatarSituation =
  | 'office'
  | 'outdoor'
  | 'studio'
  | 'casual'
  | 'business'
  | 'creative';

export type AvatarSkinTone =
  | 'very_light'
  | 'light'
  | 'medium_light'
  | 'medium'
  | 'medium_dark'
  | 'dark'
  | 'very_dark';

export interface Avatar {
  id: string;
  name: string;
  previewUrl: string;
  previewVideoUrl: string;
  tags: string[];
  gender: AvatarGender;
  age: AvatarAge;
  experience: AvatarExperience;
  accessories: AvatarAccessory[];
  emotions: AvatarEmotion[];
  situation?: AvatarSituation[];
  skinTone: AvatarSkinTone;
  backgroundUrl?: string;
  defaultVoiceId?: string;
  isPopular: boolean;
  createdAt: Date;
}

// Project types
export type ProjectType = 'talking_actor' | 'gesture_only';
export type ProjectStatus = 'draft' | 'processing' | 'completed' | 'failed';
export type AudioType = 'tts' | 'sts';
export type VideoAspectRatio = '9:16' | '16:9' | '1:1';

export interface VoiceSettings {
  speed: number; // 1.0 to 1.5
  stability: number; // 0.0 to 1.0
  similarity: number; // 0.0 to 1.0
  styleExaggeration: number; // 0.0 to 1.0
}

export interface Project {
  id: string;
  userId: string;
  type: ProjectType;
  status: ProjectStatus;
  scriptText: string; // Max 1500 characters
  selectedAvatarId: string;
  selectedVoiceId?: string;
  voiceSettings: VoiceSettings;
  audioType: AudioType;
  audioUrl?: string; // For STS (Speech-to-Speech)
  gesturePrompt?: string; // For gesture_only type
  backgroundUrl?: string;
  aspectRatio: VideoAspectRatio;
  outputUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  creditsUsed: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Voice types
export interface Voice {
  id: string;
  name: string;
  previewUrl: string;
  language: string;
  accent: string; // american, british, australian, etc.
  age: 'young' | 'middle_aged' | 'old';
  gender: 'male' | 'female';
  provider: 'elevenlabs' | 'custom';
}

// Pricing plans
export interface PricingPlan {
  id: string;
  name: 'free' | 'starter' | 'creator' | 'pro';
  displayName: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  credits: number; // -1 for unlimited
  features: string[];
  stripeProductId?: string;
  stripePriceId?: string;
}

// Content validation result
export interface ContentValidationResult {
  isValid: boolean;
  flaggedCategories?: string[];
  message?: string;
}

// Filter options for avatar library
export interface AvatarFilters {
  gender?: AvatarGender[];
  age?: AvatarAge[];
  experience?: AvatarExperience[];
  accessories?: AvatarAccessory[];
  emotions?: AvatarEmotion[];
  situation?: AvatarSituation[];
  skinTone?: AvatarSkinTone[];
  search?: string;
  showPopularOnly?: boolean;
}
