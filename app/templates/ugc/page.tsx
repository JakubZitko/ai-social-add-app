'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAvatars } from '@/lib/hooks/useAvatars';
import { useVoices } from '@/lib/hooks/useVoices';
import { useCredits } from '@/hooks/useCredits';
import {
  Sparkles,
  User,
  Mic,
  Loader,
  ArrowRight,
  Check,
  Heart,
} from 'lucide-react';
import { VIDEO_TEMPLATES } from '@/lib/templates/video-templates';

export default function UGCPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <UGCContent />
      </AppLayout>
    </ProtectedRoute>
  );
}

function UGCContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { credits } = useCredits();
  const { avatars } = useAvatars();
  const { voices } = useVoices();

  const template = VIDEO_TEMPLATES.find((t) => t.id === 'ugc-testimonial')!;

  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [selectedHook, setSelectedHook] = useState<string>(template.hooks[0]);
  const [productName, setProductName] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [results, setResults] = useState<string>('');
  const [selectedCta, setSelectedCta] = useState<string>(template.ctas?.[0] || '');
  const [customScript, setCustomScript] = useState<string>('');
  const [useCustomScript, setUseCustomScript] = useState<boolean>(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateScript = () => {
    if (!productName) return '';

    const script = `${selectedHook}

I recently tried ${productName} and ${experience || 'it completely exceeded my expectations'}.

${results || 'The results were incredible - I saw improvements immediately!'}

Honestly, I wish I had found this sooner. If you've been on the fence about trying it, this is your sign.

${selectedCta}`;

    return script;
  };

  const finalScript = useCustomScript ? customScript : generateScript();

  const handleGenerate = async () => {
    if (!selectedAvatarId || !selectedVoiceId) {
      setError('Please select an avatar and voice');
      return;
    }

    if (!finalScript) {
      setError('Please fill in the product name');
      return;
    }

    if (credits < (template.price || 2)) {
      setError('Insufficient credits. Please purchase more.');
      return;
    }

    try {
      setGenerating(true);
      setError('');

      const token = await user?.getIdToken();

      const response = await fetch('/api/generate/ugc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          script: finalScript,
          avatarId: selectedAvatarId,
          voiceId: selectedVoiceId,
          aspectRatio: template.aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      router.push(`/video/${data.projectId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to generate video');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{template.name}</h1>
              <p className="text-gray-600">{template.description}</p>
            </div>
          </div>
        </div>

        {/* Template Info */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Duration</div>
            <div className="text-2xl font-bold text-gray-900">{template.duration}s</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Aspect Ratio</div>
            <div className="text-2xl font-bold text-gray-900">{template.aspectRatio}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Credits</div>
            <div className="text-2xl font-bold text-gray-900">{template.price || 2}</div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">Template Features</h3>
          <div className="grid grid-cols-2 gap-3">
            {template.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
          <h3 className="font-bold text-gray-900 mb-6">Configure Your Video</h3>

          {/* Avatar Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <User className="h-4 w-4 inline mr-2" />
              Select Avatar (Choose authentic, casual-looking avatars)
            </label>
            <select
              value={selectedAvatarId}
              onChange={(e) => setSelectedAvatarId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Choose an avatar...</option>
              {avatars.map((avatar) => (
                <option key={avatar.id} value={avatar.id}>
                  {avatar.name} - {avatar.gender}, {avatar.age}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <Mic className="h-4 w-4 inline mr-2" />
              Select Voice (Choose casual, friendly voices)
            </label>
            <select
              value={selectedVoiceId}
              onChange={(e) => setSelectedVoiceId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Choose a voice...</option>
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name} - {voice.style}
                </option>
              ))}
            </select>
          </div>

          {/* Hook Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Opening Hook</label>
            <select
              value={selectedHook}
              onChange={(e) => setSelectedHook(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {template.hooks.map((hook, index) => (
                <option key={index} value={hook}>
                  {hook}
                </option>
              ))}
            </select>
          </div>

          {/* Product Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Product Name *</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., SkinGlow Serum"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Experience */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Your Experience (How was using it?)
            </label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g., it felt so lightweight and absorbed instantly"
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Results */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Results (What happened after using it?)
            </label>
            <textarea
              value={results}
              onChange={(e) => setResults(e.target.value)}
              placeholder="e.g., My skin feels smoother and more hydrated. I've gotten so many compliments!"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* CTA Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Call-to-Action</label>
            <select
              value={selectedCta}
              onChange={(e) => setSelectedCta(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              {template.ctas?.map((cta, index) => (
                <option key={index} value={cta}>
                  {cta}
                </option>
              ))}
            </select>
          </div>

          {/* Script Preview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-900">Script Preview</label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={useCustomScript}
                  onChange={(e) => setUseCustomScript(e.target.checked)}
                  className="rounded"
                />
                Edit manually
              </label>
            </div>
            {useCustomScript ? (
              <textarea
                value={customScript}
                onChange={(e) => setCustomScript(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 font-mono text-sm"
              />
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap">
                {finalScript || 'Fill in the product name to see the script preview'}
              </div>
            )}
          </div>

          {/* Pro Tip */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="font-semibold text-gray-900 mb-2">💡 UGC Pro Tip</div>
            <p className="text-sm text-gray-700">
              Keep it authentic! UGC videos perform best when they feel real and relatable. Use casual
              language, personal stories, and genuine emotion.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !selectedAvatarId || !selectedVoiceId || !finalScript}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Generating Video...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate UGC Testimonial ({template.price || 2} credits)
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Current Credits */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Your current balance: <span className="font-semibold">{credits} credits</span>
          </div>
        </div>
      </div>
    </div>
  );
}
