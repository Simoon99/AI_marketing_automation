"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    Brain
} from "lucide-react";
import { cn } from "@/lib";

type PowerUp = {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    category: string;
    isPopular?: boolean;
    isNew?: boolean;
    gradient: string;
};

const POWER_UPS: PowerUp[] = [
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

export default function PowerUpsTab() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold">Power Ups</h2>
                <p className="text-muted-foreground mt-2">
                    Supercharge your marketing with AI-powered tools and features
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {POWER_UPS.map((powerUp) => (
                    <PowerUpCard key={powerUp.id} powerUp={powerUp} />
                ))}
            </div>
        </div>
    );
}

function PowerUpCard({ powerUp }: { powerUp: PowerUp }) {
    const Icon = powerUp.icon;

    return (
        <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 border-border bg-card">
            {/* Gradient background on hover */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br",
                powerUp.gradient
            )}></div>

            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                        powerUp.gradient
                    )}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-2">
                        {powerUp.isPopular && (
                            <Badge variant="secondary" className="text-xs">
                                Popular
                            </Badge>
                        )}
                        {powerUp.isNew && (
                            <Badge className="text-xs bg-blue-600 hover:bg-blue-700">
                                New
                            </Badge>
                        )}
                    </div>
                </div>
                <CardTitle className="mt-4">{powerUp.name}</CardTitle>
                <CardDescription className="text-sm">
                    {powerUp.description}
                </CardDescription>
            </CardHeader>

            <CardFooter className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{powerUp.category}</span>
                <Button size="sm" variant="ghost" className="group-hover:bg-secondary">
                    Activate
                </Button>
            </CardFooter>
        </Card>
    );
}

