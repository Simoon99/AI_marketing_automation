"use client";

import { NAV_LINKS } from "@/constants";
import Link from "next/link";
import Icons from "../global/icons";
import Wrapper from "../global/wrapper";
import { Button } from "../ui/button";
import MobileMenu from "./mobile-menu";
import { cn } from "@/lib";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Users } from "lucide-react";

interface NavbarProps {
    sticky?: boolean;
}

const FEATURE_CARDS = [
    {
        title: "AI Agents",
        description: "Automate complex workflows with powerful AI agents",
        icon: Sparkles,
        href: "/features/agents",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        title: "AI Helpers",
        description: "Specialized assistants for every business function",
        icon: Users,
        href: "/features/helpers",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        title: "Power-Ups",
        description: "Supercharge your productivity with AI tools",
        icon: Zap,
        href: "/features/power-ups",
        gradient: "from-orange-500 to-pink-500",
    },
];

const Navbar = ({ sticky = true }: NavbarProps) => {
    const [featuresOpen, setFeaturesOpen] = useState(false);

    return (
        <header className={cn(
            "w-full h-16 bg-background/80 backdrop-blur-sm z-50",
            sticky && "sticky top-0"
        )}>
            <Wrapper className="h-full">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <Icons.icon className="w-6" />
                            <span className="text-xl font-semibold hidden lg:block">
                                Celio
                            </span>
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <ul className="flex items-center gap-8">
                            {NAV_LINKS.map((link, index) => (
                                <li 
                                    key={index} 
                                    className="text-sm font-medium relative"
                                    onMouseEnter={() => link.name === "Features" && setFeaturesOpen(true)}
                                    onMouseLeave={() => link.name === "Features" && setFeaturesOpen(false)}
                                >
                                    {link.name === "Features" ? (
                                        <>
                                            <button className="hover:text-primary transition-colors">
                                                {link.name}
                                            </button>
                                            <AnimatePresence>
                                                {featuresOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 pt-2"
                                                    >
                                                        <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-4 w-[600px]">
                                                            <div className="grid grid-cols-3 gap-3">
                                                                {FEATURE_CARDS.map((feature, idx) => (
                                                                    <Link 
                                                                        key={idx}
                                                                        href={feature.href}
                                                                        className="group"
                                                                    >
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: 20 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ delay: idx * 0.05 }}
                                                                            className="relative overflow-hidden rounded-xl p-4 bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                                                        >
                                                                            <div className={cn(
                                                                                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity",
                                                                                feature.gradient
                                                                            )} />
                                                                            
                                                                            <div className="relative z-10">
                                                                                <div className={cn(
                                                                                    "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3",
                                                                                    feature.gradient
                                                                                )}>
                                                                                    <feature.icon className="w-5 h-5 text-white" />
                                                                                </div>
                                                                                <h3 className="font-semibold mb-1 text-sm">
                                                                                    {feature.title}
                                                                                </h3>
                                                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                                                    {feature.description}
                                                                                </p>
                                                                            </div>
                                                                        </motion.div>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <Link href={link.href} className="hover:text-primary transition-colors">
                                            {link.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="hidden lg:block">
                            <Button variant="ghost" className="text-sm font-medium">
                                Log in
                            </Button>
                        </Link>
                        <Link href="/pricing" className="hidden lg:block">
                            <Button variant="blue">
                                Get Started
                            </Button>
                        </Link>
                        <MobileMenu />
                    </div>
                </div>
            </Wrapper>
        </header>
    )
};

export default Navbar
