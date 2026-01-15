"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  XCircle,
} from "lucide-react";
import { inviteAPI, authAPI } from "@/lib/api";
import { setToken, setUserRole, setUserData } from "@/lib/auth";
import { MWareXLogo } from "@/components/mwarex-logo";
import { NetworkMeshOverlay } from "@/components/ui/network-mesh-background";
import { cn } from "@/lib/utils";

function JoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [step, setStep] = useState<"verifying" | "signup" | "error">(
    "verifying"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creatorId, setCreatorId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStep("error");
      setError("Missing invitation token.");
      return;
    }

    const verify = async () => {
      try {
        const res = await inviteAPI.verifyInvite(token);
        setEmail(res.data.email);
        setCreatorId(res.data.creatorId);
        setStep("signup");
      } catch (err) {
        setStep("error");
        setError("Invalid or expired invitation link.");
      }
    };
    verify();
  }, [token]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const signupRes = await authAPI.userSignup({
        email,
        password,
        name,
        creatorId,
        role: "editor",
      });

      const signinRes = await authAPI.userSignin({ email, password });

      setToken(signinRes.data.token);
      setUserRole("editor");
      setUserData({ email, id: signupRes.data.user._id, creatorId });

      router.push("/dashboard/editor");
    } catch (err) {
      setError("Signup failed. Account might already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <NetworkMeshOverlay />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card max-w-md w-full rounded-[2rem] p-8 md:p-10 relative z-10 border border-border/40 bg-card/60 backdrop-blur-2xl shadow-2xl"
      >
        <div className="flex justify-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-border/10"
          >
            <MWareXLogo className="scale-125" showText={true} />
          </motion.div>
        </div>

        {step === "verifying" && (
          <div className="text-center py-8">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-6" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Verifying Invitation
            </h2>
            <p className="text-muted-foreground">
              Please wait while we validate your secure link...
            </p>
          </div>
        )}

        {step === "signup" && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Join Workspace
              </h2>
              <p className="text-muted-foreground text-sm">
                Complete your editor profile to start collaborating.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Users className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Alex Smith"
                    className="w-full bg-secondary/30 border border-border/40 focus:border-primary/50 text-foreground rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all placeholder:text-muted-foreground/50 hover:bg-secondary/50 focus:bg-secondary/60 focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-secondary/20 border border-border/20 text-muted-foreground rounded-xl py-3.5 pl-12 pr-4 outline-none cursor-not-allowed opacity-75"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
                  Set Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-secondary/30 border border-border/40 focus:border-primary/50 text-foreground rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all placeholder:text-muted-foreground/50 hover:bg-secondary/50 focus:bg-secondary/60 focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center font-medium"
                >
                  {error}
                </motion.div>
              )}

              <button className="w-full btn-primary group relative overflow-hidden py-4 rounded-xl mt-6 font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Accept & Join Workspace <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </>
        )}

        {step === "error" && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Invalid Invite
            </h2>
            <p className="text-muted-foreground mb-8 text-sm max-w-[260px] mx-auto leading-relaxed">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="btn-secondary w-full py-3 rounded-xl hover:bg-secondary/80 border border-border/40"
            >
              Back to Home
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center relative">
          <NetworkMeshOverlay />
          <Loader2 className="w-8 h-8 animate-spin text-primary relative z-10" />
        </div>
      }
    >
      <JoinContent />
    </Suspense>
  );
}
