'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { integrationClient } from '@/lib/integration-client';
import { INTEGRATIONS, getIntegrationById, type UserIntegration, type IntegrationDefinition } from '@/lib/types/integrations';

interface IntegrationsModalProps {
  open: boolean;
  onClose: () => void;
}

export function IntegrationsModal({ open, onClose }: IntegrationsModalProps) {
  const [userIntegrations, setUserIntegrations] = useState<UserIntegration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationDefinition | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (open) {
      loadUserIntegrations();
    }
  }, [open]);

  const loadUserIntegrations = async () => {
    try {
      const integrations = await integrationClient.getUserIntegrations();
      setUserIntegrations(integrations);
    } catch (error) {
      console.error('Failed to load integrations:', error);
    }
  };

  const handleAddIntegration = (integration: IntegrationDefinition) => {
    setSelectedIntegration(integration);
    setFormData({});
  };

  const handleSubmit = async () => {
    if (!selectedIntegration) return;

    setIsSubmitting(true);
    try {
      await integrationClient.addIntegration(
        selectedIntegration.id,
        formData.name || selectedIntegration.name,
        formData
      );
      await loadUserIntegrations();
      setSelectedIntegration(null);
      setFormData({});
    } catch (error: any) {
      alert('Failed to add integration: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) return;

    try {
      await integrationClient.deleteIntegration(id);
      await loadUserIntegrations();
    } catch (error: any) {
      alert('Failed to delete integration: ' + error.message);
    }
  };

  const categories = Array.from(new Set(INTEGRATIONS.map(i => i.category)));
  const filteredIntegrations = activeTab === 'all' 
    ? INTEGRATIONS 
    : INTEGRATIONS.filter(i => i.category === activeTab);

  return (
    <>
      <Dialog open={open && !selectedIntegration} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Integrations</DialogTitle>
            <DialogDescription>
              Connect your accounts to enable agents to interact with your favorite services.
            </DialogDescription>
          </DialogHeader>

          {/* Connected Integrations */}
          {userIntegrations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Connected Integrations</h3>
              <div className="space-y-2">
                {userIntegrations.map((integration) => {
                  const def = getIntegrationById(integration.provider);
                  return (
                    <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{def?.icon || '🔌'}</span>
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-xs text-muted-foreground">{def?.name || integration.provider}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(integration.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Integrations */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Add New Integration</h3>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map(cat => (
                  <TabsTrigger key={cat} value={cat} className="capitalize">
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredIntegrations.map((integration) => {
                  const isConnected = userIntegrations.some(ui => ui.provider === integration.id);
                  return (
                    <button
                      key={integration.id}
                      onClick={() => !isConnected && handleAddIntegration(integration)}
                      disabled={isConnected}
                      className="p-4 border rounded-lg text-left hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-2xl">{integration.icon}</span>
                        {integration.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                        {isConnected && <Badge variant="default" className="text-xs">Connected</Badge>}
                      </div>
                      <h4 className="font-medium text-sm mb-1">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </button>
                  );
                })}
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Integration Form Dialog */}
      <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>{selectedIntegration?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="integration-name">Integration Name</Label>
              <Input
                id="integration-name"
                placeholder={selectedIntegration?.name}
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {selectedIntegration?.credentialFields.map((field) => (
              <div key={field.key}>
                <Label htmlFor={field.key}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.key}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    required={field.required}
                  />
                ) : field.type === 'select' ? (
                  <Select
                    value={formData[field.key] || ''}
                    onValueChange={(value) => setFormData({ ...formData, [field.key]: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    required={field.required}
                  />
                )}
                {field.description && (
                  <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                )}
              </div>
            ))}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Connecting...' : 'Connect'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedIntegration(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

