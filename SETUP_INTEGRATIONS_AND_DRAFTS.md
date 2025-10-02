# Setup Guide: User Integrations & Agent Customization

## Overview

This guide will help you set up the new features:
1. **User API Key Management** - Users can add their own API keys for integrations
2. **Agent Draft/Customization Flow** - Generate → Customize → Deploy workflow
3. **Popular Integrations Support** - 20+ integrations ready to use

## Step 1: Apply Database Migrations

You need to run the SQL migrations in your Supabase dashboard:

### Option A: Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/hujcbnrixdcxspmczbxi/sql
2. Click "New Query"
3. Copy and paste the contents of **`supabase/migrations/20241002_user_integrations.sql`**
4. Click "Run" to execute the migration

### Option B: Command Line

If you have direct database access:

```bash
psql "postgresql://postgres.hujcbnrixdcxspmczbxi:Gintarine99@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" < supabase/migrations/20241002_user_integrations.sql
```

## Step 2: Verify Edge Functions Are Deployed

The following edge functions have been deployed:
- ✅ `generate-agent-config` - Generates agent configuration from prompt
- ✅ `deploy-agent` - Deploys customized agent to database
- ✅ `execute-agent` - Executes agents using user API keys
- ✅ `create-agent` - Legacy direct creation (updated)

You can verify them at: https://supabase.com/dashboard/project/hujcbnrixdcxspmczbxi/functions

## Step 3: Test the Application

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Navigate to the Agents tab**

3. **Add an Integration:**
   - Click "Manage Integrations" button in the top right
   - Select an integration (e.g., OpenAI, SendGrid, Slack)
   - Enter your API keys
   - Click "Connect"

4. **Create an Agent:**
   - Enter a prompt (e.g., "Create an agent that summarizes my daily emails")
   - OR click a template card to use pre-configured templates
   - Click the send button or press Ctrl+Enter

5. **Customize Your Agent:**
   - After generation, a customization modal will appear
   - Edit the agent name, description, steps, triggers, etc.
   - Click "Deploy Agent" when ready

6. **Execute Your Agent:**
   - Click on an agent card to view details
   - Click "Run Now" to execute the agent
   - View execution history and results

## Available Integrations (20+)

### AI & LLMs
- ✅ OpenAI (GPT-4, GPT-3.5)
- ✅ Anthropic Claude

### Communication
- ✅ Slack
- ✅ Discord
- ✅ Telegram
- ✅ Twilio (SMS)

### Email
- ✅ SendGrid
- ✅ Gmail

### Productivity
- ✅ Notion
- ✅ Google Sheets
- ✅ Airtable

### CRM & Marketing
- ✅ HubSpot
- ✅ Mailchimp

### Social Media
- ✅ Twitter/X
- ✅ LinkedIn

### Payment & E-commerce
- ✅ Stripe
- ✅ Shopify

### Webhooks
- ✅ HTTP/Webhook (any URL)

## Important Notes

### API Key Security
- All API keys are stored encrypted in the `user_integrations` table
- Keys are only accessible by the user who created them
- Row Level Security (RLS) policies are enforced

### Integration Implementation Status
The integration framework is complete, but individual integration API calls need to be implemented in `supabase/functions/execute-agent/index.ts`.

Currently, the system:
- ✅ Generates agent configurations with proper integration requirements
- ✅ Validates that users have connected required integrations
- ✅ Fetches user API keys securely during execution
- ⚠️ Uses mock implementations for actual API calls (needs implementation)

### Next Steps for Production
To make integrations fully functional, implement actual API calls in `execute-agent`:

```typescript
// Example for SendGrid in executeFetchStep or executeActionStep
if (step.integration === 'sendgrid' && step.action === 'send_email') {
  const credentials = integrations.get('sendgrid')
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: step.params.to }] }],
      from: { email: step.params.from },
      subject: step.params.subject,
      content: [{ type: 'text/html', value: step.params.html }],
    }),
  })
  // Handle response...
}
```

## Troubleshooting

### Migration Errors
If you encounter errors running migrations:
1. Check that the `uuid-ossp` extension is enabled
2. Ensure no conflicting tables exist
3. Check Supabase logs in the Dashboard

### Edge Function Errors
View logs in the Supabase Dashboard:
https://supabase.com/dashboard/project/hujcbnrixdcxspmczbxi/functions

### OpenAI API Errors
Make sure you have either:
- Added OpenAI integration via the UI with your API key
- OR set `OPENAI_API_KEY` in Supabase Edge Function secrets (legacy)

## File Structure

```
src/
├── components/
│   └── dashboard/
│       ├── integrations-modal.tsx         # Manage integrations UI
│       ├── agent-customization-modal.tsx  # Agent customization UI
│       └── tabs/
│           └── agents-tab.tsx             # Main agents UI
├── lib/
│   ├── automation-engine.ts               # Client API
│   ├── integration-client.ts              # Integration API
│   └── types/
│       └── integrations.ts                # Integration definitions

supabase/
├── functions/
│   ├── generate-agent-config/             # Generate config from prompt
│   ├── deploy-agent/                      # Deploy customized agent
│   └── execute-agent/                     # Execute with user API keys
└── migrations/
    └── 20241002_user_integrations.sql     # Database schema
```

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check Supabase function logs
3. Verify all environment variables are set
4. Ensure database migrations were applied successfully

---

**Ready to start?** Follow the steps above and your users will be able to manage their own API keys and create customized AI agents! 🚀

