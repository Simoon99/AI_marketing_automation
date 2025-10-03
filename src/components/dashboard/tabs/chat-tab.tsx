"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Briefcase, DollarSign, TrendingUp, Users, Mail, Code, BarChart, ShoppingCart, PenTool, MessageSquare, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
};

type Helper = {
    id: string;
    name: string;
    emoji: string;
    role: string;
    description: string;
    color: string;
    icon: any;
};

type HelperChats = {
    [helperId: string]: Message[];
};

const HELPERS: Helper[] = [
    {
        id: 'marketing',
        name: 'Marketing Pro',
        emoji: '🎯',
        role: 'Marketing Specialist',
        description: 'Content strategy, campaigns, and brand positioning',
        color: 'from-blue-500 to-cyan-500',
        icon: TrendingUp,
    },
    {
        id: 'sales',
        name: 'Sales Expert',
        emoji: '💼',
        role: 'Sales Specialist',
        description: 'Lead generation, outreach, and closing deals',
        color: 'from-green-500 to-emerald-500',
        icon: Briefcase,
    },
    {
        id: 'finance',
        name: 'Finance Guru',
        emoji: '💰',
        role: 'Financial Advisor',
        description: 'Budgeting, forecasting, and financial planning',
        color: 'from-amber-500 to-yellow-500',
        icon: DollarSign,
    },
    {
        id: 'operations',
        name: 'Ops Manager',
        emoji: '⚙️',
        role: 'Operations Specialist',
        description: 'Process optimization and workflow automation',
        color: 'from-purple-500 to-violet-500',
        icon: BarChart,
    },
    {
        id: 'customer',
        name: 'Support Hero',
        emoji: '🎧',
        role: 'Customer Success',
        description: 'Customer support, onboarding, and retention',
        color: 'from-pink-500 to-rose-500',
        icon: Users,
    },
    {
        id: 'email',
        name: 'Email Pro',
        emoji: '📧',
        role: 'Email Specialist',
        description: 'Email campaigns, automation, and optimization',
        color: 'from-indigo-500 to-blue-500',
        icon: Mail,
    },
    {
        id: 'tech',
        name: 'Tech Assistant',
        emoji: '💻',
        role: 'Technical Advisor',
        description: 'Integrations, APIs, and technical solutions',
        color: 'from-slate-500 to-gray-600',
        icon: Code,
    },
    {
        id: 'analytics',
        name: 'Data Analyst',
        emoji: '📊',
        role: 'Analytics Expert',
        description: 'Data analysis, insights, and reporting',
        color: 'from-teal-500 to-cyan-500',
        icon: BarChart,
    },
    {
        id: 'ecommerce',
        name: 'E-commerce Pro',
        emoji: '🛍️',
        role: 'E-commerce Specialist',
        description: 'Online sales, product optimization, and conversions',
        color: 'from-orange-500 to-red-500',
        icon: ShoppingCart,
    },
    {
        id: 'content',
        name: 'Content Writer',
        emoji: '✍️',
        role: 'Content Creator',
        description: 'Blog posts, articles, and creative writing',
        color: 'from-fuchsia-500 to-pink-500',
        icon: PenTool,
    },
    {
        id: 'social',
        name: 'Social Media',
        emoji: '📱',
        role: 'Social Media Manager',
        description: 'Social strategy, engagement, and community',
        color: 'from-cyan-500 to-blue-500',
        icon: MessageSquare,
    },
    {
        id: 'strategy',
        name: 'Strategist',
        emoji: '🎨',
        role: 'Business Strategist',
        description: 'Business planning, growth, and innovation',
        color: 'from-violet-500 to-purple-500',
        icon: Lightbulb,
    },
];

const getInitialMessage = (helper: Helper): Message => ({
    id: "initial-1",
    role: "assistant",
    content: `Hello! I'm your ${helper.role}. I specialize in ${helper.description}. How can I assist you today?`,
    timestamp: new Date(),
});

const INITIAL_CHATS: HelperChats = HELPERS.reduce((acc, helper) => {
    acc[helper.id] = [getInitialMessage(helper)];
    return acc;
}, {} as HelperChats);

