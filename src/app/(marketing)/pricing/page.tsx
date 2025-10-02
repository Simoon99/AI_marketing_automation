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

const BUNDLE_PRICING_TIERS: PricingTier[] = [
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

const INDIVIDUAL_PRICING_TIERS: PricingTier[] = [
    {
        id: 'yearly',
        name: 'Pay Yearly',
        originalPrice: 19.50,
        discountedPrice: 7.80,
        billingPeriod: '/month',
        description: 'Pay yearly.',
        isRecommended: true,
    },
    {
        id: 'monthly',
        name: 'Pay Monthly',
        originalPrice: 39,
        discountedPrice: 15.60,
        billingPeriod: '/month',
        description: 'Pay monthly',
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
    const [selectedPricingTier, setSelectedPricingTier] = useState<string>('yearly');

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
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Countdown Timer Banner - Always visible at top */}
            <div className="sticky top-0 z-40 bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
                    <span className="font-semibold text-base">Summer Sale: 60% OFF</span>
                    <CountdownTimer />
                </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="pb-32">
                <Container>
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        {/* Helper Selection Tabs */}
                        <div className="flex justify-center mb-12">
                            <div className="inline-flex rounded-lg bg-muted/50 p-1.5 backdrop-blur-sm border border-border">
                                <button 
                                    onClick={() => {
                                        setViewMode('individual');
                                        setSelectedHelper(null);
                                    }}
                                    className={cn(
                                        "px-6 py-2.5 rounded-md font-medium transition-all text-sm",
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
                                        "px-6 py-2.5 rounded-md font-medium transition-all text-sm",
                                        viewMode === 'bundle' 
                                            ? "bg-background shadow-md" 
                                            : "hover:bg-background/50"
                                    )}
                                >
                                    Celio X
                                </button>
                            </div>
                        </div>

                        {/* Individual Helpers Row */}
                        {viewMode === 'individual' && (
                            <div className="mb-8">
                                <div className="flex items-center justify-center gap-3 flex-wrap max-w-5xl mx-auto">
                                    {HELPERS.map((helper, index) => (
                                        <motion.button
                                            key={helper.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.02 }}
                                            onClick={() => handleHelperClick(helper)}
                                            className="group relative flex flex-col items-center transition-all duration-300 cursor-pointer"
                                        >
                                            <div className={cn(
                                                "w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all",
                                                "bg-gradient-to-br shadow-md hover:scale-110",
                                                helper.color,
                                                selectedHelper?.id === helper.id && "ring-4 ring-primary ring-offset-2 ring-offset-background scale-110"
                                            )}>
                                                {helper.emoji}
                                            </div>
                                            <h3 className="font-medium text-xs text-center mt-1.5 line-clamp-2 max-w-[80px]">
                                                {helper.name}
                                            </h3>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Individual Helper Details - Below avatars */}
                        {viewMode === 'individual' && selectedHelper && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-4xl mx-auto mb-12"
                            >
                                <div className={cn(
                                    "relative overflow-hidden rounded-2xl p-8 shadow-lg border",
                                    "bg-gradient-to-br",
                                    selectedHelper.color
                                )}>
                                    <div className="relative">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
                                                {selectedHelper.emoji}
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold text-white mb-1">
                                                    {selectedHelper.name}
                                                </h2>
                                                <p className="text-base text-white/90">
                                                    {selectedHelper.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
                                            <h3 className="text-base font-semibold text-white mb-3">What's included:</h3>
                                            <ul className="space-y-2">
                                                {selectedHelper.benefits.map((benefit, index) => (
                                                    <li key={index} className="flex items-start gap-2.5 text-white/95">
                                                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm">{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Bundle View - Main Features */}
                        {viewMode === 'bundle' && (
                            <>
                                {/* Everything Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-12"
                                >
                                    <h2 className="text-2xl font-bold mb-8">Everything you're getting with Celio X</h2>
                                    <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border p-6">
                                        <div className="space-y-6">
                                            {MAIN_FEATURES.map((feature, index) => {
                                                const Icon = feature.icon;
                                                return (
                                                    <div key={index} className="flex gap-3">
                                                        <Icon className="w-6 h-6 flex-shrink-0" />
                                                        <div>
                                                            <h3 className="text-base font-semibold mb-1">{feature.title}</h3>
                                                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Included Helpers */}
                                <div className="mb-12">
                                    <h2 className="text-2xl font-bold mb-3">Included with Celio X</h2>
                                    <p className="text-muted-foreground mb-6 text-sm">Helpers: 12+ AI helpers for all your tasks</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {HELPERS.slice(0, 8).map((helper) => (
                                            <div
                                                key={helper.id}
                                                className="bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-all"
                                            >
                                                <div className={cn(
                                                    "w-full aspect-square rounded-xl flex items-center justify-center text-4xl mb-3",
                                                    "bg-gradient-to-br",
                                                    helper.color
                                                )}>
                                                    {helper.emoji}
                                                </div>
                                                <h3 className="font-semibold text-sm mb-0.5">{helper.name}</h3>
                                                <p className="text-xs text-muted-foreground">{helper.role}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Benefits */}
                                <div className="mb-12">
                                    <h2 className="text-2xl font-bold mb-6">You're also getting</h2>
                                    <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border p-6">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {BUNDLE_BENEFITS.map((benefit, index) => (
                                                <div key={index} className="flex items-start gap-2.5">
                                                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                                                    <span className="text-sm">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Trust Section */}
                                <div className="mb-12 max-w-4xl mx-auto">
                                    <div className="bg-card rounded-2xl border border-border p-8">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1.5 mb-3">
                                                {[1,2,3,4,5].map((i) => (
                                                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                                                ))}
                                            </div>
                                            <h2 className="text-xl font-bold mb-2">Trusted by thousands of entrepreneurs</h2>
                                            <p className="text-sm text-muted-foreground">Over 40,000 entrepreneurs from more than 100 countries around the globe trust Celio.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Guarantee Section */}
                                <div className="mb-12 max-w-4xl mx-auto">
                                    <div className="bg-card rounded-2xl border border-border p-6">
                                        <div className="flex items-start gap-4">
                                            <Shield className="w-10 h-10 text-primary flex-shrink-0" />
                                            <div>
                                                <h2 className="text-lg font-bold mb-1.5">Risk-free guarantee with your order</h2>
                                                <p className="text-sm text-muted-foreground">Enjoy full access to Celio products completely risk-free. If you are not 100% satisfied, tell us within 14 days of buying Celio Helpers and get a full refund.</p>
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
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border py-3">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col items-center gap-1.5">
                        <Button
                            size="lg"
                            onClick={handleRedeemClick}
                            className="w-full max-w-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold text-base px-8 py-5 rounded-xl shadow-xl transition-all hover:scale-[1.02]"
                        >
                            Redeem 60% OFF
                        </Button>
                        <p className="text-xs text-muted-foreground">14-day money back guarantee</p>
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
                                <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-3.5 rounded-t-3xl flex items-center justify-between z-10">
                                    <h2 className="text-xl font-bold">
                                        Pricing Options
                                    </h2>
                                    <button
                                        onClick={closePricingModal}
                                        className="p-2 rounded-full hover:bg-muted transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="px-6 py-6 max-w-xl mx-auto">
                                    {/* Pricing Tiers */}
                                    <div className="space-y-3">
                                        {(selectedHelper ? INDIVIDUAL_PRICING_TIERS : BUNDLE_PRICING_TIERS).map((tier) => (
                                            <button
                                                key={tier.id}
                                                onClick={() => setSelectedPricingTier(tier.id)}
                                                className={cn(
                                                    "w-full p-5 rounded-xl border-2 transition-all text-left relative",
                                                    selectedPricingTier === tier.id
                                                        ? "border-primary bg-primary/5 shadow-md"
                                                        : "border-border hover:border-primary/50 hover:shadow-sm"
                                                )}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2.5 mb-1.5">
                                                            <span className="text-base font-semibold">
                                                                ${tier.discountedPrice}{tier.billingPeriod}
                                                            </span>
                                                            {tier.isRecommended && (
                                                                <span className="px-2.5 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                                                                    60% OFF
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            {tier.description}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1 line-through">
                                                            ${tier.originalPrice}{tier.billingPeriod}
                                                        </p>
                                                    </div>
                                                    {selectedPricingTier === tier.id && (
                                                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-primary-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        size="lg"
                                        className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white text-base py-5 rounded-xl font-bold shadow-lg transition-all"
                                    >
                                        Get {selectedHelper ? selectedHelper.name : "Celio X"} for ${(selectedHelper ? INDIVIDUAL_PRICING_TIERS : BUNDLE_PRICING_TIERS).find(t => t.id === selectedPricingTier)?.discountedPrice}/m
                                    </Button>

                                    <p className="text-center text-xs text-muted-foreground mt-3">
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
