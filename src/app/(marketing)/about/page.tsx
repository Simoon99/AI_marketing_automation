import Wrapper from "@/components/global/wrapper";
import Container from "@/components/global/container";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import Link from "next/link";
import { Sparkles, Users, Target, Rocket, Heart, Globe, ArrowRight } from "lucide-react";

const VALUES = [
    {
        title: "Innovation First",
        description: "We're constantly pushing the boundaries of what's possible with AI",
        icon: Sparkles,
    },
    {
        title: "User-Centric",
        description: "Every feature is designed with our users' needs in mind",
        icon: Users,
    },
    {
        title: "Mission-Driven",
        description: "Empowering small teams to compete with billion-dollar companies",
        icon: Target,
    },
    {
        title: "Fast & Reliable",
        description: "Built for speed, stability, and scale from day one",
        icon: Rocket,
    },
];

const STATS = [
    { value: "50+", label: "AI Power-Ups" },
    { value: "12", label: "Specialized Helpers" },
    { value: "20+", label: "Integrations" },
    { value: "24/7", label: "Availability" },
];

export default function AboutPage() {
    return (
        <Wrapper className="py-20">
            {/* Hero Section */}
            <Container>
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
                    <button className="group relative grid overflow-hidden rounded-full px-2 py-1 shadow-[0_1000px_0_0_hsl(0_0%_15%)_inset] transition-colors duration-200 mx-auto mb-6">
                        <span>
                            <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                        </span>
                        <span className="backdrop absolute inset-[1px] rounded-full bg-background transition-colors duration-200 group-hover:bg-neutral-800" />
                        <span className="z-10 py-0.5 text-sm text-neutral-100 flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5" />
                            About Celio
                        </span>
                    </button>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold !leading-tight mb-6">
                        Empowering Small Teams to Build <br />
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Billion-Dollar Companies
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                        We believe that with the right AI tools, a small team can accomplish what used to require hundreds of employees. Celio is that tool.
                    </p>
                </div>
            </Container>

            {/* Mission Section */}
            <Container>
                <div className="bg-card border border-border rounded-3xl p-8 md:p-12 mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                                Our Mission
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                We're on a mission to democratize enterprise-level capabilities for solopreneurs and small teams. By combining AI Agents, specialized Helpers, and powerful Power-Ups, we're creating an AI workforce that never sleeps.
                            </p>
                            <p className="text-lg text-muted-foreground">
                                Every feature we build is designed to help you do more with less - less time, less resources, less headcount. More impact.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center">
                                <Globe className="w-32 h-32 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Values Grid */}
            <Container>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-8">
                    What We Stand For
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {VALUES.map((value, index) => (
                         <MagicCard
                            key={index}
                            gradientFrom="#6366f1"
                            gradientTo="#8b5cf6"
                            gradientColor="rgba(99,102,241,0.1)"
                            className="p-6 rounded-2xl"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                                <value.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                            <p className="text-sm text-muted-foreground">{value.description}</p>
                        </MagicCard>
                    ))}
                </div>
            </Container>

            {/* Stats Section */}
            <Container>
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 mb-16">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-12">
                        Celio by the Numbers
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {STATS.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>

            {/* Team Section */}
            <Container>
                <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                            Built by Makers, For Makers
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            We're a small team of engineers, designers, and AI enthusiasts who believe in the power of automation and AI. We use Celio to build Celio - eating our own dog food every single day.
                        </p>
                        <p className="text-lg text-muted-foreground">
                            Join us in our mission to redefine what's possible for small teams.
                        </p>
                    </div>
                </div>
            </Container>

            {/* CTA Section */}
            <Container className="mt-16">
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                        Ready to Join the Revolution?
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        Start building your AI-powered business today. You deserve to win back time.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/pricing">
                            <Button variant="secondary" size="lg" className="gap-2 rounded-full">
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <a href="mailto:managercelio.ai@gmail.com">
                            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full">
                                Contact Us
                            </Button>
                        </a>
                    </div>
                </div>
            </Container>
        </Wrapper>
    );
}

