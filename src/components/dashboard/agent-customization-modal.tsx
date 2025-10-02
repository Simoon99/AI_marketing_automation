'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getIntegrationById } from '@/lib/types/integrations';

interface AgentConfig {
  name: string;
  description: string;
  trigger: {
    type: 'manual' | 'scheduled' | 'webhook';
    schedule?: string;
  };
  integrations: Array<{
    provider: string;
    actions: string[];
  }>;
  steps: Array<{
    type: 'fetch' | 'process' | 'action';
    integration?: string;
    action: string;
    params?: Record<string, any>;
  }>;
  llm?: {
    model: string;
    systemPrompt: string;
    temperature: number;
  };
}

interface AgentCustomizationModalProps {
  open: boolean;
  config: AgentConfig | null;
  onSave: (config: AgentConfig) => void;
  onCancel: () => void;
  isDeploying: boolean;
}

export function AgentCustomizationModal({
  open,
  config,
  onSave,
  onCancel,
  isDeploying,
}: AgentCustomizationModalProps) {
  const [editedConfig, setEditedConfig] = useState<AgentConfig | null>(config);

  if (!editedConfig) return null;

  const updateConfig = (updates: Partial<AgentConfig>) => {
    setEditedConfig({ ...editedConfig, ...updates });
  };

  const updateStep = (index: number, updates: any) => {
    const newSteps = [...editedConfig.steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    updateConfig({ steps: newSteps });
  };

  const deleteStep = (index: number) => {
    const newSteps = editedConfig.steps.filter((_, i) => i !== index);
    updateConfig({ steps: newSteps });
  };

  const addStep = () => {
    const newStep = {
      type: 'action' as const,
      action: 'new_action',
      params: {},
    };
    updateConfig({ steps: [...editedConfig.steps, newStep] });
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Your Agent</DialogTitle>
          <DialogDescription>
            Review and modify the AI-generated agent configuration before deploying.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  id="agent-name"
                  value={editedConfig.name}
                  onChange={(e) => updateConfig({ name: e.target.value })}
                  placeholder="My Awesome Agent"
                />
              </div>
              <div>
                <Label htmlFor="agent-description">Description</Label>
                <Textarea
                  id="agent-description"
                  value={editedConfig.description}
                  onChange={(e) => updateConfig({ description: e.target.value })}
                  placeholder="What does this agent do?"
                  rows={2}
                />
              </div>
            </div>
          </Card>

          {/* Trigger Configuration */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Trigger</h3>
            <div className="space-y-4">
              <div>
                <Label>Trigger Type</Label>
                <Select
                  value={editedConfig.trigger.type}
                  onValueChange={(value: any) =>
                    updateConfig({ trigger: { ...editedConfig.trigger, type: value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editedConfig.trigger.type === 'scheduled' && (
                <div>
                  <Label htmlFor="schedule">Schedule (Cron Expression)</Label>
                  <Input
                    id="schedule"
                    value={editedConfig.trigger.schedule || ''}
                    onChange={(e) =>
                      updateConfig({
                        trigger: { ...editedConfig.trigger, schedule: e.target.value },
                      })
                    }
                    placeholder="0 8 * * *"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Example: "0 8 * * *" = Every day at 8 AM
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Required Integrations */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Required Integrations</h3>
            <div className="flex flex-wrap gap-2">
              {editedConfig.integrations.map((integration, idx) => {
                const def = getIntegrationById(integration.provider);
                return (
                  <Badge key={idx} variant="secondary" className="text-sm">
                    {def?.icon} {def?.name || integration.provider}
                  </Badge>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Make sure you've connected these integrations in your settings.
            </p>
          </Card>

          {/* Steps Configuration */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Execution Steps</h3>
              <Button variant="outline" size="sm" onClick={addStep}>
                + Add Step
              </Button>
            </div>
            <div className="space-y-4">
              {editedConfig.steps.map((step, index) => (
                <Card key={index} className="p-4 border-l-4 border-l-primary/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium capitalize">{step.type}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteStep(index)}
                      disabled={editedConfig.steps.length === 1}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={step.type}
                          onValueChange={(value: any) => updateStep(index, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fetch">Fetch Data</SelectItem>
                            <SelectItem value="process">Process Data</SelectItem>
                            <SelectItem value="action">Perform Action</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {(step.type === 'fetch' || step.type === 'action') && (
                        <div>
                          <Label>Integration</Label>
                          <Input
                            value={step.integration || ''}
                            onChange={(e) => updateStep(index, { integration: e.target.value })}
                            placeholder="e.g., gmail, slack"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Action</Label>
                      <Input
                        value={step.action}
                        onChange={(e) => updateStep(index, { action: e.target.value })}
                        placeholder="e.g., send_email, read_messages"
                      />
                    </div>

                    <div>
                      <Label>Parameters (JSON)</Label>
                      <Textarea
                        value={JSON.stringify(step.params || {}, null, 2)}
                        onChange={(e) => {
                          try {
                            const params = JSON.parse(e.target.value);
                            updateStep(index, { params });
                          } catch (err) {
                            // Invalid JSON, don't update
                          }
                        }}
                        rows={3}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* LLM Configuration */}
          {editedConfig.llm && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4">AI/LLM Configuration</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Model</Label>
                    <Input
                      value={editedConfig.llm.model}
                      onChange={(e) =>
                        updateConfig({
                          llm: { ...editedConfig.llm!, model: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Temperature</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={editedConfig.llm.temperature}
                      onChange={(e) =>
                        updateConfig({
                          llm: { ...editedConfig.llm!, temperature: parseFloat(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>System Prompt</Label>
                  <Textarea
                    value={editedConfig.llm.systemPrompt}
                    onChange={(e) =>
                      updateConfig({
                        llm: { ...editedConfig.llm!, systemPrompt: e.target.value },
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => onSave(editedConfig)}
              disabled={isDeploying}
              className="flex-1"
            >
              {isDeploying ? 'Deploying...' : 'Deploy Agent'}
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

