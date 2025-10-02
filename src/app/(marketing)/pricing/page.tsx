"use client";

import { useState } from "react";
import { cn } from "@/lib";
import { Button } from "@/components/ui/button";
import { 
    TrendingUp, Briefcase, DollarSign, BarChart, Users, Mail, 
    Code, ShoppingCart, PenTool, MessageSquare, Lightbulb, X, Check 
} from "lucide-react";
import Container from "@/components/global/container";
import { motion, AnimatePresence } from "framer-motion";

type Helper = {
    id: string;
    name: string;
    emoji: string;
    role: string;
    description: string;
    color: string;
    icon: any;
    price: number;
};

const HELPERS: Helper[] = [
    {
        id: 'marketing',
        name: 'Marketing Pro',
        emoji: '🎯',
        role: 'Marketing Specialist',
        description: 'Content strategy, campaigns, and brand positioning',
        color: 'from-blue-500 to-cyan-500',
        icon: TrendingUp,
        price: 12.99,
    },
    {
        id: 'sales',
        name: 'Sales Expert',
        emoji: '💼',
        role: 'Sales Specialist',
        description: 'Lead generation, outreach, and closing deals',
        color: 'from-green-500 to-emerald-500',
        icon: Briefcase,
        price: 12.99,
    },
    {
        id: 'finance',
        name: 'Finance Guru',
        emoji: '💰',
        role: 'Financial Advisor',
        description: 'Budgeting, forecasting, and financial planning',
        color: 'from-amber-500 to-yellow-500',
        icon: DollarSign,
        price: 12.99,
    },
    {
        id: 'operations',
        name: 'Ops Manager',
        emoji: '⚙️',
        role: 'Operations Specialist',
        description: 'Process optimization and workflow automation',
        color: 'from-purple-500 to-violet-500',
        icon: BarChart,
        price: 12.99,
    },
    {
        id: 'customer',
        name: 'Support Hero',
        emoji: '🎧',
        role: 'Customer Success',
        description: 'Customer support, onboarding, and retention',
        color: 'from-pink-500 to-rose-500',
        icon: Users,
        price: 12.99,
    },
    {
        id: 'email',
        name: 'Email Pro',
        emoji: '📧',
        role: 'Email Specialist',
        description: 'Email campaigns, automation, and optimization',
        color: 'from-indigo-500 to-blue-500',
        icon: Mail,
        price: 12.99,
    },
    {
        id: 'tech',
        name: 'Tech Assistant',
        emoji: '💻',
        role: 'Technical Advisor',
        description: 'Integrations, APIs, and technical solutions',
        color: 'from-slate-500 to-gray-600',
        icon: Code,
        price: 12.99,
    },
    {
        id: 'analytics',
        name: 'Data Analyst',
        emoji: '📊',
        role: 'Analytics Expert',
        description: 'Data analysis, insights, and reporting',
        color: 'from-teal-500 to-cyan-500',
        icon: BarChart,
        price: 12.99,
    },
    {
        id: 'ecommerce',
        name: 'E-commerce Pro',
        emoji: '🛍️',
        role: 'E-commerce Specialist',
        description: 'Online sales, product optimization, and conversions',
        color: 'from-orange-500 to-red-500',
        icon: ShoppingCart,
        price: 12.99,
    },
    {
        id: 'content',
        name: 'Content Writer',
        emoji: '✍️',
        role: 'Content Creator',
        description: 'Blog posts, articles, and creative writing',
        color: 'from-fuchsia-500 to-pink-500',
        icon: PenTool,
        price: 12.99,
    },
    {
        id: 'social',
        name: 'Social Media',
        emoji: '📱',
        role: 'Social Media Manager',
        description: 'Social strategy, engagement, and community',
        color: 'from-cyan-500 to-blue-500',
        icon: MessageSquare,
        price: 12.99,
    },
    {
        id: 'strategy',
        name: 'Strategist',
        emoji: '🎨',
        role: 'Business Strategist',
        description: 'Business planning, growth, and innovation',
        color: 'from-violet-500 to-purple-500',
        icon: Lightbulb,
        price: 12.99,
    },
];

type PricingTier = {
    id: string;
    name: string;
    originalPrice: number;
    discountedPrice: number;
    billingPeriod: string;
    description: string;
    isRecommended?: boolean;
};

const PRICING_TIERS: PricingTier[] = [
    {
        id: 'yearly',
        name: 'Pay Yearly',
        originalPrice: 97,
        discountedPrice: 15.60,
        billingPeriod: '/month',
        description: 'Billed annually',
    },
    {
        id: 'quarterly',
        name: 'Pay Every 3 Months',
        originalPrice: 59,
        discountedPrice: 23.60,
        billingPeriod: '/month',
        description: 'Billed quarterly',
    },
    {
        id: 'monthly',
        name: 'Pay Monthly',
        originalPrice: 97,
        discountedPrice: 38.80,
        billingPeriod: '/month',
        description: 'Billed monthly',
        isRecommended: true,
    },
];

