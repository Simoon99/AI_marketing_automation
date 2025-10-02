# AI Agent Engine Architecture
## Prompt-to-Agent System (No Visual Builder Needed)

---

## 🎯 Core Concept

**User Input:** Natural language prompt describing what they want
**System Output:** Fully configured, ready-to-use AI agent

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INPUT                           │
│  "Create an agent that analyzes my emails and              │
│   categorizes them by urgency"                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    LLM AGENT PLANNER                        │
│  (GPT-4, Claude, etc.)                                      │
│                                                             │
│  Analyzes prompt and outputs:                              │
│  • Required integrations (Gmail, Slack, etc.)              │
│  • Tools needed (email parser, classifier)                 │
│  • Trigger type (schedule, webhook, manual)                │
│  • Execution steps                                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   AGENT BUILDER SERVICE                     │
│                                                             │
│  1. Generates agent configuration JSON                     │
│  2. Sets up required integrations                          │
│  3. Creates execution workflow                             │
│  4. Configures triggers/schedules                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    AGENT RUNTIME                            │
│                                                             │
│  • Stores agent configuration in Supabase                  │
│  • Executes agents via Supabase Edge Functions             │
│  • Logs execution history                                  │
│  • Handles retries and errors                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

### Frontend (Next.js)
```
src/
├── app/
│   └── dashboard/
│       └── agents/
│           ├── page.tsx           # Agent list
│           ├── create/
│           │   └── page.tsx       # Prompt input form
│           └── [id]/
│               └── page.tsx       # Agent detail/logs
├── components/
│   └── agents/
│       ├── agent-creator.tsx      # Prompt input + preview
│       ├── agent-card.tsx         # Display agent info
│       └── execution-log.tsx      # Show agent runs
└── lib/
    ├── agent-client.ts            # API calls to agent service
    └── types/agent.ts             # TypeScript types
```

### Backend (Supabase)
```
supabase/
├── functions/
│   ├── create-agent/              # Generate agent from prompt
│   ├── execute-agent/             # Run an agent
│   └── agent-scheduler/           # Cron job runner
└── migrations/
    └── agents_schema.sql          # Database schema
```

