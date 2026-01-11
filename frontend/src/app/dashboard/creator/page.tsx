'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Video, 
  CheckCircle, 
  XCircle, 
  Youtube, 
  Clock, 
  Users, 
  Plus,
  Settings,
  Bell,
  LogOut,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Copy,
  Check,
  ExternalLink,
  TrendingUp,
  Upload
} from 'lucide-react';
import VideoCard from '@/components/VideoCard';
import { videoAPI, inviteAPI, getGoogleAuthUrl } from '@/lib/api';
import { isAuthenticated, getUserData, logout } from '@/lib/auth';

interface Video {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'uploaded';
  youtubeId?: string;
}

export default function CreatorDashboard() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const userData = getUserData();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    fetchVideos();
  }, [router]);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await videoAPI.getPending();
      setVideos(response.data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await videoAPI.approve(id);
      setVideos(videos.map(v => 
        v._id === id ? { ...v, status: 'uploaded' as const } : v
      ));
    } catch (error) {
      console.error('Failed to approve video:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await videoAPI.reject(id);
      setVideos(videos.map(v => 
        v._id === id ? { ...v, status: 'rejected' as const } : v
      ));
    } catch (error) {
      console.error('Failed to reject video:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleInviteEditor = async () => {
    if (!inviteEmail) return;
    setIsInviting(true);
    try {
      const response = await inviteAPI.sendInvite(inviteEmail);
      setInviteLink(response.data.inviteLink);
    } catch (error) {
      console.error('Failed to send invite:', error);
    } finally {
      setIsInviting(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || video.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = [
    { 
      label: 'Pending', 
      value: videos.filter(v => v.status === 'pending').length, 
      icon: Clock, 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20'
    },
    { 
      label: 'Approved', 
      value: videos.filter(v => v.status === 'approved').length, 
      icon: CheckCircle, 
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    { 
      label: 'Uploaded', 
      value: videos.filter(v => v.status === 'uploaded').length, 
      icon: Youtube, 
      color: 'text-red-400',
      bgColor: 'bg-red-400/20'
    },
    { 
      label: 'Rejected', 
      value: videos.filter(v => v.status === 'rejected').length, 
      icon: XCircle, 
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/20'
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/5 hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Approval<span className="text-red-500">Hub</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 text-red-400">
            <Video className="w-5 h-5" />
            <span className="font-medium">Videos</span>
          </button>
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Invite Editors</span>
          </button>
          <a
            href={getGoogleAuthUrl()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Youtube className="w-5 h-5" />
            <span className="font-medium">Connect YouTube</span>
          </a>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="font-medium">Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-medium">
              {userData?.name?.[0] || userData?.email?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userData?.name || 'Creator'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 glass border-b border-white/5">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-500 text-sm">Manage your video approvals</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Connect YouTube Button */}
              <a
                href={getGoogleAuthUrl()}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <Youtube className="w-4 h-4" />
                <span className="text-sm font-medium">Connect YouTube</span>
              </a>

              {/* Invite Button */}
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="btn-primary flex items-center gap-2 py-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Invite Editor</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchVideos}
                className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <div className="flex rounded-xl bg-white/5 p-1">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'pending'
                      ? 'bg-red-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'all'
                      ? 'bg-red-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  All
                </button>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-800 rounded w-3/4" />
                    <div className="h-4 bg-gray-800 rounded w-full" />
                    <div className="h-4 bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  showActions={video.status === 'pending'}
                  isLoading={actionLoading === video._id}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                <Video className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Videos Found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {activeTab === 'pending' 
                  ? "No pending videos to review. Invite editors to start uploading!"
                  : "No videos match your search criteria."
                }
              </p>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Invite an Editor
              </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80"
            onClick={() => setIsInviteModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-3xl p-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Invite an Editor</h2>
                <p className="text-gray-400">
                  Send an invite link to collaborate with your video editor
                </p>
              </div>

              {!inviteLink ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Editor&apos;s Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="editor@example.com"
                        className="input-field pl-12"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleInviteEditor}
                    disabled={!inviteEmail || isInviting}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                  >
                    {isInviting ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Send Invite
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Invite Created!</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Share this link with your editor to get started.
                    </p>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="input-field pr-24 text-sm"
                    />
                    <button
                      onClick={copyInviteLink}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-sm text-white hover:bg-white/20 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setInviteLink('');
                      setInviteEmail('');
                      setIsInviteModalOpen(false);
                    }}
                    className="w-full btn-secondary py-4"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
