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
    benefits: string[];
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
        benefits: [
            'AI-powered content strategy',
            'Campaign planning and execution',
            'Brand positioning analysis',
            'Competitor research',
            'Marketing automation setup',
        ],
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
        benefits: [
            'Lead generation strategies',
            'Outreach message templates',
            'Sales funnel optimization',
            'Objection handling scripts',
            'Deal closing techniques',
        ],
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
        benefits: [
            'Budget planning and tracking',
            'Financial forecasting',
            'Cash flow analysis',
            'Investment recommendations',
            'Cost optimization strategies',
        ],
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
        benefits: [
            'Process optimization',
            'Workflow automation',
            'Resource allocation',
            'Efficiency improvements',
            'Operations analytics',
        ],
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
        benefits: [
            'Customer support automation',
            'Onboarding workflows',
            'Retention strategies',
            'Satisfaction surveys',
            'Support ticket management',
        ],
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
        benefits: [
            'Email campaign creation',
            'Automation sequences',
            'A/B testing strategies',
            'Deliverability optimization',
            'Performance analytics',
        ],
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
        benefits: [
            'Integration recommendations',
            'API implementation guidance',
            'Technical troubleshooting',
            'System architecture advice',
            'Development best practices',
        ],
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
        benefits: [
            'Data analysis and insights',
            'Custom report generation',
            'KPI tracking and monitoring',
            'Predictive analytics',
            'Dashboard creation',
        ],
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
        benefits: [
            'Product optimization',
            'Conversion rate improvement',
            'Shopping cart optimization',
            'Pricing strategies',
            'Inventory management',
        ],
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
        benefits: [
            'Blog post creation',
            'Article writing',
            'SEO optimization',
            'Content calendar planning',
            'Copywriting for ads',
        ],
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
        benefits: [
            'Social media strategy',
            'Content scheduling',
            'Engagement optimization',
            'Community management',
            'Social analytics',
        ],
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
        benefits: [
            'Business planning',
            'Growth strategies',
            'Market analysis',
            'Innovation consulting',
            'Strategic roadmapping',
        ],
    },
];

