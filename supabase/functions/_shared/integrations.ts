// Integration Implementations
// This file contains actual API call implementations for all integrations

// ============================================
// 1. OPENAI - AI & LLMs
// ============================================

export async function openaiChatCompletion(credentials: any, params: any, context: any): Promise<any> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: params.model || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: params.prompt,
        },
      ],
      temperature: params.temperature || 0.7,
      max_tokens: params.max_tokens,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    openai_response: data.choices[0].message.content,
    usage: data.usage,
  }
}

// ============================================
// 2. ANTHROPIC - AI & LLMs
// ============================================

export async function anthropicMessage(credentials: any, params: any, context: any): Promise<any> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': credentials.api_key,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: params.model || 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: params.prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    claude_response: data.content[0].text,
  }
}

// ============================================
// 3. SENDGRID - Email
// ============================================

export async function sendgridSendEmail(credentials: any, params: any, context: any): Promise<any> {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: substituteVariables(params.to, context) }]
      }],
      from: { email: substituteVariables(params.from, context) },
      subject: substituteVariables(params.subject, context),
      content: [{
        type: 'text/html',
        value: substituteVariables(params.html, context)
      }]
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SendGrid error: ${error}`)
  }

  return {
    ...context,
    email_sent: true,
    email_to: params.to,
    message_id: response.headers.get('x-message-id'),
  }
}

// ============================================
// 4. GMAIL - Email
// ============================================

async function getGmailAccessToken(credentials: any): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      refresh_token: credentials.refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh Gmail token')
  }

  const data = await response.json()
  return data.access_token
}

export async function gmailSendEmail(credentials: any, params: any, context: any): Promise<any> {
  const accessToken = await getGmailAccessToken(credentials)

  const email = [
    `To: ${substituteVariables(params.to, context)}`,
    `Subject: ${substituteVariables(params.subject, context)}`,
    '',
    substituteVariables(params.body, context)
  ].join('\n')

  const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedEmail
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gmail error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    email_sent: true,
    message_id: data.id,
  }
}

export async function gmailReadEmails(credentials: any, params: any, context: any): Promise<any> {
  const accessToken = await getGmailAccessToken(credentials)

  const query = params.query || 'is:unread'
  const maxResults = params.max_results || 10

  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch Gmail messages')
  }

  const data = await response.json()
  const messages = data.messages || []

  // Fetch full message details
  const fullMessages = await Promise.all(
    messages.slice(0, 5).map(async (msg: any) => {
      const msgResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      )
      return msgResponse.json()
    })
  )

  return {
    ...context,
    emails: fullMessages,
    email_count: messages.length,
  }
}

// ============================================
// 5. SLACK - Communication
// ============================================

export async function slackSendMessage(credentials: any, params: any, context: any): Promise<any> {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.bot_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: substituteVariables(params.channel, context),
      text: substituteVariables(params.text, context),
    }),
  })

  const data = await response.json()

  if (!data.ok) {
    throw new Error(`Slack error: ${data.error}`)
  }

  return {
    ...context,
    slack_message_sent: true,
    timestamp: data.ts,
    channel: data.channel,
  }
}

// ============================================
// 6. DISCORD - Communication
// ============================================

export async function discordSendMessage(credentials: any, params: any, context: any): Promise<any> {
  const response = await fetch(`https://discord.com/api/v10/channels/${params.channel_id}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${credentials.bot_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: substituteVariables(params.content, context),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Discord error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    discord_message_sent: true,
    message_id: data.id,
  }
}

// ============================================
// 7. TELEGRAM - Communication
// ============================================

