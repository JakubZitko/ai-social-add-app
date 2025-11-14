'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Play, Sparkles, Users, Globe, Zap, Video, ChevronRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <Sparkles className="h-4 w-4 text-gray-900" />
              <span className="text-sm font-bold text-gray-900">AI-Powered Video Creation</span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
                Create Viral Video Ads
                <span className="block mt-2">in Minutes</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-xl">
                Generate professional UGC-style video ads with AI avatars. Choose from 300+ actors,
                35+ languages, and create content that converts—without hiring creators.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/register">
                <button className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 flex items-center gap-2">
                  Start Creating Free
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="#demo">
                <button className="px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-900 hover:border-gray-300 hover:shadow-lg transition-all flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </Link>
            </div>

            {/* Stats Pills */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                ✨ 300+ AI Avatars
              </div>
              <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                🌍 35+ Languages
              </div>
              <div className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                ⚡ 2 min Creation
              </div>
            </div>
          </div>

          {/* Right Side - Bento Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Large Video Card */}
            <div className="col-span-2 bg-white rounded-[32px] p-6 border border-gray-200 shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mx-auto mb-4">
                    <Play className="w-8 h-8 text-gray-900 ml-1" />
                  </div>
                  <p className="text-white text-lg font-semibold">Watch Demo Video</p>
                  <p className="text-gray-300 text-sm mt-1">See VideoAI in action</p>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">300+</div>
              <div className="text-sm text-gray-600 mt-1">AI Avatars</div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">35+</div>
              <div className="text-sm text-gray-600 mt-1">Languages</div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">2 min</div>
              <div className="text-sm text-gray-600 mt-1">Creation Time</div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">120s</div>
              <div className="text-sm text-gray-600 mt-1">Max Length</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
