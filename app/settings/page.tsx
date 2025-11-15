'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Palette,
  Users,
  Shield,
  Download,
  Trash2,
  Save,
  Camera,
  Link as LinkIcon,
  Check,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
  joinedAt: Date;
  status: 'active' | 'pending';
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SettingsContent />
      </AppLayout>
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'team' | 'security'>('profile');
  const [saved, setSaved] = useState(false);

  // Profile state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [videoComplete, setVideoComplete] = useState(true);
  const [videoFailed, setVideoFailed] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);

  // Team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: user?.displayName || 'You',
      email: user?.email || '',
      role: 'owner',
      avatar: user?.photoURL,
      joinedAt: new Date('2025-09-01'),
      status: 'active',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      role: 'admin',
      joinedAt: new Date('2025-10-15'),
      status: 'active',
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@company.com',
      role: 'member',
      joinedAt: new Date('2025-11-01'),
      status: 'pending',
    },
  ]);

  const handleSave = () => {
    // Simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleInviteMember = () => {
    const email = prompt('Enter email address to invite:');
    if (email) {
      alert(`Invitation sent to ${email}`);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(teamMembers.filter((m) => m.id !== memberId));
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'account', label: 'Account', icon: <Lock className="h-5 w-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { id: 'team', label: 'Team', icon: <Users className="h-5 w-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-[24px] p-3 shadow-sm border border-gray-100">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      activeTab === tab.id
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-semibold text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Social Connections Link */}
            <Link href="/settings/social">
              <div className="mt-4 bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-4 border-2 border-gray-200 cursor-pointer hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-5 w-5 text-gray-600" />
                  <span className="font-bold text-gray-900 text-sm">Social Connections</span>
                </div>
                <p className="text-xs text-gray-600">Manage TikTok, Instagram & YouTube</p>
              </div>
            </Link>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Save Success Banner */}
            {saved && (
              <div className="mb-6 bg-gray-50 rounded-[20px] p-4 border-2 border-gray-200 flex items-center gap-3">
                <Check className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-semibold text-gray-800">Settings saved successfully!</span>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>

                  {/* Avatar Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        {user?.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-600">
                            {user?.email?.[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                        <Camera className="h-4 w-4" />
                        Upload Photo
                      </button>
                    </div>
                  </div>

                  {/* Display Name */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                      placeholder="Your display name"
                    />
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Website */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <Save className="h-5 w-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

                  {/* Email */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                      />
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Lock className="h-5 w-5 text-gray-600" />
                          <span className="text-sm font-semibold text-gray-900">Password</span>
                        </div>
                        <p className="text-xs text-gray-600">••••••••••••</p>
                      </div>
                      <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Language & Region */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm">
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm">
                      <option>Pacific Time (PT)</option>
                      <option>Mountain Time (MT)</option>
                      <option>Central Time (CT)</option>
                      <option>Eastern Time (ET)</option>
                      <option>UTC</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <Save className="h-5 w-5" />
                    Save Changes
                  </button>
                </div>

                {/* Export Data */}
                <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Export Your Data</h3>
                  <p className="text-gray-600 mb-4">
                    Download a copy of your account data, including all videos and settings.
                  </p>
                  <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                    <Download className="h-5 w-5" />
                    Request Data Export
                  </button>
                </div>

                {/* Delete Account */}
                <div className="bg-gray-50 rounded-[24px] p-8 border-2 border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Account</h3>
                  <p className="text-gray-700 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors">
                    <Trash2 className="h-5 w-5" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

                  {/* Email Notifications Toggle */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="h-5 w-5 text-gray-600" />
                          <span className="text-sm font-semibold text-gray-900">Email Notifications</span>
                        </div>
                        <p className="text-xs text-gray-600">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>
                  </div>

                  {/* Individual Notification Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">Video Generation Complete</div>
                        <p className="text-xs text-gray-600">Get notified when your videos are ready</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={videoComplete}
                          onChange={(e) => setVideoComplete(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">Video Generation Failed</div>
                        <p className="text-xs text-gray-600">Alert me when generation fails</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={videoFailed}
                          onChange={(e) => setVideoFailed(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">Weekly Usage Report</div>
                        <p className="text-xs text-gray-600">Receive weekly summary of your activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={weeklyReport}
                          onChange={(e) => setWeeklyReport(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">Product Updates & Tips</div>
                        <p className="text-xs text-gray-600">Learn about new features and best practices</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productUpdates}
                          onChange={(e) => setProductUpdates(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="mt-6 flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <Save className="h-5 w-5" />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
                      <p className="text-sm text-gray-600 mt-1">Manage who has access to your workspace</p>
                    </div>
                    <button
                      onClick={handleInviteMember}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                      <Users className="h-5 w-5" />
                      Invite Member
                    </button>
                  </div>

                  {/* Team Members List */}
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full overflow-hidden border-2 border-white shadow">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-600">
                                {member.name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-gray-900">{member.name}</span>
                              {member.status === 'pending' && (
                                <span className="px-2 py-0.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold">
                                  Pending
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600">{member.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={member.role}
                            disabled={member.role === 'owner'}
                            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 disabled:bg-gray-100"
                          >
                            <option value="owner">Owner</option>
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                          </select>
                          {member.role !== 'owner' && (
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-gray-600" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Roles Info */}
                <div className="bg-gray-50 rounded-[24px] p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Team Roles</h3>
                  <div className="space-y-2 text-sm text-gray-800">
                    <div><strong>Owner:</strong> Full access to all features and settings</div>
                    <div><strong>Admin:</strong> Can manage projects and invite members</div>
                    <div><strong>Member:</strong> Can create and edit projects</div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>

                  {/* Two-Factor Authentication */}
                  <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl border-2 border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-6 w-6 text-gray-600" />
                          <span className="text-lg font-bold text-gray-900">Two-Factor Authentication</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-4">
                          Add an extra layer of security to your account
                        </p>
                        <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-800 border border-green-300 rounded-lg text-xs font-semibold">
                          <Check className="h-3 w-3 mr-1" />
                          Enabled
                        </span>
                      </div>
                      <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                        Manage
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-gray-900 mb-1">Current Session</div>
                            <div className="text-xs text-gray-600">Chrome on macOS • San Francisco, CA</div>
                          </div>
                          <span className="px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold">
                            Active Now
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* API Keys */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">API Keys</h3>
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
                        Generate New Key
                      </button>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-gray-800">
                          <strong>No API keys yet.</strong> Generate an API key to integrate VideoAI with your applications.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
