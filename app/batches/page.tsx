'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Plus,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  RectangleStackIcon,
  Video,
  Trash2,
  Eye,
  Download,
} from 'lucide-react';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Batch } from '@/lib/firestore/types';
import { useToast } from '@/components/ui/Toast';

// Demo batches for when Firestore is empty
const demoBatches: Batch[] = [
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
      { id: '1', batchId: 'demo_batch_001', scriptText: 'Introducing our revolutionary new product!', status: 'completed' },
      { id: '2', batchId: 'demo_batch_001', scriptText: 'See what makes us different from competitors.', status: 'completed' },
      { id: '3', batchId: 'demo_batch_001', scriptText: 'Join thousands of happy customers today!', status: 'completed' },
    ],
    status: 'completed',
    totalVideos: 3,
    completedVideos: 3,
    failedVideos: 0,
    creditsUsed: 6,
    createdAt: { toDate: () => new Date(Date.now() - 86400000) } as any,
    updatedAt: { toDate: () => new Date(Date.now() - 86400000) } as any,
    completedAt: { toDate: () => new Date(Date.now() - 86400000) } as any,
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
      { id: '1', batchId: 'demo_batch_002', scriptText: 'Massive holiday savings await!', status: 'completed' },
      { id: '2', batchId: 'demo_batch_002', scriptText: 'Limited time offers you cant miss.', status: 'processing' },
      { id: '3', batchId: 'demo_batch_002', scriptText: 'Shop now before its too late!', status: 'pending' },
      { id: '4', batchId: 'demo_batch_002', scriptText: 'Free shipping on all orders!', status: 'pending' },
    ],
    status: 'processing',
    totalVideos: 4,
    completedVideos: 1,
    failedVideos: 0,
    creditsUsed: 2,
    createdAt: { toDate: () => new Date(Date.now() - 3600000) } as any,
    updatedAt: { toDate: () => new Date() } as any,
  },
  {
    id: 'demo_batch_003',
    userId: 'demo',
    name: 'Testimonial Series',
    templateConfig: {
      avatar: 'demo_emma_007',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
      voice: 'demo_voice_emily_007',
      voiceId: 'emily',
      aspectRatio: '1:1',
      background: 'minimal',
    },
    scripts: [
      { id: '1', batchId: 'demo_batch_003', scriptText: 'This product changed my life!', status: 'pending' },
      { id: '2', batchId: 'demo_batch_003', scriptText: 'I recommend it to everyone.', status: 'pending' },
    ],
    status: 'pending',
    totalVideos: 2,
    completedVideos: 0,
    failedVideos: 0,
    creditsUsed: 0,
    createdAt: { toDate: () => new Date() } as any,
    updatedAt: { toDate: () => new Date() } as any,
  },
];

function BatchesContent() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchToDelete, setBatchToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const batchesQuery = query(
          collection(db, 'batches'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(batchesQuery);
        const batchesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Batch[];

        // Use demo data if no batches found
        if (batchesData.length === 0) {
          console.log('No batches in database, using demo data');
          setBatches(demoBatches);
        } else {
          setBatches(batchesData);
        }
      } catch (error) {
        console.error('Error fetching batches:', error);
        // Use demo data on error
        setBatches(demoBatches);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      case 'processing':
        return <Loader className="h-4 w-4 text-gray-600 animate-spin" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
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
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'pending':
        return 'bg-gray-50 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const handleDeleteBatch = async () => {
    if (!batchToDelete) return;

    try {
      // Check if it's a demo batch
      if (batchToDelete.startsWith('demo_')) {
        setBatches(batches.filter((b) => b.id !== batchToDelete));
        toast.success('Batch Deleted', 'The batch has been removed');
      } else {
        await deleteDoc(doc(db, 'batches', batchToDelete));
        setBatches(batches.filter((b) => b.id !== batchToDelete));
        toast.success('Batch Deleted', 'The batch has been removed');
      }
    } catch (error) {
      console.error('Error deleting batch:', error);
      toast.error('Delete Failed', 'Please try again');
    } finally {
      setBatchToDelete(null);
    }
  };

  const stats = {
    total: batches.length,
    completed: batches.filter((b) => b.status === 'completed').length,
    processing: batches.filter((b) => b.status === 'processing').length,
    totalVideos: batches.reduce((sum, b) => sum + b.totalVideos, 0),
  };

  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="bg-white h-full rounded-[40px] shadow-sm border border-gray-200/60 overflow-y-auto">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Batch Generation</h1>
            <p className="text-sm text-gray-500">Create and manage bulk video projects</p>
          </div>
          <button
            onClick={() => router.push('/batches/new')}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Batch
          </button>
        </header>

        {/* Main Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase">Total Batches</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase">Completed</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.completed}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <Loader className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase">Processing</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.processing}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase">Total Videos</div>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalVideos}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Batches List */}
          {loading ? (
            <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100">
              <Loader className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Loading batches...</h3>
              <p className="text-gray-600">Please wait</p>
            </div>
          ) : batches.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100">
              <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No batches yet</h3>
              <p className="text-gray-600 mb-6">Create your first batch to generate multiple videos at once</p>
              <button
                onClick={() => router.push('/batches/new')}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Create New Batch
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-white rounded-[24px] p-6 border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{batch.name}</h3>
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${getStatusColor(
                            batch.status
                          )}`}
                        >
                          {getStatusIcon(batch.status)}
                          <span className="capitalize">{batch.status}</span>
                        </span>
                      </div>

                      {/* Template Info */}
                      <div className="flex items-center gap-4 mb-4">
                        {batch.templateConfig.avatarUrl && (
                          <img
                            src={batch.templateConfig.avatarUrl}
                            alt="Avatar"
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{batch.totalVideos} videos</span>
                          <span className="mx-2">•</span>
                          <span>{batch.templateConfig.aspectRatio}</span>
                          <span className="mx-2">•</span>
                          <span>{batch.creditsUsed} credits used</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {batch.status === 'processing' && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-bold text-gray-900">
                              {batch.completedVideos}/{batch.totalVideos}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-700 rounded-full transition-all"
                              style={{ width: `${(batch.completedVideos / batch.totalVideos) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Created Date */}
                      <div className="text-xs text-gray-500">
                        Created {batch.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }) || 'Recently'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => router.push(`/batches/${batch.id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setBatchToDelete(batch.id)}
                        className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {batchToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Batch?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this batch? All videos in this batch will also be deleted. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBatchToDelete(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBatch}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BatchesPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <BatchesContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
