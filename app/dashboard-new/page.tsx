'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Sparkles,
  Video,
  Zap,
  TrendingUp,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  ShoppingCart,
  Heart,
  DollarSign,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import Link from 'next/link';

export default function ImprovedDashboardPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ImprovedDashboardContent />
      </AppLayout>
    </ProtectedRoute>
  );
}

function ImprovedDashboardContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const [recentVideos, setRecentVideos] = useState<any[]>([]);

  // Quick start templates based on user goals
  const quickStartTemplates = [
    {
      id: 'tiktok-ad',
      title: 'TikTok Ad',
      subtitle: '1-click viral ad',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'from-gray-900 to-gray-700',
      credits: 2,
      duration: '15-30s',
      route: '/templates/tiktok-ad',
    },
    {
      id: 'facebook-ad',
      title: 'Facebook Ad',
      subtitle: '1-click product ad',
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'from-blue-600 to-indigo-600',
      credits: 3,
      duration: '30s',
      route: '/templates/facebook-ad',
    },
    {
      id: 'product-video',
      title: 'Product Video',
      subtitle: '1-click showcase',
      icon: <Video className="h-6 w-6" />,
      color: 'from-purple-600 to-pink-600',
      credits: 3,
      duration: '60s',
      route: '/templates/product-video',
    },
    {
      id: 'ugc-testimonial',
      title: 'UGC Testimonial',
      subtitle: '1-click authentic',
      icon: <Heart className="h-6 w-6" />,
      color: 'from-red-600 to-rose-600',
      credits: 2,
      duration: '30s',
      route: '/templates/ugc',
    },
  ];

  const stats = [
    {
      label: 'Videos Created',
      value: recentVideos.length,
      icon: <Video className="h-6 w-6" />,
      color: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Processing',
      value: recentVideos.filter((v) => v.status === 'processing').length,
      icon: <Loader className="h-6 w-6" />,
      color: 'from-yellow-50 to-orange-50',
      iconBg: 'bg-yellow-600',
      borderColor: 'border-yellow-200',
    },
    {
      label: 'Completed',
      value: recentVideos.filter((v) => v.status === 'completed').length,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-600',
      borderColor: 'border-green-200',
    },
  ];

  const recommendations = [
    {
      title: 'How to Create a Viral TikTok Ad in 60 Seconds',
      type: 'Tutorial',
      duration: '2 min read',
      link: '#',
    },
    {
      title: 'High-Converting Product Ad Template for Facebook',
      type: 'Template',
      duration: 'Free',
      link: '#',
    },
    {
      title: 'Success Story: Brand X made $50k with AI videos',
      type: 'Case Study',
      duration: '5 min read',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back{user?.displayName ? `, ${user.displayName}` : ''}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            You have <span className="font-bold text-gray-900">{credits} credits</span> available
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.color} rounded-[24px] p-6 border-2 ${stat.borderColor}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase">{stat.label}</div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Quick Start</h2>
          </div>
          <p className="text-gray-600 mb-6">Create your next video in one click</p>

          <div className="grid grid-cols-4 gap-6">
            {quickStartTemplates.map((template) => (
              <Link key={template.id} href={template.route}>
                <div className="group bg-white rounded-[20px] p-6 border border-gray-100 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1">
                  <div className={`w-14 h-14 bg-gradient-to-br ${template.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <div className="text-white">{template.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{template.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.subtitle}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{template.credits} credits</span>
                    <span className="text-gray-500">{template.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Videos Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Recent Videos</h2>
            <Link
              href="/projects"
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentVideos.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No videos yet!</h3>
              <p className="text-gray-600 mb-6">
                Let's create your first video - it takes less than 5 minutes
              </p>
              <button
                onClick={() => router.push('/templates')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Create Your First Video
              </button>
            </div>
          ) : (
            // Video Grid
            <div className="grid grid-cols-3 gap-6">
              {recentVideos.slice(0, 3).map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-[20px] overflow-hidden border border-gray-100 hover:shadow-lg transition-all group cursor-pointer"
                  onClick={() => router.push(`/video/${video.id}`)}
                >
                  <div className="relative aspect-video bg-gray-100">
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    {video.status === 'completed' && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    {video.status === 'processing' && (
                      <div className="absolute inset-0 bg-blue-600/90 flex items-center justify-center">
                        <Loader className="h-8 w-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-1">{video.title}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{video.createdAt}</span>
                      <span className="capitalize">{video.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
          </div>
          <p className="text-gray-600 mb-6">Based on your goals and activity</p>

          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <a
                key={index}
                href={rec.link}
                className="flex items-center justify-between p-5 bg-white rounded-[16px] border border-gray-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {rec.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span className="font-medium">{rec.type}</span>
                      <span>•</span>
                      <span>{rec.duration}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>
        </div>

        {/* Onboarding Checklist (if new user) */}
        {recentVideos.length < 3 && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[24px] p-8 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Get Started Checklist</h3>
                <p className="text-gray-700 mb-4">Complete these steps to get the most out of VideoAI</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Create account</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 ${recentVideos.length > 0 ? 'bg-green-500' : 'bg-gray-300'} rounded-full flex items-center justify-center`}>
                      {recentVideos.length > 0 ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">Create your first video</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Download your video</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Connect social media account</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm font-semibold text-blue-900">
                    Complete all steps → Get 10 Bonus Credits! 🎁
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
