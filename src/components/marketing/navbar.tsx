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

interface NavbarProps {
    sticky?: boolean;
}

const FEATURE_LINKS = [
    {
        title: "Celio Helpers",
        href: "/features/helpers",
    },
    {
        title: "AI Agents",
        href: "/features/agents",
    },
    {
        title: "Power-ups",
        href: "/features/power-ups",
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
                                                        className="absolute top-full left-0 mt-2 pt-2"
                                                    >
                                                        <div className="bg-background border border-border rounded-xl shadow-xl p-2 min-w-[160px]">
                                                            {FEATURE_LINKS.map((feature, idx) => (
                                                                <Link 
                                                                    key={idx}
                                                                    href={feature.href}
                                                                    className="block px-4 py-2.5 text-sm hover:bg-muted/50 rounded-lg transition-all"
                                                                >
                                                                    {feature.title}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : link.name === "Contact" ? (
                                        <a href="mailto:hello@celio.ai" className="link hover:text-primary transition-colors">
                                            {link.name}
                                        </a>
                                    ) : (
                                        <Link href={link.href} className="link hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="hidden lg:block">
                            <Button variant="ghost" className="text-sm font-medium rounded-full">
                                Log in
                            </Button>
                        </Link>
                        <Link href="/pricing" className="hidden lg:block">
                            <Button variant="blue" className="rounded-full">
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
