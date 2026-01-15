"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const pricingPlans = [
    {
        name: "Free",
        price: "0",
        description: "Best for beginners looking to start their journey with DCA investing strategy.",
        features: [
            "Basic DCA Scheduling",
            "Portfolio Tracking Dashboard",
            "Standard Email Support",
            "3 Active Plans"
        ],
        icon: Shield,
        buttonText: "Get Started",
        popular: false
    },
    {
        name: "Standard",
        price: "98.00",
        description: "Best for investors looking to grow their portfolio in stable and secure way.",
        features: [
            "Up to 10 Active DCA Plans",
            "Portfolio Tracking with Profit Analysis",
            "Real-Time Market Data",
            "Smart Execution Logic",
            "Priority Email Support"
        ],
        icon: Zap,
        buttonText: "Get Started",
        popular: true
    },
    {
        name: "Business",
        price: "124.00",
        description: "Best for professionals looking to grow their portfolio in with all the features we offer.",
        features: [
            "Unlimited Active DCA Plans",
            "Full Historical Data and Insights",
            "Custom Strategy Integration",
            "Zero Fees on Crypto Trades",
            "24/7 Dedicated Agent"
        ],
        icon: Crown,
        buttonText: "Get Started",
        popular: false
    },
];

export function PricingSection() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

    const handleSelectPlan = (planName: string) => {
        toast.success(`You selected ${planName} plan. (Backend integration coming soon)`);
    };

    return (
        <section className="relative py-24 px-6 overflow-hidden z-10" id="pricing">
            {/* 
                REMOVED NetworkMeshOverlay to match "above pages" (Hero/Features).
                This ensures the global grid background shows through cleanly, resolving the "odd" look.
             */}

            <div className="relative max-w-7xl mx-auto flex flex-col items-center">
                {/* Header Text */}
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400 font-semibold tracking-wide text-sm uppercase">
                            Pricing Coming Soon!
                        </span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Unlock Your Potential
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Choose the plan that fits your studio needs. Scale as you grow.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={cn("text-sm font-medium transition-colors", billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                            className="w-14 h-7 bg-secondary rounded-full p-1 relative transition-colors duration-300 focus:outline-none ring-1 ring-primary/20"
                        >
                            {/* REMOVED 'layout' prop to prevent hydration teleportation bugs */}
                            <motion.div
                                className="w-5 h-5 rounded-full shadow-sm bg-primary"
                                animate={{ x: billingCycle === "monthly" ? 0 : 28 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={cn("text-sm font-medium transition-colors relative", billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground")}>
                            Annually
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
                    {pricingPlans.map((plan, index) => {
                        const isPopular = plan.popular;

                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onMouseEnter={() => setHoveredPlan(plan.name)}
                                onMouseLeave={() => setHoveredPlan(null)}
                                className={cn(
                                    "relative rounded-2xl p-[1px] transition-transform duration-300 flex flex-col h-full",
                                    isPopular
                                        ? "bg-gradient-to-b from-orange-400/50 via-green-400/50 to-transparent shadow-[0_0_40px_-10px_rgba(251,146,60,0.2)] md:-translate-y-4 scale-105 z-10"
                                        : "bg-border hover:bg-primary/20"
                                )}
                            >
                                {/* Inner Card Content */}
                                <div className={cn(
                                    "flex flex-col h-full rounded-2xl p-8 backdrop-blur-xl border border-white/5",
                                    isPopular ? "bg-background/80 dark:bg-black/80" : "bg-card/40 hover:bg-card/60"
                                )}>

                                    {/* Header */}
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed min-h-[40px]">{plan.description}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-8">
                                        {plan.price === "0" ? (
                                            <div className="flex items-end gap-1">
                                                <span className="text-4xl font-bold text-foreground">Free</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                                                <span className="text-muted-foreground text-sm font-light">/month</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Button */}
                                    <button
                                        onClick={() => handleSelectPlan(plan.name)}
                                        className={cn(
                                            "w-full py-3 rounded-lg font-medium transition-all duration-300 mb-8 border relative overflow-hidden group",
                                            isPopular
                                                ? "bg-gradient-to-r from-orange-500 to-green-500 text-white border-transparent hover:brightness-110"
                                                : "bg-secondary text-foreground border-border hover:bg-secondary/80"
                                        )}
                                    >
                                        <span className="relative z-10">{plan.buttonText}</span>
                                    </button>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-border mb-8" />
                                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4 text-center font-semibold">Features</div>

                                    {/* Features */}
                                    <ul className="space-y-4 flex-1">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <div className="w-4 h-4 rounded-full border border-muted-foreground/30 flex items-center justify-center shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                                                </div>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
