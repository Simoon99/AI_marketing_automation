# 🚀 Agent Engine - Quick Start (5 Minutes)

Get your AI Agent Engine running in 5 minutes!

---

## ✅ Step 1: Run Database Migration (30 seconds)

```bash
# Option A: Using Supabase CLI
npx supabase db push

# Option B: Via Supabase Dashboard
# 1. Go to https://app.supabase.com/project/_/sql/new
# 2. Copy contents of supabase/migrations/20241002_agents_schema.sql
# 3. Click "Run"
```

---

## ✅ Step 2: Deploy Edge Functions (1 minute)

```bash
# Login and link (first time only)
npx supabase login
npx supabase link

# Deploy functions
npx supabase functions deploy create-agent
npx supabase functions deploy execute-agent
```

---

## ✅ Step 3: Add OpenAI API Key (30 seconds)

```bash
npx supabase secrets set OPENAI_API_KEY=sk-your-key-here
```

💡 **Don't have an OpenAI key?** Get one at https://platform.openai.com/api-keys

---

## ✅ Step 4: Start Your App (30 seconds)

```bash
npm run dev
```

Navigate to http://localhost:3000/dashboard/agents

---

## ✅ Step 5: Create Your First Agent (2 minutes)

### Option A: Use a Template
1. Scroll to **"Agent Templates"**
2. Click any template card (e.g., "Email Summarizer")
3. The prompt auto-fills in the textarea
4. Click the blue arrow button (or press Ctrl+Enter)
5. Wait ~10 seconds for AI to generate it
6. Find your agent in "Your Agents" section
7. Click **"Run Now"** to test it!

### Option B: Custom Prompt
1. Type in the large textarea:
   ```
   Create an agent that sends me a fun fact every day at 9 AM
   ```
2. Click the blue arrow button (or press Ctrl+Enter)
3. Wait ~10 seconds for AI to generate it
4. Find your agent in "Your Agents" section
5. Click **"Run Now"** to test it!

---

## 🎉 Done!

You now have a working AI Agent Engine!

### What You Can Do Now:

- ✅ Create agents from natural language
- ✅ Execute agents manually
- ✅ View execution logs
- ✅ Pause/resume agents
- ✅ Delete agents

### Coming Soon:

- ⏰ Scheduled execution (cron jobs)
- 🔗 Webhook triggers
- 📧 Gmail integration
- 💬 Slack integration
- 🐦 Twitter monitoring

---

## 📖 Next Steps

- **Read full setup guide**: `AGENT_ENGINE_SETUP.md`
- **View architecture**: `AGENT_ENGINE_ARCHITECTURE.md`
- **Try example prompts**: See setup guide for ideas

---

## ⚠️ Troubleshooting

**"Failed to create agent"**
- Check that OPENAI_API_KEY is set: `npx supabase secrets list`
- Verify OpenAI account has credits

**"Unauthorized"**
- Make sure you're logged in to your app
- Check Supabase URL/ANON_KEY in .env.local

**Need help?**
- Check Edge Function logs in Supabase Dashboard
- See `AGENT_ENGINE_SETUP.md` for detailed troubleshooting

---

## 💰 Costs

- **Database**: Free (Supabase free tier)
- **Edge Functions**: Free (2M invocations/month)
- **OpenAI API**: ~$0.01-0.05 per agent created, ~$0.01-0.10 per execution with LLM

**Typical monthly cost**: $5-20 for 20-50 agents

