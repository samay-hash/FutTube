"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { FutTubeLogo } from "@/components/futtube-logo";

export function SiteHeader() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none"
        >
            {/* Glass Container for Nav */}
            <div className="absolute inset-0 pointer-events-auto"></div>

            <div className="w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
                <Link href="/" className="z-10 hover:scale-105 transition-transform duration-300">
                    {/* Using the standard Red/Black Logo from the earlier UI */}
                    <div className="text-2xl font-serif font-bold tracking-tight text-foreground flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
                        </div>
                        FutTube.
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-8 bg-background/50 backdrop-blur-md px-8 py-3 rounded-full border border-border/40 shadow-sm">
                    <Link href="#workflow" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Workflow</Link>
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                </nav>

                <div className="flex items-center gap-4 z-10">
                    <ThemeToggle />

                    <Link href="/auth/signin" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Log in
                    </Link>
                    <Link
                        href="/auth/signup"
                        className="group relative px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium overflow-hidden transition-all hover:shadow-[0_0_20px_-5px_var(--color-primary)] hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10">Get Started</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
