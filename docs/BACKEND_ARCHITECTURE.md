# Backend Architecture Plan - VideoAI Platform

## Overview
Comprehensive backend architecture for AI-powered video generation platform using Firebase Cloud Functions, ElevenLabs API, and third-party avatar/video generation services.

---

## Architecture Stack

### Core Technologies
- **Backend Runtime**: Firebase Cloud Functions (Node.js 20)
- **Database**: Firestore (NoSQL document database)
- **Storage**: Firebase Storage (video files, assets)
- **Authentication**: Firebase Auth
- **AI Services**:
  - ElevenLabs API (Text-to-Speech)
  - Heygen API / D-ID API (AI Avatar & Video Generation)
  - OpenAI API (Script enhancement, optional)

---

## Database Schema

### Collections Structure

#### 1. `users`
```typescript
{
  uid: string;                    // Firebase Auth UID
  email: string;
  displayName: string | null;
  photoURL: string | null;
  credits: number;                // Available credits
  plan: 'free' | 'starter' | 'creator' | 'pro';
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Subscription info
  stripeCustomerId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due';
  subscriptionPeriodEnd?: Timestamp;

  // Usage tracking
  videosGenerated: number;
  totalCreditsUsed: number;
}
```

#### 2. `projects`
```typescript
{
  id: string;
  userId: string;

  // Project metadata
  type: 'talking_actor' | 'gesture_only';
  status: 'draft' | 'processing' | 'completed' | 'failed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;

  // Content configuration
  scriptText: string;             // For talking_actor
  gesturePrompt?: string;         // For gesture_only

  // Avatar & Voice settings
  selectedAvatarId: string;
  selectedVoiceId?: string;
  voiceSettings?: {
    speed: number;                // 1.0 - 1.5
    stability: number;            // 0.0 - 1.0
    similarity: number;           // 0.0 - 1.0
    styleExaggeration: number;    // 0.0 - 1.0
  };

  // Audio configuration
  audioType: 'tts' | 'sts';      // Text-to-Speech or Speech-to-Speech
  audioFileUrl?: string;          // For STS

  // Video configuration
  aspectRatio: '9:16' | '16:9' | '1:1';
  duration?: number;              // In seconds

  // Background & Customization
  background?: {
    type: 'color' | 'image' | 'video';
    value: string;                // Hex color, URL, or video URL
  };
  overlayText?: {
    enabled: boolean;
    text: string;
    position: 'top' | 'bottom' | 'center';
    style: 'subtitle' | 'title' | 'caption';
  };

  // Output
  outputUrl?: string;             // Final video URL
  thumbnailUrl?: string;

  // Processing details
  errorMessage?: string;
  processingSteps?: {
    audioGeneration?: { status: string; timestamp: Timestamp };
    videoGeneration?: { status: string; timestamp: Timestamp };
    rendering?: { status: string; timestamp: Timestamp };
  };

  // Credits
  creditsUsed: number;
}
```

#### 3. `avatars`
```typescript
{
  id: string;
  name: string;
  previewUrl: string;            // Thumbnail image
  videoPreviewUrl?: string;      // Short preview clip

  // Provider info
  provider: 'heygen' | 'd-id' | 'custom';
  providerId: string;            // ID in provider's system

  // Metadata
  gender: 'male' | 'female' | 'non-binary';
  age: 'young' | 'adult' | 'senior';
  ethnicity: string;

  // Tags for filtering
  tags: string[];                // e.g., ['professional', 'casual', 'business']

  // Availability
  isActive: boolean;
  isPremium: boolean;            // Requires pro plan

  // Stats
  usageCount: number;
  rating?: number;
}
```

#### 4. `voices`
```typescript
{
  id: string;
  name: string;
  provider: 'elevenlabs' | 'custom';
  providerId: string;

  // Voice characteristics
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'middle_aged' | 'old';
  accent: string;                // e.g., 'American', 'British', 'Australian'
  language: string;              // ISO code

  // Metadata
  previewUrl?: string;           // Sample audio
  description: string;

  // Availability
  isActive: boolean;
  isPremium: boolean;
}
```

#### 5. `transactions`
```typescript
{
  id: string;
  userId: string;
  type: 'credit_purchase' | 'credit_usage' | 'subscription' | 'refund';
  amount: number;                // Credits or money
  currency?: 'usd';

  // Related entities
  projectId?: string;            // For credit_usage
  stripePaymentIntentId?: string;

  // Metadata
  description: string;
  createdAt: Timestamp;
  status: 'pending' | 'completed' | 'failed';
}
```

