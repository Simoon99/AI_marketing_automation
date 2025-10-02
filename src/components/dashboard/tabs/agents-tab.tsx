"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Play, Pause, Trash2, Sparkles, CheckCircle2, XCircle, Clock, Loader2, ArrowUp, Plus, ArrowLeft, Settings2, Settings } from "lucide-react";
import { automationEngine } from "@/lib/automation-engine";
import { toast } from "sonner";
import type { Agent, AgentExecution } from "@/lib/types/agent";
import { agentTemplates, type AgentTemplate, type AgentParameter } from "@/lib/agent-templates";
import { IntegrationsModal } from "@/components/dashboard/integrations-modal";
import { AgentCustomizationModal } from "@/components/dashboard/agent-customization-modal";

type ViewMode = 'new-agent' | 'my-agents' | 'configure' | 'details';

export default function AgentsTab() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deploying, setDeploying] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>('new-agent');
    const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
    const [templateParams, setTemplateParams] = useState<Record<string, string>>({});
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [executions, setExecutions] = useState<AgentExecution[]>([]);
    const [executing, setExecuting] = useState<string | null>(null);
    const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
    const [showCustomizationModal, setShowCustomizationModal] = useState(false);
    const [draftAgentConfig, setDraftAgentConfig] = useState<any>(null);

    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = async () => {
        try {
            setLoading(true);
            setLoadError(false);
            const loadedAgents = await automationEngine.getAgents();
            setAgents(loadedAgents);
        } catch (error) {
            console.error('Error loading agents:', error);
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAgent = async () => {
        if (!prompt.trim()) {
            toast.error("Please describe what your agent should do");
            return;
        }

        setCreating(true);
        // Call OpenAI to generate config (without creating in DB yet)
        const result = await automationEngine.generateAgentConfig(prompt);

        if (result.success && result.config) {
            toast.success("Agent configuration generated! Review and customize it before deploying.");
            setDraftAgentConfig({ ...result.config, originalPrompt: prompt });
            setShowCustomizationModal(true);
            setPrompt("");
        } else {
            toast.error(result.error || "Failed to generate agent configuration");
        }
        setCreating(false);
    };

    const handleDeployAgent = async (config: any) => {
        setDeploying(true);
        
        // Deploy the customized agent
        const result = await automationEngine.deployAgent(config.originalPrompt, config);

        if (result.success && result.agent) {
            toast.success(`Agent "${result.agent.name}" deployed successfully!`);
            setShowCustomizationModal(false);
            setDraftAgentConfig(null);
            await loadAgents();
        } else {
            toast.error(result.error || "Failed to deploy agent");
        }
        setDeploying(false);
    };

    const handleCancelCustomization = () => {
        setShowCustomizationModal(false);
        setDraftAgentConfig(null);
    };

    const handleTemplateClick = (template: AgentTemplate) => {
        // Initialize parameters with default values
        const initialParams: Record<string, string> = {};
        template.parameters.forEach(param => {
            initialParams[param.id] = param.defaultValue || '';
        });
        
        setSelectedTemplate(template);
        setTemplateParams(initialParams);
        setViewMode('configure');
    };

    const handleParameterChange = (paramId: string, value: string) => {
        setTemplateParams(prev => ({
                ...prev,
            [paramId]: value,
        }));
    };

    const handleCreateFromTemplate = async () => {
        if (!selectedTemplate) return;

        // Validate required parameters
        const missingParams = selectedTemplate.parameters
            .filter(p => p.required && !templateParams[p.id]?.trim())
            .map(p => p.label);

        if (missingParams.length > 0) {
            toast.error(`Please fill in: ${missingParams.join(', ')}`);
            return;
        }

        // Replace placeholders in prompt with actual values
        let finalPrompt = selectedTemplate.prompt;
        Object.entries(templateParams).forEach(([key, value]) => {
            finalPrompt = finalPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });

        setCreating(true);
        // Generate config first, then show customization modal
        const result = await automationEngine.generateAgentConfig(finalPrompt);

        if (result.success && result.config) {
            toast.success("Agent configuration generated! Review and customize it before deploying.");
            setDraftAgentConfig({ ...result.config, originalPrompt: finalPrompt });
            setShowCustomizationModal(true);
            setSelectedTemplate(null);
            setTemplateParams({});
            setViewMode('new-agent');
        } else {
            toast.error(result.error || "Failed to generate agent configuration");
        }
        setCreating(false);
    };

    const handleExecuteAgent = async (agentId: string) => {
        setExecuting(agentId);
        const result = await automationEngine.executeAgent(agentId);

        if (result.success) {
            toast.success("Agent executed successfully!");
            if (selectedAgent?.id === agentId) {
                loadExecutions(agentId);
            }
        } else {
            toast.error(result.error || "Failed to execute agent");
        }
        setExecuting(null);
    };

    const handleToggleAgent = async (agent: Agent) => {
        const newStatus = agent.status === 'active' ? 'paused' : 'active';
        const success = await automationEngine.updateAgentStatus(agent.id, newStatus);

        if (success) {
            toast.success(`Agent ${newStatus === 'active' ? 'activated' : 'paused'}`);
            await loadAgents();
        } else {
            toast.error("Failed to update agent status");
        }
    };

    const handleDeleteAgent = async (agentId: string) => {
        if (!confirm("Are you sure you want to delete this agent?")) {
            return;
        }

        const success = await automationEngine.deleteAgent(agentId);

        if (success) {
            toast.success("Agent deleted successfully");
            await loadAgents();
            if (selectedAgent?.id === agentId) {
                setSelectedAgent(null);
                setViewMode('new-agent');
            }
        } else {
            toast.error("Failed to delete agent");
        }
    };

    const loadExecutions = async (agentId: string) => {
        const agentExecutions = await automationEngine.getExecutions(agentId);
        setExecutions(agentExecutions);
    };

    const viewAgentDetails = async (agent: Agent) => {
        setSelectedAgent(agent);
        await loadExecutions(agent.id);
        setViewMode('details');
    };

    // Loading state - only show for initial load
    if (loading && !loadError) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading agents...</p>
                </div>
            </div>
        );
    }

    // Template Configuration View
    if (viewMode === 'configure' && selectedTemplate) {
        return (
            <div className="h-full flex flex-col bg-background">
                <div className="border-b border-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setSelectedTemplate(null);
                                    setViewMode('new-agent');
                                }}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <span className="text-3xl">{selectedTemplate.icon}</span>
                                    Configure {selectedTemplate.name}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {selectedTemplate.description}
                                </p>
                            </div>
                        </div>
                    </div>
                        </div>
                        
                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Settings2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-sm mb-1">Configure Your Agent</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Fill in the parameters below to customize how your agent works. All required fields are marked with *.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {selectedTemplate.parameters.map((param) => (
                                <div key={param.id} className="bg-card border border-border rounded-lg p-4">
                                    <label className="block mb-2">
                                        <span className="text-sm font-medium">
                                            {param.label}
                                            {param.required && <span className="text-red-500 ml-1">*</span>}
                                        </span>
                                        {param.description && (
                                            <span className="block text-xs text-muted-foreground mt-1">
                                                {param.description}
                                            </span>
                                        )}
                                    </label>

                                    {param.type === 'select' ? (
                                        <select
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={templateParams[param.id] || ''}
                                            onChange={(e) => handleParameterChange(param.id, e.target.value)}
                                        >
                                            {param.options?.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : param.type === 'time' ? (
                                        <input
                                            type="time"
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={templateParams[param.id] || ''}
                                            onChange={(e) => handleParameterChange(param.id, e.target.value)}
                                        />
                                    ) : param.type === 'number' ? (
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={param.placeholder}
                                            value={templateParams[param.id] || ''}
                                            onChange={(e) => handleParameterChange(param.id, e.target.value)}
                                        />
                                    ) : (
                                        <input
                                            type={param.type}
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={param.placeholder}
                                            value={templateParams[param.id] || ''}
                                            onChange={(e) => handleParameterChange(param.id, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                            </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                onClick={handleCreateFromTemplate}
                                disabled={creating}
                                className="flex-1"
                                size="lg"
                            >
                                {creating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating Agent...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Create Agent
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedTemplate(null);
                                    setViewMode('new-agent');
                                }}
                                disabled={creating}
                                size="lg"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                                    </div>
                                </div>
        );
    }

    // Agent Details View
    if (viewMode === 'details' && selectedAgent) {
        return (
            <div className="h-full flex flex-col bg-background">
                <div className="border-b border-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setSelectedAgent(null);
                                    setViewMode('new-agent');
                                }}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Bot className="w-5 h-5" />
                                    {selectedAgent.name}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {selectedAgent.description}
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => handleExecuteAgent(selectedAgent.id)}
                            disabled={executing === selectedAgent.id}
                        >
                            {executing === selectedAgent.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Run Now
                                </>
                            )}
                        </Button>
                    </div>
                                    </div>

                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-card border border-border rounded-lg p-4">
                                <div className="text-sm text-muted-foreground mb-1">Status</div>
                                <div className="flex items-center gap-2">
                                    {selectedAgent.status === 'active' ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-gray-500" />
                                    )}
                                    <span className="font-medium capitalize">{selectedAgent.status}</span>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-lg p-4">
                                <div className="text-sm text-muted-foreground mb-1">Trigger</div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="font-medium capitalize">{selectedAgent.trigger_type}</span>
                                    {selectedAgent.schedule && (
                                        <span className="text-xs text-muted-foreground">({selectedAgent.schedule})</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Original Prompt</h3>
                            <p className="text-sm text-muted-foreground">{selectedAgent.prompt}</p>
                    </div>

                        <div className="bg-card border border-border rounded-lg p-4">
                            <h3 className="font-semibold mb-4">Execution History</h3>
                            {executions.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No executions yet. Run the agent to see results here.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {executions.map((execution) => (
                                        <div
                                            key={execution.id}
                                            className="flex items-center justify-between p-3 bg-background rounded border border-border"
                                        >
                                            <div className="flex items-center gap-3">
                                                {execution.status === 'success' ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : execution.status === 'failed' ? (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                ) : (
                                                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                                )}
                                <div>
                                                    <div className="text-sm font-medium capitalize">{execution.status}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(execution.executed_at).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                            {execution.duration_ms && (
                                                <div className="text-xs text-muted-foreground">
                                                    {execution.duration_ms}ms
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                            </div>
        );
    }

    // Main View - Prompt interface with templates and existing agents
    return (
        <>
        <div className="h-full overflow-y-auto bg-gradient-to-b from-background to-muted/20">
            <div className="min-h-full flex flex-col">
                {/* Header with Tabs and Integrations Button */}
                <div className="flex-shrink-0 px-6 pt-6 pb-2 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        {/* View Tabs */}
                        <div className="flex gap-2">
                            <Button 
                                variant={viewMode === 'new-agent' ? 'default' : 'ghost'}
                                onClick={() => setViewMode('new-agent')}
                                className="gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                New Agent
                            </Button>
                            <Button 
                                variant={viewMode === 'my-agents' ? 'default' : 'ghost'}
                                onClick={() => setViewMode('my-agents')}
                                className="gap-2"
                            >
                                <Bot className="w-4 h-4" />
                                My Agents
                                {agents.length > 0 && (
                                    <span className="ml-1 px-2 py-0.5 bg-primary/20 rounded-full text-xs">
                                        {agents.length}
                                    </span>
                                )}
                            </Button>
                    </div>

                        {/* Integrations Button */}
                        <Button
                            variant="outline"
                            onClick={() => setShowIntegrationsModal(true)}
                            className="gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            Manage Integrations
                        </Button>
                    </div>
                </div>

                {/* Content based on view mode */}
                {viewMode === 'new-agent' && (
                <>
                    {/* Hero Section */}
                    <div className="flex-shrink-0 px-6 pt-6 pb-8">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                What should we build today?
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8">
                                Create intelligent agents by chatting with AI.
                            </p>

                            {/* Prompt Input */}
                            <div className="relative max-w-3xl mx-auto">
                                <textarea
                                    className="w-full min-h-[160px] px-6 py-4 bg-card border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base transition-all placeholder:text-muted-foreground/60"
                                    placeholder="Type your idea and we'll build it together.&#10;&#10;Example: Create an agent that monitors my Gmail inbox every morning at 8 AM, summarizes unread emails by category, and sends me a summary."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    disabled={creating}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                            handleCreateAgent();
                                        }
                                    }}
                                />
                                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                    <Button 
                                        size="sm" 
                                        variant="ghost"
                                        className="h-8 text-xs"
                                        disabled={creating}
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Attach
                                    </Button>
                                    <Button 
                                        onClick={handleCreateAgent}
                                        disabled={creating || !prompt.trim()}
                                        className="h-10 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {creating ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <ArrowUp className="w-4 h-4" />
                                        )}
                                    </Button>
                </div>
            </div>

                            <p className="text-xs text-muted-foreground mt-3">
                                Press <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">Enter</kbd> to create
                            </p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 px-6 pb-8">
                        <div className="max-w-6xl mx-auto space-y-8">
                            {/* Agent Templates */}
                    <div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-yellow-500" />
                                    Agent Templates (20+)
                        </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {agentTemplates.map((template) => (
                                        <button
                                            key={template.id}
                                            onClick={() => handleTemplateClick(template)}
                                            className="group relative bg-card border border-border rounded-xl p-4 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all text-left"
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />
                                            <div className="relative">
                                                <div className="text-3xl mb-3">{template.icon}</div>
                                                <h3 className="font-semibold mb-1 text-sm">{template.name}</h3>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                    {template.description}
                                                </p>
                                                <span className="inline-block px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground">
                                                    {template.category}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                )}

                {/* My Agents View */}
                {viewMode === 'my-agents' && (
                <div className="flex-1 px-6 py-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold mb-2">My Agents</h1>
                            <p className="text-muted-foreground">
                                Manage and monitor your deployed AI agents
                            </p>
                        </div>

                        {loading && !loadError ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : agents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl">
                                <Bot className="w-16 h-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No agents yet</h3>
                                <p className="text-muted-foreground mb-4">Create your first agent to get started</p>
                                <Button
                                    onClick={() => setViewMode('new-agent')}
                                    className="gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Agent
                                </Button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {agents.map((agent) => (
                                    <div
                                        key={agent.id}
                                        className="group bg-card border border-border rounded-xl p-4 hover:border-purple-500/50 hover:shadow-lg transition-all cursor-pointer"
                                        onClick={() => viewAgentDetails(agent)}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Bot className="w-5 h-5 text-purple-500" />
                                                {agent.status === 'active' ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-gray-500" />
                                                )}
                </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <Button
                        size="sm"
                                                    variant="ghost"
                                                    className="h-7 w-7 p-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleAgent(agent);
                                                    }}
                                                >
                                                    {agent.status === 'active' ? (
                                                        <Pause className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <Play className="w-3.5 h-3.5" />
                                                    )}
                    </Button>
                    <Button
                        size="sm"
                                                    variant="ghost"
                                                    className="h-7 w-7 p-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteAgent(agent.id);
                                                    }}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

                                        <h3 className="font-semibold mb-1 text-sm">{agent.name}</h3>
                                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                            {agent.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            <span className="capitalize">{agent.trigger_type}</span>
                                            {agent.schedule && <span>• {agent.schedule}</span>}
                                        </div>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full mt-3 h-7 text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleExecuteAgent(agent.id);
                                            }}
                                            disabled={executing === agent.id}
                                        >
                                            {executing === agent.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <>
                                                    <Play className="w-3 h-3 mr-1" />
                                                    Run Now
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                )}
            </div>
        </div>

        {/* Modals */}
        <IntegrationsModal
            open={showIntegrationsModal}
            onClose={() => setShowIntegrationsModal(false)}
        />
        <AgentCustomizationModal
            open={showCustomizationModal}
            config={draftAgentConfig}
            onSave={handleDeployAgent}
            onCancel={handleCancelCustomization}
            isDeploying={deploying}
        />
        </>
    );
}
