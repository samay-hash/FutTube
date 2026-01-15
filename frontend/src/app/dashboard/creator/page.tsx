"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
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
  LayoutDashboard
} from "lucide-react";
import VideoCard from "@/components/VideoCard";
import { videoAPI, inviteAPI, getGoogleAuthUrl } from "@/lib/api";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const data = getUserData();
    if (!isAuthenticated() || !data) {
      router.push("/auth/signin");
      return;
    }
    setUserData(data);
    fetchVideos();
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
        style: "text-yellow-500",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        bar: "bg-yellow-500"
      },
      {
        label: "Ready to Publish",
        value: videos.filter((v) => v.status === "approved").length,
        icon: CheckCircle,
        style: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        bar: "bg-emerald-500"
      },
      {
        label: "Published",
        value: videos.filter((v) => v.status === "uploaded").length,
        icon: Youtube,
        style: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        bar: "bg-red-500"
      },
      {
        label: "Rejected",
        value: videos.filter((v) => v.status === "rejected").length,
        icon: XCircle,
        style: "text-muted-foreground",
        bg: "bg-secondary/50",
        border: "border-border/50",
        bar: "bg-muted-foreground"
      },
    ],
    [videos]
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">

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
          "fixed lg:relative inset-y-0 left-0 z-50 w-72 bg-card border-r border-border/50 flex flex-col shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out lg:translate-x-0 glass-card lg:bg-transparent lg:backdrop-filter-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Area */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <MWareXLogo showText={false} className="scale-100" />
            <span className="text-xl font-bold tracking-tight">MWareX</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground px-4 mb-2 uppercase tracking-wider">Menu</div>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium transition-colors border border-primary/10">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
          </button>

          <button
            onClick={() => { setIsInviteModalOpen(true); setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors group"
          >
            <Users className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span>Team Members</span>
          </button>

          <a
            href={getGoogleAuthUrl()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors group"
          >
            <Youtube className="w-5 h-5 group-hover:text-red-500 transition-colors" />
            <span>Integrations</span>
          </a>

          <div className="my-4 border-t border-white/5" />

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors group">
            <Settings className="w-5 h-5 group-hover:text-foreground transition-colors" />
            <span>Project Settings</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold shadow-md">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">
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
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative bg-background/50 selection:bg-primary/20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-secondary text-muted-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold hidden sm:block tracking-tight">Overview</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Welcome back, {userData?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-white/5 text-xs font-medium text-muted-foreground mr-2">
              <div className={`w-2 h-2 rounded-full ${videos.some(v => v.status === 'pending') ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`} />
              {videos.filter(v => v.status === 'pending').length} Actions Required
            </div>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="btn-primary flex items-center gap-2 py-2 px-4 shadow-lg shadow-primary/20 hover:shadow-primary/30 rounded-xl transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Invite Editor</span>
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className={cn("glass-card p-6 border relative overflow-hidden group hover:border-white/10 transition-colors", stat.border)}>
                <div className={cn("absolute top-0 left-0 w-1 h-full", stat.bar)} />
                <div className={cn("absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity", stat.bar.replace('bg-', 'bg-'))} />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div
                    className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", stat.bg, stat.border.replace('border-', 'border-opacity-50 '))}
                  >
                    <stat.icon className={cn("w-6 h-6", stat.style)} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-muted-foreground opacity-30 group-hover:opacity-50 transition-opacity" />
                </div>
                <div className="space-y-1 relative z-10">
                  <p className="text-4xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide text-[10px]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/30 border border-border focus:border-primary/50 text-foreground rounded-xl pl-12 pr-4 py-3 outline-none transition-all focus:bg-background shadow-sm"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar scroll-smooth">
              <button
                onClick={() => setActiveTab("pending")}
                className={cn(
                  "px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap border flex items-center gap-2",
                  activeTab === "pending"
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                    : "bg-background border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                Pending Review
                {videos.filter(v => v.status === 'pending').length > 0 &&
                  <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-[10px]">{videos.filter(v => v.status === 'pending').length}</span>
                }
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={cn(
                  "px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap border",
                  activeTab === "all"
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                    : "bg-background border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                All Videos
              </button>

              <button
                onClick={fetchVideos}
                className="ml-auto p-3 rounded-xl bg-secondary/30 border border-border text-muted-foreground hover:text-primary hover:bg-secondary hover:border-primary/30 transition-all"
              >
                <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
              </button>
            </div>
          </div>

          {/* Videos Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-[2rem] overflow-hidden animate-pulse border border-white/5">
                  <div className="aspect-video bg-secondary/50" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-secondary/50 rounded-lg w-3/4" />
                    <div className="h-4 bg-secondary/30 rounded-lg w-full" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-10 w-full bg-secondary/40 rounded-lg" />
                      <div className="h-10 w-full bg-secondary/40 rounded-lg" />
                    </div>
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
            <div className="text-center py-24 bg-gradient-to-b from-secondary/10 to-transparent border border-dashed border-white/10 rounded-[3rem]">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center border border-white/5">
                <VideoIcon className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No videos found</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                {activeTab === 'pending'
                  ? "You're all caught up! No pending reviews at the moment."
                  : "Try adjusting your search filters to find what you're looking for."}
              </p>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105"
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
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg glass-card rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 dark:border-white/5 bg-[#0f0f10] text-foreground"
            >
              <div className="p-8 pb-6 text-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-xl shadow-primary/10 border border-primary/20">
                  <Users className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold mb-2 tracking-tight">Invite Collaborator</h2>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Send a secure invite link to your editor to start collaborating.
                </p>
              </div>

              <div className="p-8">
                {!inviteLink ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Editor's Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full bg-secondary/30 border border-white/5 focus:border-primary/50 rounded-2xl pl-14 pr-6 py-4 outline-none transition-all focus:bg-secondary/50 text-lg font-medium placeholder:text-muted-foreground/30"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleInviteEditor}
                      disabled={!inviteEmail || isInviting}
                      className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-3 mt-4 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
                    >
                      {isInviting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Send Invite <ChevronRight className="w-5 h-5 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                      <div className="inline-flex items-center gap-3 text-emerald-500 font-bold mb-2 text-lg relative z-10">
                        <CheckCircle className="w-6 h-6" />
                        Invite Generated!
                      </div>
                      <p className="text-sm text-emerald-500/80 relative z-10">Use the link below to onboard your team.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Invite Link</label>
                      <div className="relative group">
                        <input
                          type="text"
                          value={inviteLink}
                          readOnly
                          className="w-full bg-secondary/50 border border-white/10 text-foreground font-mono text-sm rounded-xl pl-5 pr-28 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <button
                            onClick={copyInviteLink}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-white/10 hover:bg-white/5 transition-colors text-xs font-bold"
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
                    </div>

                    <button
                      onClick={() => {
                        setInviteLink("");
                        setInviteEmail("");
                        setIsInviteModalOpen(false);
                      }}
                      className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Close Window
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
