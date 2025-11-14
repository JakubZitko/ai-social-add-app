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
    color: 'blue',
  },
  {
    icon: Mic,
    title: 'Realistic Voice Generation',
    description:
      'Powered by ElevenLabs with customizable speed, stability, and style. Support for 35+ languages and accents.',
    color: 'purple',
  },
  {
    icon: Sliders,
    title: 'Full Customization',
    description:
      'Adjust backgrounds, accessories, emotions, and gestures. Create videos that match your brand perfectly.',
    color: 'green',
  },
  {
    icon: Video,
    title: 'Multiple Formats',
    description:
      'Export in 9:16 for TikTok/Reels, 16:9 for YouTube, or 1:1 for social posts. All formats optimized for each platform.',
    color: 'orange',
  },
  {
    icon: Sparkles,
    title: 'Gesture Control',
    description:
      'Create 5-second gesture clips with custom prompts. Perfect for authentic reactions and testimonials.',
    color: 'pink',
  },
  {
    icon: Globe,
    title: 'Multi-Language Support',
    description:
      'Create content in over 35 languages with native accents. Reach global audiences effortlessly.',
    color: 'indigo',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Generate professional videos in under 2 minutes. Perfect for rapid A/B testing and iteration.',
    color: 'yellow',
  },
  {
    icon: TrendingUp,
    title: 'Bulk Generation',
    description:
      'Create multiple versions of your ads simultaneously. Test different scripts and avatars at scale.',
    color: 'red',
  },
];

const colorClasses: { [key: string]: { bg: string; icon: string } } = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
  pink: { bg: 'bg-pink-50', icon: 'text-pink-600' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600' },
  red: { bg: 'bg-red-50', icon: 'text-red-600' },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Everything you need to create viral ads
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Professional video creation tools powered by cutting-edge AI. No technical skills required.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color];
            return (
              <div
                key={feature.title}
                className="bg-white rounded-[24px] border border-gray-200 p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-200 group"
              >
                <div className={`w-12 h-12 ${colors.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
