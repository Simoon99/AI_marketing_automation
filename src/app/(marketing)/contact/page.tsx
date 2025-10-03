"use client";

import Wrapper from "@/components/global/wrapper";
import Container from "@/components/global/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MagicCard } from "@/components/ui/magic-card";
import { Mail, MessageSquare, HelpCircle, Send } from "lucide-react";
import { useState } from "react";

const CONTACT_OPTIONS = [
    {
        title: "Sales Inquiries",
        description: "Want to learn more about Celio for your team?",
        icon: MessageSquare,
        email: "sales@celio.ai",
    },
    {
        title: "Support",
        description: "Need help with your account or features?",
        icon: HelpCircle,
        email: "support@celio.ai",
    },
    {
        title: "General Questions",
        description: "Have a question or feedback for us?",
        icon: Mail,
        email: "hello@celio.ai",
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <Wrapper className="py-20">
            {/* Hero Section */}
            <Container>
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Get in Touch</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold !leading-tight mb-6">
                        We'd Love to <br />
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Hear From You
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground">
                        Have questions? Want to see a demo? Just want to chat about AI? <br />
                        We're here and we'd love to help.
                    </p>
                </div>
            </Container>

            {/* Contact Options */}
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {CONTACT_OPTIONS.map((option, index) => (
                        <MagicCard
                            key={index}
                            gradientFrom="#3b82f6"
                            gradientTo="#8b5cf6"
                            gradientColor="rgba(59,130,246,0.1)"
                            className="p-6 rounded-2xl text-center"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 mx-auto">
                                <option.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                            <a 
                                href={`mailto:${option.email}`}
                                className="text-sm text-primary hover:underline"
                            >
                                {option.email}
                            </a>
                        </MagicCard>
                    ))}
                </div>
            </Container>

            {/* Contact Form */}
            <Container>
                <div className="max-w-2xl mx-auto">
                    <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
                        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2 text-center">
                            Send Us a Message
                        </h2>
                        <p className="text-muted-foreground text-center mb-8">
                            Fill out the form below and we'll get back to you within 24 hours
                        </p>

                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                    <Send className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                                <p className="text-muted-foreground">
                                    We'll get back to you as soon as possible.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            required
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        required
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us more about what you need..."
                                        required
                                        className="mt-2 min-h-[150px]"
                                    />
                                </div>

                                <Button type="submit" variant="blue" size="lg" className="w-full gap-2">
                                    Send Message
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </Container>
        </Wrapper>
    );
}

