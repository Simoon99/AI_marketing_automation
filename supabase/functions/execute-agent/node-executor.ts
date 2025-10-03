// Node Executor Implementation
import { WorkflowNode, ExecutionContext, WorkflowEdge, NodeExecutor } from './workflow-engine.ts';
import { getIntegrationHandler } from '../_shared/integrations.ts';

export class DefaultNodeExecutor implements NodeExecutor {
  /**
   * Execute fetch/action nodes (API calls, integrations)
   */
  async executeFetchOrAction(
    node: WorkflowNode,
    context: ExecutionContext,
    integrations: Map<string, any>
  ): Promise<any> {
    const integration = node.parameters.integration;
    const action = node.parameters.action;

    if (!integration || !action) {
      throw new Error(`Node ${node.name} missing integration or action`);
    }

    // Check if user has the required integration
    if (!integrations.has(integration)) {
      throw new Error(
        `Integration ${integration} not configured. Please add it in Manage Integrations.`
      );
    }

    // Get the integration handler
    const handler = getIntegrationHandler(integration, action);
    if (!handler) {
      throw new Error(`Action ${action} not supported for ${integration}`);
    }

    // Get credentials
    const credentials = integrations.get(integration);

    // Resolve parameters with variable substitution
    const resolvedParams = this.resolveParameters(node.parameters, context);

    // Execute the integration
    try {
      const result = await handler(credentials, resolvedParams, context);
      return result;
    } catch (error: any) {
      console.error(`Integration error:`, error);
      throw new Error(`Failed to execute ${integration}.${action}: ${error.message}`);
    }
  }

