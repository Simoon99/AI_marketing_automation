import { 
    Sparkles, 
    Zap, 
    Target, 
    TrendingUp, 
    Mail, 
    MessageSquare, 
    Image as ImageIcon, 
    FileText,
    BarChart3,
    Globe,
    Share2,
    Brain,
    type LucideIcon
} from "lucide-react";

export type PowerUp = {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    category: string;
    isPopular?: boolean;
    isNew?: boolean;
    gradient: string;
};

export const POWER_UPS: PowerUp[] = [
    {
        id: "content-generator",
        name: "AI Content Generator",
        description: "Generate high-quality blog posts, articles, and web content in seconds using advanced AI.",
        icon: FileText,
        category: "Content Creation",
        isPopular: true,
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        id: "social-wizard",
        name: "Social Media Wizard",
        description: "Create engaging social media posts optimized for each platform with AI-powered insights.",
        icon: Share2,
        category: "Social Media",
        isNew: true,
        gradient: "from-purple-500 to-pink-500",
    },
    {
        id: "email-campaigns",
        name: "Email Campaign Builder",
        description: "Design and automate email campaigns with AI-written copy and smart segmentation.",
        icon: Mail,
        category: "Email Marketing",
        isPopular: true,
        gradient: "from-orange-500 to-red-500",
    },
    {
        id: "ad-optimizer",
        name: "Ad Campaign Optimizer",
        description: "Optimize your ad campaigns with AI-driven insights and performance predictions.",
        icon: Target,
        category: "Advertising",
        gradient: "from-green-500 to-emerald-500",
    },
    {
        id: "image-creator",
        name: "AI Image Studio",
        description: "Generate stunning marketing images and graphics with AI-powered design tools.",
        icon: ImageIcon,
        category: "Creative",
        isNew: true,
        gradient: "from-violet-500 to-purple-500",
    },
    {
        id: "analytics-pro",
        name: "Analytics Pro",
        description: "Get deep insights into your marketing performance with AI-powered analytics.",
        icon: BarChart3,
        category: "Analytics",
        gradient: "from-yellow-500 to-orange-500",
    },
    {
        id: "seo-booster",
        name: "SEO Booster",
        description: "Optimize your content for search engines with AI-driven SEO recommendations.",
        icon: TrendingUp,
        category: "SEO",
        isPopular: true,
        gradient: "from-teal-500 to-green-500",
    },
    {
        id: "chatbot-builder",
        name: "Chatbot Builder",
        description: "Create intelligent chatbots to engage customers and automate support.",
        icon: MessageSquare,
        category: "Customer Service",
        gradient: "from-blue-500 to-indigo-500",
    },
    {
        id: "brand-voice",
        name: "Brand Voice AI",
        description: "Train AI to write in your unique brand voice across all marketing channels.",
        icon: Brain,
        category: "Branding",
        isNew: true,
        gradient: "from-pink-500 to-rose-500",
    },
    {
        id: "multi-language",
        name: "Multi-Language Pro",
        description: "Expand globally with AI-powered translation and localization for 100+ languages.",
        icon: Globe,
        category: "Localization",
        gradient: "from-cyan-500 to-blue-500",
    },
    {
        id: "performance-predictor",
        name: "Performance Predictor",
        description: "Predict campaign performance before launch using AI-powered forecasting.",
        icon: Zap,
        category: "Optimization",
        gradient: "from-amber-500 to-yellow-500",
    },
    {
        id: "trend-analyzer",
        name: "Trend Analyzer",
        description: "Stay ahead with AI that monitors and analyzes market trends in real-time.",
        icon: Sparkles,
        category: "Market Research",
        gradient: "from-fuchsia-500 to-purple-500",
    },
];

