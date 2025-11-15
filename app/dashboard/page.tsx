'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Plus,
  Search,
  Video,
  Mic,
  ChevronDown,
  Bell,
  CreditCard,
  Play,
} from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Project } from '@/types';

// --- COMPONENT: AVATAR DRAWER (The "Pop Up") ---
interface AvatarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: () => void;
}

const AvatarDrawer: React.FC<AvatarDrawerProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const handleAvatarSelect = () => {
    onSelect();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop Blur */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* The Drawer Content */}
      <div className="relative w-full max-w-6xl h-[85vh] bg-white rounded-t-[40px] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
        {/* Drawer Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Select Actor
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Choose who will present your video
            </p>
          </div>

          {/* Filters Pill */}
          <div className="flex gap-2 bg-gray-100 p-1.5 rounded-full">
            <button className="px-4 py-2 bg-white rounded-full shadow-sm text-sm font-semibold text-gray-900">
              Talking Head
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-200/50">
              Gestures Only
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronDown className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          {/* Category: Featured */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Trending Avatars
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {/* Avatar Cards */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <div
                  key={item}
                  onClick={handleAvatarSelect}
                  className="group relative bg-white rounded-3xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-gray-100"
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200 relative mb-3">
                    <img
                      src={`https://i.pravatar.cc/300?img=${item + 10}`}
                      className="w-full h-full object-cover"
                      alt="Avatar"
                    />
                    {/* Hover Video Preview Icon */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 fill-black text-black ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="px-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900">Avatar {item}</h4>
                      <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        UGC
                      </span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div
                        className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"
                        title="Blue Shirt"
                      ></div>
                      <div
                        className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"
                        title="Casual"
                      ></div>
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
};

// --- MAIN DASHBOARD COMPONENT ---
function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const projectsRef = collection(db, 'projects');
      const q = query(
        projectsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Project[];

      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = () => {
    router.push('/create');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-green-100">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Ready
        </span>
      ),
      processing: (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse"></span>{' '}
          Processing
        </span>
      ),
      failed: (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-red-100">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Failed
        </span>
      ),
      draft: (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Draft
        </span>
      ),
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <>
      {/* --- MAIN CONTENT --- */}
      <div className="p-4 overflow-hidden h-full">
        <div className="bg-white h-full rounded-[40px] shadow-sm border border-gray-200/60 overflow-y-auto flex flex-col">
          {/* Header */}
          <header className="h-20 px-8 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur z-10">
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span className="hover:text-gray-900 cursor-pointer">Team Space</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">Overview</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-gray-200 outline-none w-64 placeholder-gray-400"
                />
              </div>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                <Bell className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </header>

          {/* Content Body */}
          <div className="p-8 max-w-7xl mx-auto w-full">
            <div className="mb-10">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Creator'}
              </h1>
              <p className="text-gray-500">
                Here is what's happening with your video campaigns today.
              </p>
            </div>

            {/* Stats Grid (Bento Style) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div
                className="bg-[#F9FAFB] p-6 rounded-[32px] border border-gray-100 relative overflow-hidden group hover:border-gray-300 transition-colors cursor-pointer"
                onClick={handleNewProject}
              >
                <div className="absolute right-6 top-6 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm text-gray-900 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="mt-20">
                  <h3 className="text-2xl font-bold text-gray-900">New Project</h3>
                  <p className="text-gray-500 mt-1">Create a video ad</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-lg shadow-gray-100/50">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-2 bg-gray-50 text-gray-600 rounded-xl">
                    <Video className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold bg-gray-50 px-2 py-1 rounded text-gray-500">
                    +{projects.filter((p) => p.status === 'completed').length} this week
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{projects.length}</div>
                <div className="text-sm text-gray-500 mt-1">Videos Generated</div>
              </div>

              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-lg shadow-gray-100/50">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-2 bg-gray-50 text-gray-600 rounded-xl">
                    <Mic className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{user?.credits || 0}</div>
                <div className="text-sm text-gray-500 mt-1">Credits Remaining</div>
              </div>
            </div>

            {/* Recent List */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Campaigns</h2>
              <button className="text-sm font-medium text-gray-500 hover:text-gray-900">
                View all
              </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full" />
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No projects yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Create your first video to get started
                  </p>
                  <button
                    onClick={handleNewProject}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Create First Project
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="py-4 px-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {projects.slice(0, 5).map((project, i) => (
                      <tr
                        key={project.id}
                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                        onClick={() => router.push(`/video/${project.id}`)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden">
                              {project.thumbnailUrl ? (
                                <img
                                  src={project.thumbnailUrl}
                                  className="w-full h-full object-cover"
                                  alt="Thumbnail"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                  <Video className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">
                              {project.scriptText.slice(0, 30)}
                              {project.scriptText.length > 30 && '...'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">{getStatusBadge(project.status)}</td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {project.type === 'talking_actor' ? 'Talking Head' : 'Gesture Only'}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {formatDate(project.createdAt)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button className="text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Render the Drawer Component */}
      <AvatarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelect={() => router.push('/create')}
      />
    </>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <DashboardContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
