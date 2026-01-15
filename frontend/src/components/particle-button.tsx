"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParticleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

export function ParticleButton({ children, className, onClick, ...props }: ParticleButtonProps) {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; angle: number; velocity: number }[]>([]);

    const createParticles = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Generate particles
        const newParticles = Array.from({ length: 24 }).map((_, i) => ({
            id: Date.now() + i,
            x: centerX, // Start from center relative to button
            y: centerY,
            angle: Math.random() * 360,
            velocity: Math.random() * 50 + 50, // Speed
        }));

        setParticles(newParticles);

        // Clear particles after animation
        setTimeout(() => setParticles([]), 1000);

        // Call original onClick
        if (onClick) onClick(e);
    };

    return (
        <button
            onClick={createParticles}
            className={cn("relative overflow-visible", className)}
            {...props}
        >
            <span className="relative z-10">{children}</span>

            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.span
                        key={particle.id}
                        initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 1 }}
                        animate={{
                            x: particle.x + Math.cos(particle.angle) * particle.velocity,
                            y: particle.y + Math.sin(particle.angle) * particle.velocity,
                            opacity: 0,
                            scale: 0,
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute w-1.5 h-1.5 bg-primary/60 rounded-full pointer-events-none z-0"
                        style={{
                            left: 0, // Position relative to button
                            top: 0,
                        }}
                    />
                ))}
            </AnimatePresence>
        </button>
    );
}
