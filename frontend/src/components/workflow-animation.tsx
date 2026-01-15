"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Upload, FileVideo, CheckCircle2, Youtube, DollarSign, BarChart2, Globe, Users, Briefcase, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

const WORKFLOW_STEPS = [
    { title: "1. Upload Raw", description: "Editor sends raw clips to the secure project folder.", icon: Upload, color: "bg-blue-600" },
    { title: "2. Editor Processing", description: "Drafts are uploaded. No more WeTransfer links.", icon: FileVideo, color: "bg-purple-600" },
    { title: "3. Cloud Feedback", description: "Review on mobile. Approve with one tap.", icon: CheckCircle2, color: "bg-orange-600" },
    { title: "4. Auto-Publish", description: "Server pushes to YouTube API directly.", icon: Youtube, color: "bg-red-600" },
    { title: "5. Instant Payout", description: "Revenue split is calculated and sent automatically.", icon: DollarSign, color: "bg-green-600" },
    { title: "6. Performance Audit", description: "Track growth and optimize future content strategy.", icon: BarChart2, color: "bg-indigo-600" },
    { title: "7. Global CDN", description: "Assets replicated worldwide for instant editor access.", icon: Globe, color: "bg-cyan-600" },
    { title: "8. Audience Retention", description: "Deep analytics on viewer drop-off points.", icon: Users, color: "bg-pink-600" },
    { title: "9. Sponsorships", description: "Manage brand deals and deliverables in one place.", icon: Briefcase, color: "bg-teal-600" },
    { title: "10. Archive Vault", description: "Long-term cold storage for all your project files.", icon: Archive, color: "bg-slate-600" }
];

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
        <div ref={containerRef} className="relative w-full max-w-7xl mx-auto py-20 px-4 min-h-[2500px] flex flex-col items-center">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20 relative z-20"
            >
                <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4">Connected Pipeline</h2>
                <p className="text-muted-foreground text-lg">A live audit trail from upload to payout.</p>
            </motion.div>

            {/* The Connection Layer (SVG) - Zig Zag Path */}
            <div className="absolute top-[250px] left-0 right-0 bottom-0 z-0 hidden md:block pointer-events-none">
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

                    {/* Zig Zag Path - Compressed Y coordinates to match 2500px height */}
                    <motion.path
                        d="M 50% 0 
                           C 50% 50, 30% 50, 30% 150
                           L 30% 150
                           C 30% 300, 70% 300, 70% 450
                           L 70% 450
                           C 70% 600, 30% 600, 30% 750
                           L 30% 750
                           C 30% 900, 70% 900, 70% 1050
                           L 70% 1050
                           C 70% 1200, 30% 1200, 30% 1350
                           L 30% 1350
                           C 30% 1500, 70% 1500, 70% 1650
                           L 70% 1650
                           C 70% 1800, 30% 1800, 30% 1950
                           L 30% 1950
                           C 30% 2100, 70% 2100, 70% 2250
                           L 70% 2250"
                        fill="none"
                        strokeWidth="3"
                        stroke="currentColor"
                        className="text-muted/10 opacity-20"
                        strokeLinecap="round"
                    />

                    {/* Animated Line */}
                    <motion.path
                        d="M 50% 0 
                           C 50% 50, 30% 50, 30% 150
                           L 30% 150
                           C 30% 300, 70% 300, 70% 450
                           L 70% 450
                           C 70% 600, 30% 600, 30% 750
                           L 30% 750
                           C 30% 900, 70% 900, 70% 1050
                           L 70% 1050
                           C 70% 1200, 30% 1200, 30% 1350
                           L 30% 1350
                           C 30% 1500, 70% 1500, 70% 1650
                           L 70% 1650
                           C 70% 1800, 30% 1800, 30% 1950
                           L 30% 1950
                           C 30% 2100, 70% 2100, 70% 2250
                           L 70% 2250"
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
            <div className="w-full relative z-10 grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-16">
                {WORKFLOW_STEPS.map((step, index) => {
                    const isLeft = index % 2 === 0;

                    // Connector Logic
                    let connectorPos: "top" | "bottom" | "left" | "right" = "left";
                    if (index === 0) connectorPos = "top";
                    else if (isLeft) connectorPos = "right";
                    else connectorPos = "left";

                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex justify-center",
                                isLeft ? "md:col-start-1 md:justify-end md:pr-10" : "md:col-start-2 md:justify-start md:pl-10",
                                !isLeft && "mt-0 md:mt-32" // Stagger right column
                            )}
                        >
                            <WorkflowNode
                                icon={<step.icon className="w-6 h-6 text-white" />}
                                title={step.title}
                                description={step.description}
                                color={step.color}
                                align={isLeft ? "right" : "left"}
                                connectorPosition={connectorPos}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

interface WorkflowNodeProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    align: "left" | "right" | "center";
    connectorPosition: "top" | "bottom" | "left" | "right";
}

function WorkflowNode({ icon, title, description, color, align, connectorPosition }: WorkflowNodeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-15% 0px -15% 0px" }} // Trigger when element is near center of viewport
            transition={{ duration: 0.6, ease: "easeOut" }}
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
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }} // Dot pops after card
                    className="absolute inset-0 bg-primary rounded-full shadow-[0_0_15px_2px_var(--primary)]"
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
