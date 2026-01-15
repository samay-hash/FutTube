"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Play,
  CheckCircle,
  XCircle,
  Youtube,
  Clock,
  Users,
  Plus,
  Settings,
  Bell,
  LogOut,
  Search,
  RefreshCw,
  Mail,
  Copy,
  Check,
  TrendingUp,
  Video as VideoIcon,
  Menu,
  ChevronRight,
  Loader2,
} from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { videoAPI, inviteAPI, getGoogleAuthUrl } from "@/lib/api";
import { isAuthenticated, getUserData, logout } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface Video {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected" | "uploaded";
  youtubeId?: string;
}

export default function CreatorDashboard() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [avatarLetter, setAvatarLetter] = useState("U");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

  const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    // Check auth and load user data only on client side to avoid hydration mismatch
    const data = getUserData();
    if (!isAuthenticated() || !data) {
      router.push("/auth/signin");
      return;
    }
    setUserData(data);

    fetchVideos();

    // Set avatar letter
    const letter = data?.name?.[0] || data?.email?.[0] || "U";
    setAvatarLetter(letter);
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

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await videoAPI.approve(id);
      await fetchVideos();
    } catch (error) {
      console.error("Failed to approve video:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await videoAPI.reject(id);
      setVideos(
        videos.map((v) =>
          v._id === id ? { ...v, status: "rejected" as const } : v
        )
      );
    } catch (error) {
      console.error("Failed to reject video:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleInviteEditor = async () => {
    if (!inviteEmail) return;
    setIsInviting(true);
    try {
      const response = await inviteAPI.sendInvite(inviteEmail);
      setInviteLink(response.data.inviteLink);
    } catch (error) {
      console.error("Failed to send invite:", error);
    } finally {
      setIsInviting(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        video.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || video.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [videos, searchQuery, activeTab]);

  const stats = useMemo(
    () => [
      {
        label: "Pending Review",
        value: videos.filter((v) => v.status === "pending").length,
        icon: Clock,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
      },
      {
        label: "Ready to Publish",
        value: videos.filter((v) => v.status === "approved").length,
        icon: CheckCircle,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
      },
      {
        label: "Published",
        value: videos.filter((v) => v.status === "uploaded").length,
        icon: Youtube,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
      },
      {
        label: "Rejected",
        value: videos.filter((v) => v.status === "rejected").length,
        icon: XCircle,
        color: "text-muted-foreground",
        bgColor: "bg-secondary/50",
        borderColor: "border-border/50",
      },
    ],
    [videos]
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-card border-r border-border/50 flex flex-col shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
              <Youtube className="w-5 h-5 fill-current" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Fut<span className="text-primary">Tube</span>
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground px-4 mb-2 uppercase tracking-wider">Menu</div>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium transition-colors">
            <VideoIcon className="w-5 h-5" />
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
          </button>

          <button
            onClick={() => { setIsInviteModalOpen(true); setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Team Members</span>
          </button>

          <a
            href={getGoogleAuthUrl()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Youtube className="w-5 h-5" />
            <span>Integrations</span>
          </a>

          <div className="my-4 border-t border-border/50" />

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
            <span>Project Settings</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-medium shadow-md">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userData?.name || "Creator"}
              </p>
              <p className="text-xs text-muted-foreground truncate opacity-80">
                {userData?.email}
              </p>
            </div>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-background/50 relative">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-secondary text-muted-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold hidden sm:block">Overview</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="btn-primary flex items-center gap-2 py-2 px-4 shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Invite Editor</span>
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className={cn("glass-card p-5 border", stat.borderColor)}>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bgColor)}
                  >
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-muted-foreground opacity-50" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/30 border border-border focus:border-primary/50 text-foreground rounded-xl pl-12 pr-4 py-3 outline-none transition-all focus:bg-background"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
              <button
                onClick={() => setActiveTab("pending")}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                  activeTab === "pending"
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                    : "bg-background border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                Pending Review
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                  activeTab === "all"
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                    : "bg-background border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                All Videos
              </button>

              <button
                onClick={fetchVideos}
                className="ml-auto p-2.5 rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
              </button>
            </div>
          </div>

          {/* Videos Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-secondary/50" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-secondary/50 rounded w-3/4" />
                    <div className="h-4 bg-secondary/30 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  showActions={video.status === "pending"}
                  isLoading={actionLoading === video._id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-secondary/5 border-2 border-dashed border-border rounded-3xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center">
                <VideoIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No videos found</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                {activeTab === 'pending'
                  ? "You have no pending videos review. Invite your editor to get started."
                  : "Try adjusting your search filters to find what you're looking for."}
              </p>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2 px-6 py-3"
              >
                <Plus className="w-5 h-5" />
                Invite Editor
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Invite Editor Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/10 dark:border-white/5 bg-background text-foreground"
            >
              <div className="p-8 pb-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                  <Users className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Invite Collaborator</h2>
                <p className="text-muted-foreground text-sm px-4">
                  Send an invite link to your video editor to start collaborating immediately.
                </p>
              </div>

              <div className="p-8 pt-2">
                {!inviteLink ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium ml-1">Editor's Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-secondary/30 border border-border focus:border-primary/50 rounded-xl pl-12 pr-4 py-3 outline-none transition-all focus:bg-background"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleInviteEditor}
                      disabled={!inviteEmail || isInviting}
                      className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2"
                    >
                      {isInviting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Send Invite <ChevronRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                        <CheckCircle className="w-5 h-5" />
                        Invite Generated!
                      </div>
                      <p className="text-xs text-muted-foreground">Link generated successfully.</p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block ml-1">Invite Link</label>
                      <div className="relative group">
                        <input
                          type="text"
                          value={inviteLink}
                          readOnly
                          className="w-full bg-secondary/50 border border-border text-foreground text-sm rounded-xl pl-4 pr-24 py-3 outline-none"
                        />
                        <button
                          onClick={copyInviteLink}
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border shadow-sm hover:bg-secondary transition-colors text-xs font-medium"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setInviteLink("");
                        setInviteEmail("");
                        setIsInviteModalOpen(false);
                      }}
                      className="w-full py-3.5 rounded-xl border border-border hover:bg-secondary/50 transition-colors font-medium text-muted-foreground"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
