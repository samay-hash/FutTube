"use client";

import React, { useRef } from "react";
import { SiteHeader } from "@/components/site-header";
import { BlurReveal } from "@/components/BlurReveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BarChart2, Layers, Zap, CheckCircle2, Shield, Download, MessageCircle, Youtube, Users, GitBranch, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WorkflowAnimation } from "@/components/workflow-animation";
import { ScrollDoorSection } from "@/components/scroll-door-section";
import { ParticleButton } from "@/components/particle-button";

export default function LandingPage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    // Global Grid Background applied to the main wrapper
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-red-500/20 relative">

      {/* GLOBAL BACKGROUND: Net/Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.1] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
                 linear-gradient(to right, #808080 1px, transparent 1px),
                 linear-gradient(to bottom, #808080 1px, transparent 1px)
               `,
          backgroundSize: '50px 50px',
          // Radial fade out to make it feel like a spotlight in center
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)'
        }}
      />

      <SiteHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 md:px-12 pt-20 z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              v2.0 Live
            </motion.div>

            <div className="mb-8">
              <BlurReveal
                text="Zero Downloads."
                className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.9] tracking-tight block mb-2"
                delay={0.1}
              />
              <BlurReveal
                text="Zero Risk."
                className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.9] tracking-tight block italic text-muted-foreground/80 mb-2"
                delay={0.3}
              />
              <BlurReveal
                text="Pure Flow."
                className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.9] tracking-tight block text-primary"
                delay={0.5}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-2xl md:text-3xl font-medium mb-6 text-muted-foreground"
            >
              The middleware for professional creators.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-8 mt-12 w-full sm:w-auto items-center justify-start"
            >
              {/* Primary: Start Free Trial - Text with Particle Burst */}
              <ParticleButton
                onClick={() => {
                  setTimeout(() => router.push('/auth/signup'), 400); // Slight delay for effect
                }}
                className="text-lg font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 group tracking-tight"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </ParticleButton>

              {/* Secondary: See The Workflow - Muted Text with Particle Burst */}
              <ParticleButton
                onClick={() => {
                  const element = document.getElementById('workflow');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors tracking-tight"
              >
                See The Workflow
              </ParticleButton>
            </motion.div>
          </div>

          {/* Removed Right Visual Image as per request "remove that image on right side of 1st page" */}
        </div>
      </section>

      {/* Scroll Door Section (Transition to Workflow) - Restored as per "earlier ui" request */}
      <ScrollDoorSection>
        <BlurReveal text="The Invisible" className="text-4xl md:text-6xl font-serif font-bold mb-2" />
        <BlurReveal text="Approval Layer" className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6" delay={0.2} />
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          Enter a workspace where creativity flows without security risks.
        </p>
        <div className="mt-8">
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-primary to-transparent mx-auto animate-pulse" />
        </div>
      </ScrollDoorSection>


      {/* Connected Workflow Section (The Line Animation) */}
      <section id="workflow" className="relative z-0 min-h-[1200px]">
        <WorkflowAnimation />
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative z-10 bg-background/50 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">Built for Security & Speed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              The only platform that protects your channel while accelerating your production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="No Channel Access"
              description="Editors upload to our secure server. You keep your credentials safe forever."
              delay={0.1}
            />
            <FeatureCard
              icon={<Download className="w-6 h-6" />}
              title="Zero File Downloads"
              description="Stop wasting hours downloading 10GB renders. Review streams instantly."
              delay={0.2}
            />
            <FeatureCard
              icon={<MessageCircle className="w-6 h-6" />}
              title="WhatsApp Approval"
              description="Get notified on WhatsApp. Approve via a magic link without logging in."
              delay={0.3}
            />
            <FeatureCard
              icon={<Youtube className="w-6 h-6" />}
              title="Server-to-YouTube"
              description="Once APPROVED, we push the file 10x faster than home internet via API."
              delay={0.4}
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Secure Workspace"
              description="Isolated environments for every editor. Granular permissions control."
              delay={0.5}
            />
            <FeatureCard
              icon={<GitBranch className="w-6 h-6" />}
              title="Version Control"
              description="Track every change. Compare cuts side-by-side. Never lose progress."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border mt-20 relative bg-[#050505] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="text-xl font-serif font-bold flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
            </div>
            <span className="tracking-tight">FutTube.</span>
          </div>

          <div className="flex items-center gap-8">
            {['Terms', 'Privacy', 'Security', 'Contact'].map((item) => (
              <Link key={item} href="#" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="text-sm text-gray-500">© 2026 FutTube Inc. All locked down.</div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl glass border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 group shadow-lg"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}
