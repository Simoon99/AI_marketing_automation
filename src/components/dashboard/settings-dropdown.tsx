"use client";

import { useState } from "react";
import { Settings, Brain, CreditCard, User, X, Plug } from "lucide-react";
import { cn } from "@/lib";
import { IntegrationsModal } from "./integrations-modal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type SettingsSection = 'integrations' | 'brains' | 'subscription' | 'user';

const settingsSections = [
    { id: 'integrations' as const, label: 'Manage Integrations', icon: Plug, description: 'Configure API keys and third-party integrations' },
    { id: 'brains' as const, label: 'Brains', icon: Brain, description: 'Manage your AI brain configurations' },
    { id: 'subscription' as const, label: 'Manage Subscription', icon: CreditCard, description: 'View and manage your subscription plan' },
    { id: 'user' as const, label: 'User Settings', icon: User, description: 'Update your profile and preferences' },
];

interface SettingsDropdownProps {
    isCollapsed?: boolean;
}

export default function SettingsDropdown({ isCollapsed = false }: SettingsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<SettingsSection>('integrations');
    const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);

    const handleSectionClick = (section: SettingsSection) => {
        setActiveSection(section);
        setIsOpen(true);
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'integrations':
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Manage Integrations</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Configure API keys and credentials for third-party services.
                            </p>
                        </div>
                        <div className="flex items-center justify-center py-12">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setShowIntegrationsModal(true);
                                }}
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                <Plug className="w-4 h-4" />
                                Open Integrations Manager
                            </button>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>✓ Connect 20+ services</p>
                            <p>✓ Secure API key storage</p>
                            <p>✓ Test connections</p>
                            <p>✓ Manage credentials safely</p>
                        </div>
                    </div>
                );
            case 'brains':
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">AI Brains Configuration</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Configure and manage your AI brain settings for different assistants.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-1">Default Brain</h4>
                                <p className="text-sm text-muted-foreground">GPT-4 Turbo - General purpose AI</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-1">Creative Brain</h4>
                                <p className="text-sm text-muted-foreground">GPT-4 - Enhanced creativity settings</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium mb-1">Analytical Brain</h4>
                                <p className="text-sm text-muted-foreground">Claude 3.5 - Data analysis focused</p>
                            </div>
                        </div>
                    </div>
                );
            case 'subscription':
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Subscription Management</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                View your current plan and manage billing information.
                            </p>
                        </div>
                        <div className="p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-xl font-bold">Pro Plan</h4>
                                <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">Active</span>
                            </div>
                            <p className="text-2xl font-bold mb-2">$49<span className="text-sm font-normal">/month</span></p>
                            <p className="text-sm text-muted-foreground mb-4">Billed monthly</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Unlimited agents</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>All Power Ups included</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span>
                                    <span>Priority support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'user':
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">User Settings</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Manage your account settings and preferences.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg bg-background"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border rounded-lg bg-background"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Company</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg bg-background"
                                    placeholder="Acme Inc."
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Timezone</label>
                                <select className="w-full px-3 py-2 border rounded-lg bg-background">
                                    <option>UTC-5 (Eastern Time)</option>
                                    <option>UTC-6 (Central Time)</option>
                                    <option>UTC-7 (Mountain Time)</option>
                                    <option>UTC-8 (Pacific Time)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className={cn(
                            "flex items-center gap-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-300 w-full",
                            isCollapsed ? "px-3 py-3 justify-center" : "px-3 py-2"
                        )}
                        title={isCollapsed ? "Settings" : undefined}
                    >
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">Settings</span>}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    {settingsSections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <DropdownMenuItem
                                key={section.id}
                                onClick={() => handleSectionClick(section.id)}
                                className="cursor-pointer"
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {section.label}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-5xl h-[85vh] p-0 gap-0 bg-gradient-to-b from-background to-muted/20">
                    <div className="flex h-full">
                        {/* Sidebar */}
                        <div className="w-64 border-r border-border bg-background/50 backdrop-blur-sm">
                            <DialogHeader className="p-6 border-b border-border">
                                <DialogTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-white" />
                                    </div>
                                    Settings
                                </DialogTitle>
                            </DialogHeader>
                            <nav className="p-4 space-y-1">
                                {settingsSections.map((section) => {
                                    const Icon = section.icon;
                                    const isActive = activeSection === section.id;
                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-md"
                                                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <Icon className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-left">{section.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <ScrollArea className="flex-1">
                                <div className="p-8">
                                    {renderSectionContent()}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Integrations Modal */}
            <IntegrationsModal 
                open={showIntegrationsModal} 
                onClose={() => setShowIntegrationsModal(false)} 
            />
        </>
    );
}

