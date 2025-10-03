import Wrapper from "@/components/global/wrapper";
import Container from "@/components/global/container";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { Users, TrendingUp, ShoppingCart, Mail, MessageSquare, DollarSign, CheckCircle, ArrowRight, Briefcase, Code } from "lucide-react";

const HELPER_TYPES = [
    {
        title: "Marketing Pro",
        description: "Content strategy, campaigns, and brand positioning",
        icon: TrendingUp,
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        title: "E-commerce Expert",
        description: "Store optimization, inventory, and sales analytics",
        icon: ShoppingCart,
        gradient: "from-green-500 to-emerald-500",
    },
    {
        title: "Sales Specialist",
        description: "Lead generation, pipeline management, and CRM",
        icon: DollarSign,
        gradient: "from-orange-500 to-amber-500",
    },
    {
        title: "Customer Support",
        description: "24/7 customer service and ticket management",
        icon: MessageSquare,
        gradient: "from-purple-500 to-pink-500",
    },
    {
        title: "Email Marketing",
        description: "Campaign creation, automation, and analytics",
        icon: Mail,
        gradient: "from-red-500 to-rose-500",
    },
    {
        title: "Business Strategy",
        description: "Planning, forecasting, and decision support",
        icon: Briefcase,
        gradient: "from-indigo-500 to-blue-500",
    },
];

const BENEFITS = [
    "12 specialized AI helpers for different business functions",
    "Each helper trained on industry best practices",
    "Switch between helpers seamlessly in one conversation",
    "Maintain context and chat history per helper",
    "Collapsible interface for focused work",
    "Real-time streaming responses",
];

export default function HelpersPage() {
    return (
        <Wrapper className="py-20">
            {/* Hero Section */}
            <Container>
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold !leading-tight mb-6">
                        Your Personal Team of <br />
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                            AI Specialists
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                        12 specialized AI assistants, each an expert in their field. From marketing to sales, customer support to finance - your complete AI workforce.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/pricing">
                            <Button variant="blue" size="lg" className="gap-2 rounded-full">
                                Meet Your Team
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" size="lg" className="rounded-full">
                                Try Helpers
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>

            {/* Helpers Grid */}
            <Container>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-8">
                    Meet Your AI Helpers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {HELPER_TYPES.map((helper, index) => (
                        <MagicCard
                            key={index}
                            gradientFrom="#3b82f6"
                            gradientTo="#06b6d4"
                            gradientColor="rgba(59,130,246,0.1)"
                            className="p-6 rounded-2xl"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${helper.gradient} flex items-center justify-center mb-4`}>
                                <helper.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{helper.title}</h3>
                            <p className="text-sm text-muted-foreground">{helper.description}</p>
                        </MagicCard>
                    ))}
                </div>
            </Container>

            {/* Benefits Section */}
            <Container>
                <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                                Why Businesses Love Our Helpers
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Each helper is specialized for specific tasks, trained on industry best practices, and ready to work 24/7. Switch between helpers seamlessly to get the right expertise when you need it.
                            </p>
                            <div className="space-y-4">
                                {BENEFITS.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-foreground">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center">
                                <Users className="w-32 h-32 text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* CTA Section */}
            <Container className="mt-16">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                        Ready to Build Your AI Team?
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        Get instant access to 12 specialized AI helpers and transform how you work.
                    </p>
                    <Link href="/pricing">
                        <Button variant="secondary" size="lg" className="gap-2 rounded-full">
                            Get Started Now
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </Container>
        </Wrapper>
    );
}

