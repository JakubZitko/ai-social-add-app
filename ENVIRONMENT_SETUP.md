# 🔐 Environment Variables Setup Guide

Step-by-step guide to get all your API keys and configure the app.

---

## 📋 Quick Checklist

- [ ] Firebase project created
- [ ] Firebase web app configured
- [ ] OpenAI API key obtained
- [ ] ElevenLabs API key obtained
- [ ] SyncLabs API key obtained (or HeyGen)
- [ ] .env.local file created and filled

---

## 1️⃣ Firebase Configuration (REQUIRED)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `videoai` (or your choice)
4. **Enable Google Analytics**: Yes (recommended)
5. Click **"Create project"**
6. Wait 30 seconds for project creation

### Step 2: Add Web App to Firebase

1. In your Firebase project, click the **</>** icon (Add app)
2. Register app nickname: `VideoAI Web App`
3. **Check**: "Also set up Firebase Hosting"
4. Click **"Register app"**

### Step 3: Copy Firebase Config

You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuv",
  authDomain: "videoai-demo.firebaseapp.com",
  projectId: "videoai-demo",
  storageBucket: "videoai-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

### Step 4: Fill in .env.local

Open `.env.local` and copy values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuv
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=videoai-demo.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=videoai-demo
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=videoai-demo.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789
```

✅ Firebase setup complete!

---

## 2️⃣ Enable Firebase Services

### Enable Authentication

1. In Firebase Console, go to **"Authentication"** (left sidebar)
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Enable **"Google"**:
   - Click on Google
   - Toggle "Enable"
   - Add support email (your email)
   - Click "Save"
5. Enable **"Email/Password"**:
   - Click on Email/Password
   - Toggle "Enable"
   - Click "Save"

### Create Firestore Database

1. Go to **"Firestore Database"** (left sidebar)
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose location: `us-central1` (or closest to you)
5. Click **"Enable"**

### Create Storage Bucket

1. Go to **"Storage"** (left sidebar)
2. Click **"Get started"**
3. Select **"Start in production mode"**
4. Click **"Next"**
5. Keep default location
6. Click **"Done"**

✅ Firebase services enabled!

---

## 3️⃣ OpenAI API Key (REQUIRED)

### Get OpenAI Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Click your profile (top right) → **"View API keys"**
4. Click **"Create new secret key"**
5. Name it: `VideoAI - Content Moderation`
6. Copy the key (starts with `sk-proj-` or `sk-`)

### Add to .env.local

```env
OPENAI_API_KEY=sk-proj-1234567890abcdefghijklmnopqrstuvwxyz
```

### Cost Estimate
- **Price**: ~$0.0002 per moderation request
- **100 videos**: ~$0.02
- **1000 videos**: ~$0.20

✅ OpenAI configured!

---

## 4️⃣ ElevenLabs API Key (REQUIRED)

### Get ElevenLabs Key

1. Go to [ElevenLabs](https://elevenlabs.io)
2. Sign up for free account
3. Go to **"Settings"** → **"API Keys"**
   - Or direct: [https://elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys)
4. Click **"Create API Key"**
5. Name it: `VideoAI`
6. Copy the key

### Add to .env.local

```env
ELEVENLABS_API_KEY=abc123def456ghi789jkl012mno345pqr
```

### Free Tier
- **10,000 characters/month** free
- Good for ~50 videos
- Then $5/month for 30,000 chars

### Cost Estimate
- **Price**: ~$0.18 per 1000 characters
- **Average script**: 500 chars = $0.09
- **100 videos**: ~$9.00

✅ ElevenLabs configured!

---

## 5️⃣ SyncLabs/HeyGen API Key (REQUIRED)

### Option A: SyncLabs (Recommended)

1. Go to [SyncLabs](https://synclabs.so)
2. Sign up for account
3. Go to **"Dashboard"** → **"API Keys"**
4. Click **"Generate API Key"**
5. Copy the key

```env
SYNCLABS_API_KEY=synclabs_abc123def456ghi789jkl012
```

**Pricing**: Contact for pricing, typically $0.50-$2.00 per video

### Option B: HeyGen

1. Go to [HeyGen](https://heygen.com)
2. Sign up for account
3. Go to **"Settings"** → **"API"**
4. Copy your API key

```env
SYNCLABS_API_KEY=heygen_abc123def456ghi789jkl012
```

**Pricing**: Check [pricing page](https://heygen.com/pricing)

### Note on Video Generation APIs

These APIs can be expensive. Alternative options:

1. **D-ID**: Another lip-sync API
2. **Synthesia**: Enterprise option
3. **Custom**: Use open-source models (Wav2Lip, SadTalker)

✅ Video generation configured!

---

## 6️⃣ Stripe (OPTIONAL - for payments)

### Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or log in
3. Toggle **"Test mode"** (top right) to ON
4. Go to **"Developers"** → **"API keys"**
5. Copy both keys:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### Add to .env.local

```env
STRIPE_SECRET_KEY=sk_test_51A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0
```

### Create Products

1. Go to **"Products"** → **"Add product"**
2. Create 3 products:

**Starter Plan:**
- Name: VideoAI Starter
- Price: $29/month
- Credits: 50

**Creator Plan:**
- Name: VideoAI Creator
- Price: $79/month
- Credits: 150

**Pro Plan:**
- Name: VideoAI Pro
- Price: $199/month
- Credits: Unlimited

3. Copy the **Price ID** for each and save for later

✅ Stripe configured!

---

## 7️⃣ Verify Your Setup

### Check .env.local File

Your `.env.local` should now look like:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1234...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=videoai-demo.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=videoai-demo
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=videoai-demo.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456...

# API Keys
OPENAI_API_KEY=sk-proj-abc123...
ELEVENLABS_API_KEY=abc123def456...
SYNCLABS_API_KEY=synclabs_abc123...

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_51A1B2C3...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51A1B2C3...
```

