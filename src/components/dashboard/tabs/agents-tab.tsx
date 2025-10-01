"use client";

import { useState, useCallback } from "react";
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    type Connection,
    type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Plus, Save, Play, Trash2 } from "lucide-react";

const initialNodes = [
    {
        id: "1",
        type: "input",
        data: { label: "Start Trigger" },
        position: { x: 250, y: 25 },
        style: {
            background: "#3b82f6",
            color: "#fff",
            border: "1px solid #2563eb",
            borderRadius: "8px",
            padding: "10px",
        },
    },
];

const initialEdges: Edge[] = [];

export default function AgentsTab() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [showNewNodeMenu, setShowNewNodeMenu] = useState(false);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const addNewNode = useCallback(
        (type: string, label: string) => {
            const newNode = {
                id: `node-${nodes.length + 1}`,
                type: "default",
                data: { label },
                position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 100 },
                style: {
                    background: "#1e293b",
                    color: "#fff",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "10px",
                },
            };
            setNodes((nds) => nds.concat(newNode));
            setShowNewNodeMenu(false);
        },
        [nodes.length, setNodes]
    );

    const clearCanvas = useCallback(() => {
        setNodes(initialNodes);
        setEdges([]);
    }, [setNodes, setEdges]);

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-border bg-background px-6 py-3">
                <div>
                    <h2 className="text-lg font-semibold">Automation Builder</h2>
                    <p className="text-sm text-muted-foreground">
                        Create custom marketing automation workflows
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => setShowNewNodeMenu(!showNewNodeMenu)}
                        >
                            <Plus className="w-4 h-4" />
                            Add Node
                        </Button>
                        {showNewNodeMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50 p-2">
                                <button
                                    onClick={() => addNewNode("action", "Generate Content")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded"
                                >
                                    📝 Generate Content
                                </button>
                                <button
                                    onClick={() => addNewNode("action", "Send Email")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded"
                                >
                                    ✉️ Send Email
                                </button>
                                <button
                                    onClick={() => addNewNode("action", "Post to Social")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded"
                                >
                                    📱 Post to Social
                                </button>
                                <button
                                    onClick={() => addNewNode("action", "Analyze Data")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded"
                                >
                                    📊 Analyze Data
                                </button>
                                <button
                                    onClick={() => addNewNode("condition", "If/Then")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded"
                                >
                                    🔀 If/Then Condition
                                </button>
                                <button
                                    onClick={() => addNewNode("delay", "Wait/Delay")}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded"
                                >
                                    ⏱️ Wait/Delay
                                </button>
                            </div>
                        )}
                    </div>
                    <Button size="sm" variant="outline" className="gap-2" onClick={clearCanvas}>
                        <Trash2 className="w-4 h-4" />
                        Clear
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                        <Save className="w-4 h-4" />
                        Save
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Play className="w-4 h-4" />
                        Run
                    </Button>
                </div>
            </div>

            {/* React Flow Canvas */}
            <div className="flex-1 bg-background">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    style={{
                        background: "hsl(var(--background))",
                    }}
                >
                    <Controls />
                    <MiniMap
                        style={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                        }}
                    />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    );
}

