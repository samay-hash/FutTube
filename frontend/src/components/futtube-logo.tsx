"use client";

import React from "react";

export function FutTubeLogo({ className, showText = true }: { className?: string, showText?: boolean }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Logo Icon */}
            <div className="relative w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
                    <defs>
                        <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40">
                            <stop offset="0%" stopColor="#ef4444" /> {/* Red 500 */}
                            <stop offset="100%" stopColor="#f97316" /> {/* Orange 500 */}
                        </linearGradient>
                    </defs>
                    {/* Rounded Triangle Play Button Shape */}
                    <path
                        d="M15 10 L30 20 L15 30 V10 Z"
                        fill="none"
                        stroke="url(#logoGradient)"
                        strokeWidth="0"
                    />

                    {/* Custom Icon Shape (Check Mark / Play Hybrid) to match User's request but in Theme Colors */}
                    <path
                        d="M12 10C9 12 8 16 8 20C8 26 12 30 18 30H24C28 30 32 26 32 20C32 14 28 10 24 10H12ZM15 18L19 22L25 15"
                        stroke="url(#logoGradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />
                    {/* Wrapping Box */}
                    <rect x="4" y="4" width="32" height="32" rx="8" stroke="url(#logoGradient)" strokeWidth="4" className="opacity-100" />
                </svg>
            </div>

            {showText && (
                <span className="text-2xl font-serif font-bold tracking-tight text-foreground">
                    FutTube.
                </span>
            )}
        </div>
    );
}
