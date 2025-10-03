"use client";

import { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MiniMap,
  Panel,
  BackgroundVariant,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  Play, 
  Save, 
  Zap, 
  Database, 
  Brain, 
  Send,
  Settings,
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Custom Node Component
function CustomNode({ data }: { data: any }) {
  const getNodeIcon = () => {
    switch (data.type) {
      case 'trigger':
        return <Zap className="w-5 h-5 text-white" />;
      case 'fetch':
        return <Database className="w-5 h-5 text-white" />;
      case 'process':
        return <Brain className="w-5 h-5 text-white" />;
      case 'action':
        return <Send className="w-5 h-5 text-white" />;
      default:
        return <Settings className="w-5 h-5 text-white" />;
    }
  };

  const getNodeColor = () => {
    switch (data.type) {
      case 'trigger':
        return 'from-purple-500 to-purple-600';
      case 'fetch':
        return 'from-blue-500 to-blue-600';
      case 'process':
        return 'from-orange-500 to-orange-600';
      case 'action':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="relative group">
      <div 
        className={cn(
          "w-64 bg-card border-2 border-border rounded-xl shadow-lg hover:shadow-xl transition-all",
          data.selected && "border-primary"
        )}
        onClick={() => data.onSelect?.(data.id)}
      >
        {/* Header */}
        <div className={cn("bg-gradient-to-br p-3 rounded-t-xl flex items-center gap-3", getNodeColor())}>
          {getNodeIcon()}
          <div className="flex-1 text-white">
            <div className="font-semibold text-sm">{data.label}</div>
            <div className="text-xs opacity-90 capitalize">{data.type}</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(data.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {data.integration && (
            <Badge variant="secondary" className="text-xs">
              {data.integration}
            </Badge>
          )}
          {data.action && (
            <div className="text-xs text-muted-foreground">
              Action: {data.action}
            </div>
          )}
          {data.description && (
            <div className="text-xs text-muted-foreground line-clamp-2">
              {data.description}
            </div>
          )}
        </div>

        {/* Connection Points */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background" />
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background" />
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

interface VisualAgentBuilderProps {
  initialConfig?: any;
  onSave: (config: any) => void;
  onClose: () => void;
  agentName?: string;
  agentDescription?: string;
}

export function VisualAgentBuilder({ 
  initialConfig, 
  onSave, 
  onClose,
  agentName = "New Agent",
  agentDescription = ""
}: VisualAgentBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showNodePanel, setShowNodePanel] = useState(false);
  const [editingNode, setEditingNode] = useState<any>(null);

  // Convert agent config to visual nodes
  useEffect(() => {
    if (initialConfig?.steps) {
      const visualNodes: Node[] = [];
      const visualEdges: Edge[] = [];
      
      // Add trigger node
      visualNodes.push({
        id: 'trigger',
        type: 'custom',
        position: { x: 250, y: 50 },
        data: {
          id: 'trigger',
          type: 'trigger',
          label: 'Trigger',
          description: initialConfig.trigger_type || 'Manual',
          onSelect: handleNodeSelect,
          onDelete: handleNodeDelete,
        },
      });

      // Add step nodes
      initialConfig.steps.forEach((step: any, index: number) => {
        const nodeId = `step-${index}`;
        visualNodes.push({
          id: nodeId,
          type: 'custom',
          position: { x: 250, y: 200 + index * 180 },
          data: {
            id: nodeId,
            type: step.type,
            label: step.action || `${step.type} Step`,
            action: step.action,
            integration: step.integration,
            description: step.params?.description,
            params: step.params,
            onSelect: handleNodeSelect,
            onDelete: handleNodeDelete,
          },
        });

        // Connect to previous node
        const sourceId = index === 0 ? 'trigger' : `step-${index - 1}`;
        visualEdges.push({
          id: `edge-${sourceId}-${nodeId}`,
          source: sourceId,
          target: nodeId,
          type: 'smoothstep',
          animated: true,
        });
      });

      setNodes(visualNodes);
      setEdges(visualEdges);
    } else {
      // Start with just a trigger node
      setNodes([{
        id: 'trigger',
        type: 'custom',
        position: { x: 250, y: 50 },
        data: {
          id: 'trigger',
          type: 'trigger',
          label: 'Trigger',
          description: 'Manual',
          onSelect: handleNodeSelect,
          onDelete: () => {},
        },
      }]);
    }
  }, [initialConfig]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds)),
    [setEdges]
  );

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNode(node.data);
      setShowNodePanel(true);
    }
  }, [nodes]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    if (nodeId === 'trigger') return; // Don't delete trigger
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNode === nodeId) {
      setShowNodePanel(false);
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const addNode = (type: 'fetch' | 'process' | 'action') => {
    const newNodeId = `step-${Date.now()}`;
    const lastNode = nodes[nodes.length - 1];
    const yPosition = lastNode ? lastNode.position.y + 180 : 200;

    const newNode: Node = {
      id: newNodeId,
      type: 'custom',
      position: { x: 250, y: yPosition },
      data: {
        id: newNodeId,
        type,
        label: `New ${type} Step`,
        action: '',
        integration: '',
        description: '',
        params: {},
        onSelect: handleNodeSelect,
        onDelete: handleNodeDelete,
      },
    };

    setNodes((nds) => [...nds, newNode]);

    // Auto-connect to last node
    if (lastNode) {
      setEdges((eds) => [
        ...eds,
        {
          id: `edge-${lastNode.id}-${newNodeId}`,
          source: lastNode.id,
          target: newNodeId,
          type: 'smoothstep',
          animated: true,
        },
      ]);
    }

    handleNodeSelect(newNodeId);
  };

  const updateNodeData = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
  };

  const handleSaveNode = () => {
    if (editingNode && selectedNode) {
      updateNodeData(selectedNode, editingNode);
      setShowNodePanel(false);
    }
  };

  const handleSaveWorkflow = () => {
    // Convert visual nodes back to agent config
    const steps = nodes
      .filter(node => node.id !== 'trigger')
      .map(node => ({
        type: node.data.type,
        action: node.data.action || node.data.label,
        integration: node.data.integration,
        params: node.data.params || {},
      }));

    const config = {
      name: agentName,
      description: agentDescription,
      trigger_type: 'manual',
      steps,
      integrations: [...new Set(steps.map(s => s.integration).filter(Boolean))],
    };

    onSave(config);
  };

  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              Visual Agent Builder
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {agentName} - Drag, connect, and configure nodes to build your workflow
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveWorkflow} className="gap-2">
              <Save className="w-4 h-4" />
              Save Workflow
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-muted/20"
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.data.type) {
                  case 'trigger': return '#a855f7';
                  case 'fetch': return '#3b82f6';
                  case 'process': return '#f97316';
                  case 'action': return '#22c55e';
                  default: return '#6b7280';
                }
              }}
              className="!bg-card !border !border-border"
            />

            {/* Toolbar Panel */}
            <Panel position="top-left" className="space-y-2 bg-card border border-border rounded-lg p-3 shadow-lg">
              <div className="text-sm font-semibold mb-2">Add Node</div>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => addNode('fetch')}
              >
                <Database className="w-4 h-4 text-blue-500" />
                Fetch Data
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => addNode('process')}
              >
                <Brain className="w-4 h-4 text-orange-500" />
                Process Data
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => addNode('action')}
              >
                <Send className="w-4 h-4 text-green-500" />
                Take Action
              </Button>
            </Panel>
          </ReactFlow>
        </div>

        {/* Node Editor Panel */}
        {showNodePanel && editingNode && (
          <div className="w-96 border-l border-border bg-card flex flex-col">
            <div className="flex-shrink-0 p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Edit Node</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNodePanel(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label>Node Type</Label>
                  <Badge variant="secondary" className="capitalize">
                    {editingNode.type}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="node-label">Label</Label>
                  <Input
                    id="node-label"
                    value={editingNode.label || ''}
                    onChange={(e) =>
                      setEditingNode({ ...editingNode, label: e.target.value })
                    }
                    placeholder="Enter node label"
                  />
                </div>

                {editingNode.type !== 'trigger' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="node-action">Action</Label>
                      <Input
                        id="node-action"
                        value={editingNode.action || ''}
                        onChange={(e) =>
                          setEditingNode({ ...editingNode, action: e.target.value })
                        }
                        placeholder="e.g., fetch_emails, send_message"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="node-integration">Integration</Label>
                      <Select
                        value={editingNode.integration || ''}
                        onValueChange={(value) =>
                          setEditingNode({ ...editingNode, integration: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select integration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="slack">Slack</SelectItem>
                          <SelectItem value="gmail">Gmail</SelectItem>
                          <SelectItem value="google-sheets">Google Sheets</SelectItem>
                          <SelectItem value="airtable">Airtable</SelectItem>
                          <SelectItem value="hubspot">HubSpot</SelectItem>
                          <SelectItem value="zapier">Zapier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="node-description">Description</Label>
                      <Textarea
                        id="node-description"
                        value={editingNode.description || ''}
                        onChange={(e) =>
                          setEditingNode({ ...editingNode, description: e.target.value })
                        }
                        placeholder="Describe what this node does"
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>

            <div className="flex-shrink-0 p-4 border-t border-border">
              <Button onClick={handleSaveNode} className="w-full">
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

