"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  RefreshCw,
  Upload,
  FileVideo,
  AlertCircle,
  Loader2,
  X,
  LogOut,
} from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { videoAPI } from "@/lib/api";
import { isAuthenticated, getUserData, logout } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

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
  const [userData, setUserData] = useState<{ id?: string; name?: string; email?: string } | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Client-side fix for hydration mismatches
    const data = getUserData();
    if (!isAuthenticated()) {
      router.push("/auth/signin");
      return;
    }
    setUserData(data);

    // Set associated creator info
    if (data?.creatorId) {
      setCreatorId(data.creatorId);
    }

    fetchVideos();
  }, [router]);


  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await videoAPI.getPending();
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

    if (!creatorId) {
      setError(
        "No creator associated with your account. Please contact support."
      );
      return;
    }

    setUploadLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("creatorId", creatorId);
    formData.append("editorId", userData?.id || "");

    try {
      await videoAPI.upload(formData);
      setIsUploadModalOpen(false);
      setTitle("");
      setDescription("");
      setFile(null);
      fetchVideos();
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Editor Workspace</h1>
              {userData && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online as {userData.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-primary flex items-center gap-2 py-2.5 px-5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">New Submission</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 border-l-4 border-yellow-500 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-yellow-500 tracking-wider">AWAITING REVIEW</span>
              <Clock className="w-5 h-5 text-yellow-500 opacity-80" />
            </div>
            <p className="text-4xl font-bold leading-none">
              {videos.filter((v) => v.status === "pending").length}
            </p>
          </div>
          <div className="glass-card p-6 border-l-4 border-emerald-500 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-emerald-500 tracking-wider">APPROVED</span>
              <CheckCircle className="w-5 h-5 text-emerald-500 opacity-80" />
            </div>
            <p className="text-4xl font-bold leading-none">
              {videos.filter((v) => v.status === "approved" || v.status === "uploaded").length}
            </p>
          </div>
          <div className="glass-card p-6 border-l-4 border-red-500 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-red-500 tracking-wider">REJECTED</span>
              <XCircle className="w-5 h-5 text-red-500 opacity-80" />
            </div>
            <p className="text-4xl font-bold leading-none">
              {videos.filter((v) => v.status === "rejected").length}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Recent Submissions</h2>
          <button
            onClick={fetchVideos}
            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-secondary"
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
                className="glass-card rounded-2xl aspect-video animate-pulse bg-secondary/50"
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
          <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-3xl bg-secondary/10">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <FileVideo className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No videos submitted yet
            </h3>
            <p className="text-muted-foreground mb-6">Start your workflow by uploading your first draft.</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
            >
              Upload your first video
            </button>
          </div>
        )}
      </main>

      {/* Upload Modal - Redesigned */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/10 dark:border-white/5 bg-background"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Submit New Draft</h3>
                    <p className="text-xs text-muted-foreground">Send to creator for review</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-6 space-y-5">
                {error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Video Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-secondary/30 border border-border focus:border-primary/50 rounded-xl px-4 py-3 outline-none transition-all focus:bg-background"
                    placeholder="E.g. My Amazing Travel Vlog - v1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Description / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-secondary/30 border border-border focus:border-primary/50 rounded-xl px-4 py-3 outline-none transition-all resize-none focus:bg-background"
                    placeholder="Add notes for the creator..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Video File
                  </label>
                  <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-8 text-center transition-colors group bg-secondary/10 hover:bg-secondary/20 cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      required
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                      <FileVideo className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-foreground font-medium mb-1">
                      {file ? file.name : "Click to browse or drag file"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MP4, MOV, or WEBM (Max 2GB)
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    disabled={uploadLoading}
                    className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-medium text-base"
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
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
