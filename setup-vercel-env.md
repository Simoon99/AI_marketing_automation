# 🚀 Quick CLI Setup for Vercel Environment Variables

## Step 1: Get Your Supabase Credentials

First, get your credentials from Supabase:

**Option A:** From your local `.env.local` file (if you have one)
**Option B:** From Supabase dashboard: https://app.supabase.com/project/_/settings/api

You need:
- **Project URL** (starts with `https://`)
- **anon/public key** (starts with `eyJhbG...`)

---

## Step 2: Run These Commands

Copy your Supabase URL and anon key, then run:

```bash
# Add SUPABASE_URL to production
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production

# When prompted, paste your Supabase URL (e.g., https://xxxxx.supabase.co)
# Press Enter

# Add SUPABASE_ANON_KEY to production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# When prompted, paste your Supabase anon key
# Press Enter
```

---

## Step 3: Add to Preview and Development (Optional but Recommended)

```bash
# Add to preview environment
npx vercel env add NEXT_PUBLIC_SUPABASE_URL preview
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview

# Add to development environment
npx vercel env add NEXT_PUBLIC_SUPABASE_URL development
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
```

---

## Step 4: Verify Variables Were Added

```bash
npx vercel env ls
```

You should see both variables listed for production.

---

## Step 5: Redeploy to Production

```bash
npx vercel --prod --yes
```

This will rebuild and deploy with the new environment variables!

---

## ✅ Done!

Your production app should now work without the "supabaseUrl is required" error.

Test it at: https://ai-marketing-automation-l5dciawsj-simoon99s-projects.vercel.app/dashboard

