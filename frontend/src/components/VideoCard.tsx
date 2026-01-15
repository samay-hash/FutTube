"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  Clock,
  CheckCircle,
  XCircle,
  Youtube,
  MoreVertical,
  X,
  ExternalLink,
  AlertTriangle,
  FileVideo
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    description: string;
    fileUrl: string;
    status: "pending" | "approved" | "rejected" | "uploaded";
    creatorId?: string;
    editorId?: string;
    youtubeId?: string;
  };
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
  isLoading?: boolean;
}

export default function VideoCard({
  video,
  onApprove,
  onReject,
  showActions = false,
  isLoading = false,
}: VideoCardProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const getStatusIcon = () => {
    switch (video.status) {
      case "pending": return <Clock className="w-3.5 h-3.5" />;
      case "approved": return <CheckCircle className="w-3.5 h-3.5" />;
      case "rejected": return <XCircle className="w-3.5 h-3.5" />;
      case "uploaded": return <Youtube className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const getStatusBadgeClass = () => {
    switch (video.status) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "approved": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "uploaded": return "bg-red-600/10 text-red-600 border-red-600/20";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  const getLabel = () => {
    switch (video.status) {
      case "pending": return "Review Pending";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "uploaded": return "On YouTube";
      default: return video.status;
    }
  }

  // Helper to construct the full video URL
  const getVideoUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob")) return path;

    // Cleanup path separators
    const cleanPath = path.replace(/\\/g, "/");
    // CRITICAL FIX: Use port 8000 to match backend, instead of 5000
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // Ensure one slash between base and path
    const safeBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const safePath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

    return `${safeBase}${safePath}`;
  };

  const videoUrl = getVideoUrl(video.fileUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="glass-card rounded-2xl overflow-hidden card-hover group flex flex-col h-full border border-border/40 hover:border-border/80 bg-card transition-all duration-300 shadow-sm hover:shadow-lg"
    >
      {/* Thumbnail / Video Preview Area */}
      <div
        className="relative aspect-video bg-muted/30 overflow-hidden cursor-pointer group/thumb"
        onClick={() => {
          if (video.status === "uploaded" && video.youtubeId) {
            window.open(`https://youtube.com/watch?v=${video.youtubeId}`, "_blank");
          } else {
            // Reset error state when reopening to retry
            setVideoError(false);
            setIsVideoModalOpen(true);
          }
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform duration-500 group-hover/thumb:scale-110">
          <div className="w-14 h-14 rounded-full bg-background/20 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/thumb:bg-primary transition-colors shadow-2xl">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted opacity-50 transition-opacity group-hover/thumb:opacity-40" />

        {/* Placeholder Icon if no thumbnail (could check if videoError here too if we tried to preload) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <FileVideo className="w-20 h-20" />
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 shadow-sm",
            getStatusBadgeClass()
          )}>
            {getStatusIcon()}
            {getLabel()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col bg-card/50">
        <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {video.title || "Untitled Video"}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed h-10">
          {video.description || "No description provided"}
        </p>

        <div className="mt-auto">
          {/* Actions - Creator View */}
          {showActions && video.status === "pending" && (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/40">
              <button
                onClick={(e) => { e.stopPropagation(); onApprove?.(video._id); }}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs font-bold uppercase tracking-wide border border-emerald-500/20 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onReject?.(video._id); }}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors text-xs font-bold uppercase tracking-wide border border-red-500/20 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}

          {/* YouTube Link - Uploaded status */}
          {video.status === "uploaded" && video.youtubeId && (
            <div className="pt-4 border-t border-border/40">
              <button
                onClick={(e) => { e.stopPropagation(); window.open(`https://youtube.com/watch?v=${video.youtubeId}`, "_blank"); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600/10 text-red-600 hover:bg-red-600/20 transition-colors text-sm font-medium border border-red-600/20"
              >
                <Youtube className="w-4 h-4" />
                Watch on YouTube
                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-5xl w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-primary transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>

              {!videoError ? (
                <video
                  controls
                  autoPlay
                  className="w-full aspect-video bg-black"
                  src={videoUrl}
                  onError={(e) => {
                    console.error("Video playback error", e);
                    setVideoError(true);
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full aspect-video flex flex-col items-center justify-center bg-zinc-900 text-center p-6">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Unavailable to Play</h3>
                  <p className="text-zinc-400 text-sm max-w-md">
                    We couldn't load the video from <span className="font-mono bg-black/50 px-1 py-0.5 rounded text-xs text-red-400 break-all">{videoUrl}</span>.
                  </p>
                  <p className="text-zinc-500 text-xs mt-4">
                    Troubleshooting:
                    <br />1. Is the backend server running on port 8000?
                    <br />2. Try re-uploading the video (older uploads might be missing extensions).
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
