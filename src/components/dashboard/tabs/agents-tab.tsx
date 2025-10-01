"use client";

import { Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgentsTab() {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="max-w-md text-center space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center">
                    <Bot className="w-10 h-10 text-muted-foreground" />
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">No Agents Yet</h3>
                    <p className="text-muted-foreground">
                        Create your first AI agent to automate your marketing workflows and campaigns.
                    </p>
                </div>

                <Button size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Create Your First Agent
                </Button>

                <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">What you can do with agents:</p>
                    <ul className="space-y-1 text-left list-disc list-inside">
                        <li>Automate content creation</li>
                        <li>Schedule social media posts</li>
                        <li>Generate campaign ideas</li>
                        <li>Analyze marketing performance</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

