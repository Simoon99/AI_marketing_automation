"use client";

import { useState } from "react";
import { Settings, Brain, CreditCard, User, X, Plug, ChevronRight } from "lucide-react";
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
    const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

    const handleSectionClick = (section: SettingsSection) => {
        setActiveSection(section);
        setIsOpen(true);
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'integrations':
                const integrations = [
                    { name: 'OpenAI', emoji: '🤖', connected: false },
                    { name: 'SendGrid', emoji: '📧', connected: false },
                    { name: 'Slack', emoji: '💬', connected: false },
                    { name: 'Gmail', emoji: '✉️', connected: false },
                    { name: 'Google Sheets', emoji: '📊', connected: false },
                    { name: 'Airtable', emoji: '🗂️', connected: false },
                    { name: 'HubSpot', emoji: '🎯', connected: false },
                    { name: 'Stripe', emoji: '💳', connected: false },
                    { name: 'Twilio', emoji: '📱', connected: false },
                    { name: 'Mailchimp', emoji: '🐵', connected: false },
                    { name: 'LinkedIn', emoji: '💼', connected: false },
                    { name: 'Twitter', emoji: '🐦', connected: false },
                    { name: 'Facebook', emoji: '📘', connected: false },
                    { name: 'Instagram', emoji: '📸', connected: false },
                    { name: 'Shopify', emoji: '🛍️', connected: false },
                    { name: 'WooCommerce', emoji: '🛒', connected: false },
                    { name: 'Zapier', emoji: '⚡', connected: false },
                    { name: 'Make', emoji: '🔧', connected: false },
                    { name: 'Notion', emoji: '📝', connected: false },
                    { name: 'Trello', emoji: '📋', connected: false },
                ];
                
                if (selectedIntegration) {
                    // Show integration settings inline
                    const integration = integrations.find(i => i.name === selectedIntegration);
                    return (
                        <div className="space-y-4">
                            <button 
                                onClick={() => setSelectedIntegration(null)}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" />
                                Back to all integrations
                            </button>
                            
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-4xl">{integration?.emoji}</span>
                                <div>
                                    <h3 className="text-2xl font-bold">{integration?.name}</h3>
                                    <p className="text-sm text-muted-foreground">Configure API credentials</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">API Key</label>
                                    <input
                                        type="password"
                                        placeholder={`Enter your ${integration?.name} API key...`}
                                        className="w-full px-3 py-2 border rounded-lg bg-background font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Get your API key from the {integration?.name} dashboard
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium mb-2 block">API Secret (Optional)</label>
                                    <input
                                        type="password"
                                        placeholder="Enter API secret if required..."
                                        className="w-full px-3 py-2 border rounded-lg bg-background font-mono text-sm"
                                    />
                                </div>
                                
                                <div className="flex gap-3 pt-4">
                                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                        Test Connection
                                    </button>
                                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                                        Save Credentials
                                    </button>
                                </div>
                                
                                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-800 dark:text-blue-300">
                                        💡 <strong>Security:</strong> Your credentials are encrypted and stored securely. We never share your API keys.
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                }
                
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Manage Integrations</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Configure API keys and credentials for third-party services.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {integrations.map((integration) => (
                                <button
                                    key={integration.name}
                                    onClick={() => setSelectedIntegration(integration.name)}
                                    className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                                >
                                    <span className="text-3xl">{integration.emoji}</span>
                                    <span className="text-xs font-medium text-center">{integration.name}</span>
                                    {integration.connected && (
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                        
                        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">
                                Click any integration to configure its API key and credentials.
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span>✓ Secure storage</span>
                                <span>•</span>
                                <span>✓ Test connections</span>
                                <span>•</span>
                                <span>✓ 20+ services</span>
                            </div>
                        </div>
                    </div>
                );
            case 'brains':
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Knowledge Base</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Manage knowledge that your AI Helpers need to remember about you and your business.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Add Knowledge Button */}
                            <button className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-sm text-muted-foreground flex items-center justify-center gap-2">
                                <Brain className="w-4 h-4" />
                                Add New Knowledge
                            </button>
                            
                            {/* Example Knowledge Cards */}
                            <div className="space-y-3">
                                <div className="p-4 border rounded-lg bg-card">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-medium">Business Information</h4>
                                        <span className="text-xs text-muted-foreground">Updated 2 days ago</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Company name, industry, target audience, brand voice, and core values that helpers should know.
                                    </p>
                                    <button className="text-xs text-primary hover:underline">Edit Knowledge</button>
                                </div>
                                
                                <div className="p-4 border rounded-lg bg-card">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-medium">Product Catalog</h4>
                                        <span className="text-xs text-muted-foreground">Updated 1 week ago</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        List of products/services, pricing, features, and key selling points for accurate recommendations.
                                    </p>
                                    <button className="text-xs text-primary hover:underline">Edit Knowledge</button>
                                </div>
                                
                                <div className="p-4 border rounded-lg bg-card">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-medium">Customer Preferences</h4>
                                        <span className="text-xs text-muted-foreground">Updated 3 days ago</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Common customer questions, preferred communication style, and service level expectations.
                                    </p>
                                    <button className="text-xs text-primary hover:underline">Edit Knowledge</button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                💡 <strong>Tip:</strong> The more context you provide, the better your Helpers can assist you. Knowledge is shared across all your AI Helpers.
                            </p>
                        </div>
                    </div>
                );
            case 'subscription':
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Subscription Management</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                View your current plan and manage billing information.
                            </p>
                        </div>
                        
                        <div className="p-8 border rounded-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/10 dark:to-purple-950/10">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h4 className="text-2xl font-bold mb-1">Pro Plan</h4>
                                </div>
                                <span className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full">Active</span>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-4xl font-bold mb-1">$49<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                                <p className="text-sm text-muted-foreground">Billed monthly</p>
                            </div>
                            
                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 text-lg">✓</span>
                                    <span>Unlimited AI agents & workflows</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 text-lg">✓</span>
                                    <span>Access to all 20+ Power Ups</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 text-lg">✓</span>
                                    <span>12 specialized AI Helpers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 text-lg">✓</span>
                                    <span>Priority support & updates</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 text-lg">✓</span>
                                    <span>Advanced analytics & insights</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                    Manage Billing
                                </button>
                                <button className="px-6 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
                                    View Invoices
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                Need to change your plan or cancel? Contact support or manage your subscription in the billing portal.
                            </p>
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
                <DialogContent className="max-w-6xl max-h-[90vh] p-0 gap-0 bg-gradient-to-b from-background to-muted/20 flex flex-col">
                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar */}
                        <div className="w-64 border-r border-border bg-background/50 backdrop-blur-sm flex flex-col">
                            <DialogHeader className="p-6 border-b border-border flex-shrink-0">
                                <DialogTitle className="flex items-center gap-3 text-xl">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <Settings className="w-5 h-5 text-white" />
                                    </div>
                                    Settings
                                </DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="flex-1">
                                <nav className="p-4 space-y-1">
                                    {settingsSections.map((section) => {
                                        const Icon = section.icon;
                                        const isActive = activeSection === section.id;
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => {
                                                    setActiveSection(section.id);
                                                    setSelectedIntegration(null); // Reset integration selection when changing sections
                                                }}
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
                            </ScrollArea>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col overflow-hidden">
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

