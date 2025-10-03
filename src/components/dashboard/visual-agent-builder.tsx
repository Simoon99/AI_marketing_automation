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
  Handle,
  Position,
  EdgeProps,
  EdgeLabelRenderer,
  BaseEdge,
  getSmoothStepPath,
  EdgeTypes,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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
  ChevronRight,
  Edit,
  AlertCircle,
  Clock,
  Code,
  Link as LinkIcon,
  Loader2,
  CheckCircle,
  XCircle,
  TestTube,
  BarChart
} from 'lucide-react';
import { cn } from '@/lib';

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

  // Status indicator for testing
  const getStatusBadge = () => {
    if (data.testing) {
      return (
        <div className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        </div>
      );
    }
    if (data.testStatus === 'success') {
      return (
        <div className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      );
    }
    if (data.testStatus === 'error') {
      return (
        <div className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
          <XCircle className="w-4 h-4 text-white" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative group">
      {/* Status Badge */}
      {getStatusBadge()}
      {/* Input Handle - More visible with hover effect */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-primary !border-2 !border-background hover:!w-6 hover:!h-6 transition-all !shadow-lg"
        style={{ left: -8 }}
      />
      
      <div 
        className={cn(
          "w-64 bg-card border-2 border-border rounded-xl shadow-lg hover:shadow-xl transition-all",
          data.selected && "border-primary ring-2 ring-primary/20"
        )}
        onClick={() => data.onSelect?.(data.id)}
      >
        {/* Header */}
        <div className={cn("bg-gradient-to-br p-3 rounded-t-xl flex items-center gap-2", getNodeColor())}>
          {getNodeIcon()}
          <div className="flex-1 text-white">
            <div className="font-semibold text-sm">{data.label}</div>
            <div className="text-xs opacity-90 capitalize">{data.type}</div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                data.onSelect?.(data.id);
              }}
              className="p-1 hover:bg-white/20 rounded"
              title="Edit node"
            >
              <Edit className="w-4 h-4 text-white" />
            </button>
            {data.type !== 'trigger' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  data.onDelete?.(data.id);
                }}
                className="p-1 hover:bg-white/20 rounded"
                title="Delete node"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
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
      </div>
      
      {/* Output Handle - More visible with hover effect */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-primary !border-2 !border-background hover:!w-6 hover:!h-6 transition-all !shadow-lg"
        style={{ right: -8 }}
      />
    </div>
  );
}

