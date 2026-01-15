"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Shield, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { NetworkMeshOverlay } from "@/components/ui/network-mesh-background";
import { Toaster, toast } from "sonner"; // Assuming sonner is installed, or we can use custom Alert

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
        missing: [], // Image implies all are "features" just checking what you have
        icon: Shield,
        color: "gray",
        buttonText: "Get Started",
        popular: false,
        headerColor: "text-white"
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
        missing: [],
        icon: Zap,
        color: "orange",
        buttonText: "Get Started",
        popular: true,
        headerColor: "text-white"
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
        missing: [],
        icon: Crown,
        color: "gray",
        buttonText: "Get Started",
        popular: false,
        headerColor: "text-white"
    },
];

export default function PricingPage() {
    const router = useRouter();
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

    const handleSelectPlan = (planName: string) => {
        // Redirect to dashboard as "completion" of onboarding
        // User requested "just frontend will integrate backend soon"
        // Using simple redirect
        toast.success("Welcome aboard! (This is a frontend demo)");
        setTimeout(() => {
            router.push("/dashboard/creator");
        }, 1000);
    };

    return (
        <main className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden bg-background text-foreground">

            {/* Background Mesh (Dark & Premium) */}
            <NetworkMeshOverlay />
            <div className="absolute inset-0 bg-background/5 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 w-full max-w-6xl mx-auto flex flex-col items-center"
            >
                {/* Header Text */}
                <div className="text-center mb-12 space-y-2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-green-500/10 border border-white/5 backdrop-blur-sm mb-4"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400 font-semibold tracking-wide text-sm uppercase">
                            Pricing Coming Soon!
                        </span>
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                        Unlock Your Potential
                    </h1>


                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={cn("text-sm font-medium transition-colors", billingCycle === "monthly" ? "text-gray-200" : "text-gray-500")}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                            className="w-14 h-7 bg-white/10 rounded-full p-1 relative transition-colors duration-300 focus:outline-none ring-1 ring-white/20"
                        >
                            <motion.div
                                className="w-5 h-5 rounded-full shadow-sm bg-gradient-to-br from-orange-400 to-green-400"
                                layout
                                animate={{ x: billingCycle === "monthly" ? 0 : 28 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={cn("text-sm font-medium transition-colors relative", billingCycle === "yearly" ? "text-gray-200" : "text-gray-500")}>
                            Annually
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
                    {pricingPlans.map((plan, index) => {
                        const isPopular = plan.popular;
                        // Using styling from image: 
                        // Popular: Gradient border (orange to green), internal glow, larger price text.
                        // Others: Dark border, muted text.

                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onMouseEnter={() => setHoveredPlan(plan.name)}
                                onMouseLeave={() => setHoveredPlan(null)}
                                className={cn(
                                    "relative rounded-2xl p-[1px] transition-transform duration-300 flex flex-col h-full",
                                    isPopular
                                        ? "bg-gradient-to-b from-orange-400/50 via-green-400/50 to-transparent shadow-[0_0_40px_-10px_rgba(251,146,60,0.2)] md:-translate-y-4"
                                        : "bg-white/10 hover:bg-white/15"
                                )}
                            >
                                {/* Inner Card Content */}
                                <div className={cn(
                                    "flex flex-col h-full rounded-2xl p-8 bg-black/80 backdrop-blur-xl border border-white/5",
                                    isPopular ? "bg-black/80" : "bg-black/60"
                                )}>

                                    {/* Header */}
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed min-h-[40px]">{plan.description}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-8">
                                        {plan.price === "0" ? (
                                            <div className="flex items-end gap-1">
                                                <span className="text-5xl font-bold text-white">Free</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-5xl font-bold text-white">${plan.price}</span>
                                                <span className="text-gray-400 text-sm font-light">/month</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Button */}
                                    <button
                                        onClick={() => handleSelectPlan(plan.name)}
                                        className={cn(
                                            "w-full py-3 rounded-lg font-medium transition-all duration-300 mb-8 border",
                                            isPopular
                                                ? "bg-gradient-to-r from-orange-100 to-green-100 text-black border-transparent hover:brightness-110"
                                                : "bg-transparent text-white border-white/10 hover:border-white/30 hover:bg-white/5"
                                        )}
                                    >
                                        {plan.buttonText}
                                    </button>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
                                    <div className="text-xs uppercase tracking-widest text-gray-500 mb-4 text-center font-semibold">Features</div>

                                    {/* Features */}
                                    <ul className="space-y-4 flex-1">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                                                <div className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
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
            </motion.div>
            <div className="absolute top-4 left-4">
                {/* Safe Back Button */}
                <button className="text-gray-500 hover:text-white transition-colors" onClick={() => router.push("/")}>
                    &larr; Back
                </button>
            </div>
        </main>
    );
}
