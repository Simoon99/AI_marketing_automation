# Integration Implementation Guide

This guide shows you how to implement actual API calls for each integration in your Agent Engine.

## Where to Implement

All integration implementations go in: **`supabase/functions/execute-agent/index.ts`**

Look for the three step execution functions:
- `executeFetchStep()` - For fetching data from integrations
- `executeProcessStep()` - For processing data (uses LLM)
- `executeActionStep()` - For performing actions via integrations

## Implementation Pattern

### Basic Structure

```typescript
async function executeActionStep(step: any, context: any, integrations: Map<string, any>): Promise<any> {
  console.log(`    Executing action: ${step.action}...`)

  // 1. Check if integration is configured
  if (step.integration && !integrations.has(step.integration)) {
    throw new Error(`Integration ${step.integration} not configured`)
  }

  // 2. Get credentials
  const credentials = integrations.get(step.integration)

  // 3. Implement specific integration logic
  if (step.integration === 'sendgrid' && step.action === 'send_email') {
    return await sendgridSendEmail(credentials, step.params, context)
  } else if (step.integration === 'slack' && step.action === 'send_message') {
    return await slackSendMessage(credentials, step.params, context)
  }
  // ... more integrations

  // 4. Fallback for unimplemented
  return {
    ...context,
    action_result: {
      integration: step.integration,
      action: step.action,
      status: 'not_implemented',
    },
  }
}
```

## Example Implementations

### 1. SendGrid (Email)

```typescript
async function sendgridSendEmail(
  credentials: any,
  params: any,
  context: any
): Promise<any> {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: params.to }]
      }],
      from: { email: params.from },
      subject: params.subject,
      content: [{
        type: 'text/html',
        value: params.html
      }]
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SendGrid error: ${error}`)
  }

  return {
    ...context,
    action_result: {
      integration: 'sendgrid',
      action: 'send_email',
      status: 'success',
      message_id: response.headers.get('x-message-id'),
    },
  }
}
```

### 2. Slack (Communication)

```typescript
async function slackSendMessage(
  credentials: any,
  params: any,
  context: any
): Promise<any> {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.bot_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: params.channel,
      text: params.text,
    }),
  })

  const data = await response.json()

  if (!data.ok) {
    throw new Error(`Slack error: ${data.error}`)
  }

  return {
    ...context,
    action_result: {
      integration: 'slack',
      action: 'send_message',
      status: 'success',
      timestamp: data.ts,
      channel: data.channel,
    },
  }
}
```

### 3. OpenAI (Already Implemented in processStep)

```typescript
// Already working in executeProcessStep!
// Uses either user's OpenAI integration or system OPENAI_API_KEY
let openaiApiKey = integrations?.get('openai')?.api_key
if (!openaiApiKey) {
  openaiApiKey = Deno.env.get('OPENAI_API_KEY')
}

const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${openaiApiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: llmConfig?.model || 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    temperature: llmConfig?.temperature || 0.7,
  }),
})
```

### 4. Gmail (Fetch Emails)

```typescript
async function gmailReadEmails(
  credentials: any,
  params: any,
  context: any
): Promise<any> {
  // First, get access token from refresh token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      refresh_token: credentials.refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  const { access_token } = await tokenResponse.json()

  // Now fetch emails
  const query = params.query || 'is:unread'
  const maxResults = params.max_results || 10

  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`,
    {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    }
  )

  const data = await response.json()

  return {
    ...context,
    fetched_data: {
      integration: 'gmail',
      action: 'read_emails',
      emails: data.messages || [],
      result_size: data.messages?.length || 0,
    },
  }
}
```

### 5. Stripe (Create Customer)

```typescript
async function stripeCreateCustomer(
  credentials: any,
  params: any,
  context: any
): Promise<any> {
  const response = await fetch('https://api.stripe.com/v1/customers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.secret_key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      email: params.email,
      name: params.name || '',
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Stripe error: ${error.message}`)
  }

  const customer = await response.json()

  return {
    ...context,
    action_result: {
      integration: 'stripe',
      action: 'create_customer',
      status: 'success',
      customer_id: customer.id,
      customer,
    },
  }
}
```

### 6. Notion (Create Page)

```typescript
async function notionCreatePage(
  credentials: any,
  params: any,
  context: any
): Promise<any> {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: {
        page_id: params.parent_id,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: params.title,
              },
            },
          ],
        },
      },
      children: params.content ? [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: params.content,
                },
              },
            ],
          },
        },
      ] : [],
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Notion error: ${error.message}`)
  }

  const page = await response.json()

  return {
    ...context,
    action_result: {
      integration: 'notion',
      action: 'create_page',
      status: 'success',
      page_id: page.id,
      page_url: page.url,
    },
  }
}
```

### 7. Webhook (HTTP Request)