---

## Cloud Functions Architecture

### 1. Video Generation Pipeline

#### Function: `generateVideo`
**Trigger**: Firestore onCreate in `projects` collection
**Purpose**: Orchestrates the entire video generation pipeline

```typescript
export const generateVideo = functions.firestore
  .document('projects/{projectId}')
  .onCreate(async (snap, context) => {
    const project = snap.data();
    const projectId = context.params.projectId;

    try {
      // 1. Validate user credits
      await validateCredits(project.userId, project.creditsUsed);

      // 2. Generate audio (if talking_actor)
      let audioUrl;
      if (project.type === 'talking_actor') {
        audioUrl = await generateAudio(project);
      }

      // 3. Generate video with avatar
      const videoUrl = await generateAvatarVideo({
        avatarId: project.selectedAvatarId,
        audioUrl,
        gesturePrompt: project.gesturePrompt,
        aspectRatio: project.aspectRatio,
      });

      // 4. Apply background & overlays
      const finalVideoUrl = await applyPostProcessing({
        videoUrl,
        background: project.background,
        overlayText: project.overlayText,
      });

      // 5. Generate thumbnail
      const thumbnailUrl = await generateThumbnail(finalVideoUrl);

      // 6. Update project
      await snap.ref.update({
        status: 'completed',
        outputUrl: finalVideoUrl,
        thumbnailUrl,
        completedAt: FieldValue.serverTimestamp(),
      });

      // 7. Deduct credits
      await deductCredits(project.userId, project.creditsUsed);

    } catch (error) {
      await handleGenerationError(projectId, error);
    }
  });
```

---

### 2. Audio Generation Service

#### Function: `generateAudio`
**Purpose**: Generate speech audio using ElevenLabs API

```typescript
async function generateAudio(project: Project): Promise<string> {
  // 1. Get voice configuration
  const voice = await getVoiceById(project.selectedVoiceId);

  // 2. Call ElevenLabs API
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.providerId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text: project.scriptText,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: project.voiceSettings.stability,
        similarity_boost: project.voiceSettings.similarity,
        style: project.voiceSettings.styleExaggeration,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.statusText}`);
  }

  // 3. Upload audio to Firebase Storage
  const audioBuffer = await response.arrayBuffer();
  const audioPath = `audio/${project.id}/speech.mp3`;
  const audioFile = storage.bucket().file(audioPath);

  await audioFile.save(Buffer.from(audioBuffer), {
    metadata: {
      contentType: 'audio/mpeg',
    },
  });

  // 4. Get public URL
  const [audioUrl] = await audioFile.getSignedUrl({
    action: 'read',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // 5. Update processing steps
  await updateProcessingStep(project.id, 'audioGeneration', 'completed');

  return audioUrl;
}
```

---

### 3. Avatar Video Generation

#### Function: `generateAvatarVideo`
**Purpose**: Generate video with AI avatar using Heygen or D-ID API

```typescript
async function generateAvatarVideo(options: {
  avatarId: string;
  audioUrl?: string;
  gesturePrompt?: string;
  aspectRatio: string;
}): Promise<string> {
  // 1. Get avatar configuration
  const avatar = await getAvatarById(options.avatarId);

  // 2. Choose provider based on avatar
  if (avatar.provider === 'heygen') {
    return await generateHeygenVideo(avatar, options);
  } else if (avatar.provider === 'd-id') {
    return await generateDIDVideo(avatar, options);
  }

  throw new Error(`Unsupported avatar provider: ${avatar.provider}`);
}

// Heygen Integration
async function generateHeygenVideo(avatar, options) {
  const response = await fetch('https://api.heygen.com/v1/video.generate', {
    method: 'POST',
    headers: {
      'X-Api-Key': process.env.HEYGEN_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      video_inputs: [{
        character: {
          type: 'avatar',
          avatar_id: avatar.providerId,
        },
        voice: {
          type: 'audio',
          audio_url: options.audioUrl,
        },
        background: {
          type: 'color',
          value: '#FFFFFF',
        },
      }],
      dimension: {
        width: options.aspectRatio === '9:16' ? 1080 : 1920,
        height: options.aspectRatio === '9:16' ? 1920 : 1080,
      },
      aspect_ratio: options.aspectRatio,
    }),
  });

  const data = await response.json();
  const videoId = data.video_id;

  // Poll for completion
  return await pollVideoStatus(videoId, 'heygen');
}