export async function telegramSendMessage(credentials: any, params: any, context: any): Promise<any> {
  const response = await fetch(`https://api.telegram.org/bot${credentials.bot_token}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: substituteVariables(params.chat_id, context),
      text: substituteVariables(params.text, context),
    }),
  })

  const data = await response.json()

  if (!data.ok) {
    throw new Error(`Telegram error: ${data.description}`)
  }

  return {
    ...context,
    telegram_message_sent: true,
    message_id: data.result.message_id,
  }
}

// ============================================
// 8. TWILIO - Communication
// ============================================

export async function twilioSendSMS(credentials: any, params: any, context: any): Promise<any> {
  const auth = btoa(`${credentials.account_sid}:${credentials.auth_token}`)

  const formData = new URLSearchParams()
  formData.append('To', substituteVariables(params.to, context))
  formData.append('From', substituteVariables(params.from, context))
  formData.append('Body', substituteVariables(params.body, context))

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${credentials.account_sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twilio error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    sms_sent: true,
    message_sid: data.sid,
  }
}

// ============================================
// 9. NOTION - Productivity
// ============================================

export async function notionCreatePage(credentials: any, params: any, context: any): Promise<any> {
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
                content: substituteVariables(params.title, context),
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
                  content: substituteVariables(params.content, context),
                },
              },
            ],
          },
        },
      ] : [],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Notion error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    notion_page_created: true,
    page_id: data.id,
    page_url: data.url,
  }
}

// ============================================
// 10. GOOGLE SHEETS - Productivity
// ============================================

export async function googleSheetsAppendRow(credentials: any, params: any, context: any): Promise<any> {
  const accessToken = await getGoogleAccessToken(credentials)

  const values = Array.isArray(params.values) ? params.values : JSON.parse(params.values)

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${params.spreadsheet_id}/values/${params.sheet_name}!A:Z:append?valueInputOption=RAW`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [values],
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Google Sheets error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    row_appended: true,
    updated_range: data.updates.updatedRange,
  }
}

async function getGoogleAccessToken(credentials: any): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      refresh_token: credentials.refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  const data = await response.json()
  return data.access_token
}

// ============================================
// 11. AIRTABLE - Productivity
// ============================================

export async function airtableCreateRecord(credentials: any, params: any, context: any): Promise<any> {
  const fields = typeof params.fields === 'string' ? JSON.parse(params.fields) : params.fields

  const response = await fetch(
    `https://api.airtable.com/v0/${params.base_id}/${encodeURIComponent(params.table_name)}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: fields,
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Airtable error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    airtable_record_created: true,
    record_id: data.id,
  }
}

// ============================================
// 12. HUBSPOT - CRM
// ============================================

export async function hubspotCreateContact(credentials: any, params: any, context: any): Promise<any> {
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        email: substituteVariables(params.email, context),
        firstname: params.firstname ? substituteVariables(params.firstname, context) : undefined,
        lastname: params.lastname ? substituteVariables(params.lastname, context) : undefined,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`HubSpot error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    hubspot_contact_created: true,
    contact_id: data.id,
  }
}

// ============================================
// 13. MAILCHIMP - CRM
// ============================================

export async function mailchimpAddSubscriber(credentials: any, params: any, context: any): Promise<any> {
  const dc = credentials.api_key.split('-')[1]
  
  const response = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${params.list_id}/members`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: substituteVariables(params.email, context),
        status: 'subscribed',
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Mailchimp error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    mailchimp_subscriber_added: true,
    subscriber_id: data.id,
  }
}

// ============================================
// 14. TWITTER/X - Social
// ============================================

export async function twitterPostTweet(credentials: any, params: any, context: any): Promise<any> {
  // Note: Twitter API v2 requires OAuth 1.0a signing which is complex
  // This is a simplified version - in production, use a proper OAuth library
  
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: substituteVariables(params.text, context),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twitter error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    tweet_posted: true,
    tweet_id: data.data.id,
  }
}

// ============================================
// 15. LINKEDIN - Social
// ============================================

export async function linkedinCreatePost(credentials: any, params: any, context: any): Promise<any> {
  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.access_token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: `urn:li:person:${credentials.person_id}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: substituteVariables(params.text, context),
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`LinkedIn error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    linkedin_post_created: true,
    post_id: data.id,
  }
}

// ============================================
// 16. STRIPE - Payment
// ============================================

export async function stripeCreateCustomer(credentials: any, params: any, context: any): Promise<any> {
  const formData = new URLSearchParams()
  formData.append('email', substituteVariables(params.email, context))
  if (params.name) {
    formData.append('name', substituteVariables(params.name, context))
  }

  const response = await fetch('https://api.stripe.com/v1/customers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.secret_key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Stripe error: ${error.error.message}`)
  }

  const data = await response.json()

  return {
    ...context,
    stripe_customer_created: true,
    customer_id: data.id,
    customer: data,
  }
}

