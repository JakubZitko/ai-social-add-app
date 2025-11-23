'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, ChevronRight, CreditCard, Video, Zap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signInWithGoogle, signUpWithEmail, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signUpWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="animate-spin h-12 w-12 border-4 border-gray-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">

        {/* Left Side - Branding */}
        <div className="hidden md:block">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-full"></div>
              </div>
              <span className="font-bold text-3xl tracking-tight text-gray-900">VideoAI</span>
            </div>

            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Join thousands creating viral content
            </h1>

            <p className="text-xl text-gray-600">
              Get started with 10 free credits and create your first AI video in minutes
            </p>

            {/* Benefits Cards */}
            <div className="space-y-4 pt-4">
              <div className="bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">10 Free Credits</h3>
                  <p className="text-sm text-gray-600">Start creating immediately with no payment required</p>
                </div>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Video className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">100+ AI Avatars</h3>
                  <p className="text-sm text-gray-600">Choose from diverse, professional AI actors</p>
                </div>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">60-Second Generation</h3>
                  <p className="text-sm text-gray-600">From script to final video in under a minute</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-gray-200">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white rounded-full"></div>
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">VideoAI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create your account</h2>
            <p className="mt-2 text-gray-500">Start creating viral video ads in minutes</p>
          </div>

          {/* Free Credits Badge */}
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-50 border-2 border-gray-200 rounded-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gray-700" />
              <span className="text-sm font-bold text-gray-900">
                Get 10 free credits to start creating now!
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
              <p className="text-sm text-gray-700">{error}</p>
            </div>
          )}

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mb-4 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-900 hover:border-gray-300 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Email Sign Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-gray-900 focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-gray-900 focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-gray-900 focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-0.5 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900"
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="font-medium text-gray-900 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="font-medium text-gray-900 hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-6 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-gray-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
