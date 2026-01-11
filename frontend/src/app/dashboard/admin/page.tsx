"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Play,
  Video,
  Users,
  Settings,
  LogOut,
  Search,
  RefreshCw,
  Shield,
  TrendingUp,
  Activity,
  Database,
  UserCheck,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
} from "lucide-react";
import { isAuthenticated, getUserData, logout } from "@/lib/auth";
import { videoAPI } from "@/lib/api";

interface Video {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "uploaded";
  creatorId?: string;
  editorId?: string;
  youtubeId?: string;
  createdAt: string;
}

interface User {
  _id: string;
  email: string;
  name?: string;
  role?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "videos" | "users" | "settings"
  >("overview");
  const [videos, setVideos] = useState<Video[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const userData = getUserData();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/signin");
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd have admin APIs to fetch all videos and users
      // For now, we'll simulate with pending videos
      const videosData = await videoAPI.getPending();
      setVideos(videosData.data);

      // Mock users data - in real app, fetch from admin API
      setUsers([
        {
          _id: "1",
          email: "creator@example.com",
          name: "John Creator",
          role: "creator",
          createdAt: "2024-01-01",
        },
        {
          _id: "2",
          email: "editor@example.com",
          name: "Jane Editor",
          role: "editor",
          createdAt: "2024-01-02",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const stats = [
    {
      label: "Total Videos",
      value: videos.length + 150, // Mock additional videos
      icon: Video,
      color: "text-blue-400",
      bgColor: "bg-blue-400/20",
    },
    {
      label: "Active Users",
      value: users.length + 45, // Mock additional users
      icon: Users,
      color: "text-green-400",
      bgColor: "bg-green-400/20",
    },
    {
      label: "System Health",
      value: "99.9%",
      icon: Activity,
      color: "text-purple-400",
      bgColor: "bg-purple-400/20",
    },
    {
      label: "Revenue",
      value: "$12.5K",
      icon: TrendingUp,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/20",
    },
  ];

  const filteredVideos = videos.filter(
    (video) =>
      video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Admin<span className="text-red-500">Panel</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "overview"
                ? "bg-red-500/20 text-red-400"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "videos"
                ? "bg-red-500/20 text-red-400"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Video className="w-5 h-5" />
            <span className="font-medium">All Videos</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "users"
                ? "bg-red-500/20 text-red-400"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">User Management</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === "settings"
                ? "bg-red-500/20 text-red-400"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-medium">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userData?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
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
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">
                System overview and management
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={fetchData}
                className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass rounded-2xl p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                        >
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        action: "New video uploaded",
                        user: "john@example.com",
                        time: "2 minutes ago",
                      },
                      {
                        action: "User registered",
                        user: "jane@example.com",
                        time: "15 minutes ago",
                      },
                      {
                        action: "Video approved",
                        user: "admin",
                        time: "1 hour ago",
                      },
                      {
                        action: "Editor invited",
                        user: "creator@example.com",
                        time: "2 hours ago",
                      },
                    ].map((activity, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white/5"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">
                            by {activity.user}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "videos" && (
              <motion.div
                key="videos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
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
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-500">All Videos</span>
                  </div>
                </div>

                {/* Videos Table */}
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-white/5">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium text-gray-400">
                            Video
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-gray-400">
                            Status
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-gray-400">
                            Creator
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-gray-400">
                            Created
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-gray-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVideos.map((video) => (
                          <tr
                            key={video._id}
                            className="border-b border-white/5 hover:bg-white/5"
                          >
                            <td className="p-4">
                              <div>
                                <p className="text-white font-medium">
                                  {video.title}
                                </p>
                                <p className="text-gray-500 text-sm">
                                  {video.description}
                                </p>
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  video.status === "pending"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : video.status === "approved"
                                    ? "bg-green-500/20 text-green-400"
                                    : video.status === "rejected"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-blue-500/20 text-blue-400"
                                }`}
                              >
                                {video.status}
                              </span>
                            </td>
                            <td className="p-4 text-gray-400">
                              {video.creatorId || "Unknown"}
                            </td>
                            <td className="p-4 text-gray-400">
                              {new Date(video.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-12 w-full"
                  />
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                    <div key={user._id} className="glass rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-medium">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {user.name || "No Name"}
                          </p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-red-500/20 text-red-400"
                              : user.role === "creator"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {user.role}
                        </span>
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">
                    System Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div>
                        <p className="text-white font-medium">
                          Maintenance Mode
                        </p>
                        <p className="text-gray-500 text-sm">
                          Temporarily disable user access
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div>
                        <p className="text-white font-medium">
                          Email Notifications
                        </p>
                        <p className="text-gray-500 text-sm">
                          Send system alerts to admins
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
