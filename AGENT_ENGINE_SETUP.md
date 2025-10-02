# AI Agent Engine Setup Guide

This guide will help you set up the AI Agent Engine - a system that creates intelligent automation agents from natural language prompts.

---

## 🎯 What You'll Get

- **Natural Language Agent Creation**: Describe what you want in plain English
- **AI-Powered Intelligence**: GPT-4 generates complete agent configurations
- **Plug & Play**: No complex visual builders or workflows needed
- **Execution Tracking**: Monitor agent runs and view detailed logs

---

## 📋 Prerequisites

1. **Supabase Account** (free tier works)
2. **OpenAI API Key** (requires account with credits)
3. **Node.js 18+** installed locally

---

## 🚀 Step-by-Step Setup

### Step 1: Database Setup

Run the database migration to create necessary tables:

```bash
# Using Supabase CLI
npx supabase db push

# Or manually run the SQL in Supabase Dashboard
# Go to: https://app.supabase.com/project/_/sql/new
# Copy and run the contents of: supabase/migrations/20241002_agents_schema.sql
```

This creates:
- `agents` table - stores agent configurations
- `agent_executions` table - logs all agent runs
- `agent_integrations` table - encrypted integration credentials

---

### Step 2: Deploy Edge Functions

Deploy the agent creation and execution functions:

```bash
# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Deploy functions
npx supabase functions deploy create-agent
npx supabase functions deploy execute-agent
```

---

### Step 3: Set OpenAI API Key

The agent engine needs your Open AI API key to generate agents:

#### Option A: Via Supabase CLI

```bash
npx supabase secrets set OPENAI_API_KEY=sk-your-openai-api-key-here
```

#### Option B: Via Supabase Dashboard

1. Go to **Project Settings** → **Edge Functions**
2. Under **Secrets**, click **Add Secret**
3. Name: `OPENAI_API_KEY`
4. Value: Your OpenAI API key (starts with `sk-`)
5. Click **Save**

🔑 **Get your OpenAI API key**: https://platform.openai.com/api-keys

---

### Step 4: Update Environment Variables

Update your `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### Step 5: Test the Setup

1. Start your Next.js app:
   ```bash
   npm run dev
   ```

2. Go to **Dashboard** → **Agents** tab

3. Click **Create Agent**

4. Try this test prompt:
   ```
   Create an agent that sends me a motivational quote every morning at 8 AM
   ```

5. Wait 5-10 seconds for the AI to generate the agent

6. Click **Run Now** to test it

---

## 💰 Cost Estimation

### OpenAI API Usage

| Action | Cost | Notes |
|--------|------|-------|
| Create Agent | $0.01-0.05 | One-time per agent |
| Execute Agent (with LLM) | $0.01-0.10 | Per execution |
| Execute Agent (no LLM) | $0.00 | Free |

**Monthly estimate**: $5-20 for typical usage (20-50 agents, 100-500 executions)

### Supabase

- **Free tier**: 500MB database, 2GB bandwidth, 2 million Edge Function invocations
- **Pro tier** ($25/mo): More resources if needed

---

## 🤖 Example Agent Prompts

### Email Management
```
Create an agent that reads my unread emails every morning at 8 AM, 
categorizes them by urgency using AI, and sends me a summary with 
the top 5 emails I should respond to first.
```

### Social Media Monitoring
```
Create an agent that monitors Twitter for mentions of my brand every 
30 minutes, analyzes the sentiment, and sends me a Slack notification 
if there's a negative mention that needs attention.
```

### Lead Qualification
```
Create an agent that triggers when a new lead form is submitted via 
webhook, analyzes the lead data using AI to score it 1-10, and 
automatically adds qualified leads (score > 7) to HubSpot with the 
AI's reasoning.
```

### Content Summarization
```
Create an agent that runs every Friday at 5 PM, collects all the 
articles I saved to Notion this week, generates a summary of key 
insights, and emails it to me.
```

---

## 🔧 Advanced Configuration

### Adding Integration Credentials

For agents that need API access (Gmail, Slack, etc.):

```typescript
// In your app, use the AutomationEngine to store credentials
import { supabase } from '@/lib/supabase';

await supabase.from('agent_integrations').insert({
  provider: 'gmail',
  credentials: {
    // Store encrypted credentials
    api_key: 'encrypted_key_here',
    client_id: 'your_client_id',
    // etc.
  },
});
```

### Scheduled Agent Execution

To enable scheduled execution (cron jobs):

1. Create a new Edge Function: `agent-scheduler`
2. Set up Supabase Cron jobs or use an external cron service
3. Call the scheduler function periodically

Example cron configuration:
```sql
-- In Supabase SQL Editor
select cron.schedule(
  'run-scheduled-agents',
  '* * * * *', -- Every minute
  $$
  select net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/agent-scheduler',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

---

## 🐛 Troubleshooting

### "Failed to create agent"

- **Check OpenAI API key**: Verify it's set correctly in Supabase secrets
- **Check OpenAI credits**: Ensure your account has available credits
- **Check logs**: View Edge Function logs in Supabase Dashboard

### "Agent not found"

- **Check RLS policies**: Ensure Row Level Security is properly configured
- **Check user authentication**: Make sure you're logged in

### "Execution failed"

- **View error logs**: Click on the failed execution to see error details
- **Check integration credentials**: Verify API keys for integrations are valid
- **Check LLM responses**: Some prompts may be too complex

---

## 📊 Monitoring

### View Edge Function Logs

1. Go to **Edge Functions** in Supabase Dashboard
2. Select the function (`create-agent` or `execute-agent`)
3. Click **Logs** to see execution details

### Database Queries

```sql
-- View all agents
SELECT * FROM agents ORDER BY created_at DESC;

-- View recent executions
SELECT * FROM agent_executions ORDER BY executed_at DESC LIMIT 20;

-- View execution success rate
SELECT 
  status,
  COUNT(*) as count,
  AVG(duration_ms) as avg_duration
FROM agent_executions
GROUP BY status;
```

---

## 🔐 Security Best Practices

1. **Never expose API keys client-side**: Always use Edge Functions
2. **Encrypt integration credentials**: Use Supabase's encryption features
3. **Enable RLS**: Row Level Security prevents unauthorized access
4. **Rate limiting**: Implement limits on agent creation/execution
5. **Audit logs**: Monitor agent_executions for suspicious activity

---

## 🚀 What's Next?

### Phase 2 Features (Coming Soon)

- [ ] **Scheduled Execution**: Automatic cron-based agent runs
- [ ] **Webhook Triggers**: Trigger agents from external events
- [ ] **More Integrations**: Gmail, Slack, Twitter, HubSpot, Notion
- [ ] **Agent Marketplace**: Share and discover agents
- [ ] **Analytics Dashboard**: Visualize agent performance

### Phase 3 Features (Future)

- [ ] **Multi-step Reasoning**: Complex decision trees
- [ ] **Learning from History**: Agents improve over time
- [ ] **Custom Actions**: Write your own integration code
- [ ] **Team Collaboration**: Share agents with teammates

---

## 💬 Support

- **Documentation**: See `AGENT_ENGINE_ARCHITECTURE.md`
- **Issues**: Check Edge Function logs in Supabase
- **Community**: [Supabase Discord](https://discord.supabase.com)

---

## ✅ Checklist

- [ ] Database migration run successfully
- [ ] Edge functions deployed
- [ ] OpenAI API key configured
- [ ] Environment variables set
- [ ] Test agent created and executed
- [ ] Execution logs visible

If all checked, you're ready to go! 🎉