export default function PricingPage() {
    const [selectedHelper, setSelectedHelper] = useState<Helper | null>(null);
    const [showBundleModal, setShowBundleModal] = useState(false);
    const [selectedPricingTier, setSelectedPricingTier] = useState<string>('monthly');

    const handleHelperClick = (helper: Helper) => {
        setSelectedHelper(helper);
    };

    const handleBundleClick = () => {
        setShowBundleModal(true);
    };

    const closePricingModal = () => {
        setShowBundleModal(false);
        setSelectedHelper(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-20">
            <Container>
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            Choose Your <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">AI Helper</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Select individual AI helpers or get the complete bundle with all 12+ specialists
                        </p>
                    </div>

                    {/* Helper Selection Tabs */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex rounded-lg bg-muted/50 p-1.5 backdrop-blur-sm border border-border">
                            <button className="px-6 py-2.5 rounded-md bg-background shadow-md font-medium transition-all">
                                Individual
                            </button>
                            <button 
                                onClick={handleBundleClick}
                                className="px-6 py-2.5 rounded-md font-medium transition-all hover:bg-background/50"
                            >
                                All Helpers Bundle
                            </button>
                        </div>
                    </div>

                    {/* Individual Helpers Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-12">
                        {HELPERS.map((helper, index) => (
                            <motion.button
                                key={helper.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleHelperClick(helper)}
                                className={cn(
                                    "group relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300",
                                    "hover:scale-105 hover:shadow-xl cursor-pointer",
                                    selectedHelper?.id === helper.id
                                        ? "border-primary bg-primary/5 shadow-lg"
                                        : "border-border bg-card hover:border-primary/50"
                                )}
                            >
                                {/* Helper Avatar */}
                                <div className={cn(
                                    "w-16 h-16 rounded-full mb-3 flex items-center justify-center text-3xl transition-all",
                                    "bg-gradient-to-br shadow-lg group-hover:scale-110",
                                    helper.color
                                )}>
                                    {helper.emoji}
                                </div>

                                {/* Helper Name */}
                                <h3 className="font-semibold text-sm text-center mb-1 line-clamp-2">
                                    {helper.name}
                                </h3>

                                {/* Price */}
                                <div className="text-xs text-muted-foreground mb-2">
                                    ${helper.price}<span className="text-[10px]">/mo</span>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all" />
                            </motion.button>
                        ))}
                    </div>

                    {/* Bundle Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-12 shadow-2xl">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:60px_60px]" />
                            </div>

                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                                {/* Left Side - Content */}
                                <div className="flex-1 text-white">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                        Complete Bundle
                                    </h2>
                                    <p className="text-xl md:text-2xl font-semibold mb-4 text-white/90">
                                        <span className="line-through text-white/60">$97</span> $38.80/month
                                    </p>
                                    <p className="text-lg text-white/90 mb-6">
                                        All 12+ AI Helpers
                                    </p>
                                    <Button 
                                        size="lg"
                                        onClick={handleBundleClick}
                                        className="bg-white text-purple-700 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                                    >
                                        Get 60% OFF
                                    </Button>
                                    <p className="text-sm text-white/70 mt-4">
                                        14-day money back guarantee
                                    </p>
                                </div>

                                {/* Right Side - Helper Avatars */}
                                <div className="flex-shrink-0">
                                    <div className="grid grid-cols-4 gap-2">
                                        {HELPERS.slice(0, 8).map((helper, index) => (
                                            <div
                                                key={helper.id}
                                                className={cn(
                                                    "w-14 h-14 rounded-full flex items-center justify-center text-2xl",
                                                    "bg-gradient-to-br shadow-lg transition-all hover:scale-110",
                                                    helper.color,
                                                    "animate-pulse"
                                                )}
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                {helper.emoji}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Container>

            {/* Pricing Modal - Slides up from bottom */}
            <AnimatePresence>
                {(showBundleModal || selectedHelper) && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closePricingModal}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="bg-background rounded-t-3xl shadow-2xl border-t border-border">
                                {/* Header */}
                                <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 rounded-t-3xl flex items-center justify-between z-10">
                                    <h2 className="text-2xl font-bold">
                                        {selectedHelper ? selectedHelper.name : "Pricing Options"}
                                    </h2>
                                    <button
                                        onClick={closePricingModal}
                                        className="p-2 rounded-full hover:bg-muted transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="px-6 py-8 max-w-2xl mx-auto">
                                    {selectedHelper && (
                                        <div className="mb-6 text-center">
                                            <div className={cn(
                                                "w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl",
                                                "bg-gradient-to-br shadow-lg",
                                                selectedHelper.color
                                            )}>
                                                {selectedHelper.emoji}
                                            </div>
                                            <p className="text-muted-foreground">{selectedHelper.description}</p>
                                        </div>
                                    )}

                                    {/* Pricing Tiers */}
                                    <div className="space-y-4">
                                        {PRICING_TIERS.map((tier) => (
                                            <button
                                                key={tier.id}
                                                onClick={() => setSelectedPricingTier(tier.id)}
                                                className={cn(
                                                    "w-full p-6 rounded-2xl border-2 transition-all text-left relative",
                                                    selectedPricingTier === tier.id
                                                        ? "border-primary bg-primary/5 shadow-lg"
                                                        : "border-border hover:border-primary/50 hover:shadow-md"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-lg font-semibold">
                                                                ${tier.discountedPrice}{tier.billingPeriod}
                                                            </span>
                                                            {tier.isRecommended && (
                                                                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                                                                    60% OFF
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {tier.description}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1 line-through">
                                                            ${tier.originalPrice}{tier.billingPeriod}
                                                        </p>
                                                    </div>
                                                    {selectedPricingTier === tier.id && (
                                                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                            <Check className="w-4 h-4 text-primary-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        size="lg"
                                        className="w-full mt-8 text-lg py-6 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all"
                                    >
                                        Get {selectedHelper ? selectedHelper.name : "All Helpers"} for ${PRICING_TIERS.find(t => t.id === selectedPricingTier)?.discountedPrice}/m
                                    </Button>

                                    <p className="text-center text-sm text-muted-foreground mt-4">
                                        You will be redirected to checkout. All purchases are backed by our unconditional 14-day money-back guarantee.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

