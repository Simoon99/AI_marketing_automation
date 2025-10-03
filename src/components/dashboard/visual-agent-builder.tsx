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
  GitBranch,
  Filter,
  RotateCw
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
      case 'condition':
        return <GitBranch className="w-5 h-5 text-white" />;
      case 'delay':
        return <Clock className="w-5 h-5 text-white" />;
      case 'filter':
        return <Filter className="w-5 h-5 text-white" />;
      case 'loop':
        return <RotateCw className="w-5 h-5 text-white" />;
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
      case 'condition':
        return 'from-yellow-500 to-yellow-600';
      case 'delay':
        return 'from-pink-500 to-pink-600';
      case 'filter':
        return 'from-cyan-500 to-cyan-600';
      case 'loop':
        return 'from-indigo-500 to-indigo-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Status badge for test results
  const getStatusBadge = () => {
    if (data.testing) {
      return (
        <div className="absolute -top-2 -right-2 z-10 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <Loader2 className="w-4 h-4 text-white animate-spin" />
        </div>
      );
    }
    if (data.testStatus === 'success') {
      return (
        <div className="absolute -top-2 -right-2 z-10 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      );
    }
    if (data.testStatus === 'error') {
      return (
        <div className="absolute -top-2 -right-2 z-10 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
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
  const [testMode, setTestMode] = useState(false);
  const [testing, setTesting] = useState(false);
  const [nodePosition, setNodePosition] = useState<{ x: number; y: number } | null>(null);

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
    
    // Find the node, show panel, and capture position
    setNodes((nds) => {
      const node = nds.find(n => n.id === nodeId);
      if (node) {
        setEditingNode(node.data);
        setNodePosition({ x: node.position.x, y: node.position.y });
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

  const addNode = (type: 'fetch' | 'process' | 'action' | 'condition' | 'delay' | 'filter' | 'loop') => {
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

  const handleTestWorkflow = async () => {
    if (nodes.length <= 1) return; // Need at least one node besides trigger
    
    setTesting(true);
    
    // Clear previous test states
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          testing: false,
          testStatus: undefined,
        },
      }))
    );
    
    // Test each node sequentially with animation
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      // Mark as testing
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
      await new Promise(resolve => setTimeout(resolve, 1200));
      
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
    
    setTesting(false);
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
              {testMode ? "Exit Test" : "Test Mode"}
            </Button>
            {testMode && (
              <Button 
                variant="secondary" 
                onClick={handleTestWorkflow}
                disabled={testing || nodes.length <= 1}
                className="gap-2"
              >
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Test
                  </>
                )}
              </Button>
            )}
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
            proOptions={{ hideAttribution: true }}
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
                  case 'condition': return '#eab308';
                  case 'delay': return '#ec4899';
                  case 'filter': return '#06b6d4';
                  case 'loop': return '#6366f1';
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
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuItem onClick={() => addNode('fetch')} className="gap-3 cursor-pointer">
                    <Database className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium">Fetch Data</div>
                      <div className="text-xs text-muted-foreground">Get data from APIs & services</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addNode('process')} className="gap-3 cursor-pointer">
                    <Brain className="w-4 h-4 text-orange-500" />
                    <div>
                      <div className="font-medium">Process Data</div>
                      <div className="text-xs text-muted-foreground">Transform & analyze with AI</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addNode('condition')} className="gap-3 cursor-pointer">
                    <GitBranch className="w-4 h-4 text-yellow-500" />
                    <div>
                      <div className="font-medium">Condition</div>
                      <div className="text-xs text-muted-foreground">Branch based on logic</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addNode('filter')} className="gap-3 cursor-pointer">
                    <Filter className="w-4 h-4 text-cyan-500" />
                    <div>
                      <div className="font-medium">Filter Data</div>
                      <div className="text-xs text-muted-foreground">Filter & validate data</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addNode('loop')} className="gap-3 cursor-pointer">
                    <RotateCw className="w-4 h-4 text-indigo-500" />
                    <div>
                      <div className="font-medium">Loop</div>
                      <div className="text-xs text-muted-foreground">Repeat actions for each item</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addNode('delay')} className="gap-3 cursor-pointer">
                    <Clock className="w-4 h-4 text-pink-500" />
                    <div>
                      <div className="font-medium">Delay</div>
                      <div className="text-xs text-muted-foreground">Wait before continuing</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addNode('action')} className="gap-3 cursor-pointer">
                    <Send className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="font-medium">Take Action</div>
                      <div className="text-xs text-muted-foreground">Send & trigger events</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Panel>
          </ReactFlow>
        </div>

        {/* Top-Right Floating Node Editor Panel */}
        {showNodePanel && editingNode && (
          <div 
            className="absolute top-4 right-4 z-50 w-[420px] max-h-[85vh] bg-background border-2 border-border rounded-xl shadow-2xl flex flex-col animate-in fade-in slide-in-from-right duration-300"
          >
            {/* Compact Header */}
            <div className="flex-shrink-0 p-3 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Edit className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Node Settings</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant="outline" className="capitalize text-xs h-5 px-1.5">
                        {editingNode.type}
                      </Badge>
                      {editingNode.integration && (
                        <Badge variant="secondary" className="text-xs h-5 px-1.5">
                          {editingNode.integration}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNodePanel(false)}
                  className="hover:bg-destructive/10 h-7 w-7 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Compact Tabs */}
            <Tabs defaultValue="basic" className="flex-1 flex flex-col overflow-hidden min-h-0">
              <TabsList className="mx-3 mt-2 grid w-auto grid-cols-4 bg-muted/50 h-8 flex-shrink-0">
                <TabsTrigger value="basic" className="data-[state=active]:bg-background text-xs h-7">
                  <Settings className="w-3 h-3 mr-1" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="config" className="data-[state=active]:bg-background text-xs h-7">
                  <Zap className="w-3 h-3 mr-1" />
                  Config
                </TabsTrigger>
                <TabsTrigger value="data" className="data-[state=active]:bg-background text-xs h-7">
                  <Database className="w-3 h-3 mr-1" />
                  Data
                </TabsTrigger>
                <TabsTrigger value="advanced" className="data-[state=active]:bg-background text-xs h-7">
                  <Code className="w-3 h-3 mr-1" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 min-h-0 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 180px)' }}>
                <div className="pr-3">
                  {/* Basic Tab */}
                  <TabsContent value="basic" className="p-3 space-y-3 mt-0">
                  {/* Compact Info Card */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-2">
                    <p className="text-xs text-blue-800 dark:text-blue-300 flex items-start gap-1.5">
                      <span className="text-xs">💡</span>
                      <span>Essential node properties. Set name and integration.</span>
                    </p>
                  </div>

                  {/* Quick Setup with Premade Configurations */}
                  {editingNode.type !== 'trigger' && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold flex items-center gap-1.5">
                        <span className="text-green-500">⚡</span>
                        Quick Setup
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Fetch Node Presets */}
                        {editingNode.type === 'fetch' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'Fetch Emails',
                                integration: 'gmail',
                                action: 'fetch_emails',
                                description: 'Retrieve unread emails from Gmail'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">✉️ Gmail Fetcher</span>
                              <span className="text-[10px] text-muted-foreground">Get emails</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'Fetch Sheets Data',
                                integration: 'google-sheets',
                                action: 'fetch_rows',
                                description: 'Get data from Google Sheets'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">📊 Sheets Reader</span>
                              <span className="text-[10px] text-muted-foreground">Read rows</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'Fetch Contacts',
                                integration: 'hubspot',
                                action: 'fetch_contacts',
                                description: 'Retrieve contacts from HubSpot'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">🎯 HubSpot Contacts</span>
                              <span className="text-[10px] text-muted-foreground">Get contacts</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'Fetch Records',
                                integration: 'airtable',
                                action: 'fetch_records',
                                description: 'Get records from Airtable base'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">🗂️ Airtable Data</span>
                              <span className="text-[10px] text-muted-foreground">Read records</span>
                            </Button>
                          </>
                        )}

                        {/* Process Node Presets */}
                        {editingNode.type === 'process' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'AI Summarizer',
                                integration: 'openai',
                                action: 'summarize',
                                description: 'Summarize text using GPT-4'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">🤖 Summarize</span>
                              <span className="text-[10px] text-muted-foreground">AI summary</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'AI Analyzer',
                                integration: 'openai',
                                action: 'analyze',
                                description: 'Analyze data with AI insights'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">🤖 Analyze</span>
                              <span className="text-[10px] text-muted-foreground">AI insights</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'Content Generator',
                                integration: 'openai',
                                action: 'generate_content',
                                description: 'Generate marketing content'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">🤖 Generate</span>
                              <span className="text-[10px] text-muted-foreground">Create content</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'Data Transformer',
                                integration: 'openai',
                                action: 'transform',
                                description: 'Transform data structure'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">🤖 Transform</span>
                              <span className="text-[10px] text-muted-foreground">Restructure</span>
                            </Button>
                          </>
                        )}

                        {/* Action Node Presets */}
                        {editingNode.type === 'action' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'Send Email',
                                integration: 'sendgrid',
                                action: 'send_email',
                                description: 'Send email via SendGrid'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">📧 Email</span>
                              <span className="text-[10px] text-muted-foreground">Send message</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'Post to Slack',
                                integration: 'slack',
                                action: 'send_message',
                                description: 'Send message to Slack channel'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">💬 Slack</span>
                              <span className="text-[10px] text-muted-foreground">Post message</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'Update Sheet',
                                integration: 'google-sheets',
                                action: 'append_row',
                                description: 'Add row to Google Sheets'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">📊 Sheets</span>
                              <span className="text-[10px] text-muted-foreground">Add row</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'Send SMS',
                                integration: 'twilio',
                                action: 'send_sms',
                                description: 'Send SMS via Twilio'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">📱 SMS</span>
                              <span className="text-[10px] text-muted-foreground">Text message</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'Create Contact',
                                integration: 'hubspot',
                                action: 'create_contact',
                                description: 'Add contact to HubSpot'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">🎯 Contact</span>
                              <span className="text-[10px] text-muted-foreground">Add to CRM</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingNode({
                                ...editingNode,
                                label: 'Add to Mailchimp',
                                integration: 'mailchimp',
                                action: 'add_subscriber',
                                description: 'Add subscriber to list'
                              })}
                              className="h-auto py-2 px-2 flex flex-col items-start"
                            >
                              <span className="text-xs font-semibold">🐵 Subscribe</span>
                              <span className="text-[10px] text-muted-foreground">Add to list</span>
                            </Button>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="opacity-50">→</span>
                        Click a preset to quickly configure this node
                      </p>
                    </div>
                  )}

                  <div className="h-px bg-border" />

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
                      
                      {/* Integration field - Only for nodes that need API connections */}
                      {(editingNode.type === 'fetch' || editingNode.type === 'process' || editingNode.type === 'action') && (
                        <>
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

                          {/* API Key / Credentials Section */}
                          {editingNode.integration && (
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold flex items-center gap-1.5">
                                <span className="text-yellow-500">🔑</span>
                                API Key / Credentials
                              </Label>
                              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-2.5">
                                <p className="text-xs text-amber-800 dark:text-amber-300 mb-2">
                                  This integration requires authentication
                                </p>
                                <Input
                                  placeholder={`Enter ${editingNode.integration} API key...`}
                                  className="h-9 text-xs font-mono mb-2"
                                  type="password"
                                />
                                <p className="text-[10px] text-muted-foreground">
                                  💡 <strong>Tip:</strong> For better security, set up integrations in{' '}
                                  <span className="text-primary underline cursor-pointer">Manage Integrations</span> instead
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="node-action" className="text-sm font-semibold flex items-center gap-1.5">
                          <span className="text-primary">●</span>
                          Action
                        </Label>
                        <Select
                          value={editingNode.action || ''}
                          onValueChange={(value) =>
                            setEditingNode({ ...editingNode, action: value })
                          }
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select action..." />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Dynamic actions based on integration and node type */}
                            {editingNode.type === 'fetch' && (
                              <>
                                <SelectItem value="fetch_data">Fetch Data</SelectItem>
                                <SelectItem value="fetch_emails">Fetch Emails</SelectItem>
                                <SelectItem value="fetch_rows">Fetch Rows</SelectItem>
                                <SelectItem value="fetch_contacts">Fetch Contacts</SelectItem>
                                <SelectItem value="fetch_records">Fetch Records</SelectItem>
                              </>
                            )}
                            {editingNode.type === 'process' && (
                              <>
                                <SelectItem value="summarize">Summarize</SelectItem>
                                <SelectItem value="analyze">Analyze</SelectItem>
                                <SelectItem value="generate_content">Generate Content</SelectItem>
                                <SelectItem value="transform">Transform Data</SelectItem>
                                <SelectItem value="extract">Extract Information</SelectItem>
                                <SelectItem value="classify">Classify</SelectItem>
                              </>
                            )}
                            {editingNode.type === 'action' && (
                              <>
                                <SelectItem value="send_email">Send Email</SelectItem>
                                <SelectItem value="send_message">Send Message</SelectItem>
                                <SelectItem value="send_sms">Send SMS</SelectItem>
                                <SelectItem value="append_row">Append Row</SelectItem>
                                <SelectItem value="create_contact">Create Contact</SelectItem>
                                <SelectItem value="add_subscriber">Add Subscriber</SelectItem>
                                <SelectItem value="update_record">Update Record</SelectItem>
                                <SelectItem value="create_record">Create Record</SelectItem>
                              </>
                            )}
                            {editingNode.type === 'condition' && (
                              <>
                                <SelectItem value="if_then">If/Then</SelectItem>
                                <SelectItem value="switch">Switch/Case</SelectItem>
                                <SelectItem value="compare">Compare Values</SelectItem>
                                <SelectItem value="exists">Check If Exists</SelectItem>
                              </>
                            )}
                            {editingNode.type === 'delay' && (
                              <>
                                <SelectItem value="wait_fixed">Wait Fixed Time</SelectItem>
                                <SelectItem value="wait_until">Wait Until Time</SelectItem>
                                <SelectItem value="wait_condition">Wait For Condition</SelectItem>
                              </>
                            )}
                            {editingNode.type === 'filter' && (
                              <>
                                <SelectItem value="filter_array">Filter Array</SelectItem>
                                <SelectItem value="remove_duplicates">Remove Duplicates</SelectItem>
                                <SelectItem value="validate">Validate Data</SelectItem>
                                <SelectItem value="remove_empty">Remove Empty Values</SelectItem>
                              </>
                            )}
                            {editingNode.type === 'loop' && (
                              <>
                                <SelectItem value="for_each">For Each Item</SelectItem>
                                <SelectItem value="repeat_n">Repeat N Times</SelectItem>
                                <SelectItem value="while">While Condition True</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="opacity-50">→</span>
                          The specific operation this node performs
                        </p>
                      </div>

                      {/* Action Parameters */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold flex items-center gap-1.5">
                          <span className="text-purple-500">⚙️</span>
                          Action Parameters
                        </Label>
                        <div className="space-y-2 bg-muted/30 p-2.5 rounded-md border border-border">
                          {/* Email parameters */}
                          {editingNode.action === 'send_email' && (
                            <>
                              <Input placeholder="To: email@example.com" className="h-9 text-xs" />
                              <Input placeholder="Subject: {{subject}}" className="h-9 text-xs" />
                              <Textarea placeholder="Body: Use {{variables}} from previous steps" rows={3} className="text-xs resize-none" />
                            </>
                          )}
                          {/* Message parameters */}
                          {(editingNode.action === 'send_message' || editingNode.action === 'send_sms') && (
                            <>
                              <Input placeholder="To: phone/channel" className="h-9 text-xs" />
                              <Textarea placeholder="Message: {{content}}" rows={2} className="text-xs resize-none" />
                            </>
                          )}
                          {/* Data parameters */}
                          {(editingNode.action === 'append_row' || editingNode.action === 'create_record') && (
                            <>
                              <Input placeholder="Sheet/Table ID" className="h-9 text-xs" />
                              <Textarea placeholder='Data: {"field": "{{value}}", ...}' rows={3} className="text-xs resize-none font-mono" />
                            </>
                          )}
                          {/* Fetch parameters */}
                          {(editingNode.action === 'fetch_data' || editingNode.action === 'fetch_rows') && (
                            <>
                              <Input placeholder="Resource ID (sheet, folder, etc)" className="h-9 text-xs" />
                              <Input placeholder="Filter/Query (optional)" className="h-9 text-xs" />
                            </>
                          )}
                          {/* Process parameters */}
                          {(editingNode.action === 'summarize' || editingNode.action === 'analyze' || editingNode.action === 'generate_content') && (
                            <>
                              <Textarea placeholder="Input: {{data_to_process}}" rows={2} className="text-xs resize-none" />
                              <Input placeholder="Model: gpt-4 (optional)" className="h-9 text-xs" />
                              <Textarea placeholder="Custom instructions (optional)" rows={2} className="text-xs resize-none" />
                            </>
                          )}
                          {/* Condition parameters */}
                          {(editingNode.action === 'if_then' || editingNode.action === 'compare' || editingNode.action === 'exists') && (
                            <>
                              <Input placeholder="Variable to check: {{step1.output}}" className="h-9 text-xs" />
                              <Select defaultValue="equals">
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="equals">Equals</SelectItem>
                                  <SelectItem value="not_equals">Not Equals</SelectItem>
                                  <SelectItem value="contains">Contains</SelectItem>
                                  <SelectItem value="greater_than">Greater Than</SelectItem>
                                  <SelectItem value="less_than">Less Than</SelectItem>
                                  <SelectItem value="is_empty">Is Empty</SelectItem>
                                  <SelectItem value="is_not_empty">Is Not Empty</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input placeholder="Value to compare: expected_value" className="h-9 text-xs" />
                            </>
                          )}
                          {/* Delay parameters */}
                          {(editingNode.action === 'wait_fixed' || editingNode.action === 'wait_until') && (
                            <>
                              {editingNode.action === 'wait_fixed' && (
                                <>
                                  <Input placeholder="Duration: 5" className="h-9 text-xs" type="number" />
                                  <Select defaultValue="seconds">
                                    <SelectTrigger className="h-9 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="seconds">Seconds</SelectItem>
                                      <SelectItem value="minutes">Minutes</SelectItem>
                                      <SelectItem value="hours">Hours</SelectItem>
                                      <SelectItem value="days">Days</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </>
                              )}
                              {editingNode.action === 'wait_until' && (
                                <Input placeholder="Timestamp: 2024-12-31T23:59:59Z or {{variable}}" className="h-9 text-xs" />
                              )}
                            </>
                          )}
                          {/* Filter parameters */}
                          {(editingNode.action === 'filter_array' || editingNode.action === 'validate') && (
                            <>
                              <Input placeholder="Array to filter: {{step1.items}}" className="h-9 text-xs" />
                              <Textarea placeholder='Condition: item.status === "active"' rows={2} className="text-xs resize-none font-mono" />
                            </>
                          )}
                          {/* Loop parameters */}
                          {(editingNode.action === 'for_each' || editingNode.action === 'repeat_n' || editingNode.action === 'while') && (
                            <>
                              {editingNode.action === 'for_each' && (
                                <Input placeholder="Array to iterate: {{step1.items}}" className="h-9 text-xs" />
                              )}
                              {editingNode.action === 'repeat_n' && (
                                <Input placeholder="Number of times: 10" className="h-9 text-xs" type="number" />
                              )}
                              {editingNode.action === 'while' && (
                                <Textarea placeholder='Condition: {{counter}} < 100' rows={2} className="text-xs resize-none font-mono" />
                              )}
                              <Input placeholder="Max iterations (safety): 1000" className="h-9 text-xs" type="number" />
                            </>
                          )}
                          {!editingNode.action && (
                            <p className="text-xs text-muted-foreground text-center py-2">
                              Select an action to see available parameters
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="opacity-50">→</span>
                          Use {`{{variable}}`} to reference data from previous steps
                        </p>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Configuration Tab */}
                <TabsContent value="config" className="p-3 space-y-3 mt-0">
                  {/* Compact Info Card */}
                  <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-md p-2">
                    <p className="text-xs text-purple-800 dark:text-purple-300 flex items-start gap-1.5">
                      <span className="text-xs">⚡</span>
                      <span>Fine-tune execution: retries, timeouts, performance.</span>
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

                  <div className="h-px bg-border" />

                  {/* Conditional Execution Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                      <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                      Conditional Execution
                    </div>
                    
                    <div className="pl-3 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Run When Condition Meets</Label>
                        <Select defaultValue="always">
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="always">Always Run</SelectItem>
                            <SelectItem value="previous_success">Previous Node Succeeded</SelectItem>
                            <SelectItem value="previous_failed">Previous Node Failed</SelectItem>
                            <SelectItem value="custom">Custom Condition</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Custom Condition (JavaScript)</Label>
                        <Textarea
                          placeholder='Example: {{previous.status}} === "success" && {{data.count}} > 10'
                          rows={2}
                          className="text-xs resize-none font-mono"
                        />
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="opacity-50">→</span>
                          Node only runs if condition evaluates to true
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Scheduling Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
                      <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                      Scheduling & Rate Limiting
                    </div>
                    
                    <div className="pl-3 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Delay Before Execution</Label>
                        <div className="flex gap-2">
                          <Input type="number" placeholder="0" defaultValue="0" className="h-9 text-xs flex-1" />
                          <Select defaultValue="seconds">
                            <SelectTrigger className="h-9 w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="seconds">Seconds</SelectItem>
                              <SelectItem value="minutes">Minutes</SelectItem>
                              <SelectItem value="hours">Hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="opacity-50">→</span>
                          Wait before executing this node
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="space-y-0.5">
                          <Label className="font-medium">Enable Rate Limiting</Label>
                          <p className="text-xs text-muted-foreground">
                            Limit how often this node runs
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Data Mapping Tab */}
                <TabsContent value="data" className="p-3 space-y-3 mt-0">
                  {/* Info Card */}
                  <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-md p-2">
                    <p className="text-xs text-cyan-800 dark:text-cyan-300 flex items-start gap-1.5">
                      <span className="text-xs">📊</span>
                      <span>Configure how data flows through this node.</span>
                    </p>
                  </div>

                  {/* Output Mapping */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1.5">
                      <span className="text-green-500">📤</span>
                      Output Configuration
                    </Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Output variable name (e.g., emailData)"
                        className="h-9 text-xs"
                      />
                      <Select defaultValue="json">
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON Object</SelectItem>
                          <SelectItem value="array">Array</SelectItem>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="opacity-50">→</span>
                        Save output as {`{{nodeName.outputVar}}`}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Data Transformation */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1.5">
                      <span className="text-blue-500">🔄</span>
                      Transform Output
                    </Label>
                    <Select defaultValue="none">
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No transformation</SelectItem>
                        <SelectItem value="json_parse">Parse JSON String</SelectItem>
                        <SelectItem value="json_stringify">Convert to JSON String</SelectItem>
                        <SelectItem value="flatten">Flatten Nested Object</SelectItem>
                        <SelectItem value="filter">Filter Array Items</SelectItem>
                        <SelectItem value="map">Map Array Values</SelectItem>
                        <SelectItem value="custom">Custom JavaScript</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Custom transformation code (JavaScript)..."
                      rows={3}
                      className="text-xs resize-none font-mono"
                    />
                  </div>

                  <div className="h-px bg-border" />

                  {/* Variable Reference Guide */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1.5">
                      <Code className="w-4 h-4" />
                      Variable Reference Guide
                    </Label>
                    <div className="bg-muted/50 rounded-lg p-2.5 space-y-1.5 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-purple-500 font-mono">{`{{trigger.data}}`}</span>
                        <span className="text-muted-foreground">Initial trigger data</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-500 font-mono">{`{{step1.output}}`}</span>
                        <span className="text-muted-foreground">Previous node output</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-500 font-mono">{`{{nodeName.field}}`}</span>
                        <span className="text-muted-foreground">Specific field from node</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-500 font-mono">{`{{env.VAR}}`}</span>
                        <span className="text-muted-foreground">Environment variable</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-500 font-mono">{`{{$now}}`}</span>
                        <span className="text-muted-foreground">Current timestamp</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-500 font-mono">{`{{$random}}`}</span>
                        <span className="text-muted-foreground">Random UUID</span>
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
                </div>
              </ScrollArea>
            </Tabs>

            {/* Compact Footer */}
            <div className="flex-shrink-0 p-2.5 border-t border-border flex gap-2">
              <Button onClick={handleSaveNode} size="sm" className="flex-1 h-8 text-xs">
                <Save className="w-3 h-3 mr-1.5" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowNodePanel(false)} className="h-8 text-xs">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

