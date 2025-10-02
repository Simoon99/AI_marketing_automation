# 🎯 Agent Template Configuration Guide

## What's New

Templates now open a **configuration view** instead of just auto-filling the prompt. This lets users customize agent parameters before creation!

---

## 🎨 New User Flow

### Old Flow (Before)
```
1. Click template
2. Prompt auto-fills
3. Click arrow to create
4. Agent created
```

### New Flow (Now)
```
1. Click template
2. Configuration view opens
3. Fill in parameters (email, times, etc.)
4. Click "Create Agent"
5. Agent created with custom settings
```

---

## 🔧 How It Works

### Step 1: Click Template

User clicks any template card (e.g., "Email Summarizer")

### Step 2: Configuration View Opens

Shows:
- **Agent icon and name** at the top
- **Description** of what it does
- **Info box** explaining what to do
- **Parameter forms** for all customizable settings
- **Create Agent** button at bottom

### Step 3: Fill Parameters

Each template has different parameters:

**Email Summarizer:**
- Email Address (required)
- Schedule Time (required)
- Top Emails Count (required)

**Social Media Monitor:**
- Social Platform (dropdown)
- Brand Name (required)
- Check Frequency (dropdown)
- Notification Channel (dropdown)
- Alert Condition (dropdown)

**Lead Qualifier:**
- Webhook URL (required)
- Scoring Criteria (required)
- Minimum Score (required)
- CRM System (dropdown)

And so on...

### Step 4: Create Agent

- Click "Create Agent" button
- System validates all required fields
- Replaces `{{placeholders}}` in prompt with actual values
- Sends to AI for agent generation
- Agent appears in "Your Agents"

---

## 📋 Parameter Types

### Text Input
```typescript
{
  type: 'text',
  placeholder: 'Your Brand',
  required: true,
}
```
**User sees:** Standard text input field

### Email Input
```typescript
{
  type: 'email',
  placeholder: 'your@email.com',
  required: true,
}
```
**User sees:** Email input with validation

### Number Input
```typescript
{
  type: 'number',
  defaultValue: '5',
  required: true,
}
```
**User sees:** Number input field

### Time Picker
```typescript
{
  type: 'time',
  defaultValue: '08:00',
  required: true,
}
```
**User sees:** Time picker (HH:MM format)

### Dropdown Select
```typescript
{
  type: 'select',
  options: [
    { label: 'Gmail', value: 'Gmail' },
    { label: 'Outlook', value: 'Outlook' },
  ],
  defaultValue: 'Gmail',
}
```
**User sees:** Dropdown menu

---

## 🎨 Visual Design

### Configuration Screen Layout

