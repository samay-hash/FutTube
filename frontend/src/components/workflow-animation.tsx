"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Upload, FileVideo, CheckCircle2, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkflowAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div ref={containerRef} className="relative w-full max-w-7xl mx-auto py-20 px-4 min-h-[1400px] flex flex-col items-center">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-24 relative z-20"
            >
                <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4">Connected Pipeline</h2>
                <p className="text-muted-foreground text-lg">A live audit trail from upload to publish.</p>
            </motion.div>

            {/* The Connection Layer (SVG) */}
            <div className="absolute top-[280px] left-0 right-0 bottom-0 z-0 hidden md:block pointer-events-none">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="pipelineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" /> {/* Red start */}
                            <stop offset="50%" stopColor="#f97316" /> {/* Orange mid */}
                            <stop offset="100%" stopColor="#ef4444" /> {/* Red end */}
                        </linearGradient>

                        <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Base Line */}
                    <motion.path
                        d="M 50% 0 
                     C 50% 150, 65% 150, 65% 300
                     L 65% 300
                     C 65% 450, 35% 450, 35% 600
                     L 35% 600
                     L 35% 900"
                        fill="none"
                        strokeWidth="3"
                        stroke="currentColor"
                        className="text-muted/10 opacity-20"
                        strokeLinecap="round"
                    />

                    {/* Animated Line */}
                    <motion.path
                        d="M 50% 0 
                     C 50% 150, 65% 150, 65% 300
                     L 65% 300
                     C 65% 450, 35% 450, 35% 600
                     L 35% 600
                     L 35% 900"
                        fill="none"
                        strokeWidth="3"
                        stroke="url(#pipelineGradient)"
                        strokeLinecap="round"
                        style={{ pathLength: smoothProgress }}
                        filter="url(#glow-line)"
                        className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    />
                </svg>
            </div>

            {/* Nodes Grid */}
            <div className="w-full relative z-10 grid grid-cols-1 md:grid-cols-2 gap-y-32">

                {/* Step 1: Upload (Center) */}
                <div className="md:col-span-2 flex justify-center">
                    <WorkflowNode
                        icon={<Upload className="w-6 h-6 text-white" />}
                        title="1. Upload Raw"
                        description="Editor sends raw clips to the secure project folder."
                        progress={smoothProgress}
                        triggerPoint={0}
                        color="bg-blue-600"
                        align="center"
                        connectorPosition="bottom"
                    />
                </div>

                {/* Step 2: Editor Processing (Right) */}
                <div className="md:col-start-2 justify-self-center md:justify-self-start md:pl-20">
                    <WorkflowNode
                        icon={<FileVideo className="w-6 h-6 text-white" />}
                        title="2. Editor Processing"
                        description="Drafts are uploaded. No more WeTransfer links."
                        progress={smoothProgress}
                        triggerPoint={0.30}
                        color="bg-purple-600"
                        align="left"
                        connectorPosition="left"
                    />
                </div>

                {/* Step 3: Approval (Left) */}
                <div className="md:col-start-1 justify-self-center md:justify-self-end md:pr-20">
                    <WorkflowNode
                        icon={<CheckCircle2 className="w-6 h-6 text-white" />}
                        title="3. Cloud Feedback"
                        description="Review on mobile. Approve with one tap."
                        progress={smoothProgress}
                        triggerPoint={0.60}
                        color="bg-orange-600"
                        align="right"
                        connectorPosition="right"
                    />
                </div>

                {/* Step 4: Publish (Left - Below #3) */}
                {/* Keeping the layout correction the user requested (4 below 3) */}
                <div className="md:col-start-1 justify-self-center md:justify-self-end md:pr-20">
                    <WorkflowNode
                        icon={<Youtube className="w-6 h-6 text-white" />}
                        title="4. Auto-Publish"
                        description="Server pushes to YouTube API directly."
                        progress={smoothProgress}
                        triggerPoint={0.85}
                        color="bg-red-600"
                        align="left"
                        connectorPosition="top" // Connector coming from top (Step 3)
                    />
                </div>

            </div>
        </div>
    );
}

interface WorkflowNodeProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    progress: MotionValue<number>;
    triggerPoint: number;
    color: string;
    align: "left" | "right" | "center";
    connectorPosition: "top" | "bottom" | "left" | "right";
}

function WorkflowNode({ icon, title, description, progress, triggerPoint, color, align, connectorPosition }: WorkflowNodeProps) {
    const showCard = useTransform(progress, [triggerPoint - 0.1, triggerPoint], [0, 1]);
    const yCard = useTransform(progress, [triggerPoint - 0.1, triggerPoint], [30, 0]);

    // Dot logic
    const dotScale = useTransform(progress, [triggerPoint - 0.02, triggerPoint], [1, 1.5]);
    const dotGlow = useTransform(progress, [triggerPoint - 0.02, triggerPoint], [0, 1]);

    return (
        <motion.div
            style={{ opacity: showCard, y: yCard }}
            className={cn(
                "relative w-full max-w-sm p-8 glass-card rounded-2xl border border-white/5 bg-background/50 backdrop-blur-xl group hover:border-white/10 transition-colors duration-500",
                align === 'center' ? 'mx-auto' : ''
            )}
        >
            {/* The Active Connector Dot */}
            <div className={cn(
                "absolute w-4 h-4 rounded-full border-2 border-background z-20 flex items-center justify-center transition-colors duration-300",
                "bg-muted-foreground/30",
                connectorPosition === 'bottom' && "-bottom-2 left-1/2 -translate-x-1/2",
                connectorPosition === 'top' && "-top-2 left-1/2 -translate-x-1/2",
                connectorPosition === 'left' && "-left-2 top-1/2 -translate-y-1/2",
                connectorPosition === 'right' && "-right-2 top-1/2 -translate-y-1/2",
            )}>
                <motion.div
                    style={{ opacity: dotGlow, scale: dotScale }}
                    className="absolute inset-0 bg-primary rounded-full shadow-[0_0_15px_2px_var(--primary)]" /* Use CSS Variable for primary glow */
                />
            </div>

            <div className={`w-16 h-16 mb-6 rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 ${color}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">{title}</h3>
            <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
        </motion.div>
    );
}
