'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Slider } from '@/components/ui/Slider';
import { Modal } from '@/components/ui/Modal';
import { AvatarFilters } from '@/components/avatars/AvatarFilters';
import { useAvatars } from '@/lib/hooks/useAvatars';
import { useVoices } from '@/lib/hooks/useVoices';
import {
  Sparkles,
  Video,
  Hand,
  AlertCircle,
  Upload,
  Check,
  Play,
  User,
  Wand2,
  Settings as SettingsIcon,
  Eye,
} from 'lucide-react';
import { ProjectType, VoiceSettings, AudioType, VideoAspectRatio, AvatarFilters as AvatarFiltersType } from '@/types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

function CreateProjectContent() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { avatars, loading: avatarsLoading, filterAvatars } = useAvatars();
  const { voices, loading: voicesLoading } = useVoices();

  // Project state
  const [projectType, setProjectType] = useState<ProjectType>('talking_actor');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
  const [scriptText, setScriptText] = useState('');
  const [gesturePrompt, setGesturePrompt] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState('');
  const [audioType, setAudioType] = useState<AudioType>('tts');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('9:16');
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    speed: 1.0,
    stability: 0.5,
    similarity: 0.75,
    styleExaggeration: 0.3,
  });

  // UI state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarFilters, setAvatarFilters] = useState<AvatarFiltersType>({});
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const filteredAvatars = filterAvatars(avatarFilters);
  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId);

  const handleCreateProject = async () => {
    // Validation
    if (!selectedAvatarId) {
      setError('Please select an avatar');
      return;
    }

    if (projectType === 'talking_actor' && !scriptText.trim()) {
      setError('Please enter a script');
      return;
    }

    if (projectType === 'gesture_only' && !gesturePrompt.trim()) {
      setError('Please enter a gesture prompt');
      return;
    }

    if (projectType === 'talking_actor' && audioType === 'tts' && !selectedVoiceId) {
      setError('Please select a voice');
      return;
    }

    if (!user) return;

    if (user.credits < 2) {
      setError('Insufficient credits. Please purchase more credits.');
      return;
    }

    try {
      setCreating(true);
      setError('');

      // Create project in Firestore
      const projectData = {
        userId: user.uid,
        type: projectType,
        status: 'draft',
        scriptText: projectType === 'talking_actor' ? scriptText : '',
        gesturePrompt: projectType === 'gesture_only' ? gesturePrompt : '',
        selectedAvatarId,
        selectedVoiceId: audioType === 'tts' ? selectedVoiceId : '',
        voiceSettings,
        audioType,
        aspectRatio,
        creditsUsed: 2,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'projects'), projectData);

      // Refresh user to update credits
      await refreshUser();

      // Redirect to project page
      router.push(`/video/${docRef.id}`);
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* LEFT PANEL - Configuration */}
      <div className="w-[600px] p-8 overflow-y-auto">
        <div className="max-w-xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Create New Video
            </h1>
            <p className="text-lg text-gray-600">
              Configure your AI-generated video in real-time
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Section 1: Video Type */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Video className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Video Type</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setProjectType('talking_actor')}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  projectType === 'talking_actor'
                    ? 'border-gray-900 bg-gray-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <Video className={`h-5 w-5 mb-2 ${projectType === 'talking_actor' ? 'text-gray-900' : 'text-gray-400'}`} />
                <div className="font-bold text-sm text-gray-900">Talking Video</div>
                <div className="text-xs text-gray-600 mt-1">Up to 120 seconds</div>
              </button>

              <button
                onClick={() => setProjectType('gesture_only')}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  projectType === 'gesture_only'
                    ? 'border-gray-900 bg-gray-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <Hand className={`h-5 w-5 mb-2 ${projectType === 'gesture_only' ? 'text-gray-900' : 'text-gray-400'}`} />
                <div className="font-bold text-sm text-gray-900">Gesture Only</div>
                <div className="text-xs text-gray-600 mt-1">5 second clip</div>
              </button>
            </div>
          </div>

          {/* Section 2: Avatar Selection */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">AI Avatar</h2>
            </div>

            {selectedAvatar ? (
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200">
                <img
                  src={selectedAvatar.previewUrl}
                  alt={selectedAvatar.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{selectedAvatar.name}</div>
                  <div className="text-sm text-gray-600">{selectedAvatar.tags.slice(0, 2).join(', ')}</div>
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
                <div className="text-xs text-gray-600 mt-1">Choose from 300+ AI actors</div>
              </button>
            )}
          </div>

          {/* Section 3: Script/Gesture */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wand2 className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {projectType === 'talking_actor' ? 'Script' : 'Gesture'}
              </h2>
            </div>

            {projectType === 'talking_actor' ? (
              <Textarea
                label=""
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                rows={6}
                maxLength={1500}
                showCharCount
                placeholder="Enter the text your avatar will speak..."
                className="font-mono"
              />
            ) : (
              <Textarea
                label=""
                value={gesturePrompt}
                onChange={(e) => setGesturePrompt(e.target.value)}
                rows={4}
                maxLength={500}
                showCharCount
                placeholder="Describe the gesture you want..."
              />
            )}
          </div>

          {/* Section 4: Voice (only for talking_actor) */}
          {projectType === 'talking_actor' && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Voice Settings</h2>
              </div>

              <Select
                label="Voice"
                value={selectedVoiceId}
                onChange={setSelectedVoiceId}
                options={voices.map((v) => ({
                  value: v.id,
                  label: `${v.name} (${v.accent})`,
                }))}
                placeholder="Select a voice"
              />

              <div className="mt-4 bg-white rounded-2xl p-4 border border-gray-200 space-y-4">
                <Slider
                  label="Speed"
                  value={voiceSettings.speed}
                  onChange={(v) => setVoiceSettings({ ...voiceSettings, speed: v })}
                  min={1.0}
                  max={1.5}
                  step={0.1}
                />
                <Slider
                  label="Stability"
                  value={voiceSettings.stability}
                  onChange={(v) => setVoiceSettings({ ...voiceSettings, stability: v })}
                  min={0.0}
                  max={1.0}
                  step={0.05}
                />
              </div>
            </div>
          )}

          {/* Section 5: Format */}
          <div className="mb-8">
            <Select
              label="Video Format"
              value={aspectRatio}
              onChange={(v) => setAspectRatio(v as VideoAspectRatio)}
              options={[
                { value: '9:16', label: '9:16 - TikTok/Reels (Vertical)' },
                { value: '16:9', label: '16:9 - YouTube (Horizontal)' },
                { value: '1:1', label: '1:1 - Instagram (Square)' },
              ]}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleCreateProject}
            disabled={creating || !selectedAvatarId || (projectType === 'talking_actor' ? !scriptText.trim() : !gesturePrompt.trim())}
            className="w-full bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {creating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Video (2 Credits)
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL - Live Preview */}
      <div className="flex-1 p-8 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center max-w-md">
          {/* Preview Card */}
          <div className={`bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-200 mb-6 ${
            aspectRatio === '9:16' ? 'w-64' : aspectRatio === '16:9' ? 'w-full' : 'w-80'
          }`}>
            <div className={`bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center relative ${
              aspectRatio === '9:16' ? 'aspect-[9/16]' : aspectRatio === '16:9' ? 'aspect-[16/9]' : 'aspect-square'
            }`}>
              {selectedAvatar ? (
                <img
                  src={selectedAvatar.previewUrl}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-10 w-10 text-white/50" />
                  </div>
                  <p className="text-white/70 font-medium">Live Preview</p>
                  <p className="text-white/50 text-sm mt-1">Select an avatar to preview</p>
                </div>
              )}

              {/* Aspect Ratio Badge */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-xs font-bold">{aspectRatio}</span>
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Video Type</div>
              <div className="font-bold text-gray-900">
                {projectType === 'talking_actor' ? 'Talking Video' : 'Gesture Only'}
              </div>
            </div>

            {scriptText && projectType === 'talking_actor' && (
              <div className="bg-white rounded-2xl p-4 border border-gray-200 text-left">
                <div className="text-xs text-gray-600 mb-2">Script Preview</div>
                <div className="text-sm text-gray-900 line-clamp-3">
                  {scriptText}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Select Avatar"
        size="full"
      >
        <AvatarFilters
          filters={avatarFilters}
          onFilterChange={setAvatarFilters}
          resultCount={filteredAvatars.length}
        />

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto">
          {avatarsLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full" />
            </div>
          ) : filteredAvatars.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No avatars found. Try adjusting your filters.</p>
            </div>
          ) : (
            filteredAvatars.map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => {
                  setSelectedAvatarId(avatar.id);
                  setShowAvatarModal(false);
                }}
                className={`group cursor-pointer bg-white rounded-2xl p-3 border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
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
                <div className="text-xs text-gray-600 truncate">{avatar.tags[0]}</div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}

export default function CreateProjectPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <CreateProjectContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