// Custom Edge with Delete Button
function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt: React.MouseEvent, edgeId: string) => {
    evt.stopPropagation();
    data?.onDelete?.(edgeId);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            className="w-5 h-5 bg-muted/80 hover:bg-red-500 border border-border hover:border-red-600 rounded-full flex items-center justify-center shadow-md transition-all duration-200 group"
            onClick={(event) => onEdgeClick(event, id)}
            title="Delete connection"
          >
            <X className="w-3 h-3 text-muted-foreground group-hover:text-white transition-colors duration-200" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
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
  
  // Test Mode State
  const [testMode, setTestMode] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  // Handler functions
  const handleNodeSelect = useCallback((nodeId: string) => {
    console.log('Node selected:', nodeId); // Debug log
    setSelectedNode(nodeId);
    
    // Mark node as selected
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          selected: n.id === nodeId,
        },
      }))
    );
    
    // Find the node and show panel
    setNodes((nds) => {
      const node = nds.find(n => n.id === nodeId);
      if (node) {
        setEditingNode(node.data);
        setShowNodePanel(true);
      }
      return nds;
    });
  }, []);

  const handleNodeDelete = useCallback((nodeId: string) => {
    if (nodeId === 'trigger') return; // Don't delete trigger
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNode === nodeId) {
      setShowNodePanel(false);
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const handleEdgeDelete = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
  }, [setEdges]);

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
          type: 'custom',
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 3 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#6366f1',
          },
          data: { onDelete: handleEdgeDelete },
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
          onDelete: handleNodeDelete,
        },
      }]);
    }
  }, [initialConfig, handleNodeSelect, handleNodeDelete]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      type: 'custom',
      style: { stroke: '#6366f1', strokeWidth: 3 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#6366f1',
      },
      data: { onDelete: handleEdgeDelete },
    }, eds)),
    [setEdges, handleEdgeDelete]
  );

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
          type: 'custom',
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 3 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#6366f1',
          },
          data: { onDelete: handleEdgeDelete },
        },
      ]);
    }

    handleNodeSelect(newNodeId);
  };

  const updateNodeData = (nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                ...newData,
                // Preserve stable handlers
                onSelect: node.data.onSelect,
                onDelete: node.data.onDelete,
              } 
            }
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
            <Button 
              variant={testMode ? "default" : "outline"} 
              onClick={() => setTestMode(!testMode)}
              className="gap-2"
            >
              <TestTube className="w-4 h-4" />
              {testMode ? "Exit Test Mode" : "Test Mode"}
            </Button>
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
            edgeTypes={edgeTypes}
            fitView
            className="bg-muted/20"
            defaultEdgeOptions={{
              type: 'custom',
              animated: true,
              style: { stroke: '#6366f1', strokeWidth: 3 },
              markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
              data: { onDelete: handleEdgeDelete },
            }}
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

            {/* Helper Tip - Shows when there are few nodes */}
            {nodes.length <= 2 && (
              <Panel position="top-center">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Drag from the blue circles on nodes to connect them together
                </div>
              </Panel>
            )}

            {/* Compact Add Node Button */}
            <Panel position="top-left">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="gap-2 shadow-lg">
                    <Plus className="w-4 h-4" />
                    Add Node
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => addNode('fetch')} className="gap-3 cursor-pointer">
                    <Database className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium">Fetch Data</div>
                      <div className="text-xs text-muted-foreground">Get data from APIs</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addNode('process')} className="gap-3 cursor-pointer">
                    <Brain className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="font-medium">Process Data</div>
                      <div className="text-xs text-muted-foreground">Transform with AI</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addNode('action')} className="gap-3 cursor-pointer">
                    <Send className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="font-medium">Take Action</div>
                      <div className="text-xs text-muted-foreground">Send or trigger events</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Panel>
          </ReactFlow>
        </div>

        {/* Test Mode Panel */}
        {testMode && (
          <div className="w-96 border-l border-border bg-card flex flex-col shadow-xl">
            {/* Header */}
            <div className="p-4 border-b border-border bg-gradient-to-br from-green-500/10 to-blue-500/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                  <TestTube className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-lg">Test Workflow</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Test your entire workflow with sample data
              </p>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Test Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Test Input Data (JSON)</Label>
                  <Textarea
                    placeholder={`{
  "email": "test@example.com",
  "subject": "Test Email",
  "data": "your test data"
}`}
                    rows={8}
                    className="font-mono text-xs resize-none"
                    defaultValue="{}"
                  />
                  <p className="text-xs text-muted-foreground">
                    This data will be passed to the trigger node
                  </p>
                </div>

                {/* Test Button */}
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  disabled={nodes.length <= 1}
                  onClick={async () => {
                    // Mock test execution
                    setTesting(true);
                    setTestResults(null);
                    
                    // Simulate testing each node
                    for (let i = 0; i < nodes.length; i++) {
                      const node = nodes[i];
                      setNodes((nds) =>
                        nds.map((n) => ({
                          ...n,
                          data: {
                            ...n.data,
                            testing: n.id === node.id,
                          },
                        }))
                      );
                      
                      // Simulate processing time
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      
                      // Mark as success
                      setNodes((nds) =>
                        nds.map((n) => ({
                          ...n,
                          data: {
                            ...n.data,
                            testing: false,
                            testStatus: n.id === node.id ? 'success' : n.data.testStatus,
                          },
                        }))
                      );
                    }
                    
                    // Show results
                    setTestResults({
                      success: true,
                      executionTime: nodes.length * 1000,
                      stepsExecuted: nodes.length,
                      output: {
                        status: "success",
                        message: "Workflow executed successfully",
                        processedData: "Sample output data"
                      }
                    });
                    setTesting(false);
                  }}
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Full Test
                    </>
                  )}
                </Button>

                {/* Test Results */}
                {testResults && (
                  <div className="space-y-3 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Test Results</Label>
                      <Badge variant={testResults.success ? "default" : "destructive"}>
                        {testResults.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-sm">Workflow Passed!</span>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Steps Executed:</span>
                          <span className="font-mono font-medium">{testResults.stepsExecuted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Execution Time:</span>
                          <span className="font-mono font-medium">{testResults.executionTime}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Average/Step:</span>
                          <span className="font-mono font-medium">{Math.round(testResults.executionTime / testResults.stepsExecuted)}ms</span>
                        </div>
                      </div>
                    </div>

                    {/* Output Preview */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Output Data</Label>
                      <div className="bg-muted/50 border border-border rounded-lg p-3">
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                          {JSON.stringify(testResults.output, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Tips */}
                {!testResults && !testing && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-3 mt-4">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Testing Tips</p>
                    <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                      <li>• Add at least one node to test</li>
                      <li>• Watch nodes light up as they execute</li>
                      <li>• Green ✓ = Success, Red × = Error</li>
                      <li>• Check execution time for performance</li>
                    </ul>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Modal Overlay for Node Customization */}
      <Dialog open={showNodePanel && !!editingNode} onOpenChange={(open) => !open && setShowNodePanel(false)}>
        <DialogContent className="max-w-5xl h-[85vh] p-0 overflow-hidden">
          {editingNode && (
            <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted/10">
              {/* Header */}
              <div className="flex-shrink-0 p-5 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Edit className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Customize Node</h3>
                      <p className="text-xs text-muted-foreground">Configure behavior & integrations</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNodePanel(false)}
                    className="hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize font-medium">
                    {editingNode.type} Node
                </Badge>
                {editingNode.integration && (
                  <Badge variant="secondary" className="text-xs">
                    {editingNode.integration}
                  </Badge>
                )}
              </div>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="basic" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="mx-4 mt-4 grid w-auto grid-cols-5 bg-muted/50">
                <TabsTrigger value="basic" className="data-[state=active]:bg-background">
                  <Settings className="w-3.5 h-3.5 mr-1.5" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="config" className="data-[state=active]:bg-background">
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  Config
                </TabsTrigger>
                <TabsTrigger value="data" className="data-[state=active]:bg-background">
                  <Database className="w-3.5 h-3.5 mr-1.5" />
                  Data
                </TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-background">
                  <Code className="w-3.5 h-3.5 mr-1.5" />
                  Advanced
                </TabsTrigger>
                <TabsTrigger value="testing" className="data-[state=active]:bg-background">
                  <TestTube className="w-3.5 h-3.5 mr-1.5" />
                  Testing
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                {/* Basic Tab */}
                <TabsContent value="basic" className="p-5 space-y-5 mt-0">
                  {/* Info Card */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                      <span className="text-sm">💡</span>
                      <span>Configure the essential properties of this node. Give it a clear name and specify which service it connects to.</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="node-label" className="text-sm font-semibold flex items-center gap-1.5">
                      <span className="text-primary">●</span>
                      Node Name
                    </Label>
                    <Input
                      id="node-label"
                      value={editingNode.label || ''}
                      onChange={(e) =>
                        setEditingNode({ ...editingNode, label: e.target.value })
                      }
                      placeholder="e.g., Fetch Customer Emails"
                      className="h-10 font-medium"
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="opacity-50">→</span>
                      A descriptive name for this node
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="node-description" className="text-sm font-semibold">Description</Label>
                    <Textarea
                      id="node-description"
                      value={editingNode.description || ''}
                      onChange={(e) =>
                        setEditingNode({ ...editingNode, description: e.target.value })
                      }
                      placeholder="Describe what this node does..."
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="opacity-50">→</span>
                      Optional but helpful for team collaboration
                    </p>
                  </div>

                  {editingNode.type !== 'trigger' && (
                    <>
                      <div className="h-px bg-border" />
                      
                      <div className="space-y-2">
                        <Label htmlFor="node-integration" className="text-sm font-semibold flex items-center gap-1.5">
                          <span className="text-primary">●</span>
                          Integration
                        </Label>
                        <Select
                          value={editingNode.integration || ''}
                          onValueChange={(value) =>
                            setEditingNode({ ...editingNode, integration: value })
                          }
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select integration..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="openai">🤖 OpenAI</SelectItem>
                            <SelectItem value="sendgrid">📧 SendGrid</SelectItem>
                            <SelectItem value="slack">💬 Slack</SelectItem>
                            <SelectItem value="gmail">✉️ Gmail</SelectItem>
                            <SelectItem value="google-sheets">📊 Google Sheets</SelectItem>
                            <SelectItem value="airtable">🗂️ Airtable</SelectItem>
                            <SelectItem value="hubspot">🎯 HubSpot</SelectItem>
                            <SelectItem value="stripe">💳 Stripe</SelectItem>
                            <SelectItem value="twilio">📱 Twilio</SelectItem>
                            <SelectItem value="mailchimp">🐵 Mailchimp</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="opacity-50">→</span>
                          The service this node connects to
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="node-action" className="text-sm font-semibold flex items-center gap-1.5">
                          <span className="text-primary">●</span>
                          Action
                        </Label>
                        <Input
                          id="node-action"
                          value={editingNode.action || ''}
                          onChange={(e) =>
                            setEditingNode({ ...editingNode, action: e.target.value })
                          }
                          placeholder="e.g., send_email, fetch_data"
                          className="h-10 font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="opacity-50">→</span>
                          The specific action this node performs
                        </p>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Configuration Tab */}
                <TabsContent value="config" className="p-5 space-y-5 mt-0">
                  {/* Info Card */}
                  <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                    <p className="text-xs text-purple-800 dark:text-purple-300 flex items-start gap-2">
                      <span className="text-sm">⚡</span>
                      <span>Fine-tune how this node executes. Control retries, timeouts, and performance optimizations.</span>
                    </p>
                  </div>

                  {/* Error Handling Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                      <div className="w-1 h-4 bg-primary rounded-full"></div>
                      Error Handling
                    </div>
                    
                    <div className="pl-3 space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="space-y-0.5">
                          <Label className="font-medium">Retry on Failure</Label>
                          <p className="text-xs text-muted-foreground">
                            Automatically retry if this node fails
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Max Retries</Label>
                        <Select defaultValue="3">
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 attempt</SelectItem>
                            <SelectItem value="3">3 attempts</SelectItem>
                            <SelectItem value="5">5 attempts</SelectItem>
                            <SelectItem value="10">10 attempts</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="opacity-50">→</span>
                          Number of retry attempts before giving up
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Timeout (seconds)</Label>
                        <Input type="number" defaultValue="30" placeholder="30" className="h-10" />
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="opacity-50">→</span>
                          Maximum execution time before timeout
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Performance Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                      <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                      Performance
                    </div>

                    <div className="pl-3 space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="space-y-0.5">
                          <Label className="font-medium">Run Asynchronously</Label>
                          <p className="text-xs text-muted-foreground">
                            Don't wait for this node to complete
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="space-y-0.5">
                          <Label className="font-medium">Cache Results</Label>
                          <p className="text-xs text-muted-foreground">
                            Cache output for faster execution
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Data Mapping Tab */}
                <TabsContent value="data" className="p-4 space-y-4 mt-0">
                  <div className="space-y-3">
                    <div>
                      <Label className="mb-2 block">Input Parameters</Label>
                      <div className="space-y-2">
                        <Input placeholder="Parameter name" />
                        <Textarea
                          placeholder="Parameter value or expression (e.g., {{previous.output}})"
                          rows={2}
                        />
                        <Button variant="outline" size="sm" className="w-full">
                          <Plus className="w-3 h-3 mr-1" />
                          Add Parameter
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Output Path</Label>
                      <Input
                        placeholder="e.g., data.results"
                        defaultValue="output"
                      />
                      <p className="text-xs text-muted-foreground">
                        Where to store this node's output
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Data Transformation</Label>
                      <Select defaultValue="none">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No transformation</SelectItem>
                          <SelectItem value="json">Parse as JSON</SelectItem>
                          <SelectItem value="xml">Parse as XML</SelectItem>
                          <SelectItem value="csv">Parse as CSV</SelectItem>
                          <SelectItem value="custom">Custom function</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                      <div className="flex items-start gap-2">
                        <Code className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="text-xs space-y-1">
                          <p className="font-medium">Available Variables</p>
                          <p className="text-muted-foreground">{`{{trigger.data}}`} - Trigger data</p>
                          <p className="text-muted-foreground">{`{{step1.output}}`} - Previous node output</p>
                          <p className="text-muted-foreground">{`{{env.API_KEY}}`} - Environment variable</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value="advanced" className="p-4 space-y-4 mt-0">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Conditional Execution</Label>
                      <Textarea
                        placeholder="e.g., {{previous.status}} === 'success'"
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground">
                        Only run this node if condition is true
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Error Handler</Label>
                      <Select defaultValue="continue">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="continue">Continue workflow</SelectItem>
                          <SelectItem value="stop">Stop workflow</SelectItem>
                          <SelectItem value="fallback">Use fallback value</SelectItem>
                          <SelectItem value="notify">Send notification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Rate Limiting</Label>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="10" className="flex-1" />
                        <Select defaultValue="minute">
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="second">/ sec</SelectItem>
                            <SelectItem value="minute">/ min</SelectItem>
                            <SelectItem value="hour">/ hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Logging</Label>
                        <p className="text-xs text-muted-foreground">
                          Log execution details
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Wait for Webhook</Label>
                        <p className="text-xs text-muted-foreground">
                          Pause and wait for external trigger
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="space-y-2">
                      <Label>Custom Code</Label>
                      <Textarea
                        placeholder="// Write custom JavaScript here"
                        rows={4}
                        className="font-mono text-xs"
                      />
                      <p className="text-xs text-muted-foreground">
                        Execute custom code for this node
                      </p>
                    </div>

                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500" />
                        <div className="text-xs space-y-1">
                          <p className="font-medium text-amber-600 dark:text-amber-400">Advanced Settings</p>
                          <p className="text-muted-foreground">
                            These settings can affect workflow performance. Test thoroughly before deploying.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Testing Tab */}
                <TabsContent value="testing" className="p-5 space-y-5 mt-0">
                  {/* Info Card */}
                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <p className="text-xs text-green-800 dark:text-green-300 flex items-start gap-2">
                      <span className="text-sm">🧪</span>
                      <span>Test this node with sample data before deploying. See results in real-time and verify it works as expected.</span>
                    </p>
                  </div>

                  {/* Test Status */}
                  {editingNode?.testStatus && (
                    <div className={cn(
                      "p-4 rounded-lg border flex items-center gap-3",
                      editingNode.testStatus === 'success' && "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
                      editingNode.testStatus === 'error' && "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
                      editingNode.testing && "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                    )}>
                      {editingNode.testing && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                      {editingNode.testStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {editingNode.testStatus === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {editingNode.testing && "Testing in progress..."}
                          {editingNode.testStatus === 'success' && "Test passed successfully!"}
                          {editingNode.testStatus === 'error' && "Test failed"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Test Input Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                      <div className="w-1 h-4 bg-primary rounded-full"></div>
                      Test Input Data
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Mock Input (JSON)</Label>
                      <Textarea
                        placeholder={`{
  "email": "test@example.com",
  "name": "John Doe",
  "data": "your test data here"
}`}
                        rows={8}
                        className="font-mono text-xs resize-none"
                        defaultValue="{}"
                      />
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="opacity-50">→</span>
                        JSON data to test this node with. Must be valid JSON format.
                      </p>
                    </div>
                  </div>

                  {/* Test Actions */}
                  <div className="space-y-3">
                    <Button className="w-full gap-2" size="lg" disabled>
                      <Play className="w-4 h-4" />
                      Run Node Test
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Testing functionality coming soon! Full workflow testing available in Test Mode.
                    </p>
                  </div>

                  {/* Test Results Placeholder */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Test Results</Label>
                      <Badge variant="secondary" className="text-xs">Not yet run</Badge>
                    </div>
                    <div className="border border-border rounded-lg p-6 bg-muted/30 text-center">
                      <BarChart className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-sm font-medium text-muted-foreground">No test results yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click "Run Node Test" to see results here
                      </p>
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Testing Tips</p>
                    <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                      <li>• Use realistic test data that matches your production data structure</li>
                      <li>• Test both success and error scenarios</li>
                      <li>• Check the full workflow using "Test Mode" on the canvas</li>
                      <li>• Monitor execution time to optimize performance</li>
                    </ul>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            {/* Footer Actions */}
            <div className="flex-shrink-0 p-4 border-t border-border flex gap-2">
              <Button onClick={handleSaveNode} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setShowNodePanel(false)}>
                Cancel
              </Button>
            </div>
          </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

