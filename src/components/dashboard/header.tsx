"use client";

import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardHeader() {
    return (
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-10 bg-secondary/50 border-border"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
                </Button>

                <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src="/avatars/user.png" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                            SM
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block">
                        <p className="text-sm font-medium">Simoon</p>
                        <p className="text-xs text-muted-foreground">simoon@example.com</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