// ============================================
// 17. SHOPIFY - E-commerce
// ============================================

export async function shopifyCreateProduct(credentials: any, params: any, context: any): Promise<any> {
  const response = await fetch(
    `https://${credentials.shop_name}.myshopify.com/admin/api/2024-01/products.json`,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': credentials.access_token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: {
          title: substituteVariables(params.title, context),
          variants: [
            {
              price: params.price,
            },
          ],
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Shopify error: ${error}`)
  }

  const data = await response.json()

  return {
    ...context,
    shopify_product_created: true,
    product_id: data.product.id,
  }
}

// ============================================
// 18. WEBHOOK - HTTP Request
// ============================================

export async function webhookHttpRequest(credentials: any, params: any, context: any): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Merge custom headers
  if (params.headers) {
    const customHeaders = typeof params.headers === 'string' ? JSON.parse(params.headers) : params.headers
    Object.assign(headers, customHeaders)
  }

  const options: RequestInit = {
    method: params.method || 'POST',
    headers,
  }

  // Add body for non-GET requests
  if (params.body && params.method !== 'GET') {
    const body = typeof params.body === 'string' ? params.body : JSON.stringify(params.body)
    options.body = substituteVariables(body, context)
  }

  const url = substituteVariables(params.url, context)
  const response = await fetch(url, options)

  let responseData
  const contentType = response.headers.get('content-type')
  
  if (contentType?.includes('application/json')) {
    responseData = await response.json()
  } else {
    responseData = await response.text()
  }

  return {
    ...context,
    webhook_response: responseData,
    webhook_status: response.status,
    webhook_ok: response.ok,
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function substituteVariables(text: string, context: any): string {
  if (!text) return text
  
  return String(text).replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = context[key]
    return value !== undefined ? String(value) : `{{${key}}}`
  })
}

// Export routing function
export function getIntegrationHandler(integration: string, action: string): Function | null {
  const handlers: Record<string, Record<string, Function>> = {
    openai: {
      chat_completion: openaiChatCompletion,
    },
    anthropic: {
      message: anthropicMessage,
    },
    sendgrid: {
      send_email: sendgridSendEmail,
    },
    gmail: {
      send_email: gmailSendEmail,
      read_emails: gmailReadEmails,
    },
    slack: {
      send_message: slackSendMessage,
    },
    discord: {
      send_message: discordSendMessage,
    },
    telegram: {
      send_message: telegramSendMessage,
    },
    twilio: {
      send_sms: twilioSendSMS,
    },
    notion: {
      create_page: notionCreatePage,
    },
    'google-sheets': {
      append_row: googleSheetsAppendRow,
    },
    airtable: {
      create_record: airtableCreateRecord,
    },
    hubspot: {
      create_contact: hubspotCreateContact,
    },
    mailchimp: {
      add_subscriber: mailchimpAddSubscriber,
    },
    twitter: {
      post_tweet: twitterPostTweet,
    },
    linkedin: {
      create_post: linkedinCreatePost,
    },
    stripe: {
      create_customer: stripeCreateCustomer,
    },
    shopify: {
      create_product: shopifyCreateProduct,
    },
    webhook: {
      http_request: webhookHttpRequest,
    },
  }

  return handlers[integration]?.[action] || null
}

