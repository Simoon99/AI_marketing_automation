# 🧪 Integration Testing Guide

## Quick Start Testing

Your integrations are now **fully implemented and deployed**. Here's how to test them!

---

## Prerequisites

Before testing, you need:
1. ✅ Database migration applied (`20241002_user_integrations.sql`)
2. ✅ Edge functions deployed (already done!)
3. ✅ Dev server running (`npm run dev`)
4. ✅ API keys for integrations you want to test

---

## Test Plan by Integration

### 🤖 AI & LLMs

#### **OpenAI**
**What you need:**
- API key from platform.openai.com

**Test steps:**
1. Go to Agents → Manage Integrations
2. Add OpenAI integration with your API key
3. Create agent: "Summarize this: AI is transforming business"
4. Customize → Deploy → Run
5. Check execution output for summary

**Expected result:** AI-generated summary in execution output

---

#### **Anthropic Claude**
**What you need:**
- API key from console.anthropic.com

**Test steps:**
1. Add Anthropic integration
2. Create agent with Claude processing
3. Execute and verify response

---

### 📧 Email

#### **SendGrid**
**What you need:**
- API key from app.sendgrid.com
- Verified sender email

**Test agent:**
```
Create an agent that sends a test email via SendGrid from verified@yourdomain.com to your@email.com with subject "Test Email" and body "This is a test from the Agent Engine!"
```

**Expected result:** Email received in inbox

---

#### **Gmail**
**What you need:**
- Google Cloud project with Gmail API enabled
- OAuth 2.0 client ID & secret
- Refresh token

**How to get refresh token:**
1. Use Google OAuth Playground: https://developers.google.com/oauthplayground/
2. Select Gmail API v1 scopes
3. Authorize and get refresh token

**Test agent (Send):**
```
Send an email via Gmail to your@email.com with subject "Gmail Test"
```

**Test agent (Read):**
```
Read my 5 most recent unread emails from Gmail and show me the senders
```

---

### 💬 Communication

#### **Slack**
**What you need:**
- Slack app with bot token
- Bot invited to channel

**Setup:**
1. Go to api.slack.com/apps
2. Create new app
3. Add Bot Token Scopes: `chat:write`, `channels:read`
4. Install to workspace
5. Copy Bot User OAuth Token

**Test agent:**
```
Send a message "Hello from Agent Engine!" to #general on Slack
```

**Expected result:** Message appears in Slack channel

---

#### **Discord**
**What you need:**
- Discord bot token
- Bot added to server
- Channel ID

**Test agent:**
```
Send "Test message" to Discord channel ID 1234567890
```

---

#### **Telegram**
**What you need:**
- Bot token from @BotFather
- Chat ID

**Test agent:**
```
Send "Hello from agents!" via Telegram to chat 1234567890
```

---

#### **Twilio**
**What you need:**
- Account SID
- Auth Token
- Twilio phone number

**Test agent:**
```
Send SMS "Test message" from +1234567890 to +0987654321 via Twilio
```

**Expected result:** SMS received on phone

---

### 📊 Productivity

#### **Notion**
**What you need:**
- Internal Integration Token
- Parent page ID

**Setup:**
1. Go to notion.so/my-integrations
2. Create new integration
3. Share target page with integration

**Test agent:**
```
Create a new page in Notion with parent ID abc123 titled "Test Page" and content "Created by Agent Engine"
```

**Expected result:** Page created in Notion

---

#### **Google Sheets**
**What you need:**
- Google Cloud OAuth credentials
- Refresh token
- Spreadsheet ID

**Test agent:**
```
Append a row to Google Sheets spreadsheet 1234567890 in sheet "Sheet1" with values: ["Test", "Data", "Row"]
```

**Expected result:** New row added to sheet

---

#### **Airtable**
**What you need:**
- Personal access token
- Base ID
- Table name

**Test agent:**
```
Create a record in Airtable base app123 in table "Contacts" with fields {"Name": "John Doe", "Email": "john@example.com"}
```

**Expected result:** Record created in Airtable

---

### 🎯 CRM & Marketing

#### **HubSpot**
**What you need:**
- Private app access token

**Setup:**
1. Go to HubSpot → Settings → Integrations → Private Apps
2. Create app with `crm.objects.contacts.write` scope

**Test agent:**
```
Create a contact in HubSpot with email test@example.com, firstname "John", and lastname "Doe"
```

**Expected result:** Contact created in HubSpot

---

#### **Mailchimp**
**What you need:**
- API key
- Audience/List ID

**Test agent:**
```
Add subscriber test@example.com to Mailchimp list 1234567890
```

**Expected result:** Subscriber added to list

---

### 📱 Social Media

#### **Twitter/X**
**What you need:**
- API key, API secret, Access token, Access token secret
- Twitter API v2 access (currently simplified - may need OAuth 1.0a library)

**Test agent:**
```
Post a tweet: "Hello from the Agent Engine! 🚀"
```

**Note:** Full OAuth 1.0a signing not implemented. May need manual bearer token.

---

#### **LinkedIn**
**What you need:**
- OAuth access token
- Person ID (LinkedIn URN)

**Test agent:**
```
Create a LinkedIn post with text "Testing automation with Agent Engine!"
```

---

