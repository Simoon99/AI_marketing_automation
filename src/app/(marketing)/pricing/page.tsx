"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib";
import { Button } from "@/components/ui/button";
import { 
    TrendingUp, Briefcase, DollarSign, BarChart, Users, Mail, 
    Code, ShoppingCart, PenTool, MessageSquare, Lightbulb, X, Check,
    Zap, Globe, Brain, Shield, Clock, ChevronLeft, ChevronRight, Star
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

const MAIN_FEATURES = [
    {
        icon: Users,
        title: 'All 12+ helpers for most areas of your work',
        description: 'Unlock all helpers for customer support to data analysis, to personal and business development. All helpers in one team.',
    },
    {
        icon: Zap,
        title: 'All the 90+ power-ups for one-click work',
        description: 'Do one click work with power-ups. Simply adjust and complete tasks in seconds. From image generation, to creating LinkedIn posts, to optimizing landing pages.',
    },
    {
        icon: Brain,
        title: 'All the features for Brain AI',
        description: 'Personalize your outputs for your unique liking based on your knowledge. Helpers can scrape websites and use all the information while completing your tasks.',
    },
    {
        icon: Globe,
        title: 'Complete tasks in 100+ languages',
        description: 'Celio Helpers support over 100+ native languages for all your needs.',
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

// Countdown Timer Component
function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 6,
        seconds: 19
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                
                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    // Reset timer
                    return { hours: 2, minutes: 6, seconds: 19 };
                }
                
                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
            </span>
        </div>
    );
}

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
        <div className="min-h-screen bg-black text-white">
            {/* Countdown Timer Banner - Always visible at top */}
            <div className="sticky top-0 z-40 bg-gradient-to-r from-green-600 to-green-500 text-white py-3">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4">
                    <span className="font-bold text-lg">Summer Sale: 60% OFF</span>
                    <CountdownTimer />
                </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="pb-32">
                <Container>
                    <div className="max-w-7xl mx-auto px-4 py-12">
                        {/* Helper Selection Tabs */}
                        <div className="flex justify-center mb-16">
                            <div className="inline-flex rounded-lg bg-zinc-900 p-1.5 border border-zinc-800">
                                <button 
                                    onClick={() => {
                                        setViewMode('individual');
                                        setSelectedHelper(null);
                                    }}
                                    className={cn(
                                        "px-8 py-3 rounded-md font-medium transition-all",
                                        viewMode === 'individual' 
                                            ? "bg-white text-black shadow-md" 
                                            : "text-zinc-400 hover:text-white"
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
                                        "px-8 py-3 rounded-md font-medium transition-all",
                                        viewMode === 'bundle' 
                                            ? "bg-white text-black shadow-md" 
                                            : "text-zinc-400 hover:text-white"
                                    )}
                                >
                                    Celio X
                                </button>
                            </div>
                        </div>

                        {/* Individual View */}
                        {viewMode === 'individual' && selectedHelper && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-5xl mx-auto mb-16"
                            >
                                <div className={cn(
                                    "relative overflow-hidden rounded-3xl p-12 shadow-2xl",
                                    "bg-gradient-to-br",
                                    selectedHelper.color
                                )}>
                                    <div className="relative">
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl">
                                                {selectedHelper.emoji}
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-4xl font-bold mb-2">
                                                    {selectedHelper.name}
                                                </h2>
                                                <p className="text-xl text-white/90">
                                                    {selectedHelper.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                            <h3 className="text-xl font-semibold mb-4">What's included:</h3>
                                            <ul className="space-y-3">
                                                {selectedHelper.benefits.map((benefit, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                                        <span>{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Individual Helpers Row */}
                        {viewMode === 'individual' && (
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Helper</h2>
                                <div className="flex items-center justify-center gap-4 flex-wrap max-w-6xl mx-auto">
                                    {HELPERS.map((helper, index) => (
                                        <motion.button
                                            key={helper.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.03 }}
                                            onClick={() => handleHelperClick(helper)}
                                            className="group relative flex flex-col items-center transition-all duration-300 cursor-pointer"
                                        >
                                            <div className={cn(
                                                "w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all",
                                                "bg-gradient-to-br shadow-lg hover:scale-110",
                                                helper.color,
                                                selectedHelper?.id === helper.id && "ring-4 ring-white ring-offset-2 ring-offset-black scale-110"
                                            )}>
                                                {helper.emoji}
                                            </div>
                                            <h3 className="font-medium text-sm text-center mt-2 line-clamp-2 max-w-[90px]">
                                                {helper.name}
                                            </h3>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bundle View - Main Features */}
                        {viewMode === 'bundle' && (
                            <>
                                {/* Everything Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-16"
                                >
                                    <h2 className="text-4xl font-bold mb-12 text-center">Everything you're getting with Celio X</h2>
                                    <div className="max-w-5xl mx-auto bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
                                        <div className="space-y-8">
                                            {MAIN_FEATURES.map((feature, index) => {
                                                const Icon = feature.icon;
                                                return (
                                                    <div key={index} className="flex gap-4">
                                                        <Icon className="w-8 h-8 flex-shrink-0 text-white" />
                                                        <div>
                                                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                                            <p className="text-zinc-400">{feature.description}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Included Helpers Carousel */}
                                <div className="mb-16">
                                    <h2 className="text-3xl font-bold mb-4">Included with Celio X</h2>
                                    <p className="text-zinc-400 mb-8">Helpers: 12+ AI helpers for all your tasks</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {HELPERS.slice(0, 8).map((helper) => (
                                            <div
                                                key={helper.id}
                                                className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all"
                                            >
                                                <div className={cn(
                                                    "w-full aspect-square rounded-2xl flex items-center justify-center text-6xl mb-4",
                                                    "bg-gradient-to-br",
                                                    helper.color
                                                )}>
                                                    {helper.emoji}
                                                </div>
                                                <h3 className="font-bold text-lg mb-1">{helper.name}</h3>
                                                <p className="text-sm text-zinc-400">{helper.role}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Benefits */}
                                <div className="mb-16">
                                    <h2 className="text-3xl font-bold mb-12 text-center">You're also getting</h2>
                                    <div className="max-w-5xl mx-auto bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
                                        <div className="space-y-6">
                                            {BUNDLE_BENEFITS.map((benefit, index) => (
                                                <div key={index} className="flex items-start gap-4">
                                                    <Check className="w-6 h-6 flex-shrink-0 text-green-500" />
                                                    <span className="text-lg">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Trust Section */}
                                <div className="mb-16 max-w-5xl mx-auto">
                                    <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-12">
                                        <div className="text-center mb-8">
                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                {[1,2,3,4,5].map((i) => (
                                                    <Star key={i} className="w-6 h-6 fill-green-500 text-green-500" />
                                                ))}
                                            </div>
                                            <h2 className="text-3xl font-bold mb-4">Trusted by thousands of entrepreneurs</h2>
                                            <p className="text-zinc-400">Over 40,000 entrepreneurs from more than 100 countries around the globe trust Celio.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Guarantee Section */}
                                <div className="mb-16 max-w-5xl mx-auto">
                                    <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-12">
                                        <div className="flex items-center gap-6 mb-8">
                                            <Shield className="w-16 h-16 text-green-500" />
                                            <div>
                                                <h2 className="text-3xl font-bold mb-2">Risk-free guarantee with your order</h2>
                                                <p className="text-zinc-400">Enjoy full access to Celio products completely risk-free. If you are not 100% satisfied, tell us within 14 days of buying Celio Helpers and get a full refund.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Container>
            </div>

            {/* Fixed Floating Button - Always visible at bottom */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-zinc-800 py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col items-center gap-2">
                        <Button
                            size="lg"
                            onClick={handleRedeemClick}
                            className="w-full max-w-2xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold text-xl px-8 py-7 rounded-xl shadow-2xl transition-all hover:scale-105"
                        >
                            Redeem 60% OFF
                        </Button>
                        <p className="text-sm text-zinc-400">14-day money back guarantee</p>
                    </div>
                </div>
            </div>

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
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="bg-zinc-950 rounded-t-3xl shadow-2xl border-t border-zinc-800">
                                {/* Header */}
                                <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 px-6 py-4 rounded-t-3xl flex items-center justify-between z-10">
                                    <h2 className="text-2xl font-bold">
                                        Pricing Options
                                    </h2>
                                    <button
                                        onClick={closePricingModal}
                                        className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
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
                                                        ? "border-green-500 bg-green-500/10 shadow-lg"
                                                        : "border-zinc-800 hover:border-zinc-700 hover:shadow-md"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-lg font-semibold">
                                                                ${tier.discountedPrice}{tier.billingPeriod}
                                                            </span>
                                                            {tier.isRecommended && (
                                                                <span className="px-3 py-1 bg-green-500 text-black text-xs font-bold rounded-full">
                                                                    60% OFF
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-zinc-400">
                                                            {tier.description}
                                                        </p>
                                                        <p className="text-xs text-zinc-500 mt-1 line-through">
                                                            ${tier.originalPrice}{tier.billingPeriod}
                                                        </p>
                                                    </div>
                                                    {selectedPricingTier === tier.id && (
                                                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                                            <Check className="w-4 h-4 text-black" />
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        size="lg"
                                        className="w-full mt-8 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white text-lg py-6 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all"
                                    >
                                        Get {selectedHelper ? selectedHelper.name : "Celio X"} for ${PRICING_TIERS.find(t => t.id === selectedPricingTier)?.discountedPrice}/m
                                    </Button>

                                    <p className="text-center text-sm text-zinc-400 mt-4">
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
