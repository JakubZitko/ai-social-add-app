import { Timestamp } from 'firebase/firestore';

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  credits: number;
  plan: 'free' | 'starter' | 'professional' | 'business' | 'enterprise';
  totalSpent: number;
  totalCreditsEarned: number;
  videoCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: UserSettings;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    videoComplete: boolean;
    videoFailed: boolean;
    weeklyReport: boolean;
    productUpdates: boolean;
  };
  language: string;
  timezone: string;
}

// ============================================
// PROJECT/VIDEO TYPES
// ============================================

export interface Project {
  id: string;
  userId: string;
  title: string;
  script: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  duration?: number;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  avatar: string;
  avatarUrl?: string;
  voice: string;
  voiceId?: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  background: string;
  backgroundUrl?: string;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
  views: number;
  creditsUsed: number;
  errorMessage?: string;
}

// ============================================
// VOICE TYPES
// ============================================

export interface Voice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'neutral';
  accent: string;
  style: string;
  language: string;
  previewUrl: string;
  isPremium: boolean;
  category: 'professional' | 'casual' | 'energetic' | 'calm' | 'narrative' | 'custom';
  rating: number;
  usageCount: number;
  provider: 'elevenlabs' | 'google' | 'azure' | 'custom';
  providerId?: string;
  createdAt: Timestamp;
}

export interface CustomVoice extends Voice {
  userId: string;
  audioSamples: string[];
  status: 'processing' | 'ready' | 'failed';
}

// ============================================
// TRANSACTION TYPES
// ============================================

export interface Transaction {
  id: string;
  userId: string;
  type: 'credit_added' | 'credit_purchase' | 'video_generation' | 'refund';
  amount?: number;
  creditsUsed?: number;
  projectId?: string;
  stripePaymentId?: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Timestamp;
  metadata?: Record<string, any>;
}

export interface CreditPurchase {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  credits: number;
  price: number;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Timestamp;
  completedAt?: Timestamp;
}

// ============================================
// SOCIAL MEDIA TYPES
// ============================================

export interface SocialConnection {
  id: string;
  userId: string;
  platform: 'tiktok' | 'instagram' | 'youtube';
  connected: boolean;
  username?: string;
  profileUrl?: string;
  followers?: number;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Timestamp;
  permissions?: string[];
  connectedAt?: Timestamp;
  lastRefreshedAt?: Timestamp;
}

export interface ScheduledPost {
  id: string;
  userId: string;
  projectId: string;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  platforms: Array<'tiktok' | 'instagram' | 'youtube'>;
  scheduledTime: Timestamp;
  status: 'scheduled' | 'posting' | 'posted' | 'failed';
  hashtags?: string[];
  postedAt?: Timestamp;
  errorMessage?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// AUTOMATION TYPES
// ============================================

export interface Automation {
  id: string;
  userId: string;
  name: string;
  description: string;
  trigger: {
    type: 'schedule' | 'event' | 'manual';
    schedule?: string; // cron format
    event?: string;
  };
  actions: AutomationAction[];
  status: 'active' | 'paused' | 'draft';
  lastRun?: Timestamp;
  nextRun?: Timestamp;
  runsCount: number;
  successRate: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AutomationAction {
  type: 'generate_video' | 'post_to_social' | 'send_notification';
  platform?: 'tiktok' | 'instagram' | 'youtube';
  config: Record<string, any>;
}

export interface AutomationRun {
  id: string;
  automationId: string;
  userId: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: Timestamp;
  completedAt?: Timestamp;
  results?: Record<string, any>;
  errorMessage?: string;
}

// ============================================
// BATCH TYPES
// ============================================

export interface Batch {
  id: string;
  userId: string;
  name: string;
  templateConfig: {
    avatar: string;
    avatarUrl?: string;
    voice: string;
    voiceId?: string;
    aspectRatio: '16:9' | '9:16' | '1:1';
    background: string;
    backgroundUrl?: string;
  };
  scripts: BatchScript[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalVideos: number;
  completedVideos: number;
  failedVideos: number;
  creditsUsed: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
}

export interface BatchScript {
  id: string;
  batchId: string;
  scriptText: string;
  projectId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
}

// ============================================
// AVATAR TYPES
// ============================================

export interface Avatar {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  isPremium: boolean;
  category: 'professional' | 'casual' | 'presenter' | 'custom';
  gender: 'male' | 'female' | 'neutral';
  ethnicity?: string;
  ageRange?: string;
  usageCount: number;
  createdAt: Timestamp;
}

export interface CustomAvatar extends Avatar {
  userId: string;
  uploadedFiles: string[];
  status: 'processing' | 'ready' | 'failed';
}

// ============================================
// TEAM TYPES
// ============================================

export interface TeamMember {
  id: string;
  userId: string;
  workspaceId: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  joinedAt: Timestamp;
  status: 'active' | 'pending' | 'inactive';
  invitedBy?: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  credits: number;
  plan: 'free' | 'team' | 'business' | 'enterprise';
  memberCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
