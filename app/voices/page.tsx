'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Mic,
  Play,
  Pause,
  Heart,
  Upload,
  Search,
  Filter,
  Star,
  Volume2,
  User,
  Sparkles,
  Globe,
  Zap,
  Crown,
  Loader,
} from 'lucide-react';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Voice } from '@/lib/firestore/types';

export default function VoicesPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <VoicesContent />
      </AppLayout>
    </ProtectedRoute>
  );
}

function VoicesContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female' | 'neutral'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'professional' | 'casual' | 'energetic' | 'calm' | 'narrative' | 'custom'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch voices from Firestore
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setLoading(true);
        const voicesQuery = query(collection(db, 'voices'), orderBy('name', 'asc'));
        const snapshot = await getDocs(voicesQuery);
        const voicesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Voice[];
        setVoices(voicesData);
      } catch (error) {
        console.error('Error fetching voices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, []);

  const toggleFavorite = async (voiceId: string) => {
    const voice = voices.find((v) => v.id === voiceId);
    if (!voice) return;

    try {
      const voiceRef = doc(db, 'voices', voiceId);
      await updateDoc(voiceRef, { isFavorite: !voice.isFavorite });
      setVoices(voices.map((v) => (v.id === voiceId ? { ...v, isFavorite: !v.isFavorite } : v)));
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const togglePlayPause = (voiceId: string) => {
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(voiceId);
      // Simulate audio playback
      setTimeout(() => setPlayingVoiceId(null), 3000);
    }
  };

  const filteredVoices = voices.filter((voice) => {
    if (showFavoritesOnly && !voice.isFavorite) return false;
    if (filterGender !== 'all' && voice.gender !== filterGender) return false;
    if (filterCategory !== 'all' && voice.category !== filterCategory) return false;
    if (searchQuery && !voice.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !voice.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: voices.length,
    favorites: voices.filter((v) => v.isFavorite).length,
    premium: voices.filter((v) => v.isPremium).length,
    custom: voices.filter((v) => v.category === 'custom').length,
  };

  const getGenderIcon = (gender: string) => {
    return <User className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'professional':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'casual':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'energetic':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'calm':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'narrative':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'custom':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Voice Library</h1>
            <p className="text-gray-600">Choose from professional AI voices or upload your own</p>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
          >
            <Upload className="h-5 w-5" />
            Upload Custom Voice
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-[24px] p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Total Voices</div>
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Favorites</div>
                <div className="text-3xl font-bold text-gray-900">{stats.favorites}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Premium</div>
                <div className="text-3xl font-bold text-gray-900">{stats.premium}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Custom</div>
                <div className="text-3xl font-bold text-gray-900">{stats.custom}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search voices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Gender Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value as any)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm font-medium"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm font-medium"
            >
              <option value="all">All Categories</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="energetic">Energetic</option>
              <option value="calm">Calm</option>
              <option value="narrative">Narrative</option>
              <option value="custom">Custom</option>
            </select>

            {/* Favorites Toggle */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                showFavoritesOnly
                  ? 'bg-gray-50 text-gray-700 border-2 border-gray-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Heart className={`h-5 w-5 ${showFavoritesOnly ? 'fill-gray-600' : ''}`} />
              Favorites
            </button>
          </div>
        </div>

        {/* Voices Grid */}
        {loading ? (
          <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100">
            <Loader className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading voices...</h3>
            <p className="text-gray-600">Please wait while we fetch available voices</p>
          </div>
        ) : filteredVoices.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100">
            <Mic className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No voices found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or upload a custom voice</p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Upload Custom Voice
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVoices.map((voice) => (
              <div
                key={voice.id}
                className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
              >
                {/* Voice Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{voice.name}</h3>
                      {voice.isPremium && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold">
                          <Crown className="h-3 w-3" />
                          Pro
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{voice.description}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(voice.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      voice.isFavorite ? 'bg-gray-50' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${voice.isFavorite ? 'text-gray-600 fill-gray-600' : 'text-gray-400'}`}
                    />
                  </button>
                </div>

                {/* Voice Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    {getGenderIcon(voice.gender)}
                    <span className="text-gray-600">{voice.gender.charAt(0).toUpperCase() + voice.gender.slice(1)}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-600">{voice.accent}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{voice.language}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{voice.usageCount} uses</span>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold border-2 ${getCategoryColor(voice.category)}`}>
                    {voice.style}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(voice.rating)
                            ? 'text-gray-700 fill-gray-700'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{voice.rating}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePlayPause(voice.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    {playingVoiceId === voice.id ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Playing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Preview
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => router.push(`/create?voice=${voice.id}`)}
                    className="px-4 py-3 bg-gray-100 text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Use Voice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {uploadModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Custom Voice</h2>
              <p className="text-gray-600 mb-6">
                Upload audio samples to create your own AI voice clone. We recommend at least 10 minutes of clear audio.
              </p>

              <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-8 border-2 border-dashed border-gray-300 text-center mb-6">
                <Upload className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Drop audio files here</h3>
                <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                <button className="px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                  Select Files
                </button>
              </div>

              <div className="bg-gray-50 rounded-[20px] p-4 mb-6 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-800 space-y-1">
                  <li>• Minimum 10 minutes of audio</li>
                  <li>• Clear, studio-quality recordings</li>
                  <li>• WAV or MP3 format</li>
                  <li>• One speaker only</li>
                </ul>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                  Start Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
