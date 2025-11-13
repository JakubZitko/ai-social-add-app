'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  AlertCircle,
} from 'lucide-react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Project } from '@/types';

function VideoPageContent() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const videoId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!videoId || !user) return;

    // Fetch project initially
    fetchProject();

    // Set up real-time listener for status updates
    const unsubscribe = onSnapshot(
      doc(db, 'projects', videoId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setProject({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            completedAt: data.completedAt?.toDate(),
          } as Project);
        }
      },
      (err) => {
        console.error('Error listening to project:', err);
      }
    );

    return () => unsubscribe();
  }, [videoId, user]);

  const fetchProject = async () => {
    if (!videoId || !user) return;

    try {
      setLoading(true);
      setError('');

      const projectDoc = await getDoc(doc(db, 'projects', videoId));

      if (!projectDoc.exists()) {
        setError('Video not found');
        return;
      }

      const data = projectDoc.data();

      // Check ownership
      if (data.userId !== user.uid) {
        setError('You do not have permission to view this video');
        return;
      }

      setProject({
        id: projectDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
      } as Project);
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError(err.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!project?.outputUrl) return;

    const link = document.createElement('a');
    link.href = project.outputUrl;
    link.download = `video-${project.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemix = () => {
    router.push(`/create?remix=${videoId}`);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/video/${videoId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my AI video',
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const getStatusIcon = () => {
    switch (project?.status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'processing':
        return <Clock className="h-6 w-6 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (project?.status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing...';
      case 'failed':
        return 'Failed';
      default:
        return 'Draft';
    }
  };

  const getStatusColor = () => {
    switch (project?.status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'processing':
        return 'bg-blue-50 border-blue-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {error || 'Video not found'}
            </h2>
            <Button variant="primary" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

            {project.status === 'completed' && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" onClick={handleRemix}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Remix
                </Button>
                <Button variant="primary" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card>
              <CardBody className="p-0">
                {project.status === 'completed' && project.outputUrl ? (
                  <video
                    src={project.outputUrl}
                    controls
                    className="w-full aspect-video bg-black rounded-t-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
                    {project.status === 'processing' ? (
                      <div className="text-center">
                        <Spinner size="lg" className="mx-auto mb-4" />
                        <p className="text-white text-lg font-semibold">
                          Generating your video...
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          This usually takes 1-3 minutes
                        </p>
                      </div>
                    ) : project.status === 'failed' ? (
                      <div className="text-center">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <p className="text-white text-lg font-semibold">
                          Video generation failed
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          {project.errorMessage || 'An error occurred'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Play className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-white text-lg font-semibold">
                          Video preview unavailable
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Video Info */}
            <Card className="mt-6">
              <CardHeader>
                <h3 className="text-lg font-semibold">Video Details</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Script</h4>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {project.type === 'talking_actor'
                      ? project.scriptText
                      : project.gesturePrompt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold text-gray-900">
                      {project.type === 'talking_actor' ? 'Talking Actor' : 'Gesture Only'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Format</p>
                    <p className="font-semibold text-gray-900">{project.aspectRatio}</p>
                  </div>
                  {project.duration && (
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900">{project.duration}s</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className={getStatusColor()}>
              <CardBody>
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon()}
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-lg font-bold text-gray-900">
                      {getStatusText()}
                    </p>
                  </div>
                </div>

                {project.status === 'processing' && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse w-2/3" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Estimated time: 1-3 minutes
                    </p>
                  </div>
                )}

                {project.completedAt && (
                  <p className="text-sm text-gray-600">
                    Completed {project.completedAt.toLocaleString()}
                  </p>
                )}
              </CardBody>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Project Info</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-semibold text-gray-900">
                    {project.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Credits Used</p>
                  <p className="font-semibold text-gray-900">{project.creditsUsed}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Project ID</p>
                  <p className="font-mono text-xs text-gray-900">{project.id}</p>
                </div>
              </CardBody>
            </Card>

            {/* Actions */}
            {project.status === 'failed' && (
              <Card className="bg-red-50 border-red-200">
                <CardBody>
                  <h4 className="font-semibold text-red-900 mb-2">
                    What happened?
                  </h4>
                  <p className="text-sm text-red-700 mb-4">
                    {project.errorMessage || 'An unknown error occurred during video generation.'}
                  </p>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => router.push('/create')}
                  >
                    Create New Video
                  </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VideoPage() {
  return (
    <ProtectedRoute>
      <VideoPageContent />
    </ProtectedRoute>
  );
}
