"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BlurReveal } from "./BlurReveal";

export function ScrollDoorSection({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Door Opening Animation (Scroll 0.2 to 0.5)
    // Door Closing Animation (Scroll 0.7 to 0.9)

    // Logic: 0 -> Closed, 0.5 -> Open, 1.0 -> Closed
    const doorGap = useTransform(
        scrollYProgress,
        [0, 0.3, 0.7, 1],
        ["0%", "50%", "50%", "0%"]
    );

    const opacity = useTransform(
        scrollYProgress,
        [0.1, 0.3, 0.7, 0.9],
        [0, 1, 1, 0]
    );

    const scale = useTransform(
        scrollYProgress,
        [0.1, 0.4, 0.6, 0.9],
        [0.9, 1, 1, 0.9]
    );

    return (
        <div ref={containerRef} className="relative min-h-[150vh] z-20 pointer-events-none">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pointer-events-auto">

                {/* Background Content Behind Doors */}
                <motion.div
                    style={{ opacity, scale }}
                    className="absolute inset-0 flex items-center justify-center z-0 p-8"
                >
                    <div className="max-w-4xl w-full p-12 glass rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-center text-center">
                        {children}
                    </div>
                </motion.div>

                {/* Left Door */}
                <motion.div
                    style={{ x: useTransform(doorGap, (v) => `-${v}`) }}
                    className="absolute top-0 left-0 w-1/2 h-full bg-[#111] dark:bg-[#050505] z-10 border-r border-white/10 shadow-2xl flex items-center justify-end pr-4"
                >
                    {/* Handle */}
                    <div className="w-2 h-24 rounded-full bg-white/20" />
                </motion.div>

                {/* Right Door */}
                <motion.div
                    style={{ x: doorGap }}
                    className="absolute top-0 right-0 w-1/2 h-full bg-[#111] dark:bg-[#050505] z-10 border-l border-white/10 shadow-2xl flex items-center justify-start pl-4"
                >
                    {/* Handle */}
                    <div className="w-2 h-24 rounded-full bg-white/20" />
                </motion.div>

            </div>
        </div>
    );
}
