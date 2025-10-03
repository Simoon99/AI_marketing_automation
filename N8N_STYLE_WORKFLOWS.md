# N8N-Style Workflow Execution 🚀

Your Agent workflows now execute using a **graph-based execution engine** similar to n8n, instead of simple linear steps.

## 🎯 What Changed?

### Before (Linear Execution)
```javascript
// Old way: Sequential steps
{
  steps: [
    { type: 'fetch', action: 'get_emails' },
    { type: 'process', action: 'summarize' },
    { type: 'action', action: 'send_slack' }
  ]
}
```

### After (Graph-Based Execution)
```javascript
// New way: Graph with nodes and edges
{
  workflow: {
    nodes: [
      { id: 'trigger', type: 'trigger', ... },
      { id: 'node1', type: 'fetch', parameters: {...} },
      { id: 'node2', type: 'condition', parameters: {...} },
      { id: 'node3a', type: 'action', parameters: {...} },
      { id: 'node3b', type: 'action', parameters: {...} }
    ],
    edges: [
      { source: 'trigger', target: 'node1' },
      { source: 'node1', target: 'node2' },
      { source: 'node2', target: 'node3a', sourceHandle: 'true' },
      { source: 'node2', target: 'node3b', sourceHandle: 'false' }
    ]
  }
}
```

## 🌟 Key Features

### 1. **Graph-Based Execution**
- Workflows are now **graphs** with nodes and connections
- Supports **branching**, **merging**, and **parallel execution**
- Follows edges to determine execution flow

### 2. **All Node Types Supported**
- ✅ **Trigger**: Workflow starting point
- ✅ **Fetch**: Get data from integrations
- ✅ **Process**: AI/LLM data processing
- ✅ **Action**: Execute actions via integrations
- ✅ **Condition**: If/else branching
- ✅ **Filter**: Filter array items
- ✅ **Loop**: Iterate over items
- ✅ **Delay**: Wait for specified time
- ✅ **Merge**: Combine multiple inputs
- ✅ **Split**: Split data into multiple outputs
- ✅ **Transform**: Transform data (map, parse, etc.)
- ✅ **Aggregate**: Sum, count, average, min, max
- ✅ **HTTP**: Custom HTTP requests
- ✅ **Schedule**: Scheduled execution
- ✅ **Error**: Error handling
- ✅ **Webhook**: Webhook triggers

### 3. **Variable References**
Use `{{variable}}` syntax to reference data from previous nodes:

```javascript
{
  to: "{{trigger.data.email}}",
  subject: "Hello {{node1.output.name}}",
  body: "Current time: {{$now}}, Random ID: {{$random}}",
  api_key: "{{env.API_KEY}}"
}
```

**Available Variables:**
- `{{trigger.data}}` - Input data from trigger
- `{{nodeId.output}}` - Output from a specific node
- `{{$now}}` - Current timestamp
- `{{$random}}` - Random string
- `{{env.VAR_NAME}}` - Environment variables

### 4. **Advanced Execution Controls**

#### Retry Logic
```javascript
{
  retryOnFail: true,
  maxTries: 3,
  waitBetweenTries: 1000 // ms
}
```

#### Error Handling
```javascript
{
  continueOnFail: true, // Continue workflow even if node fails
  onError: 'stopWorkflow' | 'continueRegularOutput' | 'continueErrorOutput'
}
```

#### Conditional Execution
```javascript
{
  executeOnce: true, // Run only once even if triggered multiple times
  alwaysOutputData: true, // Always pass data even if node produces nothing
  disabled: false // Skip this node
}
```

### 5. **Conditional Branching**
Condition nodes can branch to different paths:

```javascript
// Condition node
{
  type: 'condition',
  parameters: {
    conditionType: 'comparison',
    value1: '{{node1.output.status}}',
    operator: '===',
    value2: 'urgent'
  }
}

// Edges from condition
{
  source: 'condition1',
  target: 'urgent_handler',
  sourceHandle: 'true' // Follows this edge if condition is true
}
{
  source: 'condition1',
  target: 'normal_handler',
  sourceHandle: 'false' // Follows this edge if condition is false
}
```

### 6. **Parallel Execution**
Multiple nodes connected to the same source execute in **parallel**:

```javascript
// Node A connects to both B and C
edges: [
  { source: 'nodeA', target: 'nodeB' },
  { source: 'nodeA', target: 'nodeC' }
]
// nodeB and nodeC execute simultaneously
```

## 📊 Example Workflows

### Example 1: Simple Linear Workflow
```javascript
{
  name: "Email Summarizer",
  workflow: {
    nodes: [
      {
        id: "trigger",
        type: "trigger",
        name: "Manual Trigger",
        parameters: {}
      },
      {
        id: "fetch_emails",
        type: "fetch",
        name: "Get Emails",
        parameters: {
          integration: "gmail",
          action: "get_unread_emails",
          max_results: 10
        }
      },
      {
        id: "summarize",
        type: "process",
        name: "Summarize with AI",
        parameters: {
          use_llm: true,
          prompt: "Summarize these emails: {{fetch_emails.output}}"
        }
      },
      {
        id: "send_slack",
        type: "action",
        name: "Send to Slack",
        parameters: {
          integration: "slack",
          action: "send_message",
          channel: "#updates",
          message: "{{summarize.output.llm_response}}"
        }
      }
    ],
    edges: [
      { source: "trigger", target: "fetch_emails" },
      { source: "fetch_emails", target: "summarize" },
      { source: "summarize", target: "send_slack" }
    ]
  }
}
```

