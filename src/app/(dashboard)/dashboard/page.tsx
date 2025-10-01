"use client";

import { useState } from "react";
import AgentsTab from "@/components/dashboard/tabs/agents-tab";
import ChatTab from "@/components/dashboard/tabs/chat-tab";
import PowerUpsTab from "@/components/dashboard/tabs/power-ups-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("chat");

    return (
        <div className="h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="border-b border-border px-6 pt-6">
                    <TabsList className="bg-transparent p-0 h-auto space-x-6">
                        <TabsTrigger 
                            value="agents" 
                            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none pb-3 px-1 text-muted-foreground data-[state=active]:text-foreground"
                        >
                            Agents
                        </TabsTrigger>
                        <TabsTrigger 
                            value="chat" 
                            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none pb-3 px-1 text-muted-foreground data-[state=active]:text-foreground"
                        >
                            AI Chat
                        </TabsTrigger>
                        <TabsTrigger 
                            value="powerups" 
                            className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none pb-3 px-1 text-muted-foreground data-[state=active]:text-foreground"
                        >
                            Power Ups
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    <TabsContent value="agents" className="h-full m-0 p-6">
                        <AgentsTab />
                    </TabsContent>
                    <TabsContent value="chat" className="h-full m-0 p-0">
                        <ChatTab />
                    </TabsContent>
                    <TabsContent value="powerups" className="h-full m-0 p-6">
                        <PowerUpsTab />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

