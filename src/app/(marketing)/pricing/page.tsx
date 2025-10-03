"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib";
import { Button } from "@/components/ui/button";
import { 
    TrendingUp, Briefcase, DollarSign, BarChart, Users, Mail, 
    Code, ShoppingCart, PenTool, MessageSquare, Lightbulb, X, Check,
    Zap, Globe, Brain, Shield, Clock, ChevronLeft, ChevronRight, Star, Bot
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
        price: 39,
        benefits: [
            'AI-powered content strategy & planning',
            'Campaign planning and execution',
            'Brand positioning and messaging',
            'Competitor analysis and insights',
            'Marketing automation workflows',
            'Content calendar management',
            'Social media strategy',
            'Influencer outreach templates',
            'Marketing metrics dashboard',
            'ROI tracking and reporting',
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
        price: 39,
        benefits: [
            'Lead generation and qualification',
            'Outreach message templates',
            'Sales funnel optimization',
            'Objection handling scripts',
            'Deal closing techniques',
            'CRM integration and management',
            'Follow-up automation',
            'Sales pitch refinement',
            'Proposal templates',
            'Commission calculators',
        ],
    },
    {
        id: 'assistant',
        name: 'Personal Assistant',
        emoji: '🎩',
        role: 'Personal Assistant',
        description: 'Task management, scheduling, and personal organization',
        color: 'from-amber-500 to-yellow-500',
        icon: Users,
        price: 39,
        benefits: [
            'Task management and prioritization',
            'Calendar scheduling and reminders',
            'Email inbox management',
            'Meeting coordination and notes',
            'Travel planning and arrangements',
            'Personal goal tracking',
            'Daily briefings and summaries',
            'Expense tracking and organization',
            'Document organization',
            'Personal productivity optimization',
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
        price: 39,
        benefits: [
            'Process optimization and mapping',
            'Workflow automation setup',
            'Resource allocation planning',
            'Efficiency improvements',
            'Operations analytics dashboard',
            'SOP documentation',
            'Team task delegation',
            'Performance monitoring',
            'Bottleneck identification',
            'Scalability planning',
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
        price: 39,
        benefits: [
            'Customer support automation',
            'Onboarding workflow creation',
            'Retention strategies and campaigns',
            'Satisfaction surveys and NPS',
            'Support ticket management',
            'FAQ and knowledge base',
            'Live chat integration',
            'Customer feedback analysis',
            'Churn prevention strategies',
            'Success milestone tracking',
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
        price: 39,
        benefits: [
            'Email campaign creation',
            'Automation sequences',
            'A/B testing strategies',
            'Deliverability optimization',
            'Performance analytics',
            'List segmentation',
            'Template design',
            'Subject line optimization',
            'Re-engagement campaigns',
            'Email warmup strategies',
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
        price: 39,
        benefits: [
            'Integration recommendations',
            'API implementation guidance',
            'Technical troubleshooting',
            'System architecture advice',
            'Development best practices',
            'Webhook configuration',
            'Database optimization',
            'Security recommendations',
            'Code review assistance',
            'Documentation generation',
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
        price: 39,
        benefits: [
            'Data analysis and insights',
            'Custom report generation',
            'KPI tracking and monitoring',
            'Predictive analytics models',
            'Interactive dashboard creation',
            'Data visualization',
            'Trend identification',
            'Performance benchmarking',
            'Statistical analysis',
            'Real-time data monitoring',
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
        price: 39,
        benefits: [
            'Product page optimization',
            'Conversion rate improvement',
            'Shopping cart abandonment recovery',
            'Dynamic pricing strategies',
            'Inventory management',
            'Product description generation',
            'Upsell and cross-sell tactics',
            'Customer lifetime value analysis',
            'Checkout flow optimization',
            'Reviews and ratings management',
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
        price: 39,
        benefits: [
            'Blog post creation (1000+ words)',
            'Article writing and research',
            'SEO content optimization',
            'Content calendar planning',
            'Copywriting for ads and emails',
            'Meta descriptions and titles',
            'Social media captions',
            'Video scripts',
            'Case studies and whitepapers',
            'Content repurposing',
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
        price: 39,
        benefits: [
            'Multi-platform social strategy',
            'Content scheduling automation',
            'Engagement optimization',
            'Community management',
            'Social media analytics',
            'Hashtag research and optimization',
            'Influencer collaboration planning',
            'Contest and giveaway management',
            'Social listening and monitoring',
            'Trend spotting and adaptation',
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
        price: 39,
        benefits: [
            'Business model development',
            'Growth strategies and planning',
            'Market analysis and research',
            'Innovation consulting',
            'Strategic roadmapping',
            'Competitive positioning',
            'Go-to-market strategy',
            'Partnership opportunities',
            'Scaling frameworks',
            'Risk assessment and mitigation',
        ],
    },
];

const BUNDLE_BENEFITS = [
    'Access to all 12+ AI Helpers',
    'Unlimited usage across all tools',
    'Priority 24/7 customer support',
    'Early access to new features and updates',
    'Advanced analytics and insights dashboard',
    'Custom integrations with your existing tools',
    'Dedicated account manager (Enterprise)',
    'Team collaboration and workspace features',
    'White-label options available',
    'API access for custom workflows',
    'Training and onboarding sessions',
    'Monthly strategy consultation calls',
    'Advanced automation capabilities',
    'Custom AI model training',
    'Priority feature requests',
    'SLA guarantees and uptime monitoring',
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

// Helper functions to link Power-Ups and Agents to Helpers
function getHelperPowerUps(helperId: string) {
    const powerUpMapping: Record<string, Array<{name: string, emoji: string}>> = {
        'marketing': [
            { name: 'AI Static Ad Creator', emoji: '🎨' },
            { name: 'SEO/GEO Optimizer Pro', emoji: '🔍' },
            { name: 'Social Media Manager', emoji: '📱' },
            { name: 'Landing Page Builder', emoji: '🌐' },
        ],
        'sales': [
            { name: 'Sales Funnel Builder', emoji: '⚡' },
            { name: 'Lead Magnet Generator', emoji: '🧲' },
            { name: 'Email Campaign Automation', emoji: '📧' },
        ],
        'assistant': [
            { name: 'Task Manager Pro', emoji: '✅' },
            { name: 'Calendar Optimization', emoji: '📅' },
            { name: 'Email Organizer', emoji: '📧' },
        ],
        'analytics': [
            { name: 'Analytics Dashboard Builder', emoji: '📈' },
            { name: 'A/B Testing Suite', emoji: '🔬' },
            { name: 'Conversion Optimizer', emoji: '🎯' },
        ],
        'operations': [
            { name: 'Workflow Automation Builder', emoji: '⚙️' },
            { name: 'Task Management System', emoji: '✅' },
            { name: 'Team Collaboration Hub', emoji: '👥' },
        ],
        'content': [
            { name: 'Content Calendar Generator', emoji: '📅' },
            { name: 'Blog Post Writer AI', emoji: '✍️' },
            { name: 'Video Script Generator', emoji: '🎬' },
        ],
        'support': [
            { name: 'AI Support Chatbot', emoji: '💬' },
            { name: 'Ticket Management System', emoji: '🎫' },
            { name: 'Knowledge Base Builder', emoji: '📚' },
        ],
        'ecommerce': [
            { name: 'Product Description Generator', emoji: '🛍️' },
            { name: 'Inventory Management', emoji: '📦' },
            { name: 'Order Fulfillment Automation', emoji: '🚚' },
        ],
        'design': [
            { name: 'Brand Style Guide Generator', emoji: '🎨' },
            { name: 'Logo Variation Creator', emoji: '✨' },
            { name: 'Marketing Asset Generator', emoji: '🖼️' },
        ],
        'copywriting': [
            { name: 'Ad Copy Generator', emoji: '📝' },
            { name: 'Email Template Library', emoji: '✉️' },
            { name: 'Sales Page Writer', emoji: '📄' },
        ],
        'data': [
            { name: 'Data Visualization Tool', emoji: '📊' },
            { name: 'Report Generator Pro', emoji: '📈' },
            { name: 'Insights Dashboard', emoji: '💡' },
        ],
        'strategy': [
            { name: 'Business Plan Generator', emoji: '📋' },
            { name: 'Competitive Analysis Tool', emoji: '🔍' },
            { name: 'Growth Strategy Builder', emoji: '🚀' },
        ],
    };
    return powerUpMapping[helperId] || [];
}

function getHelperAgents(helperId: string) {
    const agentMapping: Record<string, Array<{name: string, emoji: string}>> = {
        'marketing': [
            { name: 'Social Media Monitor', emoji: '📱' },
            { name: 'Content Repurposer', emoji: '♻️' },
            { name: 'SEO Content Optimizer', emoji: '🔍' },
        ],
        'sales': [
            { name: 'Lead Qualifier', emoji: '🎯' },
            { name: 'Sales Email Sequencer', emoji: '📧' },
            { name: 'Meeting Scheduler', emoji: '📅' },
        ],
        'assistant': [
            { name: 'Daily Scheduler', emoji: '📅' },
            { name: 'Task Prioritizer', emoji: '✅' },
            { name: 'Reminder Agent', emoji: '⏰' },
        ],
        'analytics': [
            { name: 'Data Report Generator', emoji: '📈' },
            { name: 'Metrics Dashboard', emoji: '📊' },
            { name: 'Competitor Tracker', emoji: '🔬' },
        ],
        'operations': [
            { name: 'Task Automation', emoji: '⚙️' },
            { name: 'Workflow Manager', emoji: '🔄' },
            { name: 'Project Coordinator', emoji: '📋' },
        ],
        'content': [
            { name: 'Blog Post Scheduler', emoji: '📅' },
            { name: 'Content Calendar', emoji: '🗓️' },
            { name: 'Newsletter Generator', emoji: '📰' },
        ],
        'support': [
            { name: 'Customer Support Assistant', emoji: '💬' },
            { name: 'Ticket Prioritizer', emoji: '🎫' },
            { name: 'FAQ Updater', emoji: '❓' },
        ],
        'ecommerce': [
            { name: 'Product Onboarding', emoji: '🛍️' },
            { name: 'Order Tracker', emoji: '📦' },
            { name: 'Inventory Alert', emoji: '⚠️' },
        ],
        'design': [
            { name: 'Asset Organizer', emoji: '🎨' },
            { name: 'Brand Consistency Checker', emoji: '✅' },
            { name: 'Design Template Generator', emoji: '🖼️' },
        ],
        'copywriting': [
            { name: 'Copy Variations Generator', emoji: '📝' },
            { name: 'Tone Consistency Checker', emoji: '🎭' },
            { name: 'A/B Test Copy Creator', emoji: '🔬' },
        ],
        'data': [
            { name: 'Data Analyzer', emoji: '📊' },
            { name: 'Insight Generator', emoji: '💡' },
            { name: 'Trend Detector', emoji: '📈' },
        ],
        'strategy': [
            { name: 'Competitor Tracker', emoji: '🔍' },
            { name: 'Market Researcher', emoji: '📊' },
            { name: 'Growth Opportunity Finder', emoji: '🚀' },
        ],
    };
    return agentMapping[helperId] || [];
}

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
    const [selectedHelper, setSelectedHelper] = useState<Helper | null>(HELPERS[0]); // Default to first helper
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
                                        setSelectedHelper(HELPERS[0]); // Select first helper when switching to individual
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

                        {/* Individual Helpers Row - MOVED ABOVE HERO CARD */}
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

                        {/* Hero Card - Individual Helper - AFTER AVATARS */}
                        {viewMode === 'individual' && selectedHelper && (
                            <motion.div
                                key={selectedHelper.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-5xl mx-auto mb-8"
                            >
                                <div className={cn(
                                    "relative overflow-hidden rounded-3xl p-10 shadow-xl border-2",
                                    "bg-gradient-to-br",
                                    selectedHelper.color
                                )}>
                                    <div className="relative flex items-center justify-between">
                                        {/* Left Side - Content */}
                                        <div className="flex-1">
                                            <h2 className="text-4xl font-bold text-white mb-3">
                                                {selectedHelper.name}
                                            </h2>
                                            <p className="text-2xl font-semibold text-white/95 mb-4">
                                                ${selectedHelper.price}/month
                                            </p>
                                            <p className="text-lg text-white/90">
                                                {selectedHelper.description}
                                            </p>
                                        </div>

                                        {/* Right Side - Large Emoji */}
                                        <div className="flex-shrink-0 ml-8">
                                            <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-9xl">
                                                {selectedHelper.emoji}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Individual Helper Benefits, Power-Ups & Agents - Below hero card */}
                        {viewMode === 'individual' && selectedHelper && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-4xl mx-auto mb-12 space-y-6"
                            >
                                {/* Core Benefits */}
                                <div className="bg-card rounded-2xl border border-border p-6">
                                    <h3 className="text-lg font-semibold mb-4">What's included:</h3>
                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {selectedHelper.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-start gap-2.5">
                                                <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                                                <span className="text-sm">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Linked Power-Ups */}
                                {getHelperPowerUps(selectedHelper.id).length > 0 && (
                                    <div className="bg-card rounded-2xl border border-border p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-amber-500" />
                                            Relevant Power-Ups
                                        </h3>
                                        <ul className="grid md:grid-cols-2 gap-3">
                                            {getHelperPowerUps(selectedHelper.id).map((powerup, index) => (
                                                <li key={index} className="flex items-start gap-2.5">
                                                    <span className="text-base">{powerup.emoji}</span>
                                                    <span className="text-sm font-medium">{powerup.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Linked Agent Templates */}
                                {getHelperAgents(selectedHelper.id).length > 0 && (
                                    <div className="bg-card rounded-2xl border border-border p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <Bot className="w-5 h-5 text-blue-500" />
                                            Pre-built Agents
                                        </h3>
                                        <ul className="grid md:grid-cols-2 gap-3">
                                            {getHelperAgents(selectedHelper.id).map((agent, index) => (
                                                <li key={index} className="flex items-start gap-2.5">
                                                    <span className="text-base">{agent.emoji}</span>
                                                    <span className="text-sm font-medium">{agent.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Bundle View - Main Features */}
                        {viewMode === 'bundle' && (
                            <>
                                {/* Hero Card - Celio X Bundle */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="max-w-5xl mx-auto mb-8"
                                >
                                    <div className="relative overflow-hidden rounded-3xl p-10 shadow-xl border-2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:60px_60px]" />
                                        </div>

                                        <div className="relative flex items-center justify-between">
                                            {/* Left Side - Content */}
                                            <div className="flex-1 text-white">
                                            <h2 className="text-4xl font-bold mb-3">
                                                Celio X
                                            </h2>
                                            <p className="text-2xl font-semibold mb-4">
                                                $97/month
                                            </p>
                                            <p className="text-lg text-white/95">
                                                All 12+ AI Helpers
                                            </p>
                                            </div>

                                            {/* Right Side - Helper Avatars */}
                                            <div className="flex-shrink-0 ml-8">
                                                <div className="grid grid-cols-4 gap-2">
                                                    {HELPERS.slice(0, 8).map((helper, index) => (
                                                        <div
                                                            key={helper.id}
                                                            className={cn(
                                                                "w-16 h-16 rounded-full flex items-center justify-center text-2xl",
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
