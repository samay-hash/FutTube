'use client';

import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle, XCircle, Youtube, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    description: string;
    fileUrl: string;
    status: 'pending' | 'approved' | 'rejected' | 'uploaded';
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
  isLoading = false 
}: VideoCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusIcon = () => {
    switch (video.status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'uploaded':
        return <Youtube className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = () => {
    switch (video.status) {
      case 'pending':
        return 'badge-pending';
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      case 'uploaded':
        return 'badge-uploaded';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden card-hover group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`badge ${getStatusBadgeClass()} flex items-center gap-1.5`}>
            {getStatusIcon()}
            {video.status}
          </span>
        </div>

        {/* Menu Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {video.title || 'Untitled Video'}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {video.description || 'No description provided'}
        </p>

        {/* Actions */}
        {showActions && video.status === 'pending' && (
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button
              onClick={() => onApprove?.(video._id)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Approve</span>
            </button>
            <button
              onClick={() => onReject?.(video._id)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Reject</span>
            </button>
          </div>
        )}

        {/* YouTube Link for uploaded videos */}
        {video.status === 'uploaded' && video.youtubeId && (
          <div className="pt-4 border-t border-white/5">
            <a
              href={`https://youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <Youtube className="w-4 h-4" />
              <span className="text-sm font-medium">View on YouTube</span>
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}
