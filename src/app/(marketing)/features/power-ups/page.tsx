import Wrapper from "@/components/global/wrapper";
import Container from "@/components/global/container";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { Zap, Image, Video, FileText, BarChart, Globe, CheckCircle, ArrowRight, Palette, TrendingUp } from "lucide-react";

const POWERUP_CATEGORIES = [
    {
        title: "AI Ad Creator",
        description: "Generate stunning static ads with advanced AI image models",
        icon: Image,
        gradient: "from-orange-500 to-pink-500",
        featured: true,
    },
    {
        title: "Video Script Writer",
        description: "Create engaging video scripts for any platform",
        icon: Video,
        gradient: "from-purple-500 to-indigo-500",
        featured: true,
    },
    {
        title: "Content Calendar",
        description: "Plan and schedule your content strategy",
        icon: FileText,
        gradient: "from-green-500 to-teal-500",
        featured: true,
    },
    {
        title: "SEO/GEO Optimizer",
        description: "Boost your search rankings with AI-powered optimization",
        icon: TrendingUp,
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        title: "Landing Page Builder",
        description: "Build high-converting landing pages in minutes",
        icon: Globe,
        gradient: "from-yellow-500 to-orange-500",
    },
    {
        title: "Sales Funnel Builder",
        description: "Design and optimize your sales funnels",
        icon: BarChart,
        gradient: "from-red-500 to-pink-500",
    },
];

const BENEFITS = [
    "50+ power-ups covering every business need",
    "Interactive tools with AI assistance",
    "Export-ready deliverables",
    "Real-time collaboration features",
    "Template libraries for quick starts",
    "Seamless integration with agents and helpers",
];

export default function PowerUpsPage() {
    return (
        <Wrapper className="py-20">
            {/* Hero Section */}
            <Container>
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-orange-500">Power-Ups</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold !leading-tight mb-6">
                        Supercharge Your <br />
                        <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            Productivity with AI Tools
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                        50+ specialized AI-powered tools for every business task. From ad creation to SEO optimization, from video scripts to landing pages.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/pricing">
                            <Button variant="blue" size="lg" className="gap-2">
                                Explore Power-Ups
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" size="lg">
                                Try Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>

            {/* Power-Ups Grid */}
            <Container>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-8">
                    Featured Power-Ups
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {POWERUP_CATEGORIES.map((powerup, index) => (
                        <MagicCard
                            key={index}
                            gradientFrom="#f97316"
                            gradientTo="#ec4899"
                            gradientColor="rgba(249,115,22,0.1)"
                            className="p-6 rounded-2xl relative"
                        >
                            {powerup.featured && (
                                <div className="absolute top-4 right-4">
                                    <span className="px-2 py-1 text-xs font-medium bg-orange-500 text-white rounded-full">
                                        Popular
                                    </span>
                                </div>
                            )}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${powerup.gradient} flex items-center justify-center mb-4`}>
                                <powerup.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{powerup.title}</h3>
                            <p className="text-sm text-muted-foreground">{powerup.description}</p>
                        </MagicCard>
                    ))}
                </div>
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                        + 44 more power-ups for every business need
                    </p>
                    <Link href="/dashboard">
                        <Button variant="outline">
                            View All Power-Ups
                        </Button>
                    </Link>
                </div>
            </Container>

            {/* Benefits Section */}
            <Container className="mt-16">
                <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                                Why Power-Ups Are a Game Changer
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Each power-up is a specialized tool built to solve a specific problem. They're interactive, AI-assisted, and designed to help you create professional deliverables in minutes, not hours.
                            </p>
                            <div className="space-y-4">
                                {BENEFITS.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-foreground">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center">
                                <Zap className="w-32 h-32 text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* CTA Section */}
            <Container className="mt-16">
                <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                        Ready to Boost Your Productivity?
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        Get instant access to 50+ AI-powered power-ups and transform how you create.
                    </p>
                    <Link href="/pricing">
                        <Button variant="secondary" size="lg" className="gap-2">
                            Get Started Now
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </Container>
        </Wrapper>
    );
}

