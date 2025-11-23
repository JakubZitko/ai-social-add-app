'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  Search,
  Filter,
  MoreVertical,
  Play,
  Download,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Calendar,
  Video,
  Eye,
} from 'lucide-react';
import { getUserProjects, deleteProject } from '@/lib/firestore/projects';
import { Project } from '@/lib/firestore/types';
import { demoProjectsForList } from '@/lib/data/demoData';
import { useToast } from '@/components/ui/Toast';

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ProjectsContent />
      </AppLayout>
    </ProtectedRoute>
  );
}

function ProjectsContent() {
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'processing' | 'failed' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Fetch user projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const userProjects = await getUserProjects(user.uid);

        // Use demo data if no projects found
        if (userProjects.length === 0) {
          console.log('No projects in database, using demo data');
          setProjects(demoProjectsForList as any);
        } else {
          setProjects(userProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Use demo data on error
        console.log('Error fetching projects, using demo data');
        setProjects(demoProjectsForList as any);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      case 'processing':
        return <Loader className="h-4 w-4 text-gray-600 animate-spin" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'draft':
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
      case 'draft':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return '';
    }
  };

  const filteredProjects = projects
    .filter((project) => {
      if (filterStatus !== 'all' && project.status !== filterStatus) return false;
      if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt.getTime() - a.createdAt.getTime();
      if (sortBy === 'oldest') return a.createdAt.getTime() - b.createdAt.getTime();
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

  const stats = {
    total: projects.length,
    completed: projects.filter((p) => p.status === 'completed').length,
    processing: projects.filter((p) => p.status === 'processing').length,
    failed: projects.filter((p) => p.status === 'failed').length,
  };

  const handleDeleteProject = (id: string) => {
    setProjectToDelete(id);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      // Check if it's a demo project
      if (projectToDelete.startsWith('demo_')) {
        setProjects(projects.filter((p) => p.id !== projectToDelete));
        toast.success('Project Deleted', 'The project has been removed');
      } else {
        await deleteProject(projectToDelete);
        setProjects(projects.filter((p) => p.id !== projectToDelete));
        toast.success('Project Deleted', 'The project has been removed');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Delete Failed', 'Please try again');
    } finally {
      setProjectToDelete(null);
    }
  };

  const handleDownloadVideo = async (videoUrl: string, title: string) => {
    if (!videoUrl) {
      toast.error('Download Failed', 'Video URL not available');
      return;
    }

    try {
      toast.info('Downloading...', 'Your video download has started');

      // Fetch the video file
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_')}.mp4`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Download Complete', 'Your video has been downloaded');
    } catch (error) {
      console.error('Error downloading video:', error);
      toast.error('Download Failed', 'Please try again');
    }
  };

  const handleRetryGeneration = async (projectId: string) => {
    if (!user) return;

    try {
      toast.info('Retrying...', 'Restarting video generation');

      const token = await user.getIdToken();

      const response = await fetch(`/api/video/retry/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to retry generation');
      }

      // Update project status locally
      setProjects(projects.map(p =>
        p.id === projectId ? { ...p, status: 'processing' as const } : p
      ));

      toast.success('Generation Restarted', 'Your video is being processed');

      // Redirect to video status page
      router.push(`/video/${projectId}`);
    } catch (error: any) {
      console.error('Error retrying generation:', error);
      toast.error('Retry Failed', error.message || 'Please try again');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">Manage and organize all your video projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-[24px] p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Total Projects</div>
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Completed</div>
                <div className="text-3xl font-bold text-gray-900">{stats.completed}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <Loader className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Processing</div>
                <div className="text-3xl font-bold text-gray-900">{stats.processing}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-[24px] p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Failed</div>
                <div className="text-3xl font-bold text-gray-900">{stats.failed}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm font-medium"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100">
            <Loader className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading projects...</h3>
            <p className="text-gray-600">Please wait while we fetch your videos</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100">
            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first video project to get started'}
            </p>
            <button
              onClick={() => router.push('/create')}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Create New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Play Button Overlay */}
                  {project.status === 'completed' && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <button
                        onClick={() => router.push(`/video/${project.id}`)}
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl hover:scale-110 transform"
                      >
                        <Play className="h-8 w-8 text-gray-900 ml-1" />
                      </button>
                    </div>
                  )}
                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold">
                    {formatDuration(project.duration)}
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span className="capitalize">{project.status}</span>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{project.title}</h3>

                  {/* Project Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{project.createdAt.toLocaleDateString()}</span>
                    </div>
                    {project.status === 'completed' && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span>{project.views.toLocaleString()} views</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    {project.status === 'completed' && (
                      <>
                        <button
                          onClick={() => router.push(`/video/${project.id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadVideo(project.videoUrl || '', project.title)}
                          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                          title="Download video"
                        >
                          <Download className="h-5 w-5 text-gray-600" />
                        </button>
                      </>
                    )}
                    {project.status === 'failed' && (
                      <button
                        onClick={() => handleRetryGeneration(project.id)}
                        className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Retry Generation
                      </button>
                    )}
                    {project.status === 'draft' && (
                      <button
                        onClick={() => router.push(`/create?draft=${project.id}`)}
                        className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                      >
                        Continue Editing
                      </button>
                    )}
                    {project.status === 'processing' && (
                      <div className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-sm font-semibold text-center">
                        Processing...
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
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

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Project?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setProjectToDelete(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProject}
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
