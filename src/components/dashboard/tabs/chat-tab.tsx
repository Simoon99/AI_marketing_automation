"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
};

const INITIAL_MESSAGES: Message[] = [
    {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your AI Marketing Assistant. I can help you create content, generate campaign ideas, write copy, and provide marketing insights. How can I assist you today?",
        timestamp: new Date(),
    },
];

export default function ChatTab() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "This is a demo response. In production, this would connect to your AI API to generate intelligent marketing content and insights based on your query.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsLoading(false);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex gap-4",
                            message.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        {message.role === "assistant" && (
                            <Avatar className="w-8 h-8 mt-1">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600">
                                    <Sparkles className="w-4 h-4 text-white" />
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
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                ))}

                {isLoading && (
                    <div className="flex gap-4">
                        <Avatar className="w-8 h-8 mt-1">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600">
                                <Sparkles className="w-4 h-4 text-white" />
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
                            placeholder="Ask me anything about marketing..."
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