```typescript
async function webhookHttpRequest(
  credentials: any,
  params: any,
  context: any
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...params.headers,
  }

  const options: RequestInit = {
    method: params.method || 'POST',
    headers,
  }

  if (params.body && params.method !== 'GET') {
    options.body = typeof params.body === 'string' 
      ? params.body 
      : JSON.stringify(params.body)
  }

  const response = await fetch(params.url, options)

  let responseData
  const contentType = response.headers.get('content-type')
  
  if (contentType?.includes('application/json')) {
    responseData = await response.json()
  } else {
    responseData = await response.text()
  }

  return {
    ...context,
    action_result: {
      integration: 'webhook',
      action: 'http_request',
      status: response.ok ? 'success' : 'failed',
      status_code: response.status,
      response: responseData,
    },
  }
}
```

## Complete Integration Switch Statement

Here's how to organize all integrations in your execute functions:

```typescript
async function executeActionStep(step: any, context: any, integrations: Map<string, any>): Promise<any> {
  console.log(`    Executing action: ${step.action}...`)

  if (step.integration && !integrations.has(step.integration)) {
    throw new Error(`Integration ${step.integration} not configured`)
  }

  const credentials = integrations.get(step.integration)

  // Route to specific integration handler
  switch (step.integration) {
    case 'sendgrid':
      if (step.action === 'send_email') {
        return await sendgridSendEmail(credentials, step.params, context)
      }
      break

    case 'slack':
      if (step.action === 'send_message') {
        return await slackSendMessage(credentials, step.params, context)
      }
      break

    case 'gmail':
      if (step.action === 'send_email') {
        return await gmailSendEmail(credentials, step.params, context)
      }
      break

    case 'stripe':
      if (step.action === 'create_customer') {
        return await stripeCreateCustomer(credentials, step.params, context)
      }
      break

    case 'notion':
      if (step.action === 'create_page') {
        return await notionCreatePage(credentials, step.params, context)
      }
      break

    case 'webhook':
      if (step.action === 'http_request') {
        return await webhookHttpRequest(credentials, step.params, context)
      }
      break

    // Add more integrations here...
  }

  // Not implemented yet
  throw new Error(`Action ${step.action} for ${step.integration} not implemented`)
}
```

## Testing Integrations

### 1. Local Testing
```bash
# Test individual edge functions
npx supabase functions serve execute-agent --no-verify-jwt

# In another terminal, send test request
curl -X POST http://localhost:54321/functions/v1/execute-agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{"agent_id": "xxx", "input": {}}'
```

### 2. Production Testing
1. Add integration via UI
2. Create test agent
3. Execute agent
4. Check execution results in agent details
5. Check edge function logs in Supabase Dashboard

## Error Handling Best Practices

```typescript
async function integrationAction(credentials: any, params: any, context: any): Promise<any> {
  try {
    // API call
    const response = await fetch(url, options)

    // Check response
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API error (${response.status}): ${error}`)
    }

    const data = await response.json()

    // Return success
    return {
      ...context,
      action_result: {
        integration: 'name',
        action: 'action_name',
        status: 'success',
        data,
      },
    }
  } catch (error: any) {
    // Log for debugging
    console.error(`Integration error:`, error)

    // Re-throw with context
    throw new Error(`Failed to execute ${params.action}: ${error.message}`)
  }
}
```

## Parameter Substitution

Use context variables in parameters:

```typescript
// Agent config might have:
// params: { to: "{{user_email}}", subject: "Hello {{user_name}}" }

function substituteParams(params: any, context: any): any {
  const paramStr = JSON.stringify(params)
  const substituted = paramStr.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return context[key] || `{{${key}}}`
  })
  return JSON.parse(substituted)
}

// Use it:
const substitutedParams = substituteParams(step.params, context)
```

## Rate Limiting

Add rate limiting per integration:

```typescript
const rateLimits = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(integration: string, limit: number, window: number): void {
  const now = Date.now()
  const key = integration
  
  const current = rateLimits.get(key)
  
  if (!current || current.resetAt < now) {
    rateLimits.set(key, { count: 1, resetAt: now + window })
    return
  }
  
  if (current.count >= limit) {
    throw new Error(`Rate limit exceeded for ${integration}`)
  }
  
  current.count++
}

// Use it:
checkRateLimit(step.integration, 60, 60000) // 60 requests per minute
```

## Next Steps

1. **Start with the most critical integrations** for your use case
2. **Test each integration** thoroughly before moving to the next
3. **Add error handling** and logging
4. **Document** any special requirements or limitations
5. **Consider rate limits** and API quotas
6. **Add retry logic** for failed requests

## Resources

- Integration API documentation links in `src/lib/types/integrations.ts`
- Example implementations above
- Test your integrations in the Supabase Dashboard
- Check edge function logs for debugging

---

**Ready to implement?** Start with one integration, test it thoroughly, then move to the next! 🚀

