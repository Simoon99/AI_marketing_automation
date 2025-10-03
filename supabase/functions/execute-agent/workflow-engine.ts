// N8N-style Graph-based Workflow Execution Engine

export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  parameters: Record<string, any>;
  disabled?: boolean;
  notes?: string;
  continueOnFail?: boolean;
  retryOnFail?: boolean;
  maxTries?: number;
  waitBetweenTries?: number;
  executeOnce?: boolean;
  alwaysOutputData?: boolean;
  onError?: 'stopWorkflow' | 'continueRegularOutput' | 'continueErrorOutput';
}

export interface WorkflowEdge {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  condition?: string;
}

export interface WorkflowConfig {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  settings?: {
    executionOrder?: string;
    saveExecutionProgress?: boolean;
    saveManualExecutions?: boolean;
    errorWorkflow?: string;
    timezone?: string;
  };
}

export interface ExecutionContext {
  trigger: {
    data: any;
  };
  [nodeId: string]: {
    output: any;
    status: 'success' | 'failed' | 'skipped';
    error?: string;
    executedAt: number;
  };
}

export class WorkflowEngine {
  private nodes: Map<string, WorkflowNode>;
  private edges: WorkflowEdge[];
  private executionContext: ExecutionContext;
  private executedNodes: Set<string>;
  private integrations: Map<string, any>;
  private nodeExecutor: NodeExecutor;

  constructor(
    workflow: WorkflowConfig,
    integrations: Map<string, any>,
    nodeExecutor: NodeExecutor,
    triggerData?: any
  ) {
    this.nodes = new Map(workflow.nodes.map(n => [n.id, n]));
    this.edges = workflow.edges;
    this.integrations = integrations;
    this.nodeExecutor = nodeExecutor;
    this.executedNodes = new Set();
    this.executionContext = {
      trigger: {
        data: triggerData || {},
      },
    };
  }

  /**
   * Execute the workflow starting from the trigger node
   */
  async execute(): Promise<ExecutionContext> {
    console.log('🚀 Starting workflow execution...');
    
    // Find the trigger node (starting point)
    const triggerNode = Array.from(this.nodes.values()).find(
      n => n.type === 'trigger'
    );

    if (!triggerNode) {
      throw new Error('No trigger node found in workflow');
    }

    // Start execution from trigger
    await this.executeNode(triggerNode.id);

    console.log('✅ Workflow execution completed');
    return this.executionContext;
  }

  /**
   * Execute a single node and all its downstream nodes
   */
  private async executeNode(nodeId: string): Promise<any> {
    // Skip if already executed (prevent infinite loops)
    if (this.executedNodes.has(nodeId)) {
      console.log(`⏭️  Node ${nodeId} already executed, skipping`);
      return this.executionContext[nodeId]?.output;
    }

    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    // Mark as executed
    this.executedNodes.add(nodeId);

    // Skip disabled nodes
    if (node.disabled) {
      console.log(`⏭️  Node ${node.name} (${nodeId}) is disabled, skipping`);
      this.executionContext[nodeId] = {
        output: null,
        status: 'skipped',
        executedAt: Date.now(),
      };
      return null;
    }

    console.log(`▶️  Executing node: ${node.name} (${node.type})`);

    try {
      // Execute the node with retry logic
      let output: any;
      let lastError: Error | null = null;
      const maxTries = node.retryOnFail ? (node.maxTries || 3) : 1;

      for (let attempt = 1; attempt <= maxTries; attempt++) {
        try {
          if (attempt > 1) {
            console.log(`🔄 Retry attempt ${attempt}/${maxTries} for ${node.name}`);
            // Wait between retries
            await this.delay(node.waitBetweenTries || 1000);
          }

          output = await this.executeNodeLogic(node);
          lastError = null;
          break; // Success, exit retry loop
        } catch (error: any) {
          lastError = error;
          console.error(`❌ Attempt ${attempt} failed:`, error.message);
        }
      }

      // If all retries failed
      if (lastError) {
        throw lastError;
      }

      // Store execution result
      this.executionContext[nodeId] = {
        output,
        status: 'success',
        executedAt: Date.now(),
      };

      console.log(`✅ Node ${node.name} completed successfully`);

      // Execute downstream nodes
      await this.executeDownstreamNodes(nodeId, output);

      return output;
    } catch (error: any) {
      console.error(`❌ Node ${node.name} failed:`, error.message);

      // Store error
      this.executionContext[nodeId] = {
        output: null,
        status: 'failed',
        error: error.message,
        executedAt: Date.now(),
      };

      // Handle error based on node configuration
      if (node.continueOnFail || node.onError === 'continueRegularOutput') {
        console.log(`⚠️  Continuing workflow despite error in ${node.name}`);
        // Continue with downstream nodes even on error
        await this.executeDownstreamNodes(nodeId, null);
      } else if (node.onError === 'continueErrorOutput') {
        console.log(`⚠️  Continuing with error output from ${node.name}`);
        await this.executeDownstreamNodes(nodeId, { error: error.message });
      } else {
        // stopWorkflow (default)
        throw error;
      }

      return null;
    }
  }

