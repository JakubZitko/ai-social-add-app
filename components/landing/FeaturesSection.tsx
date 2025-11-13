import React from 'react';
import {
  Users,
  Mic,
  Globe,
  Sparkles,
  Sliders,
  Video,
  Zap,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: '300+ AI Avatars',
    description:
      'Choose from a diverse library of professional actors with different ages, genders, ethnicities, and styles.',
  },
  {
    icon: Mic,
    title: 'Realistic Voice Generation',
    description:
      'Powered by ElevenLabs with customizable speed, stability, and style. Support for 35+ languages and accents.',
  },
  {
    icon: Sliders,
    title: 'Full Customization',
    description:
      'Adjust backgrounds, accessories, emotions, and gestures. Create videos that match your brand perfectly.',
  },
  {
    icon: Video,
    title: 'Multiple Formats',
    description:
      'Export in 9:16 for TikTok/Reels, 16:9 for YouTube, or 1:1 for social posts. All formats optimized for each platform.',
  },
  {
    icon: Sparkles,
    title: 'Gesture Control',
    description:
      'Create 5-second gesture clips with custom prompts. Perfect for authentic reactions and testimonials.',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description:
      'Create content in over 35 languages with native accents. Reach global audiences effortlessly.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Generate professional videos in under 2 minutes. Perfect for rapid A/B testing and iteration.',
  },
  {
    icon: TrendingUp,
    title: 'Bulk Generation',
    description:
      'Create multiple versions of your ads simultaneously. Test different scripts and avatars at scale.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to create viral ads
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Professional video creation tools powered by cutting-edge AI. No technical skills required.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="relative rounded-2xl border border-gray-200 p-8 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
