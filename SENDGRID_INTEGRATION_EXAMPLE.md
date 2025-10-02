# 📧 SendGrid Integration - Complete Example

## What This Does

Makes the "Email Summarizer" agent actually send real emails via SendGrid.

---

## Setup (5 minutes)

### 1. Get SendGrid API Key

1. Go to https://sendgrid.com
2. Sign up (free tier: 100 emails/day)
3. Navigate to Settings → API Keys
4. Create API Key with "Full Access"
5. Copy the key (starts with `SG.`)

### 2. Add to Supabase Secrets

```bash
npx supabase secrets set SENDGRID_API_KEY=SG.your_actual_key_here
```

### 3. Verify SendGr

id Sender

1. In SendGrid dashboard → Settings → Sender Authentication
2. Verify your email or domain
3. Use this as the "from" email

---

## Code Changes

### Update `supabase/functions/execute-agent/index.ts`

Replace the `executeActionStep` function with this:

```typescript
async function executeActionStep(step: any, context: any): Promise<any> {
  console.log(`    Executing action: ${step.action}...`)

  // ✅ REAL SendGrid Integration
  if (step.integration === 'sendgrid' && step.action === 'send_email') {
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY')
    
    if (!sendgridApiKey) {
      throw new Error('SendGrid API key not configured')
    }

    // Replace template variables in email content
    let subject = step.params.subject || 'Agent Notification'
    let body = step.params.body || JSON.stringify(context, null, 2)
    
    // Replace {{variable}} with actual values from context
    Object.entries(context).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g')
      subject = subject.replace(placeholder, String(value))
      body = body.replace(placeholder, String(value))
    })

    const emailData = {
      personalizations: [{
        to: [{ email: step.params.to }],
        subject: subject,
      }],
      from: { 
        email: step.params.from || 'noreply@yourdomain.com',
        name: step.params.from_name || 'AI Agent',
      },
      content: [{
        type: 'text/html',
        value: body,
      }],
    }

    console.log(`    Sending email to ${step.params.to}...`)

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('SendGrid error:', error)
      throw new Error(`Failed to send email: ${error}`)
    }

    console.log('    ✅ Email sent successfully!')

    return {
      ...context,
      email_sent: true,
      email_to: step.params.to,
      sent_at: new Date().toISOString(),
    }
  }

  // Mock implementation for other integrations
  return {
    ...context,
    action_result: {
      integration: step.integration,
      action: step.action,
      params: step.params,
      status: 'mock_completed',
    },
  }
}
```

---

## Deploy

```bash
npx supabase functions deploy execute-agent
```

---

## Test It!

### Step 1: Create Test Agent

Go to your app: `http://localhost:3000/dashboard/agents`

Create an agent with this prompt:

```
Create an agent that sends me a test email with the subject 
"Test from AI Agent" and body "This is a test email sent by 
my AI agent. Time: {{timestamp}}"
```

### Step 2: Configure Parameters

When the configuration screen appears, you'll see the agent wants to send emails.

### Step 3: Run Agent

Click "Run Now" on the agent card.

### Step 4: Check Your Email!

You should receive an email within seconds! 📧

---

## What Just Happened

### Before (Mock):
```json
{
  "action_result": {
    "integration": "sendgrid",
    "action": "send_email",
    "status": "mock_completed"
  }
}
```

### After (Real):
```json
{
  "email_sent": true,
  "email_to": "your@email.com",
  "sent_at": "2025-10-02T12:30:00.000Z"
}
```

**An actual email was sent!** ✅

---

## Troubleshooting

### Error: "SendGrid API key not configured"

```bash
# Check if secret exists
npx supabase secrets list

# Set it again
npx supabase secrets set SENDGRID_API_KEY=your_key
```

### Error: "The from address does not match a verified Sender Identity"

1. Go to SendGrid → Settings → Sender Authentication
2. Verify your email address
3. Use that verified email as the "from" address

### Error: "403 Forbidden"

Your API key doesn't have permissions. Create a new one with "Full Access".

---

## Next Steps

### Add More Email Features

```typescript
// Add CC/BCC
personalizations: [{
  to: [{ email: step.params.to }],
  cc: step.params.cc ? [{ email: step.params.cc }] : [],
  bcc: step.params.bcc ? [{ email: step.params.bcc }] : [],
  subject: subject,
}]

// Add attachments
attachments: step.params.attachments || []

// Add custom headers
headers: step.params.headers || {}
```

### Track Email Opens

SendGrid automatically tracks opens if you enable it in settings.

### Use Templates

```typescript
// Instead of raw HTML, use SendGrid templates
{
  template_id: step.params.template_id,
  dynamic_template_data: context,
}
```

---

## Cost

**SendGrid Free Tier:**
- ✅ 100 emails/day forever
- ✅ Email API
- ✅ Email validation

**Paid Plans:**
- $15/mo - 40,000 emails/month
- $60/mo - 100,000 emails/month

For most agents, **free tier is enough!**

---

## Security Note

The SendGrid API key is stored as a **Supabase secret**, so it's:
- ✅ Never exposed to the client
- ✅ Only accessible to Edge Functions
- ✅ Encrypted at rest
- ✅ Never in your git repo

---

## ✅ Summary

You now have:
1. ✅ Real email sending working
2. ✅ Template variable replacement
3. ✅ Secure API key storage
4. ✅ Error handling
5. ✅ Execution logs

**Your agents can now send real emails!** 📧✨

Total time: ~30 minutes
Cost: $0 (free tier)

---

## What's Next?

Now add:
1. **Slack** (15 minutes) - Notifications
2. **Webhooks** (15 minutes) - HTTP requests
3. **Gmail OAuth** (1 day) - Read emails

Or skip all that and use **Zapier** to get 5000+ integrations instantly!

