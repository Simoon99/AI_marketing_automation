"use client";

import Link from "next/link";
import { cn } from "@/lib";
import { Bot, MessageSquare, Sparkles, Settings, LogOut } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

const navigation = [
    { name: "Agents", href: "/dashboard/agents", icon: Bot },
    { name: "Celio", href: "/dashboard/celio", icon: MessageSquare },
    { name: "Power Ups", href: "/dashboard/powerups", icon: Sparkles },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-sidebar-background border-r border-sidebar-border flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-sidebar-border">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-semibold">AI Marketing</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border space-y-1">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
                <button
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors w-full"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}

