"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />; // Placeholder to prevent layout shift
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 focus:outline-none",
                isDark
                    ? "bg-slate-800 text-blue-200 hover:bg-slate-700 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    : "bg-amber-100 text-amber-500 hover:bg-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
            )}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Sun Icon */}
                <motion.div
                    initial={false}
                    animate={{
                        scale: isDark ? 0 : 1,
                        opacity: isDark ? 0 : 1,
                        rotate: isDark ? 90 : 0,
                    }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Sun className="w-6 h-6 fill-amber-500 stroke-amber-600" />
                </motion.div>

                {/* Moon Icon */}
                <motion.div
                    initial={false}
                    animate={{
                        scale: isDark ? 1 : 0,
                        opacity: isDark ? 1 : 0,
                        rotate: isDark ? 0 : -90,
                    }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Moon className="w-6 h-6 fill-blue-300 stroke-blue-100" />
                </motion.div>

                {/* Orbital particles for extra "coolness" */}
                {isDark ? (
                    // Stars
                    <>
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                            className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1, 0.8] }}
                            transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                            className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white rounded-full"
                        />
                    </>
                ) : (
                    // Sun Rays pulses handled by SVG but we can add a glow ring
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full bg-amber-400"
                    />
                )}
            </div>
        </button>
    );
}
