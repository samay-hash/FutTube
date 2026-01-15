"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface NetworkMeshBackgroundProps {
    className?: string;
}

export function NetworkMeshBackground({
    className,
}: NetworkMeshBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const particles: { x: number; y: number; vx: number; vy: number }[] = [];
        const particleCount = 40;
        const connectionDistance = 200;

        const createParticles = () => {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                });
            }
        };

        createParticles();

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw Grid
            ctx.strokeStyle = "rgba(128, 128, 128, 0.05)";
            ctx.lineWidth = 1;
            const gridSize = 80;

            // Vertical lines
            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal lines
            for (let y = 0; y <= height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw Particles & Connections
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Draw particle
                ctx.fillStyle = "rgba(128, 128, 128, 0.2)";
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();

                // Connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const opacity = 1 - dist / connectionDistance;
                        // Thinner, subtler lines
                        ctx.strokeStyle = `rgba(128, 128, 128, ${opacity * 0.1})`;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        };

        const animationId = requestAnimationFrame(draw);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            createParticles();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className={cn("absolute inset-0 z-0 pointer-events-none", className)}>
            <canvas
                ref={canvasRef}
                className="w-full h-full block"
            />
            {/* 
         Masking to ensure visibility primarily in corners.
         We use a radial gradient that is transparent in the center (hiding the canvas) 
         and transparent in the corners?
         Actually, we want the canvas to be VISIBLE in corners, and HIDDEN (or faded) in the center.
         So we need a mask that is OPAQUE (white) in corners and TRANSPARENT (black) in center.
         Standard radial-gradient goes from center out.
         white (center) -> black (corners) = center visible.
         black (center) -> white (corners) = corners visible.
      */}
            <div
                className="absolute inset-0 bg-background"
                style={{
                    // Mask allows content through where it is white/opaque.
                    // We want to HIDE the canvas in the center. 
                    // So we overlay the BACKGROUND color in the center?
                    // "visible softly in all four corners".
                    // Let's us mask-image on the canvas container instead.
                }}
            />
            {/* 
          Correct approach: Apply mask-image to the canvas container (this div).
          We want center to be transparent (invisible canvas), corners opaque (visible canvas).
          radial-gradient(circle at center, transparent 0%, black 100%) -> transparent at center?
          No, in CSS mask: alpha 0 is transparent (hidden), alpha 1 is visible.
          So we want 0 (transparent) at center, 1 (opaque) at corners.
          radial-gradient(circle at center, transparent 10%, black 90%)
       */}
            <div className="absolute inset-0 bg-background/0"
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--background)',
                    maskImage: 'radial-gradient(circle at center, black 0%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 100%)',
                    // Wait, if I put background here, it covers the canvas.
                    // I want to FADE OUT the canvas in the center.
                }}
            ></div>

            {/* 
           Simpler visual trick:
           Just overlay a radial gradient of the BACKGROUND color that starts solid in center and fades out to corners?
           No, that hides the center content (the page content).
           We want the MESH to be in the background.
           So we mask the MESH CANVAS itself.
        */}
        </div>
    );
}

export function NetworkMeshOverlay() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
            {/* The Mesh */}
            <div className="absolute inset-0 opacity-50 dark:opacity-30"
                style={{
                    maskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)'
                }}
            >
                <NetworkMeshBackground className="absolute" />
            </div>

            {/* Corner Glows */}
            <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-purple-500/5 blur-[120px] rounded-full mix-blend-screen dark:mix-blend-lighten" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] bg-blue-500/5 blur-[120px] rounded-full mix-blend-screen dark:mix-blend-lighten" />
        </div>
    )
}
