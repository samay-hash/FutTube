"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Briefcase,
  PenTool,
  ShieldAlert,
  Layers,
} from "lucide-react";
import { authAPI, getGoogleAuthUrl } from "@/lib/api";
import { setToken, setUserRole, setUserData } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { NetworkMeshOverlay } from "@/components/ui/network-mesh-background";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"creator" | "editor">("creator");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      if (userType === "creator") {
        const response = await authAPI.userSignup({ email, password, name });
        const signinResponse = await authAPI.userSignin({ email, password });
        setToken(signinResponse.data.token);
        setUserRole("creator");
        setUserData({ email, name, id: response.data.user?._id });
        // Redirect to Pricing/Onboarding
        router.push("/onboarding/pricing");
      } else {
        const response = await authAPI.editorSignup({ email, password });
        const signinResponse = await authAPI.userSignin({ email, password });
        setToken(signinResponse.data.token);
        setUserRole("editor");
        setUserData({ email, id: response.data.user?._id });
        router.push("/dashboard/editor");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
        "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-background text-foreground overflow-hidden">

      {/* LEFT: Image Section */}
      <motion.div
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/assets/auth-bg.png"
          alt="Creator Workspace"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute bottom-16 left-12 max-w-lg z-10 text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl font-bold font-serif mb-6 leading-none tracking-tight"
          >
            Create.<br />Collaborate.<br />Conquer.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-white/70 text-lg leading-relaxed max-w-md"
          >
            The ultimate platform for modern creators to streamline workflow and scale production.
          </motion.p>
        </div>
      </motion.div>

      {/* RIGHT: Form Section */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 lg:p-12">
        <NetworkMeshOverlay />

        <motion.div
          className="w-full max-w-sm relative z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group hover:scale-105 transition-transform">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold">MWareX.</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Get Started</h1>
            <p className="text-muted-foreground">Create your account to start managing your channel.</p>
          </div>

          <div className="mb-8 p-1 bg-secondary/30 rounded-xl flex relative overflow-hidden">
            <motion.div
              className="absolute inset-y-1 bg-card shadow-sm rounded-lg"
              layoutId="roleTabSignup"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{
                width: '48%',
                left: userType === 'creator' ? '1%' : '51%'
              }}
            />
            <button
              onClick={() => setUserType('creator')}
              className={cn("flex-1 relative z-10 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2", userType === 'creator' ? "text-foreground" : "text-muted-foreground")}
            >
              <Briefcase className="w-4 h-4" /> Creator
            </button>
            <button
              onClick={() => setUserType('editor')}
              className={cn("flex-1 relative z-10 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2", userType === 'editor' ? "text-foreground" : "text-muted-foreground")}
            >
              <PenTool className="w-4 h-4" /> Editor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 text-red-500 text-sm px-4 py-3 rounded-lg flex items-center gap-2 border border-red-500/20 mb-4"
                >
                  <ShieldAlert className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {userType === "creator" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium ml-1 uppercase tracking-wider text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background/50 border border-border focus:border-primary/50 rounded-xl px-4 py-3 outline-none transition-all focus:ring-4 focus:ring-primary/5"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium ml-1 uppercase tracking-wider text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background/50 border border-border focus:border-primary/50 rounded-xl px-4 py-3 outline-none transition-all focus:ring-4 focus:ring-primary/5"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium ml-1 uppercase tracking-wider text-muted-foreground">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background/50 border border-border focus:border-primary/50 rounded-xl px-4 py-3 outline-none transition-all focus:ring-4 focus:ring-primary/5"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium ml-1 uppercase tracking-wider text-muted-foreground">Confirm</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-background/50 border border-border focus:border-primary/50 rounded-xl px-4 py-3 outline-none transition-all focus:ring-4 focus:ring-primary/5"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-primary text-white font-medium hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/40 text-center space-y-4">
            <button
              onClick={() => window.location.href = getGoogleAuthUrl()}
              className="w-full py-3 rounded-xl border border-input bg-background/50 hover:bg-secondary/50 transition-colors flex items-center justify-center gap-3 font-medium text-sm text-foreground"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Continue with Google
            </button>
            <p className="text-sm text-muted-foreground">
              Already have an account? <Link href="/auth/signin" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
