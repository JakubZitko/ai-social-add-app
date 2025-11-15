'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import {
  Sparkles,
  Film,
  Wand2,
  Image as ImageIcon,
  AlertCircle,
  Play,
  Download,
  RefreshCw,
} from 'lucide-react';

interface GeneratedScene {
  id: string;
  prompt: string;
  style: string;
  duration: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  status: 'generating' | 'completed' | 'failed';
  createdAt: Date;
}

function SceneGeneratorContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [scenePrompt, setScenePrompt] = useState('');
  const [sceneStyle, setSceneStyle] = useState<string>('cinematic');
  const [sceneDuration, setSceneDuration] = useState<string>('5');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedScenes, setGeneratedScenes] = useState<GeneratedScene[]>([]);

  const handleDownloadScene = async (sceneId: string) => {
    const scene = generatedScenes.find(s => s.id === sceneId);
    if (!scene?.videoUrl) {
      alert('Video not available for download');
      return;
    }

    try {
      const response = await fetch(scene.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scene-${scene.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading scene:', error);
      alert('Failed to download scene. Please try again.');
    }
  };

  const handleRegenerateScene = async (sceneId: string) => {
    const scene = generatedScenes.find(s => s.id === sceneId);
    if (!scene) return;

    setGeneratedScenes(prev =>
      prev.map(s =>
        s.id === sceneId
          ? { ...s, status: 'generating' as const }
          : s
      )
    );

    // Simulate regeneration
    setTimeout(() => {
      setGeneratedScenes(prev =>
        prev.map(s =>
          s.id === sceneId
            ? { ...s, status: 'completed' as const }
            : s
        )
      );
    }, 5000);
  };

  const handleGenerateScene = async () => {
    if (!scenePrompt.trim()) {
      setError('Please enter a scene description');
      return;
    }

    if (!user) return;

    if (user.credits < 3) {
      setError('Insufficient credits. Scene generation costs 3 credits.');
      return;
    }

    try {
      setGenerating(true);
      setError('');

      // TODO: In production, this would call the backend API endpoint
      // that uses Runway ML, Pika Labs, or similar AI video generation service
      const newScene: GeneratedScene = {
        id: Date.now().toString(),
        prompt: scenePrompt,
        style: sceneStyle,
        duration: parseInt(sceneDuration),
        status: 'generating',
        createdAt: new Date(),
      };

      setGeneratedScenes([newScene, ...generatedScenes]);

      // Simulate generation completion after 5 seconds
      setTimeout(() => {
        setGeneratedScenes((prev) =>
          prev.map((scene) =>
            scene.id === newScene.id
              ? { ...scene, status: 'completed' as const }
              : scene
          )
        );
      }, 5000);

      setScenePrompt('');
    } catch (err: any) {
      console.error('Error generating scene:', err);
      setError(err.message || 'Failed to generate scene');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="bg-white h-full rounded-[40px] shadow-sm border border-gray-200/60 overflow-y-auto">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Scene Generator</h1>
            <p className="text-sm text-gray-500">AI-generated B-roll footage for your videos</p>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Generator */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[32px] p-6 border border-gray-200 shadow-lg sticky top-28">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-700 rounded-xl flex items-center justify-center">
                    <Film className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Generate Scene</h2>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <Textarea
                    label="Scene Description"
                    value={scenePrompt}
                    onChange={(e) => setScenePrompt(e.target.value)}
                    rows={4}
                    maxLength={500}
                    showCharCount
                    placeholder="Describe the scene you want to generate... e.g., 'A serene sunset over a mountain lake with golden reflections'"
                  />

                  <Select
                    label="Visual Style"
                    value={sceneStyle}
                    onChange={setSceneStyle}
                    options={[
                      { value: 'cinematic', label: 'Cinematic' },
                      { value: 'realistic', label: 'Realistic' },
                      { value: 'artistic', label: 'Artistic' },
                      { value: 'vintage', label: 'Vintage' },
                      { value: 'futuristic', label: 'Futuristic' },
                      { value: 'animated', label: 'Animated' },
                    ]}
                  />

                  <Select
                    label="Duration"
                    value={sceneDuration}
                    onChange={setSceneDuration}
                    options={[
                      { value: '3', label: '3 seconds' },
                      { value: '5', label: '5 seconds' },
                      { value: '10', label: '10 seconds' },
                    ]}
                  />

                  <button
                    onClick={handleGenerateScene}
                    disabled={generating || !scenePrompt.trim()}
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-700 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate Scene (3 Credits)
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-50 rounded-2xl border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">💡 Pro Tips</h3>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Be specific with lighting, time of day, and mood</li>
                    <li>• Describe camera movement if desired</li>
                    <li>• Mention any specific elements or subjects</li>
                    <li>• Use descriptive adjectives for better results</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Panel - Generated Scenes */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Scenes</h2>
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">{generatedScenes.length}</span> scenes generated
                </div>
              </div>

              {generatedScenes.length === 0 ? (
                <div className="bg-white rounded-[32px] p-12 border border-gray-200 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ImageIcon className="h-10 w-10 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No scenes yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Generate your first AI scene by describing what you want to see. Perfect for B-roll footage!
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {generatedScenes.map((scene) => (
                    <div
                      key={scene.id}
                      className="bg-white rounded-[24px] overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center relative">
                        {scene.status === 'generating' ? (
                          <div className="text-center">
                            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-white font-bold">Generating...</p>
                            <p className="text-white/70 text-sm mt-1">{scene.duration}s scene</p>
                          </div>
                        ) : scene.status === 'completed' ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <Play className="h-16 w-16 text-white/50" />
                          </div>
                        ) : (
                          <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                            <p className="text-white font-bold">Generation Failed</p>
                          </div>
                        )}

                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-white text-xs font-bold">{scene.duration}s</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium line-clamp-2 mb-1">
                              {scene.prompt}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-lg font-semibold">
                                {scene.style}
                              </span>
                              <span>{scene.createdAt.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {scene.status === 'completed' && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleDownloadScene(scene.id)}
                              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-900 transition-colors flex items-center justify-center gap-1"
                            >
                              <Download className="h-3 w-3" />
                              Download
                            </button>
                            <button
                              onClick={() => handleRegenerateScene(scene.id)}
                              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-900 transition-colors flex items-center justify-center gap-1"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Regenerate
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SceneGeneratorPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SceneGeneratorContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
