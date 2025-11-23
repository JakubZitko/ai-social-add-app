'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  ArrowLeft,
  Zap,
  Clock,
  Video,
  Bell,
  Trash2,
  Check,
  ChevronRight,
  Loader,
} from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { Instagram, Youtube } from 'lucide-react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useToast } from '@/components/ui/Toast';

type TriggerType = 'schedule' | 'event';
type ActionType = 'generate_video' | 'post_to_social' | 'send_notification';
type Platform = 'tiktok' | 'instagram' | 'youtube';

interface Action {
  type: ActionType;
  platform?: Platform;
  config: Record<string, any>;
}

// Demo automations for fallback
const demoAutomations = [
  {
    id: 'demo_automation_001',
    name: 'Daily Product Video',
    description: 'Automatically generate product videos every morning',
    status: 'active',
    trigger: { type: 'schedule', schedule: 'daily at 09:00' },
    actions: [{ type: 'generate_video', config: {} }],
  },
  {
    id: 'demo_automation_002',
    name: 'Auto-Post to TikTok',
    description: 'Post completed videos to TikTok automatically',
    status: 'active',
    trigger: { type: 'event', event: 'video_completed' },
    actions: [{ type: 'post_to_social', platform: 'tiktok', config: {} }],
  },
];

function EditAutomationContent() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const automationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<TriggerType>('schedule');
  const [schedule, setSchedule] = useState('daily');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [eventType, setEventType] = useState('video_completed');
  const [actions, setActions] = useState<Action[]>([]);

  // Load automation data
  useEffect(() => {
    const loadAutomation = async () => {
      if (!automationId) return;

      try {
        setLoading(true);

        // Check if it's a demo automation
        if (automationId.startsWith('demo_')) {
          const demoAutomation = demoAutomations.find((a) => a.id === automationId);
          if (demoAutomation) {
            setName(demoAutomation.name);
            setDescription(demoAutomation.description);
            setTriggerType(demoAutomation.trigger.type as TriggerType);
            if (demoAutomation.trigger.schedule) {
              const parts = demoAutomation.trigger.schedule.split(' at ');
              setSchedule(parts[0] || 'daily');
              setScheduleTime(parts[1] || '09:00');
            }
            if (demoAutomation.trigger.event) {
              setEventType(demoAutomation.trigger.event);
            }
            setActions(demoAutomation.actions as Action[]);
          }
        } else {
          // Load from Firestore
          const automationDoc = await getDoc(doc(db, 'automations', automationId));
          if (automationDoc.exists()) {
            const data = automationDoc.data();
            setName(data.name || '');
            setDescription(data.description || '');
            setTriggerType(data.trigger?.type || 'schedule');
            if (data.trigger?.schedule) {
              const parts = data.trigger.schedule.split(' at ');
              setSchedule(parts[0] || 'daily');
              setScheduleTime(parts[1] || '09:00');
            }
            if (data.trigger?.event) {
              setEventType(data.trigger.event);
            }
            setActions(data.actions || []);
          }
        }
      } catch (error) {
        console.error('Error loading automation:', error);
        toast.error('Load Failed', 'Could not load automation data');
      } finally {
        setLoading(false);
      }
    };

    loadAutomation();
  }, [automationId]);

  const addAction = (type: ActionType, platform?: Platform) => {
    setActions([...actions, { type, platform, config: {} }]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user) return;

    if (!name.trim()) {
      toast.error('Name Required', 'Please enter a name for your automation');
      return;
    }

    if (actions.length === 0) {
      toast.error('Actions Required', 'Please add at least one action');
      return;
    }

    try {
      setSaving(true);

      // Handle demo automation
      if (automationId.startsWith('demo_')) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success('Automation Updated!', 'Changes saved successfully');
        router.push('/automations');
        return;
      }

      const automationData = {
        name,
        description,
        trigger: {
          type: triggerType,
          schedule: triggerType === 'schedule' ? `${schedule} at ${scheduleTime}` : undefined,
          event: triggerType === 'event' ? eventType : undefined,
        },
        actions,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, 'automations', automationId), automationData);
      toast.success('Automation Updated!', 'Changes saved successfully');
      router.push('/automations');
    } catch (err: any) {
      console.error('Error updating automation:', err);
      toast.error('Failed to save', err.message || 'Please try again');
    } finally {
      setSaving(false);
    }
  };

  const getActionIcon = (type: ActionType) => {
    switch (type) {
      case 'generate_video':
        return <Video className="h-5 w-5" />;
      case 'post_to_social':
        return <Zap className="h-5 w-5" />;
      case 'send_notification':
        return <Bell className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 h-full overflow-hidden">
        <div className="bg-white h-full rounded-[40px] shadow-sm border border-gray-200/60 flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading automation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="bg-white h-full rounded-[40px] shadow-sm border border-gray-200/60 overflow-y-auto">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/automations')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Edit Automation</h1>
              <p className="text-sm text-gray-500">Step {step} of 3</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </header>

        {/* Progress Bar */}
        <div className="px-8 py-4 border-b border-gray-100">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-w-3xl mx-auto">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600">Update your automation name and description</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Automation Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Daily Product Video Generator"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="What does this automation do?"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Trigger */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Trigger</h2>
                <p className="text-gray-600">When should this automation run?</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTriggerType('schedule')}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    triggerType === 'schedule'
                      ? 'border-gray-900 bg-gray-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Clock className={`h-8 w-8 mb-3 ${triggerType === 'schedule' ? 'text-gray-900' : 'text-gray-400'}`} />
                  <h3 className="font-bold text-gray-900">Schedule</h3>
                  <p className="text-sm text-gray-600 mt-1">Run at specific times</p>
                </button>

                <button
                  onClick={() => setTriggerType('event')}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    triggerType === 'event'
                      ? 'border-gray-900 bg-gray-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Zap className={`h-8 w-8 mb-3 ${triggerType === 'event' ? 'text-gray-900' : 'text-gray-400'}`} />
                  <h3 className="font-bold text-gray-900">Event</h3>
                  <p className="text-sm text-gray-600 mt-1">Run when something happens</p>
                </button>
              </div>

              {triggerType === 'schedule' && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
                    <select
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="weekdays">Weekdays only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                    />
                  </div>
                </div>
              )}

              {triggerType === 'event' && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  >
                    <option value="video_completed">Video Generation Completed</option>
                    <option value="new_project">New Project Created</option>
                    <option value="credits_low">Credits Running Low</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Actions */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Actions</h2>
                <p className="text-gray-600">What should happen when the automation runs?</p>
              </div>

              {/* Current Actions */}
              {actions.length > 0 && (
                <div className="space-y-3">
                  {actions.map((action, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center text-white">
                          {getActionIcon(action.type)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {action.type === 'generate_video'
                              ? 'Generate Video'
                              : action.type === 'post_to_social'
                              ? `Post to ${action.platform}`
                              : 'Send Notification'}
                          </p>
                          <p className="text-sm text-gray-600">Action #{index + 1}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAction(index)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => addAction('generate_video')}
                  className="p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
                >
                  <Video className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="font-semibold text-gray-900 text-sm">Generate Video</p>
                  <p className="text-xs text-gray-600">Create a new AI video</p>
                </button>

                <button
                  onClick={() => addAction('send_notification')}
                  className="p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
                >
                  <Bell className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="font-semibold text-gray-900 text-sm">Send Notification</p>
                  <p className="text-xs text-gray-600">Email or push alert</p>
                </button>

                <button
                  onClick={() => addAction('post_to_social', 'tiktok')}
                  className="p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
                >
                  <FaTiktok className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="font-semibold text-gray-900 text-sm">Post to TikTok</p>
                  <p className="text-xs text-gray-600">Auto-publish video</p>
                </button>

                <button
                  onClick={() => addAction('post_to_social', 'instagram')}
                  className="p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
                >
                  <Instagram className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="font-semibold text-gray-900 text-sm">Post to Instagram</p>
                  <p className="text-xs text-gray-600">Auto-publish Reels</p>
                </button>

                <button
                  onClick={() => addAction('post_to_social', 'youtube')}
                  className="p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-left col-span-2"
                >
                  <Youtube className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="font-semibold text-gray-900 text-sm">Post to YouTube</p>
                  <p className="text-xs text-gray-600">Upload as Shorts or video</p>
                </button>
              </div>

              {actions.length === 0 && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
                  <Bell className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Add at least one action to save your automation
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditAutomationPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <EditAutomationContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