  /**
   * Execute process nodes (AI/LLM processing)
   */
  async executeProcess(
    node: WorkflowNode,
    context: ExecutionContext,
    integrations: Map<string, any>
  ): Promise<any> {
    const useLLM = node.parameters.use_llm !== false;

    if (useLLM) {
      // Try to get OpenAI API key from user integrations first, fallback to env
      let openaiApiKey = integrations.get('openai')?.api_key;
      if (!openaiApiKey) {
        openaiApiKey = Deno.env.get('OPENAI_API_KEY');
      }

      if (!openaiApiKey) {
        throw new Error('OpenAI API key not configured. Please add OpenAI integration.');
      }

      const prompt = node.parameters.llm_prompt || node.parameters.prompt || 'Process this data';
      const contextStr = JSON.stringify(context, null, 2);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: node.parameters.model || 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: node.parameters.systemPrompt || 'You are a helpful assistant.',
            },
            {
              role: 'user',
              content: `${prompt}\n\nContext: ${contextStr}`,
            },
          ],
          temperature: node.parameters.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`LLM processing failed: ${errorBody}`);
      }

      const data = await response.json();
      const llmOutput = data.choices[0].message.content;

      return {
        processed_data: llmOutput,
        llm_response: llmOutput,
        raw_response: data,
      };
    }

    // Simple processing without LLM
    const resolvedParams = this.resolveParameters(node.parameters, context);
    return {
      processed: true,
      ...resolvedParams,
    };
  }

  /**
   * Execute condition nodes (if/else branching)
   */
  async executeCondition(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const condition = node.parameters.condition || '';
    const conditionType = node.parameters.conditionType || 'expression';

    let result = false;

    if (conditionType === 'expression') {
      // Evaluate JavaScript expression
      result = this.evaluateExpression(condition, context);
    } else if (conditionType === 'comparison') {
      // Simple comparison
      const value1 = this.resolveValue(node.parameters.value1, context);
      const operator = node.parameters.operator || '===';
      const value2 = this.resolveValue(node.parameters.value2, context);

      result = this.compareValues(value1, operator, value2);
    }

    console.log(`🔀 Condition result: ${result}`);

    return {
      branch: result ? 'true' : 'false',
      result,
      condition,
    };
  }

  /**
   * Execute filter nodes (filter array items)
   */
  async executeFilter(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const inputData = this.resolveValue(node.parameters.input, context);
    const filterCondition = node.parameters.filterCondition || '';

    if (!Array.isArray(inputData)) {
      throw new Error('Filter node requires an array as input');
    }

    const filtered = inputData.filter((item: any, index: number) => {
      const itemContext = { ...context, $item: item, $index: index };
      return this.evaluateExpression(filterCondition, itemContext);
    });

    return {
      filtered,
      originalCount: inputData.length,
      filteredCount: filtered.length,
    };
  }

  /**
   * Execute loop nodes (iterate over items)
   */
  async executeLoop(
    node: WorkflowNode,
    context: ExecutionContext,
    nodes: Map<string, WorkflowNode>,
    edges: WorkflowEdge[]
  ): Promise<any> {
    const inputData = this.resolveValue(node.parameters.input, context);
    const maxIterations = node.parameters.maxIterations || 1000;

    if (!Array.isArray(inputData)) {
      throw new Error('Loop node requires an array as input');
    }

    const results: any[] = [];
    
    for (let i = 0; i < Math.min(inputData.length, maxIterations); i++) {
      const item = inputData[i];
      console.log(`🔁 Loop iteration ${i + 1}/${inputData.length}`);

      // Create iteration context
      const iterationContext = {
        ...context,
        $item: item,
        $index: i,
        $first: i === 0,
        $last: i === inputData.length - 1,
      };

      // For now, just collect the items
      // In a full implementation, this would execute child nodes
      results.push({
        index: i,
        item,
      });
    }

    return {
      results,
      totalIterations: results.length,
    };
  }

  /**
   * Execute delay nodes (wait for specified time)
   */
  async executeDelay(node: WorkflowNode): Promise<any> {
    const delayMs = node.parameters.delayMs || node.parameters.delay || 1000;
    console.log(`⏱️  Delaying for ${delayMs}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    return {
      delayed: true,
      duration: delayMs,
    };
  }

  /**
   * Execute merge nodes (combine multiple inputs)
   */
  async executeMerge(
    node: WorkflowNode,
    context: ExecutionContext,
    edges: WorkflowEdge[]
  ): Promise<any> {
    const mergeMode = node.parameters.mergeMode || 'combine';

    // Find all incoming edges to this node
    const incomingEdges = edges.filter(e => e.target === node.id);
    const inputs: any[] = [];

    for (const edge of incomingEdges) {
      const sourceOutput = context[edge.source]?.output;
      if (sourceOutput !== undefined) {
        inputs.push(sourceOutput);
      }
    }

    if (mergeMode === 'combine') {
      // Combine all inputs into one array
      return {
        merged: inputs.flat(),
        inputCount: inputs.length,
      };
    } else if (mergeMode === 'object') {
      // Merge as object properties
      return Object.assign({}, ...inputs);
    } else {
      // Keep as separate items
      return {
        inputs,
        count: inputs.length,
      };
    }
  }

  /**
   * Execute split nodes (split data into multiple outputs)
   */
  async executeSplit(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const inputData = this.resolveValue(node.parameters.input, context);
    const splitBy = node.parameters.splitBy || 'items';

    if (splitBy === 'items' && Array.isArray(inputData)) {
      return {
        items: inputData,
        count: inputData.length,
      };
    } else if (splitBy === 'property') {
      const propertyName = node.parameters.propertyName || 'data';
      return {
        items: inputData[propertyName] || [],
      };
    }

    return { items: [inputData] };
  }

  /**
   * Execute transform nodes (transform data)
   */
  async executeTransform(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const inputData = this.resolveValue(node.parameters.input, context);
    const transformType = node.parameters.transformType || 'map';

    if (transformType === 'map' && Array.isArray(inputData)) {
      const mapExpression = node.parameters.mapExpression || '$item';
      
      const transformed = inputData.map((item: any, index: number) => {
        const itemContext = { ...context, $item: item, $index: index };
        return this.evaluateExpression(mapExpression, itemContext);
      });

      return {
        transformed,
        count: transformed.length,
      };
    } else if (transformType === 'jsonParse') {
      return JSON.parse(inputData);
    } else if (transformType === 'jsonStringify') {
      return JSON.stringify(inputData, null, 2);
    }

    return inputData;
  }

  /**
   * Execute aggregate nodes (sum, count, avg, etc.)
   */
  async executeAggregate(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const inputData = this.resolveValue(node.parameters.input, context);
    const aggregationType = node.parameters.aggregationType || 'count';

    if (!Array.isArray(inputData)) {
      throw new Error('Aggregate node requires an array as input');
    }

    switch (aggregationType) {
      case 'count':
        return { result: inputData.length, type: 'count' };
      
      case 'sum': {
        const field = node.parameters.field || 'value';
        const sum = inputData.reduce((acc, item) => acc + (item[field] || 0), 0);
        return { result: sum, type: 'sum', field };
      }
      
      case 'average': {
        const field = node.parameters.field || 'value';
        const sum = inputData.reduce((acc, item) => acc + (item[field] || 0), 0);
        const avg = sum / inputData.length;
        return { result: avg, type: 'average', field };
      }
      
      case 'min': {
        const field = node.parameters.field || 'value';
        const min = Math.min(...inputData.map(item => item[field] || 0));
        return { result: min, type: 'min', field };
      }
      
      case 'max': {
        const field = node.parameters.field || 'value';
        const max = Math.max(...inputData.map(item => item[field] || 0));
        return { result: max, type: 'max', field };
      }
      
      default:
        return { result: inputData.length, type: 'count' };
    }
  }

  /**
   * Execute error handler nodes
   */
  async executeErrorHandler(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    console.log(`⚠️  Error handler activated`);
    
    // Collect all failed nodes
    const failedNodes = Object.entries(context)
      .filter(([_, value]) => value.status === 'failed')
      .map(([nodeId, value]) => ({
        nodeId,
        error: value.error,
        executedAt: value.executedAt,
      }));

    return {
      errors: failedNodes,
      errorCount: failedNodes.length,
      handledAt: Date.now(),
    };
  }

  /**
   * Resolve parameters with variable substitution
   */
  private resolveParameters(params: Record<string, any>, context: ExecutionContext): Record<string, any> {
    const resolved: Record<string, any> = {};

    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string') {
        resolved[key] = this.resolveValue(value, context);
      } else if (typeof value === 'object' && value !== null) {
        resolved[key] = this.resolveParameters(value, context);
      } else {
        resolved[key] = value;
      }
    }

    return resolved;
  }

  /**
   * Resolve a value with variable substitution (e.g., {{trigger.data.email}})
   */
  private resolveValue(value: any, context: ExecutionContext): any {
    if (typeof value !== 'string') {
      return value;
    }

    // Replace {{variable}} syntax
    const variableRegex = /\{\{([^}]+)\}\}/g;
    
    return value.replace(variableRegex, (match, variablePath) => {
      const trimmedPath = variablePath.trim();
      
      // Handle special variables
      if (trimmedPath === '$now') {
        return new Date().toISOString();
      }
      if (trimmedPath === '$random') {
        return Math.random().toString(36).substring(7);
      }
      if (trimmedPath.startsWith('env.')) {
        const envVar = trimmedPath.substring(4);
        return Deno.env.get(envVar) || '';
      }

      // Resolve from context (e.g., trigger.data.email or step1.output.result)
      const value = this.getNestedValue(context, trimmedPath);
      return value !== undefined ? value : match;
    });
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[part];
    }

    return current;
  }

  /**
   * Evaluate a JavaScript expression with context
   */
  private evaluateExpression(expression: string, context: ExecutionContext): any {
    try {
      // Create a safe evaluation environment
      const resolvedExpression = this.resolveValue(expression, context);
      
      // For safety, we'll use a simple eval-like approach
      // In production, you might want to use a proper expression evaluator
      const func = new Function('context', `with(context) { return ${resolvedExpression}; }`);
      return func(context);
    } catch (error: any) {
      console.error(`Expression evaluation error: ${error.message}`);
      return false;
    }
  }

  /**
   * Compare two values using an operator
   */
  private compareValues(value1: any, operator: string, value2: any): boolean {
    switch (operator) {
      case '===':
      case '==':
        return value1 == value2;
      case '!==':
      case '!=':
        return value1 != value2;
      case '>':
        return value1 > value2;
      case '>=':
        return value1 >= value2;
      case '<':
        return value1 < value2;
      case '<=':
        return value1 <= value2;
      case 'contains':
        return String(value1).includes(String(value2));
      case 'startsWith':
        return String(value1).startsWith(String(value2));
      case 'endsWith':
        return String(value1).endsWith(String(value2));
      case 'matches':
        return new RegExp(String(value2)).test(String(value1));
      default:
        return false;
    }
  }
}

