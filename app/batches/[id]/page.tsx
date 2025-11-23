'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  ArrowLeft,
  Video,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  Download,
  Play,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Batch, BatchScript } from '@/lib/firestore/types';
import { useToast } from '@/components/ui/Toast';

// Demo batches for fallback
const demoBatches = [
  {
    id: 'demo_batch_001',
    userId: 'demo',
    name: 'Product Launch Campaign',
    templateConfig: {
      avatar: 'demo_sarah_001',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop',
      voice: 'demo_voice_rachel_001',
      voiceId: 'rachel',
      aspectRatio: '9:16',
      background: 'office',
    },
    scripts: [
      { id: '1', batchId: 'demo_batch_001', scriptText: 'Introducing our revolutionary new product!', status: 'completed' as const, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
      { id: '2', batchId: 'demo_batch_001', scriptText: 'See what makes us different from competitors.', status: 'completed' as const, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
      { id: '3', batchId: 'demo_batch_001', scriptText: 'Join thousands of happy customers today!', status: 'completed' as const, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
    ],
    status: 'completed' as const,
    totalVideos: 3,
    completedVideos: 3,
    failedVideos: 0,
    creditsUsed: 6,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    completedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'demo_batch_002',
    userId: 'demo',
    name: 'Holiday Sale Ads',
    templateConfig: {
      avatar: 'demo_james_002',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      voice: 'demo_voice_adam_002',
      voiceId: 'adam',
      aspectRatio: '16:9',
      background: 'studio',
    },
    scripts: [
      { id: '1', batchId: 'demo_batch_002', scriptText: 'Massive holiday savings await!', status: 'completed' as const, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
      { id: '2', batchId: 'demo_batch_002', scriptText: 'Limited time offers you cant miss.', status: 'processing' as const },
      { id: '3', batchId: 'demo_batch_002', scriptText: 'Shop now before its too late!', status: 'pending' as const },
      { id: '4', batchId: 'demo_batch_002', scriptText: 'Free shipping on all orders!', status: 'pending' as const },
    ],
    status: 'processing' as const,
    totalVideos: 4,
    completedVideos: 1,
    failedVideos: 0,
    creditsUsed: 2,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(),
  },
];

interface ExtendedBatchScript extends BatchScript {
  videoUrl?: string;
}

interface ExtendedBatch extends Omit<Batch, 'scripts'> {
  scripts: ExtendedBatchScript[];
}

function BatchDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const batchId = params.id as string;

  const [batch, setBatch] = useState<ExtendedBatch | null>(null);
  const [loading, setLoading] = useState(true);

  // Load batch data
  useEffect(() => {
    const loadBatch = async () => {
      if (!batchId) return;

      try {
        setLoading(true);

        // Check if it's a demo batch
        if (batchId.startsWith('demo_')) {
          const demoBatch = demoBatches.find((b) => b.id === batchId);
          if (demoBatch) {
            setBatch(demoBatch as any);
          }
        } else {
          // Load from Firestore
          const batchDoc = await getDoc(doc(db, 'batches', batchId));
          if (batchDoc.exists()) {
            setBatch({ id: batchDoc.id, ...batchDoc.data() } as ExtendedBatch);
          }
        }
      } catch (error) {
        console.error('Error loading batch:', error);
        toast.error('Load Failed', 'Could not load batch data');
      } finally {
        setLoading(false);
      }
    };

    loadBatch();
  }, [batchId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
      case 'processing':
        return <Loader className="h-5 w-5 text-gray-600 animate-spin" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-gray-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'processing':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-gray-50 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const handleDownloadAll = () => {
    toast.info('Download Started', 'Preparing all videos for download...');
    // In production, this would zip all completed videos
    setTimeout(() => {
      toast.success('Download Ready', 'Your videos are ready!');
    }, 2000);
  };

  const handleRetryFailed = () => {
    toast.info('Retrying...', 'Restarting failed video generations');
    // In production, this would re-queue failed scripts
    setTimeout(() => {
      toast.success('Retry Queued', 'Failed videos have been requeued');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="p-4 h-full overflow-hidden">
        <div className="bg-white h-full rounded-[40px] shadow-sm border border-gray-200/60 flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading batch details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="p-4 h-full overflow-hidden">
        <div className="bg-white h-full rounded-[40px] shadow-sm border border-gray-200/60 flex items-center justify-center">
          <div className="text-center">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Batch Not Found</h3>
            <p className="text-gray-600 mb-6">This batch may have been deleted</p>
            <button
              onClick={() => router.push('/batches')}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Back to Batches
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round((batch.completedVideos / batch.totalVideos) * 100);

  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="bg-white h-full rounded-[40px] shadow-sm border border-gray-200/60 overflow-y-auto">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/batches')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{batch.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold border ${getStatusColor(batch.status)}`}>
                  {getStatusIcon(batch.status)}
                  <span className="capitalize">{batch.status}</span>
                </span>
                <span className="text-sm text-gray-500">
                  {batch.completedVideos}/{batch.totalVideos} videos
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {batch.failedVideos > 0 && (
              <button
                onClick={handleRetryFailed}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Failed ({batch.failedVideos})
              </button>
            )}
            {batch.completedVideos > 0 && (
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download All
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Stats Row */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <div className="text-xs font-semibold text-gray-600 uppercase mb-1">Total Videos</div>
              <div className="text-3xl font-bold text-gray-900">{batch.totalVideos}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <div className="text-xs font-semibold text-gray-600 uppercase mb-1">Completed</div>
              <div className="text-3xl font-bold text-gray-900">{batch.completedVideos}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <div className="text-xs font-semibold text-gray-600 uppercase mb-1">Failed</div>
              <div className="text-3xl font-bold text-gray-900">{batch.failedVideos}</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <div className="text-xs font-semibold text-gray-600 uppercase mb-1">Credits Used</div>
              <div className="text-3xl font-bold text-gray-900">{batch.creditsUsed}</div>
            </div>
          </div>

          {/* Progress Bar (if processing) */}
          {batch.status === 'processing' && (
            <div className="mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-900">Generation Progress</span>
                <span className="text-sm font-bold text-gray-900">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-700 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Processing video {batch.completedVideos + 1} of {batch.totalVideos}...
              </p>
            </div>
          )}

          {/* Template Info */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Template Settings</h2>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-4">
                {batch.templateConfig.avatarUrl && (
                  <img
                    src={batch.templateConfig.avatarUrl}
                    alt="Avatar"
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Avatar:</span>
                      <span className="ml-2 font-medium text-gray-900">{batch.templateConfig.avatar}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Voice:</span>
                      <span className="ml-2 font-medium text-gray-900">{batch.templateConfig.voice}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Format:</span>
                      <span className="ml-2 font-medium text-gray-900">{batch.templateConfig.aspectRatio}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scripts List */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Scripts ({batch.scripts.length})</h2>
            <div className="space-y-3">
              {batch.scripts.map((script, index) => (
                <div
                  key={script.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{script.scriptText}</p>
                        {script.errorMessage && (
                          <p className="text-xs text-red-600 mt-1">{script.errorMessage}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(script.status)}`}>
                        {getStatusIcon(script.status)}
                        <span className="capitalize">{script.status}</span>
                      </span>
                      {script.status === 'completed' && script.videoUrl && (
                        <button
                          onClick={() => window.open(script.videoUrl, '_blank')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Watch video"
                        >
                          <Play className="h-4 w-4 text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BatchDetailPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <BatchDetailContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
