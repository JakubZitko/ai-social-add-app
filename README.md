# VideoAI - AI-Powered Video Ad Creation Platform

A complete Arcads competitor built with Next.js, Firebase, and cutting-edge AI technologies. Create professional UGC-style video ads with AI avatars, realistic voices, and lip-sync technology.

## Features

- **300+ AI Avatars**: Diverse library with filtering by gender, age, accessories, and emotions
- **Realistic Voice Generation**: Powered by ElevenLabs with full customization (speed, stability, style)
- **35+ Languages**: Multi-language support with native accents
- **Lip-Sync Technology**: Natural lip movement synchronized with audio
- **Multiple Formats**: Export in 9:16, 16:9, or 1:1 for all social platforms
- **Gesture Control**: Create custom gesture videos with AI prompts
- **Credit System**: Flexible pricing with Stripe integration
- **Real-time Processing**: Background job queue for video rendering
- **Team Collaboration**: Multi-user support with role-based access

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Zustand** - State management

### Backend & Services
- **Firebase Auth** - Google OAuth and email/password authentication
- **Firestore** - NoSQL database for users, avatars, and projects
- **Firebase Storage** - Cloud storage for audio and video files
- **Firebase Functions** - Serverless backend logic

### AI & APIs
- **ElevenLabs** - Text-to-speech and voice cloning
- **OpenAI** - Content moderation and script generation
- **SyncLabs/HeyGen** - Video generation and lip-sync
- **Stripe** - Payment processing

## Project Structure

```
ai-social-add-app/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── login/             # Login page
│   ├── register/          # Register page
│   └── dashboard/         # Protected dashboard
├── components/
│   ├── auth/              # Auth components (ProtectedRoute)
│   ├── landing/           # Landing page sections
│   ├── layout/            # Layout components (Header, Footer)
│   ├── ui/                # Reusable UI components
│   └── dashboard/         # Dashboard-specific components
├── contexts/
│   └── AuthContext.tsx    # Authentication context provider
├── lib/
│   ├── firebase/          # Firebase configuration
│   └── utils/             # Utility functions
├── types/
│   └── index.ts           # TypeScript type definitions
└── FIRESTORE_SCHEMA.md    # Database schema documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- ElevenLabs API key
- OpenAI API key
- SyncLabs/HeyGen API key
- Stripe account (for payments)

### 1. Clone and Install

```bash
git clone <repository-url>
cd ai-social-add-app
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable **Google** and **Email/Password** providers
3. Create Firestore Database:
   - Go to Firestore Database → Create database
   - Start in **production mode**
4. Create Storage bucket:
   - Go to Storage → Get started
5. Get your Firebase config:
   - Go to Project Settings → General → Your apps
   - Add a web app and copy the config

### 3. Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Fill in your credentials in `.env.local`:

```env
# Firebase (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Keys
ELEVENLABS_API_KEY=your_elevenlabs_key
OPENAI_API_KEY=your_openai_key
SYNCLABS_API_KEY=your_synclabs_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
```

### 4. Firestore Security Rules

Apply these security rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /avatars/{avatarId} {
      allow read: if true;
      allow write: if false;
    }

    match /projects/{projectId} {
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. Storage Security Rules

Apply these rules in Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /audio/{projectId}/{fileName} {
      allow read, write: if request.auth != null;
    }

    match /videos/{projectId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    match /avatars/{allPaths=**} {
      allow read: if true;
    }
  }
}
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

See `FIRESTORE_SCHEMA.md` for detailed database structure and collections.

### Main Collections

- **users** - User accounts with credits and plan information
- **avatars** - AI avatar library with metadata and filters
- **projects** - User video projects with status tracking
- **voices** - Available voice options
- **pricingPlans** - Pricing tiers and features
- **transactions** - Credit purchase and usage history

## Development Roadmap

### ✅ Phase 1: Foundation (Complete)
- [x] Next.js setup with TypeScript
- [x] Firebase configuration
- [x] Authentication (Google + Email)
- [x] Landing page
- [x] Dashboard with project grid

### 🚧 Phase 2: Video Creation (In Progress)
- [ ] Avatar library with filters
- [ ] Project creation wizard
- [ ] Script editor (1500 char limit)
- [ ] Voice customization panel
- [ ] Audio upload (STS)
- [ ] Gesture prompt system

### 📋 Phase 3: Backend & Processing
- [ ] Firebase Cloud Functions setup
- [ ] Content validation (OpenAI Moderation)
- [ ] ElevenLabs integration
- [ ] Video generation API integration
- [ ] Job queue system
- [ ] Real-time status updates

### 💳 Phase 4: Monetization
- [ ] Stripe integration
- [ ] Credit purchase flow
- [ ] Subscription management
- [ ] Usage tracking

### 🔧 Phase 5: Admin & Polish
- [ ] Admin panel for avatar management
- [ ] Analytics dashboard
- [ ] Error handling & logging
- [ ] Performance optimization
- [ ] Testing suite

### 🚀 Phase 6: Deployment
- [ ] Firebase Hosting setup
- [ ] Custom domain configuration
- [ ] CI/CD pipeline
- [ ] Monitoring & alerts

## API Integration Guide

### ElevenLabs (Voice Generation)

```typescript
const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/{voiceId}', {
  method: 'POST',
  headers: {
    'xi-api-key': process.env.ELEVENLABS_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: scriptText,
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.3,
      use_speaker_boost: true
    }
  })
});
```

### SyncLabs (Video Generation)

```typescript
const response = await fetch('https://api.synclabs.so/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.SYNCLABS_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    audioUrl: audioFileUrl,
    avatarId: selectedAvatarId,
    aspectRatio: '9:16'
  })
});
```

## Deployment

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Environment Variables for Production

Add all environment variables to Firebase Functions configuration:

```bash
firebase functions:config:set \
  elevenlabs.key="your_key" \
  openai.key="your_key" \
  synclabs.key="your_key"
```

## Contributing

This is a private project. For questions or contributions, contact the development team.

## License

Proprietary - All rights reserved

## Support

For technical issues or questions:
- Email: support@videoai.com
- Documentation: [docs.videoai.com](https://docs.videoai.com)

---

Built with ❤️ using Next.js, Firebase, and AI
