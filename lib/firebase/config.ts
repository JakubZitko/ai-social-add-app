import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is complete
const isConfigValid = Object.values(firebaseConfig).every(value => value !== undefined);

if (!isConfigValid && typeof window !== 'undefined') {
  console.error('❌ Firebase configuration is incomplete. Please set up your .env.local file.');
  console.log('📝 See ENVIRONMENT_SETUP.md for detailed instructions');
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);

// Initialize Firestore with new cache API (replaces deprecated enableIndexedDbPersistence)
export const db = (() => {
  try {
    if (getApps().length === 1 && typeof window !== 'undefined' && isConfigValid) {
      return initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    }
    return getFirestore(app);
  } catch (error) {
    console.warn('Failed to initialize Firestore with cache, using default:', error);
    return getFirestore(app);
  }
})();

export const storage = getStorage(app);

export default app;