### Database Schema
```sql
-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,              -- Original user prompt
  config JSONB NOT NULL,             -- Generated configuration
  status TEXT DEFAULT 'active',      -- active, paused, error
  trigger_type TEXT NOT NULL,        -- manual, scheduled, webhook
  schedule TEXT,                     -- Cron expression if scheduled
  integrations JSONB,                -- Required API keys/credentials
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Execution logs
CREATE TABLE agent_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id),
  status TEXT NOT NULL,              -- success, failed, running
  input JSONB,                       -- Input data
  output JSONB,                      -- Result data
  error TEXT,                        -- Error message if failed
  duration_ms INTEGER,               -- Execution time
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integration credentials (encrypted)
CREATE TABLE agent_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  provider TEXT NOT NULL,            -- gmail, slack, twitter, etc.
  credentials JSONB NOT NULL,        -- Encrypted API keys
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🤖 Agent Configuration Format

```typescript
interface AgentConfig {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'manual' | 'scheduled' | 'webhook';
    schedule?: string;  // Cron: "0 8 * * *" for daily at 8am
    webhookUrl?: string;
  };
  integrations: {
    provider: string;   // 'gmail', 'slack', 'twitter', etc.
    actions: string[];  // ['read_emails', 'send_message']
  }[];
  steps: {
    type: 'fetch' | 'process' | 'action';
    integration?: string;
    action: string;
    params: Record<string, any>;
  }[];
  llm?: {
    model: 'gpt-4' | 'claude-3-5-sonnet';
    systemPrompt: string;
    temperature: number;
  };
}
```

---

## 💡 Example Agent Configurations

### 1. Email Summarizer Agent
```json
{
  "name": "Daily Email Summarizer",
  "description": "Reads unread emails and sends a summary every morning",
  "trigger": {
    "type": "scheduled",
    "schedule": "0 8 * * *"
  },
  "integrations": [
    {
      "provider": "gmail",
      "actions": ["read_emails", "mark_as_read"]
    },
    {
      "provider": "sendgrid",
      "actions": ["send_email"]
    }
  ],
  "steps": [
    {
      "type": "fetch",
      "integration": "gmail",
      "action": "get_unread_emails",
      "params": { "limit": 50 }
    },
    {
      "type": "process",
      "action": "summarize_with_llm",
      "llm": {
        "model": "gpt-4",
        "systemPrompt": "Summarize these emails by category and urgency",
        "temperature": 0.3
      }
    },
    {
      "type": "action",
      "integration": "sendgrid",
      "action": "send_email",
      "params": {
        "to": "{{user_email}}",
        "subject": "Daily Email Summary - {{date}}",
        "body": "{{llm_output}}"
      }
    }
  ]
}
```

### 2. Social Media Monitor Agent
```json
{
  "name": "Twitter Mention Monitor",
  "description": "Monitors Twitter mentions and sends notifications",
  "trigger": {
    "type": "scheduled",
    "schedule": "*/30 * * * *"
  },
  "integrations": [
    {
      "provider": "twitter",
      "actions": ["search_mentions"]
    },
    {
      "provider": "slack",
      "actions": ["send_message"]
    }
  ],
  "steps": [
    {
      "type": "fetch",
      "integration": "twitter",
      "action": "search_mentions",
      "params": { "since": "{{last_run}}" }
    },
    {
      "type": "process",
      "action": "analyze_sentiment",
      "llm": {
        "model": "gpt-4",
        "systemPrompt": "Analyze sentiment and categorize as positive/negative/neutral"
      }
    },
    {
      "type": "action",
      "integration": "slack",
      "action": "send_message",
      "params": {
        "channel": "#notifications",
        "text": "New mentions: {{count}}. Sentiment: {{sentiment}}"
      }
    }
  ]
}
```

### 3. Lead Qualification Agent
```json
{
  "name": "Lead Qualifier",
  "description": "Analyzes incoming leads and scores them",
  "trigger": {
    "type": "webhook",
    "webhookUrl": "/api/agents/lead-qualifier/webhook"
  },
  "integrations": [
    {
      "provider": "hubspot",
      "actions": ["update_contact"]
    }
  ],
  "steps": [
    {
      "type": "process",
      "action": "qualify_lead",
      "llm": {
        "model": "gpt-4",
        "systemPrompt": "Score this lead 1-10 based on company size, industry, budget"
      }
    },
    {
      "type": "action",
      "integration": "hubspot",
      "action": "update_contact",
      "params": {
        "contact_id": "{{input.contact_id}}",
        "properties": {
          "lead_score": "{{llm_score}}",
          "qualification_notes": "{{llm_reasoning}}"
        }
      }
    }
  ]
}
```

---

## 🔥 Key Advantages Over n8n

| Feature | n8n Visual Builder | Agent Engine |
|---------|-------------------|--------------|
| **User Experience** | Complex drag-drop | Simple prompt |
| **Learning Curve** | Hours to learn | Seconds to use |
| **Flexibility** | Limited to UI | LLM-powered intelligence |
| **Maintenance** | Manual updates | Auto-adapts |
| **Mobile Friendly** | ❌ No | ✅ Yes |
| **Integration Setup** | Manual per workflow | Auto-detected |
| **AI-Native** | ❌ No | ✅ Yes |

---

## 🚀 Implementation Phases

### Phase 1: MVP (Week 1-2)
- [ ] Agent database schema
- [ ] Create agent from prompt (using GPT-4)
- [ ] Manual execution
- [ ] Basic integrations (Email, Slack)
- [ ] Simple UI to create/list agents

### Phase 2: Automation (Week 3-4)
- [ ] Scheduled execution (cron)
- [ ] Webhook triggers
- [ ] Execution logs and monitoring
- [ ] More integrations (Twitter, HubSpot, etc.)

### Phase 3: Intelligence (Week 5-6)
- [ ] Agent optimization suggestions
- [ ] Learning from execution history
- [ ] Multi-step reasoning
- [ ] Agent marketplace (share agents)

---

## 💰 Cost Estimation

| Service | Cost (per month) |
|---------|-----------------|
| Supabase (Pro) | $25 |
| OpenAI API (GPT-4) | $50-200 (depending on usage) |
| Integration APIs | Varies (many have free tiers) |
| **Total** | **~$100-250/mo** |

**Per-user cost:** ~$2-5/mo for 50 active users

---

## 🎯 Success Metrics

- **Time to create agent:** < 1 minute
- **Agent success rate:** > 95%
- **User satisfaction:** NPS > 50
- **Active agents per user:** > 3

---

## 🔐 Security Considerations

1. **API Key Storage:** Encrypt all integration credentials in database
2. **Rate Limiting:** Prevent abuse of LLM API calls
3. **Execution Sandboxing:** Isolate agent execution environments
4. **Audit Logs:** Track all agent actions
5. **User Permissions:** Row-level security in Supabase

---

## Next Steps

1. **Validate with users:** Would they prefer this to visual builder?
2. **Start with Phase 1 MVP:** Get basic agents working
3. **Iterate based on feedback:** Add more integrations as needed

