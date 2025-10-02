# 🚀 Vercel Environment Variables Setup

Your production deployment needs environment variables to connect to Supabase. Follow these steps:

## 📋 Required Environment Variables

You need to add these two environment variables to your Vercel project:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔑 Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **Project API keys** → **anon/public** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## ⚙️ Step 2: Add Environment Variables to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click on your project: **ai-marketing-automation**
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   
   **Variable 1:**
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: (paste your Supabase Project URL)
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

   **Variable 2:**
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: (paste your Supabase anon key)
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

### Option B: Via Vercel CLI

Run these commands in your terminal:

```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste your Supabase URL when prompted

npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste your Supabase anon key when prompted
```

---

## 🔄 Step 3: Redeploy Your Application

After adding the environment variables, you need to redeploy:

### Via Vercel Dashboard:
1. Go to your project's **Deployments** tab
2. Click the **•••** menu on the latest deployment
3. Click **Redeploy**

### Via CLI:
```bash
npx vercel --prod
```

---

## ✅ Step 4: Verify It Works

1. Open your production URL: https://ai-marketing-automation-l5dciawsj-simoon99s-projects.vercel.app
2. Navigate to `/dashboard/agents`
3. You should no longer see the "supabaseUrl is required" error

---

## 🔐 Security Note

- The `NEXT_PUBLIC_*` prefix means these variables are exposed to the browser
- These are PUBLIC keys and safe to expose
- Never commit actual values to git - only use `.env.local` locally
- The anon key has Row Level Security (RLS) policies that protect your data

---

## 📝 Quick Reference

If you ever need to check your environment variables:

```bash
# List all environment variables
npx vercel env ls

# Pull environment variables to local
npx vercel env pull .env.local
```

---

## 🆘 Troubleshooting

**Error persists after adding variables?**
1. Make sure you selected all three environments (Production, Preview, Development)
2. Verify you clicked "Save" after adding each variable
3. Redeploy the application
4. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

**Can't find your Supabase keys?**
- Go to https://app.supabase.com/project/YOUR_PROJECT/settings/api
- Replace `YOUR_PROJECT` with your actual project reference ID

---

## 🎯 Next Steps

Once the environment variables are configured:
1. ✅ Test the dashboard loads without errors
2. ✅ Try creating an agent to verify Supabase connection
3. ✅ Configure Supabase Edge Function secrets for OpenAI (see .env.local.example)

