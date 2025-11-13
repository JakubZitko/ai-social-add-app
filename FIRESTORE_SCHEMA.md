# Firestore Database Schema

## Collections

### 1. users
Stores user account information and credits.

```typescript
{
  uid: string;              // Document ID (Firebase Auth UID)
  email: string;
  displayName: string;
  photoURL: string;
  credits: number;          // Available credits
  plan: 'free' | 'starter' | 'creator' | 'pro';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes:**
- uid (auto-indexed as document ID)
- email

---

### 2. avatars
Stores all available AI avatars/actors.

```typescript
{
  id: string;               // Document ID
  name: string;             // Avatar name (e.g., "Sarah")
  previewUrl: string;       // Static image URL
  previewVideoUrl: string;  // Hover preview video URL
  tags: string[];           // Searchable tags
  gender: 'male' | 'female' | 'non-binary';
  age: 'young_adult' | 'adult' | 'middle_aged' | 'senior';
  experience: 'beginner' | 'intermediate' | 'expert';
  accessories: string[];    // e.g., ['glasses', 'laptop']
  emotions: string[];       // e.g., ['calm', 'excited']
  skinTone: string;         // e.g., 'medium'
  backgroundUrl: string;    // Default background
  defaultVoiceId: string;   // Default voice for preview
  isPopular: boolean;       // Show in "Most Popular"
  createdAt: Timestamp;
}
```

**Indexes:**
- tags (array-contains)
- gender
- age
- isPopular
- accessories (array-contains)

---

### 3. projects
Stores user video projects.

```typescript
{
  id: string;               // Document ID
  userId: string;           // Reference to users collection
  type: 'talking_actor' | 'gesture_only';
  status: 'draft' | 'processing' | 'completed' | 'failed';
  scriptText: string;       // Max 1500 characters
  selectedAvatarId: string;
  selectedVoiceId: string;
  voiceSettings: {
    speed: number;          // 1.0 to 1.5
    stability: number;      // 0.0 to 1.0
    similarity: number;     // 0.0 to 1.0
    styleExaggeration: number; // 0.0 to 1.0
  };
  audioType: 'tts' | 'sts'; // Text-to-Speech or Speech-to-Speech
  audioUrl: string;         // For STS uploaded audio
  gesturePrompt: string;    // For gesture_only type
  backgroundUrl: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  outputUrl: string;        // Final video URL
  thumbnailUrl: string;     // Video thumbnail
  duration: number;         // Video length in seconds
  creditsUsed: number;      // Credits deducted for this project
  errorMessage: string;     // Error details if failed
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt: Timestamp;
}
```

**Indexes:**
- userId + status (composite)
- userId + createdAt (composite)
- status

---

### 4. voices
Stores available voice options.

```typescript
{
  id: string;               // Document ID
  name: string;             // Voice name
  previewUrl: string;       // Audio preview URL
  language: string;         // e.g., 'en'
  accent: string;           // e.g., 'american', 'british'
  age: 'young' | 'middle_aged' | 'old';
  gender: 'male' | 'female';
  provider: 'elevenlabs' | 'custom';
  elevenLabsVoiceId: string; // ElevenLabs voice ID
}
```

**Indexes:**
- language
- accent
- gender

---

### 5. pricingPlans
Stores pricing plan information.

```typescript
{
  id: string;               // Document ID
  name: 'free' | 'starter' | 'creator' | 'pro';
  displayName: string;      // e.g., "Creator Plan"
  price: number;            // Price in cents
  currency: string;         // e.g., 'usd'
  interval: 'month' | 'year';
  credits: number;          // -1 for unlimited
  features: string[];       // Feature list
  stripeProductId: string;
  stripePriceId: string;
}
```

---

### 6. transactions
Stores credit purchase and usage history.

```typescript
{
  id: string;               // Document ID
  userId: string;
  type: 'purchase' | 'usage' | 'refund';
  amount: number;           // Credits added/deducted
  projectId: string;        // For usage type
  stripePaymentIntentId: string; // For purchases
  description: string;
  createdAt: Timestamp;
}
```

**Indexes:**
- userId + createdAt (composite)
- type

---

## Firebase Storage Structure

```
/audio/
  /{projectId}/
    /generated.mp3       # TTS generated audio
    /uploaded.mp3        # STS uploaded audio

/videos/
  /{projectId}/
    /output.mp4          # Final rendered video
    /thumbnail.jpg       # Video thumbnail

/avatars/
  /{avatarId}/
    /preview.jpg         # Avatar preview image
    /preview.mp4         # Hover preview video

/voices/
  /{voiceId}/
    /preview.mp3         # Voice preview audio
```

---

## Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Everyone can read avatars and voices
    match /avatars/{avatarId} {
      allow read: if true;
      allow write: if false; // Only admins via Cloud Functions
    }

    match /voices/{voiceId} {
      allow read: if true;
      allow write: if false;
    }

    // Users can only access their own projects
    match /projects/{projectId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }

    // Everyone can read pricing plans
    match /pricingPlans/{planId} {
      allow read: if true;
      allow write: if false;
    }

    // Users can read their own transactions
    match /transactions/{transactionId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if false; // Only via Cloud Functions
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Audio files - users can read/write their own project audio
    match /audio/{projectId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Videos - users can read their own videos
    match /videos/{projectId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if false; // Only Cloud Functions
    }

    // Public assets
    match /avatars/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }

    match /voices/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```