  /**
   * Execute the actual node logic based on its type
   */
  private async executeNodeLogic(node: WorkflowNode): Promise<any> {
    const nodeType = node.type;

    switch (nodeType) {
      case 'trigger':
        return this.executionContext.trigger.data;

      case 'fetch':
      case 'action':
      case 'http':
      case 'webhook':
        return await this.nodeExecutor.executeFetchOrAction(
          node,
          this.executionContext,
          this.integrations
        );

      case 'process':
        return await this.nodeExecutor.executeProcess(
          node,
          this.executionContext,
          this.integrations
        );

      case 'condition':
        return await this.nodeExecutor.executeCondition(
          node,
          this.executionContext
        );

      case 'filter':
        return await this.nodeExecutor.executeFilter(
          node,
          this.executionContext
        );

      case 'loop':
        return await this.nodeExecutor.executeLoop(
          node,
          this.executionContext,
          this.nodes,
          this.edges
        );

      case 'delay':
        return await this.nodeExecutor.executeDelay(node);

      case 'merge':
        return await this.nodeExecutor.executeMerge(
          node,
          this.executionContext,
          this.edges
        );

      case 'split':
        return await this.nodeExecutor.executeSplit(
          node,
          this.executionContext
        );

      case 'transform':
        return await this.nodeExecutor.executeTransform(
          node,
          this.executionContext
        );

      case 'aggregate':
        return await this.nodeExecutor.executeAggregate(
          node,
          this.executionContext
        );

      case 'schedule':
        // Schedule nodes are handled externally
        return { scheduled: true };

      case 'error':
        // Error handler nodes
        return await this.nodeExecutor.executeErrorHandler(
          node,
          this.executionContext
        );

      default:
        console.warn(`Unknown node type: ${nodeType}`);
        return { type: nodeType, params: node.parameters };
    }
  }

  /**
   * Execute all nodes connected to the current node
   */
  private async executeDownstreamNodes(nodeId: string, output: any): Promise<void> {
    // Find all edges starting from this node
    const outgoingEdges = this.edges.filter(e => e.source === nodeId);

    if (outgoingEdges.length === 0) {
      console.log(`🏁 No downstream nodes from ${nodeId}`);
      return;
    }

    // For condition nodes, check which branch to take
    const node = this.nodes.get(nodeId);
    if (node?.type === 'condition' && typeof output === 'object' && 'branch' in output) {
      const branch = output.branch; // 'true' or 'false'
      const branchEdge = outgoingEdges.find(e => e.sourceHandle === branch);
      
      if (branchEdge) {
        console.log(`🔀 Following ${branch} branch from ${node.name}`);
        await this.executeNode(branchEdge.target);
      }
      return;
    }

    // Execute all downstream nodes (parallel execution)
    await Promise.all(
      outgoingEdges.map(edge => this.executeNode(edge.target))
    );
  }

  /**
   * Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Node executor handles the actual logic for each node type
 */
export interface NodeExecutor {
  executeFetchOrAction(
    node: WorkflowNode,
    context: ExecutionContext,
    integrations: Map<string, any>
  ): Promise<any>;

  executeProcess(
    node: WorkflowNode,
    context: ExecutionContext,
    integrations: Map<string, any>
  ): Promise<any>;

  executeCondition(node: WorkflowNode, context: ExecutionContext): Promise<any>;
  executeFilter(node: WorkflowNode, context: ExecutionContext): Promise<any>;
  executeLoop(
    node: WorkflowNode,
    context: ExecutionContext,
    nodes: Map<string, WorkflowNode>,
    edges: WorkflowEdge[]
  ): Promise<any>;
  executeDelay(node: WorkflowNode): Promise<any>;
  executeMerge(
    node: WorkflowNode,
    context: ExecutionContext,
    edges: WorkflowEdge[]
  ): Promise<any>;
  executeSplit(node: WorkflowNode, context: ExecutionContext): Promise<any>;
  executeTransform(node: WorkflowNode, context: ExecutionContext): Promise<any>;
  executeAggregate(node: WorkflowNode, context: ExecutionContext): Promise<any>;
  executeErrorHandler(node: WorkflowNode, context: ExecutionContext): Promise<any>;
}