```
┌─────────────────────────────────────────────────────────┐
│ [← Back]                                                │
│                                                         │
│ 📧 Configure Email Summarizer                          │
│ Daily email summaries with priority highlights         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ℹ️  Configure Your Agent                              │
│  Fill in the parameters below to customize how         │
│  your agent works. All required fields are marked      │
│  with *.                                                │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Email Address *                                  │  │
│  │ The email address to monitor                     │  │
│  │ [                                              ] │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Schedule Time *                                  │  │
│  │ What time should the agent run daily?           │  │
│  │ [08:00                                         ] │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Top Emails Count *                               │  │
│  │ How many priority emails to highlight?          │  │
│  │ [5                                             ] │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [✨ Create Agent]  [Cancel]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 How Prompts Are Generated

### Template Prompt (with placeholders)
```
Create an agent that reads my unread emails from {{email_address}} 
every day at {{schedule_time}}, categorizes them by urgency and 
importance using AI, and sends me a summary email with the top 
{{top_count}} emails I should respond to first.
```

### User Input
```
email_address: "john@example.com"
schedule_time: "08:00"
top_count: "5"
```

### Final Prompt (sent to AI)
```
Create an agent that reads my unread emails from john@example.com 
every day at 08:00, categorizes them by urgency and importance 
using AI, and sends me a summary email with the top 5 emails I 
should respond to first.
```

---

## ✅ Validation

### Required Fields
- Marked with red asterisk (*)
- Cannot create agent without filling them
- Shows error toast: "Please fill in: Email Address, Schedule Time"

### Field Validation
- **Email**: Must be valid email format
- **Number**: Must be numeric value
- **Time**: Must be valid HH:MM format
- **Select**: Pre-validated (dropdown)

---

## 🎯 All Templates with Parameters

### 1. Email Summarizer (3 params)
- Email Address (email) *
- Schedule Time (time) *
- Top Emails Count (number) *

### 2. Social Media Monitor (5 params)
- Social Platform (select) *
- Brand Name (text) *
- Check Frequency (select) *
- Notification Channel (select) *
- Alert On (select) *

### 3. Lead Qualifier (4 params)
- Webhook URL (text) *
- Scoring Criteria (text) *
- Minimum Score (number) *
- CRM System (select) *

### 4. Content Curator (4 params)
- Day of Week (select) *
- Time (time) *
- Content Source (select) *
- Delivery Method (select) *

### 5. Meeting Scheduler (3 params)
- Calendar System (select) *
- Reminder Time (select) *
- Reminder Channel (select) *

### 6. Expense Tracker (4 params)
- Email Provider (select) *
- Expense Categories (text) *
- Tracking System (select) *
- Monthly Summary (select) *

### 7. Customer Support (4 params)
- Support Channel (select) *
- Question Types (text) *
- Response Tone (select) *
- Review Channel (select) *

### 8. Competitor Tracker (6 params)
- Sources to Monitor (select) *
- Competitor Names (text) *
- Focus Areas (text) *
- Digest Frequency (select) *
- Digest Day (select) *
- Delivery Channel (select) *

---

## 💡 Benefits

### For Users
✅ **More Control**: Customize exactly how agents work
✅ **Clear Expectations**: See what parameters are needed
✅ **Validation**: Can't create misconfigured agents
✅ **Guided Setup**: Description for each parameter
✅ **Professional Feel**: Feels like a real product

### For Developers
✅ **Type-Safe**: Strong TypeScript types for parameters
✅ **Reusable**: Easy to add new templates
✅ **Maintainable**: Template definitions in one file
✅ **Extensible**: Easy to add new parameter types

---

## 🚀 Adding New Templates

### Step 1: Define Template

```typescript
{
  id: 'my-new-template',
  name: 'My New Agent',
  description: 'What this agent does',
  prompt: 'Create an agent that {{does_something}} at {{schedule_time}}',
  icon: '🚀',
  category: 'Productivity',
  color: 'from-blue-500 to-cyan-500',
  parameters: [
    {
      id: 'does_something',
      label: 'What to Do',
      type: 'text',
      placeholder: 'Enter action...',
      required: true,
      description: 'What should the agent do?',
    },
    {
      id: 'schedule_time',
      label: 'Schedule',
      type: 'time',
      defaultValue: '09:00',
      required: true,
    },
  ],
}
```

### Step 2: Add to Array

Add to `agentTemplates` array in `src/lib/agent-templates.ts`

### Step 3: Done!

Template automatically appears in UI with configuration form

---

## 🎨 Styling

### Colors
- **Configuration View**: Clean white/card background
- **Info Box**: Blue (#3B82F6) with 10% opacity
- **Required Fields**: Red asterisk
- **Buttons**: 
  - Create: Blue gradient
  - Cancel: Outline

### Spacing
- Form padding: 16px (p-4)
- Field spacing: 16px gap
- Button spacing: 12px gap

### Interactions
- **Focus**: Blue ring on inputs
- **Hover**: Border color change
- **Disabled**: Reduced opacity, cursor-not-allowed

---

## 📱 Responsive Design

### Mobile
- Full-width inputs
- Stacked buttons
- Larger touch targets

### Tablet/Desktop
- Max-width: 2xl (672px)
- Centered layout
- Side-by-side buttons

---

## 🐛 Error Handling

### Missing Required Fields
```
User clicks "Create Agent"
→ Validation fails
→ Toast: "Please fill in: Email Address, Schedule Time"
→ User fills fields
→ Validation passes
→ Agent created
```

### Invalid Values
```
User enters invalid email
→ Browser validation shows error
→ Cannot submit until fixed
```

### API Errors
```
Agent creation fails
→ Toast: "Failed to create agent"
→ User can try again
→ Configuration preserved
```

---

## 🎉 Summary

**Before**: Click template → Prompt fills → Create

**Now**: Click template → **Configure parameters** → Create

**Result**: More professional, flexible, and user-friendly! ✨

