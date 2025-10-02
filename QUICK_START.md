# 🚀 Quick Start - n8n Railway Integration

## ⚡ You're Almost Done! Just 3 Steps:

---

### **STEP 1: Complete n8n Setup (2 minutes)**

1. Open this URL in your browser:
   ```
   https://n8n-production-32c14.up.railway.app
   ```

2. You'll see "Set up owner account" form
3. Fill in your details and create password
4. Click "Next" - Done! ✅

---

### **STEP 2: Get API Key (1 minute)**

1. In n8n, click **Settings** (bottom left gear icon)
2. Click **"API"** in the menu
3. Click **"Create API Key"**
4. Name it: `Marketing App`
5. **COPY THE KEY** 📋 (you need it for Step 3!)

---

### **STEP 3: Configure (2 minutes)**

#### A. Update Your App:

Open `.env.local` file and replace the API key:
```bash
NEXT_PUBLIC_N8N_BASE_URL=https://n8n-production-32c14.up.railway.app
NEXT_PUBLIC_N8N_API_KEY=YOUR_API_KEY_FROM_STEP_2_HERE
```

#### B. Update Railway (Important for Embedding!):

Go to Railway → Click your n8n service → **Variables** tab

Add these ONE BY ONE (click "Add Variable" for each):

```
Variable Name: N8N_SECURITY_CORS_ALLOW_ORIGIN
Value: http://localhost:3000,https://your-production-domain.com
```

```
Variable Name: N8N_SECURITY_FRAME_ANCESTORS
Value: http://localhost:3000,https://your-production-domain.com
```

```
Variable Name: N8N_SECURITY_X_FRAME_OPTIONS
Value: SAMEORIGIN
```

```
Variable Name: N8N_API_ENABLED
Value: true
```

```
Variable Name: N8N_PROTOCOL
Value: https
```

```
Variable Name: N8N_HOST
Value: n8n-production-32c14.up.railway.app
```

```
Variable Name: WEBHOOK_URL
Value: https://n8n-production-32c14.up.railway.app/
```

**After adding all variables, Railway will restart your n8n (wait ~2 minutes)**

---

## ✅ Done! Now Test It:

1. Restart your app dev server (it's already running)
2. Open: http://localhost:3000/dashboard/agents
3. You should see the **full n8n editor embedded!** 🎉

---

## 🐛 Not Working?

### **Iframe Blocked?**
- Make sure Railway variables are added (Step 3B)
- Wait for Railway to restart (check Railway logs)
- Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### **"Not Connected" Message?**
- Check `.env.local` has correct API key (Step 3A)
- Verify API key in n8n Settings → API
- Restart your dev server: `npm run dev`

### **n8n Not Loading?**
- Check Railway deployment is healthy (green checkmark)
- Open n8n URL directly to verify it works
- Check Railway logs for errors

---

## 🎯 What's Next?

1. **Create First Workflow**: Click "Add first step" in n8n
2. **Test Automation**: Try a simple trigger → action flow
3. **Explore Integrations**: Browse 400+ available nodes
4. **Add Multi-Tenancy**: See `MULTI_TENANT_N8N_ARCHITECTURE.md`

---

## 📝 Important URLs:

- **Your n8n**: https://n8n-production-32c14.up.railway.app
- **Your App**: http://localhost:3000/dashboard/agents
- **Railway Dashboard**: https://railway.app/dashboard
- **n8n Docs**: https://docs.n8n.io/

---

**That's it! You now have a fully self-hosted n8n with complete embedding support!** 🚀