### 💳 Payment & E-commerce

#### **Stripe**
**What you need:**
- Secret key (test mode)

**Test agent:**
```
Create a customer in Stripe with email customer@example.com and name "Test Customer"
```

**Expected result:** Customer created in Stripe dashboard

---

#### **Shopify**
**What you need:**
- Shop name (e.g., "myshop")
- Admin API access token

**Test agent:**
```
Create a product in Shopify shop myshop titled "Test Product" with price 99.99
```

**Expected result:** Product created in Shopify

---

### 🔗 Webhooks

#### **HTTP Request**
**Test agent:**
```
Make a POST request to https://httpbin.org/post with body {"test": "data"}
```

**Expected result:** Response from httpbin with echoed data

---

## Real-World Agent Tests

### Test 1: Email Summarizer
```
Create an agent that:
1. Reads my 5 most recent unread emails from Gmail
2. Summarizes them using OpenAI
3. Sends the summary to me via SendGrid
```

**Required integrations:**
- Gmail (read)
- OpenAI
- SendGrid

**Test:**
1. Add all 3 integrations
2. Create agent with above prompt
3. Run agent
4. Check email for summary

---

### Test 2: Payment Notification
```
Create an agent that:
1. Creates a test customer in Stripe
2. Sends a Slack notification with customer details
3. Logs the customer to Airtable
```

**Required integrations:**
- Stripe
- Slack
- Airtable

---

### Test 3: Social Media Post
```
Create an agent that:
1. Generates a marketing message using OpenAI
2. Posts it to Twitter
3. Posts it to LinkedIn
4. Sends confirmation to Slack
```

**Required integrations:**
- OpenAI
- Twitter
- LinkedIn
- Slack

---

## Debugging Tips

### View Edge Function Logs
```
Go to: https://supabase.com/dashboard/project/hujcbnrixdcxspmczbxi/logs/edge-functions

Select: execute-agent
Filter by: Last hour
```

### Common Issues

**Issue: "Integration not configured"**
- Solution: Make sure you added the integration in "Manage Integrations"
- Check integration is marked as "active"

**Issue: "Invalid credentials"**
- Solution: Verify API key is correct
- Check API key has required permissions
- For OAuth: Ensure token is not expired

**Issue: "Action not supported"**
- Solution: Check action name matches integration definition
- See `src/lib/types/integrations.ts` for available actions

**Issue: OAuth token expired**
- Solution: Regenerate refresh token
- For Gmail/Google Sheets: Use OAuth Playground to get new token

---

## Testing Checklist

### Phase 1: Basic Tests
- [ ] OpenAI - Generate text
- [ ] SendGrid - Send email
- [ ] Slack - Send message
- [ ] Stripe - Create customer
- [ ] Webhook - HTTP request

### Phase 2: OAuth Integrations
- [ ] Gmail - Read emails
- [ ] Gmail - Send email
- [ ] Google Sheets - Append row
- [ ] LinkedIn - Create post

### Phase 3: Complex Workflows
- [ ] Multi-step agent (fetch → process → action)
- [ ] Variable substitution
- [ ] Context passing between steps
- [ ] Error handling

### Phase 4: Business Templates
- [ ] Email Summarizer template
- [ ] Payment Success Tracker template
- [ ] Customer Onboarding template
- [ ] Invoice Generator template

---

## Integration Status

| Integration | Status | Test Priority | Notes |
|------------|--------|---------------|-------|
| OpenAI | ✅ Ready | HIGH | Core AI functionality |
| Anthropic | ✅ Ready | MEDIUM | Alternative AI |
| SendGrid | ✅ Ready | HIGH | Email delivery |
| Gmail | ✅ Ready | HIGH | OAuth setup needed |
| Slack | ✅ Ready | HIGH | Team notifications |
| Discord | ✅ Ready | LOW | Gaming/community |
| Telegram | ✅ Ready | LOW | Messaging |
| Twilio | ✅ Ready | MEDIUM | SMS alerts |
| Notion | ✅ Ready | MEDIUM | Documentation |
| Google Sheets | ✅ Ready | HIGH | Data logging |
| Airtable | ✅ Ready | HIGH | Database |
| HubSpot | ✅ Ready | HIGH | CRM |
| Mailchimp | ✅ Ready | MEDIUM | Email marketing |
| Twitter | ⚠️ Ready* | LOW | *Simplified auth |
| LinkedIn | ⚠️ Ready* | LOW | *OAuth needed |
| Stripe | ✅ Ready | HIGH | Payments |
| Shopify | ✅ Ready | MEDIUM | E-commerce |
| Webhook | ✅ Ready | HIGH | Universal |

---

## Next Steps

1. **Start with HIGH priority integrations**
2. **Test one integration at a time**
3. **Create simple test agents first**
4. **Then test complex multi-step agents**
5. **Deploy to production when ready**

---

## Support Resources

- **Integration Code:** `supabase/functions/_shared/integrations.ts`
- **Integration Definitions:** `src/lib/types/integrations.ts`
- **Edge Function Logs:** Supabase Dashboard
- **Implementation Guide:** `INTEGRATION_IMPLEMENTATION_GUIDE.md`

---

**Ready to test?** Start with SendGrid or Slack - they're the easiest to set up! 🚀

