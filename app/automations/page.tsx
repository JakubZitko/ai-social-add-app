'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Sparkles,
  Zap,
  Clock,
  Calendar,
  Play,
  Pause,
  Trash2,
  Edit,
  Plus,
  Check,
  AlertCircle,
  Settings,
  TrendingUp,
  BarChart3,
  Loader,
} from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { Instagram, Youtube } from 'lucide-react';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Automation } from '@/lib/firestore/types';
import { useToast } from '@/components/ui/Toast';

function AutomationsContent() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [loading, setLoading] = useState(true);
  const [automationToDelete, setAutomationToDelete] = useState<string | null>(null);

  // Fetch user automations from Firestore
  useEffect(() => {
    const fetchAutomations = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const automationsQuery = query(
          collection(db, 'automations'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(automationsQuery);
        const automationsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Automation[];
        setAutomations(automationsData);
      } catch (error) {
        console.error('Error fetching automations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAutomations();
  }, [user]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'tiktok':
        return <FaTiktok className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'paused':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const toggleAutomationStatus = async (id: string) => {
    const automation = automations.find((a) => a.id === id);
    if (!automation) return;

    const newStatus = automation.status === 'active' ? 'paused' : 'active';

    try {
      const automationRef = doc(db, 'automations', id);
      await updateDoc(automationRef, { status: newStatus });
      setAutomations(
        automations.map((auto) =>
          auto.id === id ? { ...auto, status: newStatus as 'active' | 'paused' } : auto
        )
      );
    } catch (error) {
      console.error('Error toggling automation status:', error);
    }
  };

  const handleDeleteAutomation = async (id: string) => {
    setAutomationToDelete(id);
  };

  const confirmDeleteAutomation = async () => {
    if (!automationToDelete) return;

    try {
      await deleteDoc(doc(db, 'automations', automationToDelete));
      setAutomations(automations.filter((a) => a.id !== automationToDelete));
      toast.success('Automation Deleted', 'The automation has been removed');
    } catch (error) {
      console.error('Error deleting automation:', error);
      toast.error('Delete Failed', 'Please try again');
    } finally {
      setAutomationToDelete(null);
    }
  };

  const activeAutomations = automations.filter((a) => a.status === 'active').length;
  const totalRuns = automations.reduce((sum, a) => sum + a.runsCount, 0);
  const avgSuccessRate =
    automations.length > 0
      ? automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length
      : 0;

  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="bg-white h-full rounded-[40px] shadow-sm border border-gray-200/60 overflow-y-auto">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Automations</h1>
            <p className="text-sm text-gray-500">Scheduled workflows and triggers</p>
          </div>
          <button
            onClick={() => router.push('/automations/new')}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Automation
          </button>
        </header>

        {/* Main Content */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase">
                    Active Automations
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{activeAutomations}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {automations.length - activeAutomations} paused or draft
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase">Total Runs</div>
                  <div className="text-3xl font-bold text-gray-900">{totalRuns}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">Across all automations</div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 uppercase">
                    Success Rate
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{avgSuccessRate.toFixed(0)}%</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">Average across all runs</div>
            </div>
          </div>

          {/* Automations List */}
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100">
                <Loader className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Loading automations...</h3>
                <p className="text-gray-600">Please wait</p>
              </div>
            ) : automations.length === 0 ? (
              <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100">
                <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No automations yet</h3>
                <p className="text-gray-600 mb-6">Create your first automation to start saving time</p>
                <button
                  onClick={() => router.push('/automations/new')}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Create Automation
                </button>
              </div>
            ) : (
              <>
                {automations.map((automation) => (
              <div
                key={automation.id}
                className="bg-white rounded-[24px] p-6 border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{automation.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-bold border ${getStatusColor(
                          automation.status
                        )}`}
                      >
                        {automation.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{automation.description}</p>

                    {/* Trigger Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700 font-medium">
                          {automation.trigger.type === 'schedule'
                            ? automation.trigger.schedule
                            : automation.trigger.event}
                        </span>
                      </div>
                      {automation.nextRun && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">
                            Next: {automation.nextRun.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {automation.actions.map((action, index) => (
                        <div
                          key={index}
                          className="px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-2"
                        >
                          {action.platform && getPlatformIcon(action.platform)}
                          <span className="text-xs font-medium text-gray-700">
                            {action.type === 'generate_video'
                              ? 'Generate Video'
                              : action.type === 'post_to_social'
                              ? `Post to ${action.platform}`
                              : 'Notify'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex flex-col items-end gap-3 ml-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{automation.runsCount}</div>
                      <div className="text-xs text-gray-600">Runs</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-500 rounded-full"
                          style={{ width: `${automation.successRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">
                        {automation.successRate}%
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAutomationStatus(automation.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={automation.status === 'active' ? 'Pause' : 'Activate'}
                      >
                        {automation.status === 'active' ? (
                          <Pause className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Play className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => router.push(`/automations/${automation.id}/edit`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteAutomation(automation.id)}
                        className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
              </>
            )}
          </div>

          {/* Old Empty State - REMOVED (now handled in loading/empty check above) */}
          {false && (
            <div className="bg-white rounded-[32px] p-12 border border-gray-200 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No automations yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first automation to start generating and posting videos automatically
              </p>
              <button
                onClick={() => router.push('/automations/new')}
                className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-all inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Create Automation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {automationToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Automation?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this automation? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setAutomationToDelete(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAutomation}
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

export default function AutomationsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <AutomationsContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