const BUNDLE_BENEFITS = [
    'Access to all 12+ AI Helpers',
    'Unlimited usage across all tools',
    'Priority customer support',
    'Early access to new features',
    'Advanced analytics dashboard',
    'Custom integrations',
    'Dedicated account manager',
    'Team collaboration features',
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
    const [viewMode, setViewMode] = useState<'individual' | 'bundle'>('individual');
    const [selectedHelper, setSelectedHelper] = useState<Helper | null>(null);
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [selectedPricingTier, setSelectedPricingTier] = useState<string>('monthly');

    const handleHelperClick = (helper: Helper) => {
        setSelectedHelper(helper);
    };

    const handleRedeemClick = () => {
        setShowPricingModal(true);
    };

    const closePricingModal = () => {
        setShowPricingModal(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-20">
            <Container>
                <div className="max-w-7xl mx-auto px-4">
                    {/* Helper Selection Tabs */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex rounded-lg bg-muted/50 p-1.5 backdrop-blur-sm border border-border">
                            <button 
                                onClick={() => {
                                    setViewMode('individual');
                                    setSelectedHelper(null);
                                }}
                                className={cn(
                                    "px-6 py-2.5 rounded-md font-medium transition-all",
                                    viewMode === 'individual' 
                                        ? "bg-background shadow-md" 
                                        : "hover:bg-background/50"
                                )}
                            >
                                Individual
                            </button>
                            <button 
                                onClick={() => {
                                    setViewMode('bundle');
                                    setSelectedHelper(null);
                                }}
                                className={cn(
                                    "px-6 py-2.5 rounded-md font-medium transition-all",
                                    viewMode === 'bundle' 
                                        ? "bg-background shadow-md" 
                                        : "hover:bg-background/50"
                                )}
                            >
                                Celio X
                            </button>
                        </div>
                    </div>

                    {/* Individual View */}
                    {viewMode === 'individual' && (
                        <>
                            {/* Individual Helpers Row */}
                            <div className="flex items-center justify-center gap-3 md:gap-6 mb-12 flex-wrap max-w-6xl mx-auto">
                                {HELPERS.map((helper, index) => (
                                    <motion.button
                                        key={helper.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleHelperClick(helper)}
                                        className={cn(
                                            "group relative flex flex-col items-center transition-all duration-300",
                                            "cursor-pointer"
                                        )}
                                    >
                                        {/* Helper Avatar */}
                                        <div className={cn(
                                            "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl transition-all",
                                            "bg-gradient-to-br shadow-lg hover:scale-110",
                                            helper.color,
                                            selectedHelper?.id === helper.id && "ring-4 ring-primary ring-offset-2 ring-offset-background scale-110"
                                        )}>
                                            {helper.emoji}
                                        </div>

                                        {/* Helper Name */}
                                        <h3 className="font-medium text-xs md:text-sm text-center mt-2 line-clamp-2 max-w-[80px]">
                                            {helper.name}
                                        </h3>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Selected Helper Details */}
                            {selectedHelper && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", damping: 25 }}
                                    className="max-w-4xl mx-auto"
                                >
                                    <div className={cn(
                                        "relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-2xl",
                                        "bg-gradient-to-br",
                                        selectedHelper.color
                                    )}>
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1))] bg-[length:60px_60px]" />
                                        </div>

                                        <div className="relative">
                                            {/* Header */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl">
                                                    {selectedHelper.emoji}
                                                </div>
                                                <div className="flex-1 text-white">
                                                    <h2 className="text-3xl md:text-4xl font-bold mb-1">
                                                        {selectedHelper.name}
                                                    </h2>
                                                    <p className="text-lg text-white/90">
                                                        {selectedHelper.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Benefits */}
                                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                                                <h3 className="text-xl font-semibold text-white mb-4">What's included:</h3>
                                                <ul className="space-y-3">
                                                    {selectedHelper.benefits.map((benefit, index) => (
                                                        <li key={index} className="flex items-start gap-3 text-white/90">
                                                            <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                                            <span>{benefit}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* CTA Button */}
                                            <Button 
                                                size="lg"
                                                onClick={handleRedeemClick}
                                                className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold text-xl px-8 py-7 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                                            >
                                                Redeem 60% OFF
                                            </Button>
                                            <p className="text-sm text-center text-white/70 mt-4">
                                                14-day money back guarantee
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}

                    {/* Bundle View */}
                    {viewMode === 'bundle' && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-12 shadow-2xl">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:60px_60px]" />
                                </div>

                                <div className="relative">
                                    {/* Header */}
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                                        {/* Left Side - Content */}
                                        <div className="flex-1 text-white">
                                            <h2 className="text-3xl md:text-4xl font-bold mb-3">
                                                Celio X
                                            </h2>
                                            <p className="text-xl md:text-2xl font-semibold mb-4 text-white/90">
                                                <span className="line-through text-white/60">$97</span> $38.80/month
                                            </p>
                                            <p className="text-lg text-white/90">
                                                All 12+ AI Helpers
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

                                    {/* Benefits */}
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                                        <h3 className="text-xl font-semibold text-white mb-4">What's included:</h3>
                                        <ul className="grid md:grid-cols-2 gap-3">
                                            {BUNDLE_BENEFITS.map((benefit, index) => (
                                                <li key={index} className="flex items-start gap-3 text-white/90">
                                                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* CTA Button */}
                                    <Button 
                                        size="lg"
                                        onClick={handleRedeemClick}
                                        className="w-full bg-white text-purple-700 hover:bg-gray-100 font-bold text-xl px-8 py-7 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                                    >
                                        Redeem 60% OFF
                                    </Button>
                                    <p className="text-sm text-center text-white/70 mt-4">
                                        14-day money back guarantee
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </Container>

            {/* Pricing Modal - Slides up from bottom */}
            <AnimatePresence>
                {showPricingModal && (
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
                                        Pricing Options
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
                                        Get {selectedHelper ? selectedHelper.name : "Celio X"} for ${PRICING_TIERS.find(t => t.id === selectedPricingTier)?.discountedPrice}/m
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