### Example 2: Conditional Workflow with Branching
```javascript
{
  name: "Email Priority Router",
  workflow: {
    nodes: [
      { id: "trigger", type: "trigger", name: "Manual Trigger" },
      {
        id: "fetch_emails",
        type: "fetch",
        name: "Get Emails",
        parameters: {
          integration: "gmail",
          action: "get_unread_emails"
        }
      },
      {
        id: "check_priority",
        type: "condition",
        name: "Check Priority",
        parameters: {
          conditionType: "expression",
          condition: "{{fetch_emails.output.priority}} === 'urgent'"
        }
      },
      {
        id: "urgent_action",
        type: "action",
        name: "Send Urgent Alert",
        parameters: {
          integration: "slack",
          action: "send_message",
          channel: "#urgent",
          message: "URGENT: {{fetch_emails.output.subject}}"
        }
      },
      {
        id: "normal_action",
        type: "action",
        name: "Normal Processing",
        parameters: {
          integration: "slack",
          action: "send_message",
          channel: "#general",
          message: "New email: {{fetch_emails.output.subject}}"
        }
      }
    ],
    edges: [
      { source: "trigger", target: "fetch_emails" },
      { source: "fetch_emails", target: "check_priority" },
      { source: "check_priority", target: "urgent_action", sourceHandle: "true" },
      { source: "check_priority", target: "normal_action", sourceHandle: "false" }
    ]
  }
}
```

### Example 3: Loop Workflow
```javascript
{
  name: "Process Each Email",
  workflow: {
    nodes: [
      { id: "trigger", type: "trigger", name: "Manual Trigger" },
      {
        id: "fetch_emails",
        type: "fetch",
        name: "Get Emails",
        parameters: {
          integration: "gmail",
          action: "get_unread_emails"
        }
      },
      {
        id: "loop_emails",
        type: "loop",
        name: "For Each Email",
        parameters: {
          input: "{{fetch_emails.output.emails}}",
          maxIterations: 100
        }
      },
      {
        id: "process_email",
        type: "process",
        name: "Process Email",
        parameters: {
          use_llm: true,
          prompt: "Categorize this email: {{$item}}"
        }
      }
    ],
    edges: [
      { source: "trigger", target: "fetch_emails" },
      { source: "fetch_emails", target: "loop_emails" },
      { source: "loop_emails", target: "process_email" }
    ]
  }
}
```

## 🔧 How to Use

### From the Visual Builder
The Visual Agent Builder **automatically** saves workflows in the n8n-style format. Just:

1. Add nodes to the canvas
2. Connect them with edges
3. Configure each node
4. Click "Save Agent"

The workflow is automatically converted to the graph format.

### Programmatically
```javascript
const config = {
  name: "My Agent",
  description: "Agent description",
  trigger_type: "manual",
  workflow: {
    nodes: [...],
    edges: [...],
    settings: {
      executionOrder: 'v1',
      saveExecutionProgress: true,
      timezone: 'America/New_York'
    }
  }
};

await automationEngine.saveAgent(config);
```

## 🧪 Testing Workflows

Test your workflow in the Visual Builder:
1. Click the **"Test Workflow"** button
2. Watch nodes execute one by one with animations
3. See success/failure indicators on each node
4. Check the execution results

## 🔄 Backward Compatibility

**Old agents still work!** The execution engine automatically detects:
- **New agents** with `config.workflow` → Uses graph execution
- **Old agents** with `config.steps` → Uses legacy linear execution

No migration needed!

## 📖 Node Type Details

### Condition Node
```javascript
{
  type: 'condition',
  parameters: {
    // Option 1: Expression
    conditionType: 'expression',
    condition: '{{node1.output.value}} > 100'
    
    // Option 2: Comparison
    conditionType: 'comparison',
    value1: '{{node1.output.status}}',
    operator: '===', // ===, !==, >, >=, <, <=, contains, startsWith, endsWith, matches
    value2: 'active'
  }
}
```

### Filter Node
```javascript
{
  type: 'filter',
  parameters: {
    input: '{{fetch_data.output.items}}',
    filterCondition: '$item.status === "active" && $item.value > 100'
  }
}
```

### Transform Node
```javascript
{
  type: 'transform',
  parameters: {
    input: '{{fetch_data.output}}',
    transformType: 'map', // map, jsonParse, jsonStringify
    mapExpression: '{ id: $item.id, name: $item.name.toUpperCase() }'
  }
}
```

### Aggregate Node
```javascript
{
  type: 'aggregate',
  parameters: {
    input: '{{fetch_data.output.items}}',
    aggregationType: 'sum', // count, sum, average, min, max
    field: 'amount'
  }
}
```

### Delay Node
```javascript
{
  type: 'delay',
  parameters: {
    delayMs: 5000 // Wait 5 seconds
  }
}
```

### Merge Node
```javascript
{
  type: 'merge',
  parameters: {
    mergeMode: 'combine' // combine, object, separate
  }
}
```

## 🎉 Benefits

✅ **More Powerful**: Support for branching, loops, and parallel execution  
✅ **More Flexible**: Configure retry, error handling, and conditional execution per node  
✅ **More Intuitive**: Visual workflows match the execution logic  
✅ **More Scalable**: Handle complex workflows with ease  
✅ **More N8N-like**: Familiar patterns if you've used n8n before  
✅ **Backward Compatible**: Old agents continue to work  

## 🚀 Next Steps

1. **Create a new agent** in the Visual Builder
2. **Add multiple node types** (conditions, loops, etc.)
3. **Connect them** to create complex workflows
4. **Test** the workflow
5. **Save** and **execute**!

Your workflows now have the power of n8n! 🎊

