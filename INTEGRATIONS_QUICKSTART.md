# 🔌 Making Agents Actually Work - Quick Guide

## Current Problem

Agents are created but execute with **mock data**. They don't actually connect to Gmail, Slack, etc.

---

## Solution: 3 Options

### Option 1: Build Simple Integrations (1-2 days)
✅ SendGrid (email sending)
✅ Slack webhooks (notifications)
✅ HTTP webhooks (custom integrations)

### Option 2: Use Zapier as Backend (2 hours)
✅ 5000+ integrations instantly
✅ No OAuth complexity
💰 $20-50/month

### Option 3: Full OAuth Integrations (1-2 weeks)
✅ Gmail, Google Calendar, etc.
✅ Full control
⚠️ Complex setup

---

## Quick Win: SendGrid Email (30 minutes)

### Step 1: Get SendGrid API Key
1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create API key
3. Add to Supabase:
```bash
npx supabase secrets set SENDGRID_API_KEY=your_key_here
```

### Step 2: Update `execute-agent/index.ts`

Add this to the `executeActionStep` function:

```typescript
async function executeActionStep(step: any, context: any): Promise<any> {
  // SendGrid email integration
  if (step.integration === 'sendgrid' && step.action === 'send_email') {
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY')
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: step.params.to }],
          subject: step.params.subject,
        }],
        from: { email: 'noreply@yourdomain.com' }, // Change this!
        content: [{
          type: 'text/html',
          value: step.params.body,
        }],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SendGrid error: ${error}`)
    }

    return {
      ...context,
      email_sent: true,
      email_id: (await response.json()).id,
    }
  }

  // Keep existing mock for other integrations
  return {
    ...context,
    action_result: {
      integration: step.integration,
      action: step.action,
      status: 'mock_completed',
    },
  }
}
```

### Step 3: Deploy
```bash
npx supabase functions deploy execute-agent
```

### Step 4: Test!
Create an "Email Summarizer" agent and run it. It will now send real emails! 📧

---

## Quick Win: Slack Notifications (15 minutes)

### Step 1: Create Slack Incoming Webhook
1. Go to https://api.slack.com/apps
2. Create app → "From scratch"
3. Enable "Incoming Webhooks"
4. Create webhook URL
5. Store URL in your database (per user)

### Step 2: Update `execute-agent/index.ts`

Add to `executeActionStep`:

```typescript
// Slack integration
if (step.integration === 'slack' && step.action === 'send_message') {
  // Get user's Slack webhook from database
  const { data: integration } = await supabaseClient
    .from('agent_integrations')
    .select('credentials')
    .eq('user_id', user.id)
    .eq('provider', 'slack')
    .single()

  if (!integration) {
    throw new Error('Slack not connected. Please connect Slack first.')
  }

  const response = await fetch(integration.credentials.webhook_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: step.params.message || step.params.text,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to send Slack message')
  }

  return {
    ...context,
    slack_sent: true,
  }
}
```

---

## Best Option for MVP: Use Zapier

Instead of building all integrations, use Zapier as your execution engine:

### How It Works
1. User creates agent in your UI
2. Your system creates Zap via Zapier API
3. Zapier executes the actual integrations
4. Results come back via webhook

### Setup
```bash
# Get Zapier API key from https://zapier.com/app/developer
npx supabase secrets set ZAPIER_API_KEY=your_key
```

### Create Zap for Each Agent
```typescript
// In create-agent Edge Function, after AI generates config
const zapResponse = await fetch('https://api.zapier.com/v1/zaps', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('ZAPIER_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: config.name,
    trigger: {
      app: 'webhook',
      event: 'catch_hook',
    },
    actions: config.steps.map(step => ({
      app: step.integration,
      event: step.action,
      params: step.params,
    })),
  }),
})
```

**Pros:**
- ✅ Get 5000+ integrations instantly
- ✅ No OAuth headaches
- ✅ Users can edit Zaps visually
- ✅ Reliable execution

**Cons:**
- ❌ $20-50/month
- ❌ Vendor dependency

---

## Recommended Path

### Week 1: Quick Wins
1. ✅ Implement SendGrid (emails)
2. ✅ Implement Slack webhooks
3. ✅ Create integrations page in UI

### Week 2: Choose Path
**Path A:** Build OAuth for Gmail/Calendar (1-2 weeks)
**Path B:** Integrate Zapier API (2-3 days)

### Week 3+: Polish
- Add more integrations
- Improve error handling
- Add retry logic

---

## Files to Modify

### 1. `supabase/functions/execute-agent/index.ts`
Add real integration logic to:
- `executeFetchStep()` - for reading data
- `executeActionStep()` - for sending data

### 2. Create `src/app/dashboard/integrations/page.tsx`
UI for users to connect their accounts:
- Gmail OAuth button
- Slack webhook input
- SendGrid API key input

### 3. Update `agent_integrations` table
Store user credentials securely

---

## Next Steps

**Choose ONE to start:**

1. **Quick & Easy**: Implement SendGrid today (30 min)
2. **Most Powerful**: Set up Zapier integration (2 hours)
3. **Full Control**: Build Gmail OAuth (1 day)

**I recommend #1 for immediate results!**

Want me to implement SendGrid integration for you? It's just a few lines of code!

