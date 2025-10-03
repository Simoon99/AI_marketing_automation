import Wrapper from "@/components/global/wrapper";
import Container from "@/components/global/container";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { Sparkles, Workflow, Brain, Zap, CheckCircle, ArrowRight } from "lucide-react";

const AGENT_FEATURES = [
    {
        title: "Visual Workflow Builder",
        description: "Drag-and-drop interface to create complex automations without code",
        icon: Workflow,
    },
    {
        title: "AI-Powered Generation",
        description: "Describe what you want and let AI generate the workflow for you",
        icon: Brain,
    },
    {
        title: "16+ Node Types",
        description: "Conditions, loops, filters, transforms, and more for complete control",
        icon: Zap,
    },
    {
        title: "Real Integrations",
        description: "Connect to Gmail, Slack, SendGrid, Shopify, and 20+ services",
        icon: CheckCircle,
    },
];

const BENEFITS = [
    "Automate repetitive tasks and save hours every day",
    "Connect multiple apps and services seamlessly",
    "Run workflows on schedule or trigger them manually",
    "Handle errors gracefully with retry logic",
    "Process data with AI and LLMs",
    "Scale from simple to complex workflows",
];

export default function AgentsPage() {
    return (
        <Wrapper className="py-20">
            {/* Hero Section */}
            <Container>
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold !leading-tight mb-6">
                        Automate Everything with <br />
                        <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                            Intelligent Workflows
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                        Create powerful AI agents that work 24/7. From simple automations to complex multi-step workflows with branching logic and parallel execution.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/pricing">
                            <Button variant="blue" size="lg" className="gap-2 rounded-full">
                                Start Building
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline" size="lg" className="rounded-full">
                                Try Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>

            {/* Features Grid */}
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {AGENT_FEATURES.map((feature, index) => (
                        <MagicCard
                            key={index}
                            gradientFrom="#8b5cf6"
                            gradientTo="#a855f7"
                            gradientColor="rgba(139,92,246,0.1)"
                            className="p-6 rounded-2xl"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
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
                                Why Teams Choose Our Agents
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Built for power users and beginners alike. Our visual workflow builder makes it easy to create sophisticated automations without writing a single line of code.
                            </p>
                            <div className="space-y-4">
                                {BENEFITS.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-foreground">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center">
                                <Workflow className="w-32 h-32 text-violet-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* CTA Section */}
            <Container className="mt-16">
                <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-3xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                        Ready to Automate Your Workflow?
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of teams using AI Agents to save time and scale their operations.
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