### Test the Setup

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:5000

# Try to sign up with Google
# If it works, you're good! ✅
```

---

## 8️⃣ Configure Firebase Functions

For **Cloud Functions** to use the API keys:

```bash
# Set function configs
firebase functions:config:set \
  openai.api_key="YOUR_OPENAI_KEY" \
  elevenlabs.api_key="YOUR_ELEVENLABS_KEY" \
  synclabs.api_key="YOUR_SYNCLABS_KEY"

# Verify
firebase functions:config:get

# Deploy functions
cd functions && npm install && cd ..
firebase deploy --only functions
```

---

## 🎯 Cost Summary

### Per Video Cost:
- OpenAI Moderation: **$0.0002**
- ElevenLabs TTS: **$0.20** (avg)
- SyncLabs Video: **$1.00** (avg)
- **Total: ~$1.20 per video**

### Monthly Estimates:

**100 videos/month:**
- Cost: ~$120
- Revenue (Starter, 50 users): $1,450
- **Profit: $1,330** ✅

**500 videos/month:**
- Cost: ~$600
- Revenue (mixed plans): $5,000+
- **Profit: $4,400+** ✅

---

## ❓ Troubleshooting

### Firebase connection error
- Check all NEXT_PUBLIC_ variables are filled
- Verify Firebase project ID matches
- Check Firebase services are enabled

### OpenAI error
- Verify API key starts with `sk-`
- Check billing is set up in OpenAI dashboard
- Ensure you have credits available

### ElevenLabs error
- Verify API key is correct
- Check you haven't exceeded free tier (10k chars)
- Try regenerating the API key

### SyncLabs error
- Verify API key is correct
- Contact SyncLabs for API access
- Ensure billing is set up

---

## ✅ Setup Complete!

You should now have:
- [x] Firebase project configured
- [x] All services enabled
- [x] API keys obtained
- [x] .env.local file filled
- [x] Ready to run `npm run dev`

**Next steps**: See `README.md` for development instructions!

---

## 🔒 Security Notes

1. **NEVER** commit `.env.local` to git (it's in .gitignore)
2. All `NEXT_PUBLIC_` variables are visible to users
3. Keep secret keys secure
4. Use environment variables in production
5. Rotate keys if exposed

---

**Need help?** Check `DEPLOYMENT_GUIDE.md` for more details!
