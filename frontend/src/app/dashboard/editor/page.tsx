"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
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
  LayoutDashboard
} from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { videoAPI } from "@/lib/api";
import { isAuthenticated, getUserData, logout } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { MWareXLogo } from "@/components/mwarex-logo";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-primary/20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <MWareXLogo showText={false} className="scale-110" />
              <span className="text-xl font-bold tracking-tight hidden md:block">MWareX</span>
            </div>
            <div className="h-6 w-px bg-border/50 hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-secondary/50 rounded-lg">
                <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-none">Editor Workspace</h1>
                {userData && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                    {userData.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn-primary flex items-center gap-2 py-2.5 px-5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl"
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
          {/* Pending */}
          <div className="glass-card p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[100px]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-yellow-500 tracking-wider uppercase">Awaiting Review</span>
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <p className="text-4xl font-bold leading-none text-foreground">
                {videos.filter((v) => v.status === "pending").length}
              </p>
            </div>
          </div>

          {/* Approved */}
          <div className="glass-card p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[100px]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-emerald-500 tracking-wider uppercase">Approved</span>
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
              <p className="text-4xl font-bold leading-none text-foreground">
                {videos.filter((v) => v.status === "approved" || v.status === "uploaded").length}
              </p>
            </div>
          </div>

          {/* Rejected */}
          <div className="glass-card p-6 border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[100px]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-red-500 tracking-wider uppercase">Rejected</span>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <p className="text-4xl font-bold leading-none text-foreground">
                {videos.filter((v) => v.status === "rejected").length}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Recent Submissions</h2>
            <p className="text-sm text-muted-foreground">Manage and track your video delivery status.</p>
          </div>
          <button
            onClick={fetchVideos}
            className="text-muted-foreground hover:text-primary transition-colors p-2.5 rounded-full hover:bg-secondary border border-transparent hover:border-border"
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
                className="glass-card rounded-2xl aspect-video animate-pulse bg-secondary/50 border border-white/5"
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
          <div className="text-center py-20 border border-dashed border-border/50 rounded-3xl bg-secondary/5 relative overflow-hidden">

            {/* Subtle animated pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary to-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/10">
                <FileVideo className="w-8 h-8 text-primary/80" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No videos submitted yet
              </h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Start your workflow by uploading your first draft for review.</p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-outline border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5 px-8 py-3 rounded-xl transition-all"
              >
                Upload your first video
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Upload Modal - Premium Redesign */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-xl glass-card rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 dark:border-white/5 bg-[#0f0f10] text-foreground"
            >
              <div className="p-8 border-b border-white/5 bg-gradient-to-r from-secondary/20 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">Submit New Draft</h3>
                    <p className="text-sm text-muted-foreground">Send raw footage or edits to creator</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-8 space-y-6">
                {error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                      Video Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-secondary/30 border border-white/5 focus:border-primary/50 rounded-xl px-5 py-4 outline-none transition-all focus:bg-secondary/50 placeholder:text-muted-foreground/40 text-lg font-medium"
                      placeholder="E.g. My Amazing Travel Vlog - v1"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                      Description / Notes
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-secondary/30 border border-white/5 focus:border-primary/50 rounded-xl px-5 py-4 outline-none transition-all resize-none focus:bg-secondary/50 placeholder:text-muted-foreground/40"
                      placeholder="Add notes for the creator about this draft..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                    Video File
                  </label>
                  <div className="relative border-2 border-dashed border-white/10 hover:border-primary/30 rounded-2xl p-10 text-center transition-all group bg-secondary/5 hover:bg-secondary/10 cursor-pointer overflow-hidden">
                    <input
                      type="file"
                      accept="video/*"
                      required
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />

                    {/* Hover Pulse Effect */}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="relative z-0">
                      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                        <FileVideo className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors" />
                      </div>
                      <p className="text-lg text-foreground font-semibold mb-1 group-hover:text-primary transition-colors">
                        {file ? file.name : "Click to browse or drag file"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        MP4, MOV, or WEBM (Max 2GB)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={uploadLoading}
                    className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all font-bold text-lg hover:scale-[1.01] active:scale-[0.99]"
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
