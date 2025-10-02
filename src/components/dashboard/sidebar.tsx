"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib";
import { Bot, MessageSquare, Sparkles, LogOut, ChevronRight, ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import SettingsDropdown from "./settings-dropdown";

const navigation = [
    { name: "Agents", href: "/dashboard/agents", icon: Bot },
    { name: "Celio Helpers", href: "/dashboard/celio", icon: MessageSquare },
    { name: "Power Ups", href: "/dashboard/powerups", icon: Sparkles },
];

export default function DashboardSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed by default

    return (
        <div className={cn(
            "bg-sidebar-background border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out relative",
            isCollapsed ? "w-20" : "w-64"
        )}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                    "absolute -right-3 top-6 z-50 w-6 h-6 rounded-full bg-sidebar-accent border border-sidebar-border",
                    "flex items-center justify-center hover:bg-sidebar-accent-foreground/10 transition-all duration-300"
                )}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-sidebar-foreground" />
                ) : (
                    <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
                )}
            </button>

            {/* Logo */}
            <div className={cn(
                "border-b border-sidebar-border transition-all duration-300",
                isCollapsed ? "p-4" : "p-6"
            )}>
                <Link 
                    href="/dashboard" 
                    className={cn(
                        "flex items-center gap-2",
                        isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? "AI Marketing" : undefined}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <span className="text-lg font-semibold whitespace-nowrap overflow-hidden">
                            AI Marketing
                        </span>
                    )}
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
                                "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-300",
                                isCollapsed ? "px-3 py-3 justify-center" : "px-3 py-2",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                            )}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && (
                                <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border space-y-1">
                <SettingsDropdown isCollapsed={isCollapsed} />
                <button
                    className={cn(
                        "flex items-center gap-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-300 w-full",
                        isCollapsed ? "px-3 py-3 justify-center" : "px-3 py-2"
                    )}
                    title={isCollapsed ? "Logout" : undefined}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">Logout</span>}
                </button>
            </div>
        </div>
    );
}

