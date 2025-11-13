# VideoAI Deployment Guide

Complete step-by-step guide to deploy your VideoAI application to production.

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created
- All API keys obtained (ElevenLabs, OpenAI, SyncLabs)
- Stripe account set up (for payments)

---

## Part 1: Firebase Setup

### 1. Create Firebase Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Functions
# - Hosting
# - Storage
```

### 2. Configure Environment Variables

#### For Frontend (.env.local)

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### For Cloud Functions

```bash
# Set Firebase Functions config
firebase functions:config:set \
  openai.api_key="your_openai_api_key" \
  elevenlabs.api_key="your_elevenlabs_api_key" \
  synclabs.api_key="your_synclabs_api_key"

# View config
firebase functions:config:get
```

### 3. Enable Firebase Services

#### Enable Authentication

```bash
# Go to Firebase Console > Authentication
# Enable Google Sign-In
# Enable Email/Password
```

#### Create Firestore Database

```bash
# Go to Firebase Console > Firestore Database
# Click "Create Database"
# Start in production mode
# Choose location closest to your users
```

#### Create Storage Bucket

```bash
# Go to Firebase Console > Storage
# Click "Get Started"
# Start in production mode
```

---

## Part 2: Firestore Security Rules

### Apply Firestore Rules

Go to Firebase Console > Firestore > Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Avatars (public read, admin write)
    match /avatars/{avatarId} {
      allow read: if true;
      allow write: if false;
    }

    // Voices (public read, admin write)
    match /voices/{voiceId} {
      allow read: if true;
      allow write: if false;
    }

    // Projects (user owns)
    match /projects/{projectId} {
      allow read, update, delete: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }

    // Pricing plans (public read)
    match /pricingPlans/{planId} {
      allow read: if true;
      allow write: if false;
    }

    // Transactions (user owns, read only)
    match /transactions/{transactionId} {
      allow read: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow write: if false;
    }
  }
}
```

### Apply Storage Rules

Go to Firebase Console > Storage > Rules and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Audio files
    match /audio/{projectId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Videos (read authenticated, write functions only)
    match /videos/{projectId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if false;
    }

    // Avatars (public read)
    match /avatars/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }

    // Voices (public read)
    match /voices/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## Part 3: Seed Initial Data

### 1. Get Service Account Key

```bash
# Go to Firebase Console > Project Settings > Service Accounts
# Click "Generate New Private Key"
# Save as serviceAccountKey.json in project root
# Add to .gitignore!
```

### 2. Install TypeScript Node

```bash
npm install -D ts-node @types/node
```

### 3. Run Seed Script

```bash
npx ts-node scripts/seedFirestore.ts
```

This will populate:
- 5 sample avatars
- 5 sample voices (ElevenLabs)
- 4 pricing plans

---

## Part 4: Deploy Cloud Functions

### 1. Install Function Dependencies

```bash
cd functions
npm install
cd ..
```

### 2. Build Functions

```bash
cd functions
npm run build
cd ..
```

### 3. Deploy Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:onProjectCreated
```

### 4. Verify Deployment

```bash
# Test health check
curl https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/healthCheck

# Should return: {"status":"healthy",...}
```

---

## Part 5: Deploy Frontend

### 1. Build Next.js App

```bash
npm run build
```

### 2. Export Static Site

Add to `package.json`:

```json
{
  "scripts": {
    "export": "next export"
  }
}
```

```bash
npm run export
```

### 3. Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

### 4. Set Up Custom Domain (Optional)

```bash
# Go to Firebase Console > Hosting
# Click "Add custom domain"
# Follow DNS configuration steps
```

---

## Part 6: API Integration Testing

### Test ElevenLabs API

```bash
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM" \
  -H "xi-api-key: YOUR_ELEVENLABS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","model_id":"eleven_monolingual_v1"}' \
  --output test.mp3
```

### Test OpenAI Moderation

```bash
curl -X POST "https://api.openai.com/v1/moderations" \
  -H "Authorization: Bearer YOUR_OPENAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":"Hello world"}'
```

### Test SyncLabs API

```bash
curl -X POST "https://api.synclabs.so/v1/generate" \
  -H "Authorization: Bearer YOUR_SYNCLABS_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "audioUrl":"YOUR_AUDIO_URL",
    "avatarId":"avatar_001",
    "aspectRatio":"9:16"
  }'
```

---

## Part 7: Monitoring & Logging

### Enable Cloud Functions Logs

```bash
# View logs
firebase functions:log

# View specific function logs
firebase functions:log --only onProjectCreated
```

### Set Up Error Tracking (Optional)

Install Sentry:

```bash
npm install @sentry/nextjs @sentry/node
```

Configure in `sentry.client.config.ts` and `sentry.server.config.ts`.

---

## Part 8: Stripe Integration (Payments)

### 1. Create Stripe Products

```bash
# Go to Stripe Dashboard > Products
# Create products for each pricing tier:
# - Starter: $29/month, 50 credits
# - Creator: $79/month, 150 credits
# - Pro: $199/month, unlimited credits
```

### 2. Get Stripe Keys

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Create Checkout Function

```typescript
// functions/src/api/createCheckout.ts
// See Stripe documentation for implementation
```

### 4. Set Up Webhook

```bash
# In Stripe Dashboard > Developers > Webhooks
# Add endpoint: https://YOUR_PROJECT.cloudfunctions.net/handleStripeWebhook
# Select events: checkout.session.completed
```

---

## Part 9: Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] Firestore security rules applied
- [ ] Storage security rules applied
- [ ] Cloud Functions deployed and tested
- [ ] Frontend deployed to Hosting
- [ ] Custom domain configured (if applicable)
- [ ] Stripe products created
- [ ] API keys valid and tested
- [ ] Error tracking enabled
- [ ] Analytics enabled (Google Analytics)
- [ ] Terms of Service & Privacy Policy added
- [ ] Email templates configured
- [ ] Backup strategy in place

---

## Part 10: Post-Deployment

### Monitor Usage

```bash
# Check Firebase usage
firebase projects:list
firebase functions:log --limit 50
```

### Scale as Needed

```bash
# Upgrade Firebase plan if needed
# Monitor Cloud Functions quotas
# Set up billing alerts
```

### Update Functions

```bash
# Make changes in functions/src
cd functions && npm run build && cd ..
firebase deploy --only functions
```

---

## Troubleshooting

### Functions Not Deploying

```bash
# Clear cache
firebase functions:delete --force
firebase deploy --only functions
```

### CORS Errors

Add to Cloud Function:

```typescript
response.set('Access-Control-Allow-Origin', '*');
response.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
```

### Firestore Permission Denied

- Check security rules
- Verify user is authenticated
- Check document ownership

### Storage Upload Fails

- Check storage rules
- Verify bucket name
- Check file size limits

---

## Cost Optimization

1. **Use Firebase Free Tier** initially
2. **Set Cloud Functions timeout** appropriately
3. **Implement caching** for avatars/voices
4. **Monitor API usage** (ElevenLabs, SyncLabs)
5. **Set up billing alerts** in Firebase Console

---

## Support

For issues:
- Check Firebase logs: `firebase functions:log`
- Review Firestore rules
- Test APIs independently
- Check environment variables

---

**Deployment complete!** 🚀

Your VideoAI app is now live and ready to generate AI videos!
