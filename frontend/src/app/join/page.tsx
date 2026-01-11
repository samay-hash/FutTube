"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Play,
  Users,
  CheckCircle,
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  XCircle,
} from "lucide-react";
import { inviteAPI, authAPI } from "@/lib/api";
import { setToken, setUserRole, setUserData } from "@/lib/auth";

function JoinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [step, setStep] = useState<"verifying" | "signup" | "error">(
    "verifying"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await authAPI.editorSignup({ email, password });
      const signinRes = await authAPI.userSignin({ email, password });

      setToken(signinRes.data.token);
      setUserRole("editor");
      setUserData({ email });

      router.push("/dashboard/editor");
    } catch (err) {
      setError("Signup failed. Account might already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass max-w-md w-full rounded-3xl p-8 relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        {step === "verifying" && (
          <div className="text-center py-8">
            <Loader2 className="w-10 h-10 animate-spin text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Verifying Invitation
            </h2>
            <p className="text-gray-400">
              Please wait while we validate your link...
            </p>
          </div>
        )}

        {step === "signup" && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Join as an Editor
              </h2>
              <p className="text-gray-400">
                Complete your signup to start collaborating
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="input-field pl-12 opacity-60 grayscale cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Set Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-12"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button className="w-full btn-primary flex items-center justify-center gap-2 py-4 mt-6">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Accept & Join <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {step === "error" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Invalid Invite
            </h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="btn-secondary w-full"
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
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <Loader2 className="animate-spin text-red-500" />
        </div>
      }
    >
      <JoinContent />
    </Suspense>
  );
}
