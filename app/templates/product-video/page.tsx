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
  Video as VideoIcon,
} from 'lucide-react';
import { VIDEO_TEMPLATES } from '@/lib/templates/video-templates';

export default function ProductVideoPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ProductVideoContent />
      </AppLayout>
    </ProtectedRoute>
  );
}

function ProductVideoContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { credits } = useCredits();
  const { avatars } = useAvatars();
  const { voices } = useVoices();

  const template = VIDEO_TEMPLATES.find((t) => t.id === 'product-showcase')!;

  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [feature1, setFeature1] = useState<string>('');
  const [feature2, setFeature2] = useState<string>('');
  const [feature3, setFeature3] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [benefits, setBenefits] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [customScript, setCustomScript] = useState<string>('');
  const [useCustomScript, setUseCustomScript] = useState<boolean>(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateScript = () => {
    if (!productName) return '';

    const script = template.scriptTemplate
      ?.replace('{product_name}', productName)
      ?.replace('{product_description}', productDescription || 'An amazing product')
      ?.replace('{feature_1}', feature1 || 'Premium quality')
      ?.replace('{feature_2}', feature2 || 'Easy to use')
      ?.replace('{feature_3}', feature3 || 'Affordable price')
      ?.replace('{explanation}', explanation || 'Simple and intuitive design')
      ?.replace('{benefits}', benefits || 'Saves time and money')
      ?.replace('{website}', website || 'our website');

    return script || '';
  };

  const finalScript = useCustomScript ? customScript : generateScript();

  const handleGenerate = async () => {
    if (!selectedAvatarId || !selectedVoiceId) {
      setError('Please select an avatar and voice');
      return;
    }

    if (!finalScript) {
      setError('Please fill in the product details');
      return;
    }

    if (credits < (template.price || 3)) {
      setError('Insufficient credits. Please purchase more.');
      return;
    }

    try {
      setGenerating(true);
      setError('');

      const token = await user?.getIdToken();

      const response = await fetch('/api/generate/product-video', {
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
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <VideoIcon className="h-6 w-6 text-white" />
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
            <div className="text-2xl font-bold text-gray-900">{template.price || 3}</div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">Template Features</h3>
          <div className="grid grid-cols-2 gap-3">
            {template.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
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
              Select Avatar
            </label>
            <select
              value={selectedAvatarId}
              onChange={(e) => setSelectedAvatarId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
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
              Select Voice
            </label>
            <select
              value={selectedVoiceId}
              onChange={(e) => setSelectedVoiceId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">Choose a voice...</option>
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name} - {voice.style}
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
              placeholder="e.g., UltraClean Pro"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Product Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Product Description</label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="e.g., The revolutionary cleaning solution for modern homes"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Features */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Key Features</label>
            <input
              type="text"
              value={feature1}
              onChange={(e) => setFeature1(e.target.value)}
              placeholder="Feature 1: e.g., Eco-friendly formula"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 mb-3"
            />
            <input
              type="text"
              value={feature2}
              onChange={(e) => setFeature2(e.target.value)}
              placeholder="Feature 2: e.g., Works on all surfaces"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 mb-3"
            />
            <input
              type="text"
              value={feature3}
              onChange={(e) => setFeature3(e.target.value)}
              placeholder="Feature 3: e.g., Long-lasting results"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* How It Works */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">How It Works</label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="e.g., Simply spray, wipe, and enjoy a spotless surface"
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Main Benefits</label>
            <textarea
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="e.g., Save time and effort with our advanced cleaning technology"
              rows={2}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Website */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Website/Store URL</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="e.g., ultraclean.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
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
                rows={12}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono text-sm"
              />
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-sm whitespace-pre-wrap">
                {finalScript || 'Fill in the product details to see the script preview'}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !selectedAvatarId || !selectedVoiceId || !finalScript}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Generating Video...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Product Video ({template.price || 3} credits)
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
