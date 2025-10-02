"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib";

interface ManualAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (agentData: ManualAgentData) => Promise<void>;
    isCreating: boolean;
}

export interface ManualAgentData {
    name: string;
    description: string;
    trigger_type: 'manual' | 'scheduled' | 'webhook';
    schedule?: string;
    integrations: string[];
    steps: AgentStep[];
}

export interface AgentStep {
    type: 'fetch' | 'process' | 'action';
    action: string;
    integration?: string;
    params?: Record<string, any>;
}

const AVAILABLE_INTEGRATIONS = [
    { id: 'openai', name: 'OpenAI', icon: '🤖' },
    { id: 'sendgrid', name: 'SendGrid', icon: '📧' },
    { id: 'slack', name: 'Slack', icon: '💬' },
    { id: 'google-sheets', name: 'Google Sheets', icon: '📊' },
    { id: 'gmail', name: 'Gmail', icon: '✉️' },
    { id: 'airtable', name: 'Airtable', icon: '📋' },
    { id: 'hubspot', name: 'HubSpot', icon: '🎯' },
    { id: 'zapier', name: 'Zapier', icon: '⚡' },
];

const STEP_TYPES = [
    { value: 'fetch', label: 'Fetch Data', description: 'Get data from an API or service' },
    { value: 'process', label: 'Process Data', description: 'Transform or analyze data with AI' },
    { value: 'action', label: 'Take Action', description: 'Send data or trigger an action' },
];

export function ManualAgentModal({ isOpen, onClose, onSubmit, isCreating }: ManualAgentModalProps) {
    const [formData, setFormData] = useState<ManualAgentData>({
        name: '',
        description: '',
        trigger_type: 'manual',
        integrations: [],
        steps: [],
    });

    const [currentStep, setCurrentStep] = useState<Partial<AgentStep>>({});
    const [showStepForm, setShowStepForm] = useState(false);

    const handleSubmit = async () => {
        // Validation
        if (!formData.name.trim()) {
            alert('Please enter an agent name');
            return;
        }
        if (formData.steps.length === 0) {
            alert('Please add at least one step');
            return;
        }

        await onSubmit(formData);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            trigger_type: 'manual',
            integrations: [],
            steps: [],
        });
        setCurrentStep({});
        setShowStepForm(false);
        onClose();
    };

    const addIntegration = (integrationId: string) => {
        if (!formData.integrations.includes(integrationId)) {
            setFormData({
                ...formData,
                integrations: [...formData.integrations, integrationId],
            });
        }
    };

    const removeIntegration = (integrationId: string) => {
        setFormData({
            ...formData,
            integrations: formData.integrations.filter(id => id !== integrationId),
        });
    };

    const addStep = () => {
        if (!currentStep.type || !currentStep.action) {
            alert('Please fill in step details');
            return;
        }

        setFormData({
            ...formData,
            steps: [...formData.steps, currentStep as AgentStep],
        });
        setCurrentStep({});
        setShowStepForm(false);
    };

    const removeStep = (index: number) => {
        setFormData({
            ...formData,
            steps: formData.steps.filter((_, i) => i !== index),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Sparkles className="w-6 h-6 text-primary" />
                        Create Agent Manually
                    </DialogTitle>
                    <DialogDescription>
                        Build a custom AI agent by configuring steps, integrations, and triggers
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Agent Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Weekly Report Generator"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="What does this agent do?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="trigger">Trigger Type</Label>
                            <Select
                                value={formData.trigger_type}
                                onValueChange={(value: any) => setFormData({ ...formData, trigger_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="manual">Manual (Run on demand)</SelectItem>
                                    <SelectItem value="scheduled">Scheduled (Daily, Weekly, etc.)</SelectItem>
                                    <SelectItem value="webhook">Webhook (Triggered by event)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.trigger_type === 'scheduled' && (
                            <div className="space-y-2">
                                <Label htmlFor="schedule">Schedule (Cron Expression)</Label>
                                <Input
                                    id="schedule"
                                    placeholder="0 9 * * *"
                                    value={formData.schedule || ''}
                                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    e.g., "0 9 * * *" = Daily at 9 AM
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Integrations */}
                    <div className="space-y-2">
                        <Label>Integrations</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.integrations.map((integrationId) => {
                                const integration = AVAILABLE_INTEGRATIONS.find(i => i.id === integrationId);
                                return (
                                    <Badge key={integrationId} variant="secondary" className="gap-2">
                                        <span>{integration?.icon}</span>
                                        <span>{integration?.name}</span>
                                        <button onClick={() => removeIntegration(integrationId)}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_INTEGRATIONS.filter(i => !formData.integrations.includes(i.id)).map((integration) => (
                                <Button
                                    key={integration.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addIntegration(integration.id)}
                                    className="gap-2"
                                >
                                    <span>{integration.icon}</span>
                                    <span>{integration.name}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-2">
                        <Label>Workflow Steps</Label>
                        <div className="space-y-2">
                            {formData.steps.map((step, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                    <div className="flex-1">
                                        <div className="font-medium">{index + 1}. {step.type.toUpperCase()}</div>
                                        <div className="text-sm text-muted-foreground">{step.action}</div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeStep(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {showStepForm ? (
                            <div className="p-4 border rounded-lg space-y-3">
                                <Select
                                    value={currentStep.type}
                                    onValueChange={(value: any) => setCurrentStep({ ...currentStep, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select step type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STEP_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                <div>
                                                    <div className="font-medium">{type.label}</div>
                                                    <div className="text-xs text-muted-foreground">{type.description}</div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Input
                                    placeholder="Action description (e.g., 'fetch_emails', 'send_slack_message')"
                                    value={currentStep.action || ''}
                                    onChange={(e) => setCurrentStep({ ...currentStep, action: e.target.value })}
                                />

                                <div className="flex gap-2">
                                    <Button onClick={addStep} size="sm">Add Step</Button>
                                    <Button onClick={() => setShowStepForm(false)} variant="outline" size="sm">Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowStepForm(true)}
                                className="w-full gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Step
                            </Button>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isCreating}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isCreating} className="gap-2">
                        {isCreating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Create Agent
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

