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
  ExternalLink
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="glass-card rounded-2xl overflow-hidden card-hover group flex flex-col h-full border border-border/40 hover:border-border/80 bg-card transition-all duration-300 shadow-sm hover:shadow-lg"
    >
      {/* Thumbnail */}
      <div
        className="relative aspect-video bg-muted/30 overflow-hidden cursor-pointer group/thumb"
        onClick={() => {
          if (video.status === "uploaded" && video.youtubeId) {
            window.open(`https://youtube.com/watch?v=${video.youtubeId}`, "_blank");
          } else {
            setIsVideoModalOpen(true);
          }
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform duration-500 group-hover/thumb:scale-110">
          <div className="w-14 h-14 rounded-full bg-background/20 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/thumb:bg-primary transition-colors shadow-2xl">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Video Preview / Placeholder Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted opacity-50" />
        {/* If we had a thumbnail URL, we would putting an <img> here */}

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
      <div className="p-5 flex-1 flex flex-col bg-card">
        <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {video.title || "Untitled Video"}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
          {video.description || "No description provided"}
        </p>

        <div className="mt-auto">
          {/* Actions - Creator View */}
          {showActions && video.status === "pending" && (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/40">
              <button
                onClick={(e) => { e.stopPropagation(); onApprove?.(video._id); }}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-medium border border-emerald-500/20 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onReject?.(video._id); }}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium border border-red-500/20 disabled:opacity-50"
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
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-600/10 text-red-600 hover:bg-red-600/20 transition-colors text-sm font-medium border border-red-600/20"
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
              className="relative max-w-5xl w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <video
                controls
                autoPlay
                className="w-full aspect-video bg-black"
                src={`http://localhost:5000/${video.fileUrl}`}
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