// D-ID Integration (alternative provider)
async function generateDIDVideo(avatar, options) {
  const response = await fetch('https://api.d-id.com/talks', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${process.env.DID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source_url: avatar.previewUrl,
      script: {
        type: 'audio',
        audio_url: options.audioUrl,
      },
      config: {
        result_format: options.aspectRatio,
      },
    }),
  });

  const data = await response.json();
  const talkId = data.id;

  // Poll for completion
  return await pollVideoStatus(talkId, 'd-id');
}
```

---

### 4. Video Post-Processing

#### Function: `applyPostProcessing`
**Purpose**: Apply background, overlays, and text to generated video

```typescript
async function applyPostProcessing(options: {
  videoUrl: string;
  background?: BackgroundConfig;
  overlayText?: OverlayTextConfig;
}): Promise<string> {
  // If no post-processing needed, return original
  if (!options.background && !options.overlayText) {
    return options.videoUrl;
  }

  // Use FFmpeg Cloud Service or run in Cloud Run
  // This could be a separate service for video editing

  const response = await fetch(`${process.env.VIDEO_PROCESSING_SERVICE_URL}/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.PROCESSING_API_KEY}`,
    },
    body: JSON.stringify({
      input_video_url: options.videoUrl,
      background: options.background,
      overlays: options.overlayText ? [{
        type: 'text',
        text: options.overlayText.text,
        position: options.overlayText.position,
        style: options.overlayText.style,
      }] : [],
    }),
  });

  const data = await response.json();
  return data.output_url;
}
```

---

### 5. Webhook Handlers

#### Function: `stripeWebhook`
**Purpose**: Handle Stripe payment events

```typescript
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});
```

---

## API Integrations

### 1. ElevenLabs (Text-to-Speech)

**Base URL**: `https://api.elevenlabs.io/v1`

**Key Endpoints**:
- `POST /text-to-speech/{voice_id}` - Generate speech audio
- `GET /voices` - List available voices
- `POST /speech-to-speech/{voice_id}` - Convert uploaded audio

**Authentication**: API Key in header (`xi-api-key`)

**Cost**: ~$0.30 per 1,000 characters

**Implementation Notes**:
- Cache voice list in Firestore
- Monitor usage to track costs
- Handle rate limiting (10 requests/second)
- Support for 28+ languages

---

### 2. Heygen (AI Avatar Videos)

**Base URL**: `https://api.heygen.com/v1`

**Key Endpoints**:
- `POST /video.generate` - Create avatar video
- `GET /video.status/{video_id}` - Check generation status
- `GET /avatars` - List available avatars

**Authentication**: API Key in header (`X-Api-Key`)

**Cost**: ~$10-50 per minute of video (varies by plan)

**Implementation Notes**:
- Webhook support for completion notifications
- Support for custom avatars (premium feature)
- 1080p and 4K output options
- Polling interval: 5 seconds

---

### 3. Alternative: D-ID (Talking Head Videos)

**Base URL**: `https://api.d-id.com`

**Key Endpoints**:
- `POST /talks` - Create talking head video
- `GET /talks/{id}` - Get video status
- `POST /images` - Upload custom image for avatar

**Authentication**: Basic Auth with API Key

**Cost**: ~$0.05-0.15 per second of video

**Implementation Notes**:
- Good for custom images/photos
- Faster generation than Heygen
- Limited gesture control

---

## Security & Error Handling

### API Key Management
```typescript
// Use Secret Manager for API keys
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function getApiKey(secretName: string): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: `projects/${PROJECT_ID}/secrets/${secretName}/versions/latest`,
  });

  return version.payload.data.toString('utf8');
}
```

### Error Handling Strategy
```typescript
class VideoGenerationError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean
  ) {
    super(message);
  }
}

async function handleGenerationError(projectId: string, error: Error) {
  const errorCode = error.code || 'UNKNOWN_ERROR';
  const retryable = error.retryable || false;

  await firestore().collection('projects').doc(projectId).update({
    status: 'failed',
    errorMessage: error.message,
    errorCode,
    updatedAt: FieldValue.serverTimestamp(),
  });

  // If retryable, schedule retry
  if (retryable) {
    await scheduleRetry(projectId);
  }

  // Refund credits if generation failed
  const project = await getProject(projectId);
  await refundCredits(project.userId, project.creditsUsed);

  // Send notification to user
  await sendErrorNotification(project.userId, errorCode);
}
```

