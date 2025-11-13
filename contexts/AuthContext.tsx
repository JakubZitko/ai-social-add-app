'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          credits: data.credits || 0,
          plan: data.plan || 'free',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const createUserDocument = async (firebaseUser: FirebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user document with 5 free credits
      await setDoc(userRef, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        credits: 5,
        plan: 'free',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return fetchUserData(firebaseUser.uid);
  };

  const refreshUser = async () => {
    if (firebaseUser) {
      const userData = await fetchUserData(firebaseUser.uid);
      setUser(userData);
    }
  };

  useEffect(() => {
    // Set a timeout to stop loading after 3 seconds if Firebase doesn't initialize
    const loadingTimeout = setTimeout(() => {
      console.warn('Firebase initialization timeout - setting loading to false');
      setLoading(false);
    }, 3000);

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        clearTimeout(loadingTimeout);
        setFirebaseUser(firebaseUser);

        if (firebaseUser) {
          try {
            const userData = await createUserDocument(firebaseUser);
            setUser(userData);
          } catch (error) {
            console.error('Error creating user document:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }

        setLoading(false);
      });

      return () => {
        clearTimeout(loadingTimeout);
        unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing auth:', error);
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
