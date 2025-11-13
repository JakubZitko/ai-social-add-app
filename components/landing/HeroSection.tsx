'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Play, Sparkles, Users, Globe, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <div className="h-[600px] w-[600px] rounded-full bg-blue-100 opacity-20 blur-3xl" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-900">
            <Sparkles className="h-4 w-4" />
            AI-Powered Video Creation
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Create Viral Video Ads
            <span className="block text-blue-600">in Minutes</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Generate professional UGC-style video ads with AI avatars. Choose from 300+ actors,
            35+ languages, and create content that converts—without hiring creators.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="primary">
                <Play className="mr-2 h-5 w-5" />
                Start Creating Free
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-gray-900">300+</div>
              <div className="text-sm text-gray-600">AI Avatars</div>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-8 w-8 text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-gray-900">35+</div>
              <div className="text-sm text-gray-600">Languages</div>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-8 w-8 text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-gray-900">2 min</div>
              <div className="text-sm text-gray-600">Creation Time</div>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="h-8 w-8 text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-gray-900">120s</div>
              <div className="text-sm text-gray-600">Max Video Length</div>
            </div>
          </div>

          {/* Demo Video Placeholder */}
          <div className="mt-16">
            <div className="mx-auto max-w-5xl rounded-2xl bg-gray-900 p-2 shadow-2xl">
              <div className="aspect-video rounded-lg bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <Play className="mx-auto h-16 w-16 text-white mb-4" />
                  <p className="text-white text-lg">Demo Video</p>
                  <p className="text-gray-400 text-sm">Click to see VideoAI in action</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
