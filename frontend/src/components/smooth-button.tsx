"use client";

import React, { useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SmoothButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary";
    children: React.ReactNode;
}

export function SmoothButton({ className, variant = "primary", children, ...props }: SmoothButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            className={cn(
                "relative px-8 py-4 rounded-full font-medium text-lg overflow-hidden transition-colors flex items-center justify-center gap-2",
                variant === "primary"
                    ? "bg-foreground text-background border border-transparent"
                    : "bg-transparent text-foreground border border-foreground/20 hover:border-foreground/50",
                className
            )}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            {...props}
        >
            <motion.div
                className={cn(
                    "absolute inset-0 z-0",
                    variant === "primary" ? "bg-primary" : "bg-foreground/5"
                )}
                initial={{ y: "100%" }}
                animate={{ y: isHovered ? "0%" : "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            />

            <span className={cn("relative z-10 flex items-center gap-2 transition-colors duration-300", variant === "primary" && isHovered ? "text-white" : "")}>
                {children}
            </span>
        </motion.button>
    );
}