---

## Performance Optimizations

### 1. Caching Strategy
- Cache avatar list in Firestore (update daily)
- Cache voice list in Firestore (update weekly)
- Use CDN for static assets (thumbnails, previews)
- Cache API responses where applicable

### 2. Parallel Processing
```typescript
async function generateVideo(project) {
  // Run independent tasks in parallel
  const [audioUrl, avatarMetadata] = await Promise.all([
    generateAudio(project),
    getAvatarById(project.selectedAvatarId),
  ]);

  // Then proceed with video generation
  const videoUrl = await generateAvatarVideo({
    audioUrl,
    ...avatarMetadata,
  });
}
```

### 3. Queue Management
- Use Cloud Tasks for retry logic
- Implement exponential backoff
- Set max retry attempts (3)
- Priority queue for premium users

---

## Monitoring & Analytics

### Cloud Function Logs
```typescript
import { logger } from 'firebase-functions';

logger.info('Starting video generation', { projectId, userId });
logger.error('API call failed', { error, provider: 'heygen' });
logger.warn('Low credit balance', { userId, remainingCredits });
```

### Custom Metrics
```typescript
// Track generation times
await firestore().collection('metrics').add({
  type: 'generation_time',
  projectId,
  duration: endTime - startTime,
  provider: 'heygen',
  timestamp: FieldValue.serverTimestamp(),
});

// Track API costs
await firestore().collection('metrics').add({
  type: 'api_cost',
  provider: 'elevenlabs',
  characters: scriptText.length,
  estimatedCost: characters * 0.0003,
  timestamp: FieldValue.serverTimestamp(),
});
```

---

## Cost Estimation

### Per Video Breakdown
| Component | Provider | Cost |
|-----------|----------|------|
| Text-to-Speech (500 chars) | ElevenLabs | $0.15 |
| Avatar Video (60s) | Heygen | $15-25 |
| Video Processing | FFmpeg Service | $0.50 |
| Storage (1GB/month) | Firebase | $0.026 |
| **Total per video** | | **~$16-26** |

### Pricing Strategy
- Free tier: 5 credits ($130 value)
- Starter: $29/month (50 credits) = $0.58/credit
- Creator: $79/month (150 credits) = $0.53/credit
- Pro: $199/month (unlimited) = break-even at ~10 videos

---

## Next Steps for Implementation

### Phase 1: Core Infrastructure (Week 1-2)
- [ ] Set up Firebase Cloud Functions project
- [ ] Configure Firestore security rules
- [ ] Implement user authentication and credits system
- [ ] Create database schemas and indexes

### Phase 2: AI Integration (Week 3-4)
- [ ] Integrate ElevenLabs API
- [ ] Integrate Heygen/D-ID API
- [ ] Implement audio generation pipeline
- [ ] Implement video generation pipeline

### Phase 3: Post-Processing (Week 5)
- [ ] Set up video processing service
- [ ] Implement background replacement
- [ ] Implement text overlay system
- [ ] Generate thumbnails

### Phase 4: Payment & Billing (Week 6)
- [ ] Integrate Stripe payment system
- [ ] Implement webhook handlers
- [ ] Create billing dashboard
- [ ] Set up usage tracking

### Phase 5: Testing & Optimization (Week 7-8)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Error handling and retry logic
- [ ] Monitoring and alerting setup

---

## Environment Variables

```bash
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com

# API Keys
ELEVENLABS_API_KEY=your-elevenlabs-key
HEYGEN_API_KEY=your-heygen-key
DID_API_KEY=your-did-key
OPENAI_API_KEY=your-openai-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Services
VIDEO_PROCESSING_SERVICE_URL=https://your-service.run.app
PROCESSING_API_KEY=your-processing-key

# Other
FRONTEND_URL=https://yourapp.com
```

---

## Conclusion

This architecture provides a scalable, cost-effective solution for AI video generation with:
- ✅ Modular design for easy provider switching
- ✅ Comprehensive error handling and retry logic
- ✅ Real-time status updates via Firestore
- ✅ Secure API key management
- ✅ Performance optimizations
- ✅ Cost tracking and analytics

The system can handle hundreds of concurrent video generations and scale to thousands of users with Firebase's auto-scaling capabilities.
