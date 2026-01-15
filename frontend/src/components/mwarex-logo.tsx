"use client";

import React from "react";
import { Layers } from "lucide-react"; // Using Layers for Middleware/Software vibe

export function MWareXLogo({ className, showText = true }: { className?: string, showText?: boolean }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            {/* Logo Icon */}
            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-primary to-blue-600 rounded-lg shadow-lg shadow-primary/25">
                <Layers className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>

            {showText && (
                <span className="text-2xl font-serif font-bold tracking-tight text-foreground">
                    MWareX.
                </span>
            )}
        </div>
    );
}
