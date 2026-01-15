"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const transition = { duration: 1, ease: [0.25, 0.1, 0.25, 1] as const };
const variants = {
    hidden: { filter: "blur(10px)", transform: "translateY(20%)", opacity: 0 },
    visible: { filter: "blur(0)", transform: "translateY(0)", opacity: 1 },
};

interface BlurRevealProps {
    text: string;
    className?: string;
    delay?: number;
    childClassName?: string;
}

export function BlurReveal({ text, className, delay = 0, childClassName }: BlurRevealProps) {
    const words = text.split(" ");

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.04, delayChildren: delay }}
            className={cn("inline-block", className)}
        >
            {words.map((word, index) => (
                <React.Fragment key={index}>
                    <motion.span
                        className={cn("inline-block", childClassName)}
                        transition={transition}
                        variants={variants}
                    >
                        {word}
                    </motion.span>
                    {index < words.length - 1 && " "}
                </React.Fragment>
            ))}
        </motion.div>
    );
}
