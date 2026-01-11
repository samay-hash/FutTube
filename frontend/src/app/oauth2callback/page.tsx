'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

function OAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  useEffect(() => {
    if (accessToken) {
      // In a real app, you'd send these to your backend to store securely
      // For now, we'll store them in localStorage for demonstration
      localStorage.setItem('youtube_access_token', accessToken);
      if (refreshToken) localStorage.setItem('youtube_refresh_token', refreshToken);
      
      // Short delay to show success UI
      setTimeout(() => {
        router.push('/dashboard/creator');
      }, 2000);
    } else {
        router.push('/dashboard/creator?error=oauth_failed');
    }
  }, [accessToken, refreshToken, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20" />
            <div className="relative w-full h-full bg-red-600 rounded-full flex items-center justify-center">
                <Youtube className="w-12 h-12 text-white" />
            </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Connecting YouTube...</h2>
        <p className="text-gray-400 mb-8">Harmonizing your channel credentials safely.</p>

        <div className="flex items-center justify-center gap-3 text-red-500 font-medium">
            <Loader2 className="w-5 h-5 animate-spin" />
            Finalizing connection
        </div>
      </motion.div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthContent />
    </Suspense>
  );
}
