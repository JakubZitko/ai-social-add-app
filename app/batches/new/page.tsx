'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useAvatars } from '@/lib/hooks/useAvatars';
import { useVoices } from '@/lib/hooks/useVoices';
import {
  Sparkles,
  Upload,
  FileText,
  AlertCircle,
  Check,
  User,
  Mic,
  Video,
  Layers,
  Download,
  Play,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { VideoAspectRatio } from '@/types';

interface BatchScript {
  id: string;
  scriptText: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

function BatchCreatorContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { avatars, loading: avatarsLoading } = useAvatars();
  const { voices, loading: voicesLoading } = useVoices();

  // Template settings
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('9:16');

  // Batch data
  const [scripts, setScripts] = useState<BatchScript[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // UI state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [currentStep, setCurrentStep] = useState<'template' | 'scripts' | 'review'>('template');

  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId);
  const selectedVoice = voices.find((v) => v.id === selectedVoiceId);

  const handleCsvUpload = async (file: File) => {
    try {
      setUploading(true);
      setError('');

      if (!file.name.endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }

      // Read CSV file
      const text = await file.text();
      const lines = text.split('\n').filter((line) => line.trim());

      // Skip header if present
      const hasHeader = lines[0].toLowerCase().includes('script');
      const scriptLines = hasHeader ? lines.slice(1) : lines;

      // Create batch scripts
      const newScripts: BatchScript[] = scriptLines.map((line, index) => ({
        id: `script-${index}`,
        scriptText: line.trim().replace(/^["']|["']$/g, ''), // Remove quotes
        status: 'pending' as const,
      }));

      setScripts(newScripts);
      setCsvFile(file);
      setCurrentStep('review');
    } catch (err: any) {
      console.error('Error uploading CSV:', err);
      setError(err.message || 'Failed to upload CSV');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateBatch = async () => {
    if (!selectedAvatarId || !selectedVoiceId || scripts.length === 0) {
      setError('Please complete all template settings and upload scripts');
      return;
    }

    if (!user) return;

    const creditsRequired = scripts.length * 2;
    if (user.credits < creditsRequired) {
      setError(`Insufficient credits. You need ${creditsRequired} credits to generate ${scripts.length} videos.`);
      return;
    }

    try {
      setCreating(true);
      setError('');

      // TODO: In production, this would:
      // 1. Create batch in Firestore
      // 2. Queue videos for generation using Cloud Tasks
      // 3. Process videos in chunks (5 at a time)
      // 4. Update batch progress in real-time

      // Simulate batch creation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to batch status page (to be created)
      router.push('/batches');
    } catch (err: any) {
      console.error('Error creating batch:', err);
      setError(err.message || 'Failed to create batch');
    } finally {
      setCreating(false);
    }
  };

  const removeScript = (id: string) => {
    setScripts(scripts.filter((s) => s.id !== id));
  };

  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="bg-white h-full rounded-[40px] shadow-sm border border-gray-200/60 overflow-y-auto">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bulk Video Generation</h1>
            <p className="text-sm text-gray-500">Create up to 100 videos at once with CSV upload</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl border border-gray-200">
              <span className="text-xs font-bold text-gray-600">
                {scripts.length} videos queued
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8 max-w-7xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'template'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Template</span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'scripts'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Scripts</span>
            </div>
            <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'review'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Check className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Review</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-start gap-3 max-w-3xl mx-auto">
              <AlertCircle className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 font-medium">{error}</p>
            </div>
          )}

          {/* Step 1: Template Settings */}
          {currentStep === 'template' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[32px] p-8 border-2 border-gray-200 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Video Template</h2>
                <p className="text-gray-600 mb-6">
                  Configure settings that will apply to all videos in your batch
                </p>

                <div className="space-y-6">
                  {/* Avatar Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Select Avatar
                    </label>
                    {selectedAvatar ? (
                      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200">
                        <img
                          src={selectedAvatar.previewUrl}
                          alt={selectedAvatar.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">{selectedAvatar.name}</div>
                          <div className="text-sm text-gray-600">
                            {selectedAvatar.tags.slice(0, 2).join(', ')}
                          </div>
                        </div>
                        <button
                          onClick={() => setShowAvatarModal(true)}
                          className="text-sm font-semibold text-gray-900 hover:text-gray-700"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowAvatarModal(true)}
                        className="w-full p-6 bg-white border-2 border-dashed border-gray-300 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all"
                      >
                        <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-gray-900">Select Avatar</div>
                        <div className="text-xs text-gray-600 mt-1">
                          All videos will use this avatar
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Voice Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Select Voice
                    </label>
                    <Select
                      label=""
                      value={selectedVoiceId}
                      onChange={setSelectedVoiceId}
                      options={voices.map((v) => ({
                        value: v.id,
                        label: `${v.name} (${v.accent})`,
                      }))}
                      placeholder="Select a voice"
                    />
                  </div>

                  {/* Aspect Ratio */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Video Format
                    </label>
                    <Select
                      label=""
                      value={aspectRatio}
                      onChange={(v) => setAspectRatio(v as VideoAspectRatio)}
                      options={[
                        { value: '9:16', label: '9:16 - TikTok/Reels (Vertical)' },
                        { value: '16:9', label: '16:9 - YouTube (Horizontal)' },
                        { value: '1:1', label: '1:1 - Instagram (Square)' },
                      ]}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep('scripts')}
                  disabled={!selectedAvatarId || !selectedVoiceId}
                  className="w-full mt-8 bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue to Scripts
                  <Sparkles className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Upload Scripts */}
          {currentStep === 'scripts' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[32px] p-8 border-2 border-gray-200 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Scripts</h2>
                <p className="text-gray-600 mb-6">
                  Upload a CSV file with one script per row (up to 100 videos)
                </p>

                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCsvUpload(file);
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="p-12 bg-white border-2 border-dashed border-gray-300 rounded-2xl hover:border-gray-400 hover:bg-gray-50/50 transition-all text-center">
                    {uploading ? (
                      <>
                        <div className="w-12 h-12 border-4 border-gray-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm font-semibold text-gray-900">Processing CSV...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-lg font-bold text-gray-900 mb-2">
                          Click to upload CSV file
                        </p>
                        <p className="text-sm text-gray-600">
                          or drag and drop your file here
                        </p>
                      </>
                    )}
                  </div>
                </label>

                <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">CSV Format Example:</h3>
                  <pre className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg overflow-x-auto font-mono">
{`Script
"Discover our new AI-powered features!"
"Transform your content creation workflow"
"Join thousands of happy customers"`}
                  </pre>
                  <a
                    href="/templates/batch-scripts-template.csv"
                    download
                    className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-gray-600 hover:text-gray-700"
                  >
                    <Download className="h-4 w-4" />
                    Download CSV Template
                  </a>
                </div>

                <button
                  onClick={() => setCurrentStep('template')}
                  className="w-full mt-6 bg-white text-gray-900 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-all border border-gray-200"
                >
                  Back to Template
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Generate */}
          {currentStep === 'review' && (
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Template Summary */}
                <div className="lg:col-span-1 bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Template Settings</h3>

                  {selectedAvatar && (
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-gray-600 mb-2 block">
                        Avatar
                      </label>
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedAvatar.previewUrl}
                          alt={selectedAvatar.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-900 truncate">
                            {selectedAvatar.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedVoice && (
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-gray-600 mb-2 block">
                        Voice
                      </label>
                      <div className="text-sm font-bold text-gray-900">
                        {selectedVoice.name} ({selectedVoice.accent})
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-600 mb-2 block">
                      Format
                    </label>
                    <div className="text-sm font-bold text-gray-900">{aspectRatio}</div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-gray-600">Total Videos</span>
                      <span className="text-lg font-bold text-gray-900">{scripts.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-gray-600">Credits Required</span>
                      <span className="text-lg font-bold text-gray-600">
                        {scripts.length * 2}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scripts List */}
                <div className="lg:col-span-2 bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Scripts to Generate</h3>
                    <button
                      onClick={() => setCurrentStep('scripts')}
                      className="text-sm font-semibold text-gray-600 hover:text-gray-900"
                    >
                      Upload New CSV
                    </button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {scripts.map((script, index) => (
                      <div
                        key={script.id}
                        className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all flex items-start gap-3"
                      >
                        <div className="w-6 h-6 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                        </div>
                        <p className="flex-1 text-sm text-gray-900 line-clamp-2">
                          {script.scriptText}
                        </p>
                        <button
                          onClick={() => removeScript(script.id)}
                          className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep('template')}
                  className="flex-1 bg-white text-gray-900 px-6 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all border border-gray-200"
                >
                  Back to Template
                </button>
                <button
                  onClick={handleCreateBatch}
                  disabled={creating || scripts.length === 0}
                  className="flex-1 bg-gradient-to-r from-gray-700 to-gray-700 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Batch...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate {scripts.length} Videos ({scripts.length * 2} Credits)
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Select Avatar"
        size="large"
      >
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
          {avatarsLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full" />
            </div>
          ) : (
            avatars.slice(0, 20).map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => {
                  setSelectedAvatarId(avatar.id);
                  setShowAvatarModal(false);
                }}
                className={`cursor-pointer bg-white rounded-2xl p-3 border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                  selectedAvatarId === avatar.id ? 'border-gray-900 shadow-lg' : 'border-gray-200'
                }`}
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-200 mb-3 relative">
                  <img
                    src={avatar.previewUrl}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedAvatarId === avatar.id && (
                    <div className="absolute inset-0 bg-gray-900/20 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <Check className="h-6 w-6 text-gray-900" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="font-bold text-sm text-gray-900 truncate">{avatar.name}</div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}

export default function BatchCreatorPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <BatchCreatorContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
