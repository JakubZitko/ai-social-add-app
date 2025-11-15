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
import { getUserProjects } from '@/lib/firestore/projects';
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
  const [loadingVideos, setLoadingVideos] = useState(true);

  // Fetch recent videos from Firestore
  useEffect(() => {
    const fetchRecentVideos = async () => {
      if (!user) return;

      try {
        setLoadingVideos(true);
        const videosData = await getUserProjects(user.uid);
        setRecentVideos(videosData.slice(0, 6)); // Get latest 6 videos
      } catch (error) {
        console.error('Error fetching recent videos:', error);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchRecentVideos();
  }, [user]);

  // Quick start templates - GRAYSCALE ONLY
  const quickStartTemplates = [
    {
      id: 'tiktok-ad',
      title: 'TikTok Ad',
      subtitle: '1-click viral ad',
      icon: <TrendingUp className="h-6 w-6" />,
      credits: 2,
      duration: '15-30s',
      route: '/templates/tiktok-ad',
    },
    {
      id: 'facebook-ad',
      title: 'Facebook Ad',
      subtitle: '1-click product ad',
      icon: <ShoppingCart className="h-6 w-6" />,
      credits: 3,
      duration: '30s',
      route: '/templates/facebook-ad',
    },
    {
      id: 'product-video',
      title: 'Product Video',
      subtitle: '1-click showcase',
      icon: <Video className="h-6 w-6" />,
      credits: 3,
      duration: '60s',
      route: '/templates/product-video',
    },
    {
      id: 'ugc-testimonial',
      title: 'UGC Testimonial',
      subtitle: '1-click authentic',
      icon: <Heart className="h-6 w-6" />,
      credits: 2,
      duration: '30s',
      route: '/templates/ugc',
    },
  ];

  // Stats - GRAYSCALE ONLY
  const stats = [
    {
      label: 'Videos Created',
      value: recentVideos.length,
      icon: <Video className="h-6 w-6" />,
    },
    {
      label: 'Processing',
      value: recentVideos.filter((v) => v.status === 'processing').length,
      icon: <Loader className="h-6 w-6" />,
    },
    {
      label: 'Completed',
      value: recentVideos.filter((v) => v.status === 'completed').length,
      icon: <CheckCircle className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName || 'User'}
          </h1>
          <p className="text-gray-600">Create AI videos in seconds</p>
        </div>

        {/* Stats Cards - GRAYSCALE */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-[24px] p-6 border-2 border-gray-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  {React.cloneElement(stat.icon, { className: 'h-6 w-6 text-white' })}
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase">
                    {stat.label}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start Templates - GRAYSCALE */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Templates</h2>
          <div className="grid grid-cols-4 gap-4">
            {quickStartTemplates.map((template) => (
              <Link
                key={template.id}
                href={template.route}
                className="bg-white rounded-[24px] p-6 border-2 border-gray-200 hover:border-gray-900 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {React.cloneElement(template.icon, { className: 'h-6 w-6 text-white' })}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{template.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.subtitle}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{template.credits} credits</span>
                  <span>{template.duration}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Videos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Videos</h2>
            <Link
              href="/projects"
              className="text-sm font-semibold text-gray-900 hover:text-gray-700 flex items-center gap-2"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingVideos ? (
            <div className="bg-white rounded-[24px] p-12 text-center border border-gray-200">
              <Loader className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading videos...</p>
            </div>
          ) : recentVideos.length === 0 ? (
            <div className="bg-white rounded-[24px] p-12 text-center border border-gray-200">
              <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No videos yet</h3>
              <p className="text-gray-600 mb-6">Create your first AI video</p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Video
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {recentVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-[24px] overflow-hidden border-2 border-gray-200 hover:border-gray-900 hover:shadow-lg transition-all group cursor-pointer"
                  onClick={() => router.push(`/video/${video.id}`)}
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-6 w-6 text-gray-900 ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                      {video.title || 'Untitled Video'}
                    </h3>
                    <div className="flex items-center gap-2">
                      {video.status === 'completed' && (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                          Completed
                        </span>
                      )}
                      {video.status === 'processing' && (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg flex items-center gap-1">
                          <Loader className="h-3 w-3 animate-spin" />
                          Processing
                        </span>
                      )}
                      {video.status === 'failed' && (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                          Failed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-6">
          <Link
            href="/create"
            className="bg-white rounded-[24px] p-8 border-2 border-gray-200 hover:border-gray-900 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Create New Video</h3>
                <p className="text-sm text-gray-600">Start from scratch with full control</p>
              </div>
            </div>
          </Link>

          <Link
            href="/billing"
            className="bg-white rounded-[24px] p-8 border-2 border-gray-200 hover:border-gray-900 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {credits} Credits Available
                </h3>
                <p className="text-sm text-gray-600">Buy more credits to create more videos</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
