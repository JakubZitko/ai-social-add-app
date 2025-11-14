'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Slider } from '@/components/ui/Slider';
import { Modal } from '@/components/ui/Modal';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { AvatarCard } from '@/components/avatars/AvatarCard';
import { AvatarFilters } from '@/components/avatars/AvatarFilters';
import { useAvatars } from '@/lib/hooks/useAvatars';
import { useVoices } from '@/lib/hooks/useVoices';
import {
  Sparkles,
  ArrowLeft,
  Video,
  Hand,
  AlertCircle,
  Upload,
  Check,
} from 'lucide-react';
import { ProjectType, VoiceSettings, AudioType, VideoAspectRatio, AvatarFilters as AvatarFiltersType } from '@/types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

type Step = 'type' | 'avatar' | 'script' | 'voice' | 'review';

function CreateProjectContent() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { avatars, loading: avatarsLoading, filterAvatars } = useAvatars();
  const { voices, loading: voicesLoading } = useVoices();

  // Project state
  const [step, setStep] = useState<Step>('type');
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

  // Step 1: Project Type Selection
  const renderTypeStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
          Choose Your Video Type
        </h2>
        <p className="text-lg text-gray-600">
          Select the type of video you want to create
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Talking Actor */}
        <div
          onClick={() => {
            setProjectType('talking_actor');
            setStep('avatar');
          }}
          className={`bg-white rounded-[32px] border-2 p-8 cursor-pointer transition-all hover:shadow-xl ${
            projectType === 'talking_actor' ? 'border-gray-900 shadow-lg' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-center">
            <div className="h-20 w-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
              <Video className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Talking Actor
            </h3>
            <p className="text-gray-600 mb-6">
              Create videos up to 2 minutes with full audio and lip-sync
            </p>
            <ul className="text-sm text-gray-600 text-left space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                Full voice narration
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                Realistic lip-sync
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                Up to 120 seconds
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                35+ languages
              </li>
            </ul>
          </div>
        </div>

        {/* Gesture Only */}
        <div
          onClick={() => {
            setProjectType('gesture_only');
            setStep('avatar');
          }}
          className={`bg-white rounded-[32px] border-2 p-8 cursor-pointer transition-all hover:shadow-xl ${
            projectType === 'gesture_only' ? 'border-gray-900 shadow-lg' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-center">
            <div className="h-20 w-20 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-6">
              <Hand className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Gesture Only
            </h3>
            <p className="text-gray-600 mb-6">
              Create 5-second clips with custom body language
            </p>
            <ul className="text-sm text-gray-600 text-left space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                Custom gestures
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                No audio needed
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                5 seconds length
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                Perfect for reactions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Avatar Selection
  const renderAvatarStep = () => (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Select Your Avatar</h2>
        <p className="text-lg text-gray-600">
          Choose from 300+ professional AI actors
        </p>
      </div>

      {selectedAvatar && (
        <div className="mb-6 bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={selectedAvatar.previewUrl}
                alt={selectedAvatar.name}
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <div>
                <p className="text-sm text-gray-600">Selected Avatar</p>
                <p className="text-lg font-bold text-gray-900">
                  {selectedAvatar.name}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowAvatarModal(true)}>
              Change Avatar
            </Button>
          </div>
        </div>
      )}

      {!selectedAvatar && (
        <Button
          variant="primary"
          size="lg"
          className="w-full mb-6"
          onClick={() => setShowAvatarModal(true)}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Browse Avatar Library
        </Button>
      )}

      {selectedAvatar && (
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setStep('script')}>
            Continue to Script
          </Button>
        </div>
      )}

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

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
          {avatarsLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : filteredAvatars.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No avatars found. Try adjusting your filters.</p>
            </div>
          ) : (
            filteredAvatars.map((avatar) => (
              <AvatarCard
                key={avatar.id}
                avatar={avatar}
                selected={selectedAvatarId === avatar.id}
                onClick={() => {
                  setSelectedAvatarId(avatar.id);
                  setShowAvatarModal(false);
                }}
              />
            ))
          )}
        </div>
      </Modal>
    </div>
  );

  // Step 3: Script/Gesture Input
  const renderScriptStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
          {projectType === 'talking_actor' ? 'Write Your Script' : 'Describe the Gesture'}
        </h2>
        <p className="text-lg text-gray-600">
          {projectType === 'talking_actor'
            ? 'Enter the text your avatar will speak'
            : 'Describe what you want your avatar to do'}
        </p>
      </div>

      {projectType === 'talking_actor' ? (
        <Textarea
          label="Script"
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          rows={8}
          maxLength={1500}
          showCharCount
          placeholder="Hello! I'm excited to tell you about our amazing product..."
          helperText="Maximum 1500 characters. Avoid violent, racist, or adult content."
        />
      ) : (
        <Textarea
          label="Gesture Prompt"
          value={gesturePrompt}
          onChange={(e) => setGesturePrompt(e.target.value)}
          rows={4}
          maxLength={500}
          showCharCount
          placeholder="Make the actor point to the right and smile confidently"
          helperText="Describe the body language and emotion you want"
        />
      )}

      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={() => setStep('avatar')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          variant="primary"
          onClick={() => setStep(projectType === 'talking_actor' ? 'voice' : 'review')}
          className="flex-1"
          disabled={
            projectType === 'talking_actor'
              ? !scriptText.trim()
              : !gesturePrompt.trim()
          }
        >
          Continue
        </Button>
      </div>
    </div>
  );

  // Step 4: Voice Customization (Talking Actor only)
  const renderVoiceStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Customize Voice</h2>
        <p className="text-lg text-gray-600">
          Choose how your avatar sounds
        </p>
      </div>

      <div className="space-y-6">
        {/* Audio Type Selection */}
        <div className="bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Audio Type</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setAudioType('tts')}
              className={`flex-1 p-6 border-2 rounded-2xl transition-all ${
                audioType === 'tts'
                  ? 'border-gray-900 bg-gray-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <h4 className="font-bold text-gray-900 mb-1">Text-to-Speech</h4>
              <p className="text-sm text-gray-600">
                Generate voice from your script
              </p>
            </button>
            <button
              onClick={() => setAudioType('sts')}
              className={`flex-1 p-6 border-2 rounded-2xl transition-all ${
                audioType === 'sts'
                  ? 'border-gray-900 bg-gray-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <h4 className="font-bold text-gray-900 mb-1">Speech-to-Speech</h4>
              <p className="text-sm text-gray-600">
                Upload your own voice recording
              </p>
            </button>
          </div>
        </div>

        {/* TTS Settings */}
        {audioType === 'tts' && (
          <>
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

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Voice Settings</h3>
              </CardHeader>
              <CardBody className="space-y-6">
                <Slider
                  label="Speed"
                  value={voiceSettings.speed}
                  onChange={(v) =>
                    setVoiceSettings({ ...voiceSettings, speed: v })
                  }
                  min={1.0}
                  max={1.5}
                  step={0.1}
                  leftLabel="Natural"
                  rightLabel="Fast"
                  helperText="1.1x recommended for TikTok and fast-paced content"
                />

                <Slider
                  label="Stability"
                  value={voiceSettings.stability}
                  onChange={(v) =>
                    setVoiceSettings({ ...voiceSettings, stability: v })
                  }
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  leftLabel="Variable"
                  rightLabel="Stable"
                  helperText="0.5 recommended for natural, human-like feel"
                />

                <Slider
                  label="Similarity"
                  value={voiceSettings.similarity}
                  onChange={(v) =>
                    setVoiceSettings({ ...voiceSettings, similarity: v })
                  }
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  leftLabel="Varied"
                  rightLabel="Accurate"
                  helperText="0.75 recommended for TTS"
                />

                <Slider
                  label="Style Exaggeration"
                  value={voiceSettings.styleExaggeration}
                  onChange={(v) =>
                    setVoiceSettings({ ...voiceSettings, styleExaggeration: v })
                  }
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  leftLabel="Neutral"
                  rightLabel="Expressive"
                  helperText="0.3 recommended for friendly, subtle emotion"
                />
              </CardBody>
            </Card>
          </>
        )}

        {/* STS Upload */}
        {audioType === 'sts' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Upload Audio</h3>
            </CardHeader>
            <CardBody>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  accept="audio/mp3,audio/mp4"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Click to upload
                </label>
                <p className="text-sm text-gray-600 mt-2">
                  MP3 or MP4 format
                </p>
                {audioFile && (
                  <p className="text-sm text-green-600 mt-2 font-semibold">
                    {audioFile.name}
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Aspect Ratio */}
        <Select
          label="Aspect Ratio"
          value={aspectRatio}
          onChange={(v) => setAspectRatio(v as VideoAspectRatio)}
          options={[
            { value: '9:16', label: '9:16 - TikTok/Reels (Vertical)' },
            { value: '16:9', label: '16:9 - YouTube (Horizontal)' },
            { value: '1:1', label: '1:1 - Instagram Post (Square)' },
          ]}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={() => setStep('script')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button variant="primary" onClick={() => setStep('review')} className="flex-1">
          Continue to Review
        </Button>
      </div>
    </div>
  );

  // Step 5: Review and Generate
  const renderReviewStep = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Review & Generate</h2>
        <p className="text-lg text-gray-600">
          Review your video settings before generating
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Project Type */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Project Type</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-900">
              {projectType === 'talking_actor' ? 'Talking Actor' : 'Gesture Only'}
            </p>
          </CardBody>
        </Card>

        {/* Avatar */}
        {selectedAvatar && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Avatar</h3>
            </CardHeader>
            <CardBody className="flex items-center gap-4">
              <img
                src={selectedAvatar.previewUrl}
                alt={selectedAvatar.name}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{selectedAvatar.name}</p>
                <p className="text-sm text-gray-600">
                  {selectedAvatar.tags.slice(0, 3).join(', ')}
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Script/Gesture */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {projectType === 'talking_actor' ? 'Script' : 'Gesture Prompt'}
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-900 whitespace-pre-wrap">
              {projectType === 'talking_actor' ? scriptText : gesturePrompt}
            </p>
          </CardBody>
        </Card>

        {/* Voice (if TTS) */}
        {projectType === 'talking_actor' && audioType === 'tts' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Voice Settings</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Voice:</span>
                <span className="font-semibold">
                  {voices.find((v) => v.id === selectedVoiceId)?.name || 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Speed:</span>
                <span className="font-semibold">{voiceSettings.speed}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aspect Ratio:</span>
                <span className="font-semibold">{aspectRatio}</span>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Credits */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-[24px] p-6 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Credits Required</p>
              <p className="text-3xl font-bold text-gray-900">2 Credits</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-medium">Your Balance</p>
              <p className="text-3xl font-bold text-green-600">{user?.credits} Credits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep(projectType === 'talking_actor' ? 'voice' : 'script')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleCreateProject}
          loading={creating}
          disabled={creating || (user?.credits || 0) < 2}
          className="flex-1"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Video (2 Credits)
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>

            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-2xl border border-green-200">
              <Sparkles className="h-4 w-4 text-green-600" />
              <span className="text-sm font-bold text-gray-900">
                {user?.credits || 0} Credits
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-2">
            {['type', 'avatar', 'script', projectType === 'talking_actor' && 'voice', 'review']
              .filter(Boolean)
              .map((s, idx, arr) => (
                <React.Fragment key={s}>
                  <div
                    className={`flex items-center gap-2 ${
                      arr.indexOf(step) >= idx
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                        arr.indexOf(step) >= idx
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-sm font-bold hidden sm:inline">
                      {s === 'type'
                        ? 'Type'
                        : s === 'avatar'
                        ? 'Avatar'
                        : s === 'script'
                        ? 'Script'
                        : s === 'voice'
                        ? 'Voice'
                        : 'Review'}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div
                      className={`h-1 w-8 sm:w-16 rounded-full ${
                        arr.indexOf(step) > idx ? 'bg-gray-900' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {step === 'type' && renderTypeStep()}
        {step === 'avatar' && renderAvatarStep()}
        {step === 'script' && renderScriptStep()}
        {step === 'voice' && renderVoiceStep()}
        {step === 'review' && renderReviewStep()}
      </main>
    </div>
  );
}

export default function CreateProjectPage() {
  return (
    <ProtectedRoute>
      <CreateProjectContent />
    </ProtectedRoute>
  );
}
