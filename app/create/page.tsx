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
  Smile,
  HandIcon,
  ThumbsUp,
  Users,
  Brain,
  Heart,
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
  const [selectedGesture, setSelectedGesture] = useState<string>('');
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

  // Available gestures for gesture_only mode
  const gestures = [
    { id: 'laughing', name: 'Laughing', icon: Smile, description: 'Joyful laughter' },
    { id: 'pointing', name: 'Pointing', icon: HandIcon, description: 'Pointing gesture' },
    { id: 'thumbs_up', name: 'Thumbs Up', icon: ThumbsUp, description: 'Approval sign' },
    { id: 'nodding', name: 'Nodding', icon: Users, description: 'Agreeing nod' },
    { id: 'waving', name: 'Waving', icon: Hand, description: 'Friendly wave' },
    { id: 'thinking', name: 'Thinking', icon: Brain, description: 'Thoughtful pose' },
  ];

  // UI state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarFilters, setAvatarFilters] = useState<AvatarFiltersType>({});
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [previewingVoice, setPreviewingVoice] = useState(false);
  const [voicePreviewUrl, setVoicePreviewUrl] = useState<string | null>(null);
  const [enhancingScript, setEnhancingScript] = useState(false);
  const [scriptTone, setScriptTone] = useState<string>('professional');
  const [scriptGoal, setScriptGoal] = useState<string>('inform');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [customAvatarFile, setCustomAvatarFile] = useState<File | null>(null);

  const filteredAvatars = filterAvatars(avatarFilters);
  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId);
  const selectedVoice = voices.find((v) => v.id === selectedVoiceId);

  const handleVoicePreview = async () => {
    if (!selectedVoiceId) {
      setError('Please select a voice first');
      return;
    }

    try {
      setPreviewingVoice(true);
      setError('');

      // Use first 100 characters of script or default preview text
      const previewText = scriptText
        ? scriptText.slice(0, 100) + (scriptText.length > 100 ? '...' : '')
        : 'Hi! This is a preview of how this voice sounds. You can use this to decide if this voice fits your video.';

      // TODO: In production, this would call the backend API endpoint
      // that generates a 5-second preview using ElevenLabs API
      // For now, we'll use the voice's sample if available
      const voice = voices.find((v) => v.id === selectedVoiceId);

      if (voice?.previewUrl) {
        setVoicePreviewUrl(voice.previewUrl);

        // Play the preview audio
        const audio = new Audio(voice.previewUrl);
        audio.play();
      } else {
        setError('Voice preview not available. This will work once connected to ElevenLabs API.');
      }
    } catch (err: any) {
      console.error('Error previewing voice:', err);
      setError(err.message || 'Failed to preview voice');
    } finally {
      setPreviewingVoice(false);
    }
  };

  const handleEnhanceScript = async () => {
    if (!scriptText.trim()) {
      setError('Please enter a script first');
      return;
    }

    try {
      setEnhancingScript(true);
      setError('');

      // TODO: In production, this would call the backend API endpoint
      // that uses OpenAI GPT-4 to enhance the script
      // For now, we'll simulate the enhancement
      const prompt = `Rewrite the following script with a ${scriptTone} tone to ${scriptGoal}. Keep it concise and engaging:\n\n${scriptText}`;

      // Simulated enhancement (in production, this would call the API)
      // For demonstration, we'll just add a prefix
      const enhancedText = `[AI Enhanced - ${scriptTone} tone for ${scriptGoal}ing]\n\n${scriptText}`;

      setScriptText(enhancedText);
      setError('Script enhanced! (This is a demo - full AI enhancement will work once connected to OpenAI API)');
    } catch (err: any) {
      console.error('Error enhancing script:', err);
      setError(err.message || 'Failed to enhance script');
    } finally {
      setEnhancingScript(false);
    }
  };

  const handleCustomAvatarUpload = async (file: File) => {
    try {
      setUploadingAvatar(true);
      setError('');

      // Validate file
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPG, PNG, etc.)');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError('Image file is too large. Maximum size is 10MB.');
        return;
      }

      setCustomAvatarFile(file);

      // TODO: In production, this would:
      // 1. Upload photo to Firebase Storage
      // 2. Call backend API to create custom avatar using Heygen/D-ID
      // 3. Return the new avatar ID
      // 4. Set selectedAvatarId to the new custom avatar

      setError('Custom avatar upload ready! (This will work once connected to Heygen/D-ID API)');
      setShowAvatarModal(false);
    } catch (err: any) {
      console.error('Error uploading custom avatar:', err);
      setError(err.message || 'Failed to upload custom avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

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

    if (projectType === 'gesture_only' && !selectedGesture) {
      setError('Please select a gesture');
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
        selectedGesture: projectType === 'gesture_only' ? selectedGesture : '',
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
            <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 font-medium">{error}</p>
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
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
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

          {/* Section 3: Gesture Selection (gesture_only only) */}
          {projectType === 'gesture_only' && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Hand className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Select Gesture</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {gestures.map((gesture) => {
                  const Icon = gesture.icon;
                  const isSelected = selectedGesture === gesture.id;
                  return (
                    <button
                      key={gesture.id}
                      onClick={() => setSelectedGesture(gesture.id)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-gray-900 bg-gray-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 mb-2 ${
                          isSelected ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      />
                      <div className="font-bold text-sm text-gray-900">
                        {gesture.name}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {gesture.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 4: Script (talking_actor only) */}
          {projectType === 'talking_actor' && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Wand2 className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Script</h2>
              </div>

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

              {/* AI Enhancement Controls */}
              <div className="mt-4 bg-gradient-to-br from-gray-50 to-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-gray-600" />
                  <h3 className="text-sm font-bold text-gray-900">AI Script Enhancement</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Select
                    label="Tone"
                    value={scriptTone}
                    onChange={setScriptTone}
                    options={[
                      { value: 'professional', label: 'Professional' },
                      { value: 'casual', label: 'Casual' },
                      { value: 'friendly', label: 'Friendly' },
                      { value: 'persuasive', label: 'Persuasive' },
                      { value: 'enthusiastic', label: 'Enthusiastic' },
                      { value: 'authoritative', label: 'Authoritative' },
                    ]}
                  />

                  <Select
                    label="Goal"
                    value={scriptGoal}
                    onChange={setScriptGoal}
                    options={[
                      { value: 'inform', label: 'Inform' },
                      { value: 'sell', label: 'Sell' },
                      { value: 'entertain', label: 'Entertain' },
                      { value: 'educate', label: 'Educate' },
                      { value: 'inspire', label: 'Inspire' },
                      { value: 'persuade', label: 'Persuade' },
                    ]}
                  />
                </div>

                <button
                  onClick={handleEnhanceScript}
                  disabled={enhancingScript || !scriptText.trim()}
                  className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enhancingScript ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Enhance with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Section 5: Voice (only for talking_actor) */}
          {projectType === 'talking_actor' && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Voice Settings</h2>
              </div>

              <div className="space-y-3">
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

                {selectedVoiceId && (
                  <button
                    onClick={handleVoicePreview}
                    disabled={previewingVoice}
                    className="w-full px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {previewingVoice ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                        Playing Preview...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Preview Voice
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="mt-4 bg-white rounded-2xl p-4 border border-gray-200 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Advanced Tuning</h3>

                <Slider
                  label="Speed"
                  value={voiceSettings.speed}
                  onChange={(v) => setVoiceSettings({ ...voiceSettings, speed: v })}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  helperText="Control the speaking pace"
                />

                <Slider
                  label="Stability"
                  value={voiceSettings.stability}
                  onChange={(v) => setVoiceSettings({ ...voiceSettings, stability: v })}
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  helperText="Higher = more consistent, lower = more expressive"
                />

                <Slider
                  label="Similarity Boost"
                  value={voiceSettings.similarity}
                  onChange={(v) => setVoiceSettings({ ...voiceSettings, similarity: v })}
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  helperText="Enhance voice clarity and similarity"
                />

                <Slider
                  label="Style Exaggeration"
                  value={voiceSettings.styleExaggeration}
                  onChange={(v) => setVoiceSettings({ ...voiceSettings, styleExaggeration: v })}
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  helperText="Amplify the speaker's style and emotion"
                />
              </div>
            </div>
          )}

          {/* Section 6: Format */}
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
            disabled={creating || !selectedAvatarId || (projectType === 'talking_actor' ? !scriptText.trim() : !selectedGesture)}
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

            {selectedGesture && projectType === 'gesture_only' && (
              <div className="bg-white rounded-2xl p-4 border border-gray-200 text-left">
                <div className="text-xs text-gray-600 mb-2">Selected Gesture</div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const gesture = gestures.find((g) => g.id === selectedGesture);
                    if (!gesture) return null;
                    const Icon = gesture.icon;
                    return (
                      <>
                        <Icon className="h-5 w-5 text-gray-900" />
                        <span className="font-bold text-sm text-gray-900">
                          {gesture.name}
                        </span>
                      </>
                    );
                  })()}
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
        {/* Custom Avatar Upload */}
        <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-50 rounded-2xl p-4 border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Upload className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-bold text-gray-900">Create Custom Avatar</h3>
              </div>
              <p className="text-xs text-gray-600">Upload your photo to create a personalized AI actor</p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCustomAvatarUpload(file);
                }}
                className="hidden"
                disabled={uploadingAvatar}
              />
              <div className="px-4 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all flex items-center gap-2 disabled:opacity-50">
                {uploadingAvatar ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

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
