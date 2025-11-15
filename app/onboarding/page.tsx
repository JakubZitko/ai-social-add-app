'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Sparkles,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const goals = [
    {
      id: 'ecommerce',
      title: 'E-commerce Product Ads',
      description: 'Create high-converting ads for my products',
      icon: <ShoppingCart className="h-8 w-8" />,
      color: 'from-gray-500 to-gray-700',
      templates: ['facebook-product-ad', 'tiktok-native-ad', 'ugc-testimonial'],
    },
    {
      id: 'social',
      title: 'Social Media Content',
      description: 'Daily content for TikTok, Instagram, YouTube',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'from-gray-500 to-gray-700',
      templates: ['shorts-viral', 'shorts-educational', 'tiktok-native-ad'],
    },
    {
      id: 'affiliate',
      title: 'Affiliate Product Reviews',
      description: 'Review products and earn commissions',
      icon: <DollarSign className="h-8 w-8" />,
      color: 'from-gray-500 to-gray-700',
      templates: ['affiliate-review', 'affiliate-comparison', 'product-showcase'],
    },
    {
      id: 'education',
      title: 'Educational/Explainer Videos',
      description: 'Teach concepts and explain ideas',
      icon: <GraduationCap className="h-8 w-8" />,
      color: 'from-gray-500 to-gray-700',
      templates: ['explainer-video', 'shorts-educational', 'product-tutorial'],
    },
    {
      id: 'ugc',
      title: 'UGC & Testimonials',
      description: 'Authentic user-generated style content',
      icon: <Heart className="h-8 w-8" />,
      color: 'from-gray-500 to-gray-700',
      templates: ['ugc-testimonial', 'ugc-unboxing', 'testimonial-compilation'],
    },
  ];

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter((id) => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const handleContinue = async () => {
    if (selectedGoals.length === 0) {
      alert('Please select at least one goal');
      return;
    }

    setLoading(true);

    try {
      // Save user preferences to Firestore
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          onboardingCompleted: true,
          goals: selectedGoals,
          onboardingCompletedAt: new Date(),
        });
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding preferences:', error);
      // Still redirect even if save fails
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-gray-600" />
            </div>
            <h1 className="text-4xl font-bold text-white">Welcome to VideoAI!</h1>
          </div>
          <p className="text-xl text-gray-300">
            You have <span className="font-bold text-white">10 FREE CREDITS</span> to get started! 🎁
          </p>
          <p className="text-gray-400 mt-2">
            Let's personalize your experience - What type of videos do you want to create?
          </p>
        </div>

        {/* Goal Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`group relative p-6 rounded-[24px] text-left transition-all ${
                selectedGoals.includes(goal.id)
                  ? 'bg-white shadow-2xl scale-105'
                  : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
              }`}
            >
              {/* Selected Checkmark */}
              {selectedGoals.includes(goal.id) && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${goal.color} flex items-center justify-center mb-4 ${
                  selectedGoals.includes(goal.id) ? 'text-white' : 'text-white/80'
                }`}
              >
                {goal.icon}
              </div>

              {/* Content */}
              <h3
                className={`text-lg font-bold mb-2 ${
                  selectedGoals.includes(goal.id) ? 'text-gray-900' : 'text-white'
                }`}
              >
                {goal.title}
              </h3>
              <p
                className={`text-sm ${
                  selectedGoals.includes(goal.id) ? 'text-gray-600' : 'text-gray-300'
                }`}
              >
                {goal.description}
              </p>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors text-sm font-semibold"
          >
            Skip, let me explore
          </button>

          <div className="flex items-center gap-4">
            <div className="text-gray-300 text-sm">
              {selectedGoals.length === 0
                ? 'Select at least one goal'
                : `${selectedGoals.length} goal${selectedGoals.length > 1 ? 's' : ''} selected`}
            </div>
            <button
              onClick={handleContinue}
              disabled={selectedGoals.length === 0 || loading}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl ${
                selectedGoals.length === 0 || loading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-purple-900 hover:bg-gray-50 hover:scale-105'
              }`}
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Don't worry, you can change these preferences anytime in settings
          </p>
        </div>
      </div>
    </div>
  );
}
