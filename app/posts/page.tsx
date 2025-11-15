'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Edit,
  Trash2,
  Instagram,
  Youtube,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Loader,
} from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ScheduledPost } from '@/lib/firestore/types';

function ScheduledPostsContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch scheduled posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const postsQuery = query(
          collection(db, 'scheduledPosts'),
          where('userId', '==', user.uid),
          orderBy('scheduledTime', 'asc')
        );
        const snapshot = await getDocs(postsQuery);
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ScheduledPost[];
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return <FaTiktok className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return 'bg-gray-900 text-white';
      case 'instagram':
        return 'bg-gradient-to-br from-gray-700 to-gray-700 text-white';
      case 'youtube':
        return 'bg-gray-700 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(selectedWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getPostsForDay = (day: Date) => {
    return posts.filter((post) => {
      const postDate = new Date(post.scheduledTime);
      return (
        postDate.getDate() === day.getDate() &&
        postDate.getMonth() === day.getMonth() &&
        postDate.getFullYear() === day.getFullYear() &&
        (filterPlatform === 'all' || post.platforms.includes(filterPlatform as any))
      );
    });
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 22; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  const getPostPosition = (scheduledTime: Date) => {
    const hour = scheduledTime.getHours();
    const minutes = scheduledTime.getMinutes();
    const topOffset = (hour - 6) * 120 + (minutes / 60) * 120;
    return topOffset;
  };

  const getDuration = (scheduledTime: Date) => {
    // Default post duration of 1 hour
    return 60;
  };

  const weekDays = getWeekDays();
  const timeSlots = getTimeSlots();
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Sidebar - Filters & Quick Actions */}
      <div className="w-[280px] border-r border-gray-100 bg-white flex flex-col p-4 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Scheduled Posts</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {/* Platform Filters */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 mb-3">Filter by Platform</h4>
          <div className="space-y-2">
            <button
              onClick={() => setFilterPlatform('all')}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                filterPlatform === 'all'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Platforms
            </button>
            <button
              onClick={() => setFilterPlatform('tiktok')}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                filterPlatform === 'tiktok'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaTiktok className="h-4 w-4" />
              TikTok
            </button>
            <button
              onClick={() => setFilterPlatform('instagram')}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                filterPlatform === 'instagram'
                  ? 'bg-gradient-to-br from-gray-700 to-gray-700 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </button>
            <button
              onClick={() => setFilterPlatform('youtube')}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                filterPlatform === 'youtube'
                  ? 'bg-gray-700 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Youtube className="h-4 w-4" />
              YouTube
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-50 rounded-2xl p-4 border border-gray-200">
          <h4 className="text-xs font-semibold text-gray-900 mb-3">This Week</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Scheduled</span>
              <span className="text-sm font-bold text-gray-900">{posts.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Posted</span>
              <span className="text-sm font-bold text-gray-600">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Failed</span>
              <span className="text-sm font-bold text-gray-600">0</span>
            </div>
          </div>
        </div>

        {/* Upcoming Posts List */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 mb-3">Upcoming Posts</h4>
          <div className="space-y-3">
            {posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-2 mb-2">
                  <Clock className="h-3 w-3 text-gray-400 mt-0.5" />
                  <span className="text-xs text-gray-600">
                    {post.scheduledTime.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-900 line-clamp-2 mb-2">
                  {post.videoTitle}
                </p>
                <div className="flex gap-1">
                  {post.platforms.map((platform) => (
                    <div
                      key={platform}
                      className={`w-5 h-5 rounded-md flex items-center justify-center ${getPlatformColor(
                        platform
                      )}`}
                    >
                      {getPlatformIcon(platform)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-gray-900 text-white px-4 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mt-auto">
          <Plus className="h-5 w-5" />
          Schedule New Post
        </button>
      </div>

      {/* Main Calendar View */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Calendar Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Posting Calendar</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newDate = new Date(selectedWeek);
                  newDate.setDate(newDate.getDate() - 7);
                  setSelectedWeek(newDate);
                }}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
                {selectedWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => {
                  const newDate = new Date(selectedWeek);
                  newDate.setDate(newDate.getDate() + 7);
                  setSelectedWeek(newDate);
                }}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button
            onClick={() => setSelectedWeek(new Date())}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-900 transition-all"
          >
            Today
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[900px]">
            {/* Day Headers */}
            <div className="sticky top-0 bg-white z-20 border-b border-gray-100 grid grid-cols-8">
              <div className="p-3 text-center">
                <span className="text-xs font-semibold text-gray-400 uppercase">Time</span>
              </div>
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className={`p-3 text-center border-l border-gray-100 ${
                    isToday(day) ? 'border-t-4 border-t-gray-900' : ''
                  }`}
                >
                  <div
                    className={`text-2xl font-medium ${
                      isToday(day) ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {day.getDate()}
                  </div>
                  <div
                    className={`text-xs font-bold uppercase tracking-wider mt-1 ${
                      isToday(day) ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="relative">
              {timeSlots.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-gray-50">
                  <div className="p-3 text-right pr-4">
                    <span className="text-xs font-medium text-gray-400">
                      {hour === 0
                        ? '12 AM'
                        : hour < 12
                        ? `${hour} AM`
                        : hour === 12
                        ? '12 PM'
                        : `${hour - 12} PM`}
                    </span>
                  </div>
                  {weekDays.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="border-l border-gray-100 h-[120px] relative hover:bg-gray-50 transition-colors"
                    >
                      {/* Posts for this time slot */}
                      {getPostsForDay(day)
                        .filter((post) => {
                          const postHour = post.scheduledTime.getHours();
                          return postHour === hour;
                        })
                        .map((post) => {
                          const position = getPostPosition(post.scheduledTime);
                          const slotPosition = position - (hour - 6) * 120;

                          return (
                            <div
                              key={post.id}
                              className="absolute left-2 right-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-lg transition-all z-10 cursor-pointer group"
                              style={{
                                top: `${slotPosition}px`,
                                height: '100px',
                              }}
                            >
                              <div className="flex flex-col h-full">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h3 className="text-xs font-bold text-gray-900 line-clamp-1 mb-1">
                                      {post.videoTitle}
                                    </h3>
                                    <p className="text-[10px] text-gray-600 line-clamp-2">
                                      {post.caption}
                                    </p>
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button className="w-6 h-6 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm border border-gray-200">
                                      <Edit className="h-3 w-3 text-gray-600" />
                                    </button>
                                    <button className="w-6 h-6 rounded-md bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm border border-gray-200">
                                      <Trash2 className="h-3 w-3 text-gray-600" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mt-auto">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-[10px] text-gray-600 font-medium">
                                    {post.scheduledTime.toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                  <div className="flex gap-1 ml-auto">
                                    {post.platforms.map((platform) => (
                                      <div
                                        key={platform}
                                        className={`w-5 h-5 rounded-md flex items-center justify-center ${getPlatformColor(
                                          platform
                                        )}`}
                                      >
                                        {getPlatformIcon(platform)}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScheduledPostsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ScheduledPostsContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