export default function ChatTab() {
    const [helperChats, setHelperChats] = useState<HelperChats>(INITIAL_CHATS);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeHelper, setActiveHelper] = useState<Helper>(HELPERS[0]);
    const [helpersCollapsed, setHelpersCollapsed] = useState(true); // Start collapsed
    const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
    const [streamingContent, setStreamingContent] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const currentMessages = helperChats[activeHelper.id] || [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentMessages, streamingContent, activeHelper.id]);

    // Stream initial message when helper is first selected
    useEffect(() => {
        const messages = helperChats[activeHelper.id];
        if (messages && messages.length === 1) {
            const initialMessage = messages[0];
            streamText(initialMessage.content, initialMessage.id);
        }
    }, [activeHelper.id]);

    // Streaming text effect
    const streamText = (text: string, messageId: string) => {
        setStreamingMessageId(messageId);
        setStreamingContent("");
        let index = 0;
        
        const interval = setInterval(() => {
            if (index < text.length) {
                setStreamingContent((prev) => prev + text[index]);
                index++;
            } else {
                clearInterval(interval);
                setStreamingMessageId(null);
                setStreamingContent("");
            }
        }, 20); // Adjust speed here (lower = faster)

        return () => clearInterval(interval);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setHelperChats((prev) => ({
            ...prev,
            [activeHelper.id]: [...prev[activeHelper.id], userMessage]
        }));
        setInput("");
        setIsLoading(true);

        // Simulate AI response with streaming
        setTimeout(() => {
            const aiMessageId = (Date.now() + 1).toString();
            const aiContent = `As your ${activeHelper.role}, I'd be happy to help with that! This is a demo response. In production, this would connect to your AI API to generate intelligent, context-aware content based on your query and my specialization in ${activeHelper.description}.`;
            
            const aiMessage: Message = {
                id: aiMessageId,
                role: "assistant",
                content: aiContent,
                timestamp: new Date(),
            };
            
            setHelperChats((prev) => ({
                ...prev,
                [activeHelper.id]: [...prev[activeHelper.id], aiMessage]
            }));
            setIsLoading(false);
            streamText(aiContent, aiMessageId);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleHelperSwitch = (helper: Helper) => {
        setActiveHelper(helper);
        setHelpersCollapsed(true); // Auto-collapse after selection
        setStreamingMessageId(null); // Stop any ongoing streaming
        setStreamingContent("");
    };

    const handleNewConversation = () => {
        setHelperChats((prev) => ({
            ...prev,
            [activeHelper.id]: [getInitialMessage(activeHelper)]
        }));
        setStreamingMessageId(null);
        setStreamingContent("");
        setInput("");
    };

    return (
        <div className="h-full flex flex-col">
            <style jsx global>{`
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes messageSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .helpers-container {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .message-appear {
                    animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {/* Helpers Widget - Above First AI Message */}
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className={cn(
                        "helpers-container bg-background/95 backdrop-blur-md border border-border rounded-full shadow-md",
                        helpersCollapsed 
                            ? "px-3 py-1" 
                            : "px-4 py-1"
                    )}>
                        {/* Collapsed State - Just Active Helper */}
                        {helpersCollapsed && (
                            <button
                                onClick={() => setHelpersCollapsed(false)}
                                className="flex items-center gap-2.5 group transition-all duration-300"
                                title="Click to see all helpers"
                                style={{ animation: "fadeIn 0.3s ease-out" }}
                            >
                                <Avatar className={cn(
                                    "w-10 h-10 rounded-lg transition-all duration-300 group-hover:scale-110",
                                    "shadow-md"
                                )}>
                                    <AvatarImage src={`/helpers/${activeHelper.id}.png`} alt={activeHelper.name} />
                                    <AvatarFallback className={cn("bg-gradient-to-br text-lg", activeHelper.color)}>
                                        {activeHelper.emoji}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-foreground leading-tight">
                                        {activeHelper.name}
                                    </p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            </button>
                        )}

                        {/* Expanded State - All Helpers in One Row */}
                        {!helpersCollapsed && (
                            <div className="flex items-center gap-2.5" style={{ animation: "fadeIn 0.3s ease-out" }}>
                                {/* Collapse Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setHelpersCollapsed(true)}
                                    className="h-8 w-8 p-0 rounded-full hover:bg-secondary flex-shrink-0 transition-all duration-300"
                                    title="Collapse helpers"
                                >
                                    <ChevronUp className="w-4 h-4" />
                                </Button>
                                
                                {/* Helpers Row */}
                                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                                    {HELPERS.map((helper, index) => {
                                        const isActive = activeHelper.id === helper.id;
                                        return (
                                            <button
                                                key={helper.id}
                                                onClick={() => handleHelperSwitch(helper)}
                                                className={cn(
                                                    "relative flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all duration-300 flex-shrink-0",
                                                    "hover:bg-secondary/50 hover:scale-105",
                                                    isActive && "bg-secondary/50 scale-105"
                                                )}
                                                title={`${helper.name} - ${helper.description}`}
                                                style={{
                                                    animation: `slideInRight 0.3s ease-out ${index * 0.03}s both`
                                                }}
                                            >
                                                <Avatar className={cn(
                                                    "w-11 h-11 rounded-lg transition-all duration-300 cursor-pointer",
                                                    isActive 
                                                        ? "shadow-md" 
                                                        : "hover:shadow-md"
                                                )}>
                                                    <AvatarImage src={`/helpers/${helper.id}.png`} alt={helper.name} />
                                                    <AvatarFallback className={cn(
                                                        "text-lg transition-all duration-300",
                                                        isActive 
                                                            ? `bg-gradient-to-br ${helper.color} text-white`
                                                            : "bg-secondary text-foreground"
                                                    )}>
                                                        {helper.emoji}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {isActive && (
                                                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                                                )}
                                                <span className={cn(
                                                    "text-[11px] font-medium text-center leading-tight whitespace-nowrap",
                                                    isActive ? "text-foreground" : "text-muted-foreground"
                                                )}>
                                                    {helper.name.split(' ')[0]}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* New Conversation Button */}
                    {currentMessages.length > 1 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNewConversation}
                            className="rounded-full px-3 py-1 h-auto text-xs transition-all duration-300 hover:scale-105"
                            title="Start a new conversation"
                        >
                            <Sparkles className="w-3 h-3 mr-1" />
                            New Chat
                        </Button>
                    )}
                </div>
                {currentMessages.map((message) => {
                    const isStreaming = streamingMessageId === message.id;
                    const displayContent = isStreaming ? streamingContent : message.content;
                    
                    return (
                    <div
                        key={message.id}
                        className={cn(
                                "flex gap-4 message-appear",
                            message.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        {message.role === "assistant" && (
                                <Avatar className="w-8 h-8 mt-1 border border-border">
                                    <AvatarImage src={`/helpers/${activeHelper.id}.png`} alt={activeHelper.name} />
                                    <AvatarFallback className={cn("bg-gradient-to-br", activeHelper.color)}>
                                        <span className="text-lg">{activeHelper.emoji}</span>
                                </AvatarFallback>
                            </Avatar>
                        )}

                        <div
                            className={cn(
                                "max-w-[70%] rounded-2xl px-4 py-3",
                                message.role === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-secondary text-foreground"
                            )}
                        >
                                <p className="text-sm whitespace-pre-wrap">
                                    {displayContent}
                                    {isStreaming && <span className="inline-block w-1 h-4 ml-0.5 bg-current animate-pulse"></span>}
                                </p>
                            <span className={cn(
                                "text-xs mt-1 block",
                                message.role === "user" ? "text-blue-100" : "text-muted-foreground"
                            )}>
                                {message.timestamp.toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </span>
                        </div>

                        {message.role === "user" && (
                            <Avatar className="w-8 h-8 mt-1">
                                <AvatarFallback className="bg-secondary">
                                    <User className="w-4 h-4" />
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                    );
                })}

                {isLoading && (
                    <div className="flex gap-4">
                        <Avatar className="w-8 h-8 mt-1 border border-border">
                            <AvatarImage src={`/helpers/${activeHelper.id}.png`} alt={activeHelper.name} />
                            <AvatarFallback className={cn("bg-gradient-to-br", activeHelper.color)}>
                                <span className="text-lg">{activeHelper.emoji}</span>
                            </AvatarFallback>
                        </Avatar>
                        <div className="bg-secondary rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border bg-background p-4">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="relative">
                        <Textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Ask ${activeHelper.name} about ${activeHelper.description.toLowerCase()}...`}
                            className="min-h-[60px] max-h-[200px] pr-12 resize-none bg-secondary/50 border-border"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || isLoading}
                            className="absolute bottom-2 right-2 rounded-full"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        Press Enter to send, Shift + Enter for new line
                    </p>
                </form>
            </div>
        </div>
    );
}

