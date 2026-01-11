"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import {
  Play,
  Upload,
  CheckCircle,
  Youtube,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  Video,
  Bell,
  Lock,
  Star,
  TrendingUp,
  Award,
  Globe,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: Upload,
      title: "Seamless Upload",
      desc: "Editors upload directly to your approval queue with zero friction.",
      color: "from-blue-500 to-cyan-500",
      glow: "shadow-blue-500/25",
    },
    {
      icon: CheckCircle,
      title: "Instant Approval",
      desc: "Review and approve videos with a single tap. Lightning fast.",
      color: "from-green-500 to-emerald-500",
      glow: "shadow-green-500/25",
    },
    {
      icon: Youtube,
      title: "Auto-Publish",
      desc: "Approved videos go live on YouTube automatically. Set it and forget it.",
      color: "from-red-500 to-pink-500",
      glow: "shadow-red-500/25",
    },
  ];

  const stats = [
    { value: "10K+", label: "Videos Processed", icon: Video },
    { value: "500+", label: "Active Creators", icon: Users },
    { value: "99.9%", label: "Uptime", icon: Shield },
    { value: "24/7", label: "Support", icon: Bell },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center"
      >
        {/* Dynamic Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(239, 68, 68, 0.15) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-gradient-to-r from-red-600/10 via-purple-600/10 to-blue-600/10 rounded-full blur-[150px] -z-10 animate-pulse" />

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-red-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-40 right-20 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"
        />

        <motion.div
          style={{ y, opacity }}
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-red-500/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-red-400" />
            </motion.div>
            <span className="text-sm font-semibold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              THE FUTURE OF CONTENT CREATION
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-9xl font-black mb-6 tracking-tight leading-none"
          >
            Your Content
            <br />
            <span className="gradient-text animate-pulse">Revolutionized</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            The ultimate bridge between creators and editors.
            <span className="text-red-400 font-semibold">
              {" "}
              Streamline your workflow
            </span>
            , amplify your reach, and focus on what matters most.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <Link
              href="/auth/signup"
              className="group btn-primary px-12 py-5 text-lg w-full sm:w-auto relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="#features"
              className="btn-secondary px-12 py-5 text-lg w-full sm:w-auto"
            >
              Explore Features
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-red-400 mr-2" />
                  <span className="text-3xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 relative max-w-6xl mx-auto"
          >
            <div className="glass rounded-[3rem] p-4 glow-red border border-white/10">
              <div className="aspect-video rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center overflow-hidden border border-white/5 relative">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-blue-500/5 animate-pulse" />

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative group cursor-pointer z-10"
                >
                  <div className="absolute inset-0 bg-red-600 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-red-500/50 transition-shadow">
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </div>
                </motion.div>

                {/* Floating particles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -20, 0],
                      x: [0, Math.random() * 40 - 20, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                    className="absolute w-2 h-2 bg-red-400 rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + i * 10}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-32 px-6 bg-gradient-to-b from-transparent to-white/[0.02]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Why Choose <span className="gradient-text">ApprovalHub</span>?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-xl max-w-3xl mx-auto"
            >
              Built for creators who demand excellence. Every feature designed
              to save time and boost productivity.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass p-8 rounded-3xl card-hover border border-white/5 group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 ${f.glow} group-hover:shadow-2xl transition-shadow`}
                >
                  <f.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {f.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Simple 4-Step <span className="gradient-text">Process</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-xl"
            >
              From concept to published video in record time.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                s: "01",
                t: "Invite Editor",
                i: Users,
                d: "Send secure invites to your trusted editors.",
                c: "from-blue-500 to-cyan-500",
              },
              {
                s: "02",
                t: "Editor Uploads",
                i: Video,
                d: "Videos appear instantly in your dashboard.",
                c: "from-purple-500 to-pink-500",
              },
              {
                s: "03",
                t: "Quick Review",
                i: Bell,
                d: "Approve or reject with one click.",
                c: "from-yellow-500 to-orange-500",
              },
              {
                s: "04",
                t: "Live on YouTube",
                i: Youtube,
                d: "Automatic publishing to your channel.",
                c: "from-red-500 to-pink-500",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-8 rounded-3xl relative overflow-hidden group border border-white/5"
              >
                <div className="text-7xl font-black text-white/5 absolute -top-4 -right-4 group-hover:text-red-500/10 transition-colors">
                  {step.s}
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.c} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <step.i className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{step.t}</h4>
                <p className="text-gray-400 leading-relaxed">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gradient-to-r from-red-900/10 to-purple-900/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 border border-red-500/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center"
            >
              <Star className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to <span className="gradient-text">Transform</span> Your
              Workflow?
            </h2>
            <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of creators who have streamlined their content
              production with ApprovalHub.
            </p>
            <Link
              href="/auth/signup"
              className="btn-primary px-12 py-4 text-lg inline-flex items-center gap-3"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
