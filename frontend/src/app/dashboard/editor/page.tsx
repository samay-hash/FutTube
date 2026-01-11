"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Play,
  Video,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Search,
  RefreshCw,
  Upload,
  FileVideo,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { videoAPI } from "@/lib/api";
import { isAuthenticated, getUserData } from "@/lib/auth";

interface Video {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected" | "uploaded";
}

export default function EditorDashboard() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [creatorId, setCreatorId] = useState<string>("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const userData = getUserData();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/signin");
      return;
    }
    fetchCreatorId();
    fetchVideos();
  }, [router]);

  const fetchCreatorId = async () => {
    // Mock: In real app, fetch from API based on current user
    setCreatorId("67828c89c890f5b90558a23c"); // Mock creator ID
  };

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await videoAPI.getPending();
      // In a real app, you'd filter by editorId on the backend
      setVideos(response.data);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setUploadLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("creatorId", creatorId);

    try {
      await videoAPI.upload(formData);
      setIsUploadModalOpen(false);
      setTitle("");
      setDescription("");
      setFile(null);
      fetchVideos();
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Editor Panel</h1>
              <p className="text-xs text-gray-500">
                Welcome back, {userData?.name || "Editor"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-primary flex items-center gap-2 py-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Submission</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-center mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-xs text-gray-500 font-medium">
                AWAITING REVIEW
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {videos.filter((v) => v.status === "pending").length}
            </p>
          </div>
          <div className="glass rounded-2xl p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-xs text-gray-500 font-medium">
                APPROVED
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {
                videos.filter(
                  (v) => v.status === "approved" || v.status === "uploaded"
                ).length
              }
            </p>
          </div>
          <div className="glass rounded-2xl p-6 border-l-4 border-red-500">
            <div className="flex justify-between items-center mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-xs text-gray-500 font-medium">
                REJECTED
              </span>
            </div>
            <p className="text-3xl font-bold text-white">
              {videos.filter((v) => v.status === "rejected").length}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Submissions</h2>
          <button
            onClick={fetchVideos}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <RefreshCw
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass rounded-2xl aspect-video animate-pulse bg-white/5"
              />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
            <FileVideo className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400">
              No videos submitted yet
            </h3>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 text-red-500 hover:text-red-400 font-medium"
            >
              Upload your first video
            </button>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass max-w-xl w-full rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Submit New Video
                </h3>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">
                    Video Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    placeholder="E.g. My Amazing Travel Vlog"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field resize-none py-3"
                    placeholder="YouTube description, tags, etc."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">
                    Video File
                  </label>
                  <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-red-500/30 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      required
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">
                      {file ? (
                        <span className="text-red-400 font-medium">
                          {file.name}
                        </span>
                      ) : (
                        "Click to select or drag and drop video file"
                      )}
                    </p>
                  </div>
                </div>

                <button
                  disabled={uploadLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 mt-4"
                >
                  {uploadLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Submission
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
