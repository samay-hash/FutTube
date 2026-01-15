"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Briefcase,
  PenTool,
  ShieldAlert,
} from "lucide-react";
import { authAPI, getGoogleAuthUrl } from "@/lib/api";
import { setToken, setUserRole, setUserData } from "@/lib/auth";
import { cn } from "@/lib/utils";

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
        router.push("/dashboard/creator");
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
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background text-foreground selection:bg-primary/20">

      {/* Global Grid Pattern (matching landing page) */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
                 linear-gradient(to right, #808080 1px, transparent 1px),
                 linear-gradient(to bottom, #808080 1px, transparent 1px)
               `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)'
        }}
      />

      <motion.div
        initial={{ opacity: 0, rotateX: 20, y: 100 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        style={{ perspective: 1000 }}
        className="w-full max-w-lg z-10"
      >
        <div
          className="glass-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative p-8 md:p-12 bg-white/5 dark:bg-black/40 backdrop-blur-2xl"
        >
          {/* Top "Hinge" or Highlight effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
              </div>
              <span className="text-2xl font-serif font-bold">FutTube.</span>
            </Link>
            <h1 className="text-3xl font-medium mb-3 tracking-tight">Create your account</h1>
            <p className="text-muted-foreground text-sm">Join the platform for modern creators.</p>
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
                  initial={{ opacity: 0, height: 0, scale: 0.9 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  className="bg-red-500/10 text-red-500 text-sm px-4 py-3 rounded-lg flex items-center gap-2 border border-red-500/20"
                >
                  <ShieldAlert className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {userType === "creator" && (
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=" "
                  id="name"
                  className="peer w-full bg-secondary/20 border border-white/5 focus:border-primary/50 rounded-xl px-4 pt-6 pb-2 outline-none transition-all placeholder-shown:pt-4 focus:bg-background/50"
                  required
                />
                <label htmlFor="name" className="absolute left-4 top-2 text-xs text-muted-foreground font-medium transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs">
                  Full Name
                </label>
              </div>
            )}

            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                id="email"
                className="peer w-full bg-secondary/20 border border-white/5 focus:border-primary/50 rounded-xl px-4 pt-6 pb-2 outline-none transition-all placeholder-shown:pt-4 focus:bg-background/50"
                required
              />
              <label htmlFor="email" className="absolute left-4 top-2 text-xs text-muted-foreground font-medium transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs">
                Email address
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  id="password"
                  className="peer w-full bg-secondary/20 border border-white/5 focus:border-primary/50 rounded-xl px-4 pt-6 pb-2 outline-none transition-all placeholder-shown:pt-4 focus:bg-background/50"
                  required
                />
                <label htmlFor="password" className="absolute left-4 top-2 text-xs text-muted-foreground font-medium transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs">
                  Password
                </label>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder=" "
                  id="confirm"
                  className="peer w-full bg-secondary/20 border border-white/5 focus:border-primary/50 rounded-xl px-4 pt-6 pb-2 outline-none transition-all placeholder-shown:pt-4 focus:bg-background/50"
                  required
                />
                <label htmlFor="confirm" className="absolute left-4 top-2 text-xs text-muted-foreground font-medium transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs">
                  Confirm
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 px-1">
              <input type="checkbox" className="rounded border-white/20 bg-secondary/20 text-primary focus:ring-primary/20 mt-1" required />
              <p className="text-xs text-muted-foreground leading-tight">
                By creating an account, you agree to our <Link href="/terms" className="text-foreground underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="text-foreground underline hover:text-primary">Privacy Policy</Link>.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-primary text-white font-medium hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] relative overflow-hidden group mt-4"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span className="relative z-10">Create Account</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-4">
            <button
              onClick={() => window.location.href = getGoogleAuthUrl()}
              className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-3 font-medium text-sm text-foreground"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Continue with Google
            </button>

            <p className="text-sm text-muted-foreground">
              Already have an account? <Link href="/auth/signin" className="text-foreground font-medium hover:text-primary transition-colors">Sign in</Link>
            </p>
          </div>

        </div>
      </motion.div>
    </main>
  );
}
