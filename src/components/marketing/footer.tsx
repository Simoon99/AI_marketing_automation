import Link from "next/link";
import Container from "../global/container";
import Icons from "../global/icons";

const Footer = () => {
    return (
        <footer className="flex flex-col relative items-center justify-center border-t border-border/50 pt-12 pb-8 px-6 lg:px-8 w-full max-w-7xl mx-auto">
            {/* Single Combined Section */}
            <Container className="w-full mb-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
                    {/* Brand */}
                    <div className="flex flex-col items-start max-w-xs">
                        <div className="flex items-center gap-2 mb-3">
                            <Icons.icon className="w-auto h-5" />
                            <span className="text-lg font-semibold text-foreground">
                                Celio
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                            Your AI workforce that never sleeps. Empowering founders to scale lean billion-dollar companies.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Copyright © {new Date().getFullYear()} Celio, Inc.<br />
                            All rights reserved
                        </p>
                    </div>

                    {/* All Links Combined */}
                    <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground max-w-4xl">
                        <Link href="/features/helpers" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Celio Helpers
                        </Link>
                        <Link href="/features/agents" className="hover:text-foreground transition-colors whitespace-nowrap">
                            AI Agents
                        </Link>
                        <Link href="/features/power-ups" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Power-ups
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Blog
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Case studies
                        </Link>
                        <Link href="/dashboard" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Support
                        </Link>
                        <Link href="/dashboard" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Help center
                        </Link>
                        <a href="mailto:hello@celio.ai" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Contact
                        </a>
                        <Link href="/pricing" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Plans and Payments
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
                            FAQ
                        </Link>
                        <Link href="/about" className="hover:text-foreground transition-colors whitespace-nowrap">
                            About Us
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Become an Affiliate
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Careers
                        </Link>
                        <Link href="/privacy" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Privacy policy
                        </Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Terms and conditions
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Refund policy
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors whitespace-nowrap">
                            Money-Back Guarantee
                        </Link>
                    </div>
                </div>
            </Container>
        </footer>
    )
};

export default Footer
