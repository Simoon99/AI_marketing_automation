# 🎨 Agent Engine UI - Visual Guide

## Main Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                    What should we build today?                      │
│                                                                     │
│            Create intelligent agents by chatting with AI.           │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  Type your idea and we'll build it together.               │   │
│  │                                                             │   │
│  │  Example: Create an agent that monitors my Gmail...        │   │
│  │                                                             │   │
│  │                                              [+] Attach [↑] │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                 Press Ctrl + Enter to create                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ✨ Agent Templates                                                 │
│                                                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │  📧  │  │  🐦  │  │  🎯  │  │  📚  │  │  📅  │  │  💰  │      │
│  │Email │  │Social│  │ Lead │  │Content  │Meeting│  │Expense      │
│  │Summ. │  │Monitor│ │Qual. │  │Curator│  │Sched.│  │Track│      │
│  │      │  │      │  │      │  │      │  │      │  │      │      │
│  │Produc│  │Market│  │Sales │  │Research Research│  │Finance      │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘      │
│                                                                     │
│  ┌──────┐  ┌──────┐                                                │
│  │  💬  │  │  🔍  │                                                │
│  │Support  │Compet│                                                │
│  │Assist│  │Track │                                                │
│  │      │  │      │                                                │
│  │Support │Research                                                │
│  └──────┘  └──────┘                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  🤖 Your Agents (3)                                                 │
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                   │
│  │ 🤖 ✅      │  │ 🤖 ✅      │  │ 🤖 ⭕      │                   │
│  │            │  │            │  │            │                   │
│  │Email Sum.  │  │Twitter Mon.│  │Lead Scorer │                   │
│  │Daily summaries Twitter mentions │ Auto-qualify leads            │
│  │            │  │            │  │            │                   │
│  │⏰ Scheduled │  │⏰ Scheduled │  │⚡ Webhook │                   │
│  │            │  │            │  │            │                   │
│  │[▶ Run Now] │  │[▶ Run Now] │  │[▶ Run Now] │                   │
│  └────────────┘  └────────────┘  └────────────┘                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Color Palette

### Primary Colors
```
Hero Text:      Gradient (foreground → foreground/70)
Background:     Gradient (background → muted/20)
Cards:          bg-card with border
Accent:         Blue (#3B82F6)
```

### Status Colors
```
Active:     🟢 Green (#10B981)
Paused:     ⚪ Gray (#6B7280)
Failed:     🔴 Red (#EF4444)
Running:    🔵 Blue (#3B82F6)
```

### Template Gradients
```
Email Summarizer:    Blue → Cyan
Social Monitor:      Purple → Pink
Lead Qualifier:      Green → Emerald
Content Curator:     Orange → Amber
Meeting Scheduler:   Indigo → Purple
Expense Tracker:     Teal → Cyan
Support Assistant:   Rose → Pink
Competitor Tracker:  Violet → Purple
```

---

## Component Breakdown

### 1. Hero Section
```typescript
<div className="hero-section">
  <h1>What should we build today?</h1>
  <p>Create intelligent agents by chatting with AI.</p>
  
  <textarea 
    placeholder="Type your idea..."
    className="large-prompt-input"
  />
  
  <button className="create-button">
    <ArrowUp />
  </button>
</div>
```

**Visual**:
- Large (5xl-6xl) heading
- Muted subtitle
- 160px min-height textarea
- Floating action button (bottom-right)
- Rounded corners (2xl)

---

### 2. Template Card
```typescript
<button className="template-card">
  <div className="gradient-overlay" />
  <div className="icon">📧</div>
  <h3>Email Summarizer</h3>
  <p>Daily email summaries with priority highlights</p>
  <span className="category">Productivity</span>
</button>
```

**Visual**:
- Card: bg-card, rounded-xl
- Icon: 3xl emoji
- Title: semibold, sm
- Description: xs, 2-line clamp
- Category badge: muted background
- Hover: gradient overlay (5% opacity)

---

### 3. Agent Card
```typescript
<div className="agent-card" onClick={viewDetails}>
  <div className="header">
    <Bot /> <CheckCircle2 />
    <div className="actions">
      <Button><Pause /></Button>
      <Button><Trash2 /></Button>
    </div>
  </div>
  
  <h3>Agent Name</h3>
  <p>Description...</p>
  
  <div className="meta">
    <Clock /> Scheduled
  </div>
  
  <Button>Run Now</Button>
</div>
```

**Visual**:
- Card: bg-card, rounded-xl
- Icons: 5px size
- Actions: visible on hover
- Run button: full width, sm
- Hover: purple border, shadow

---

### 4. Agent Details View
```typescript
<div className="details-view">
  <header>
    <Button>← Back</Button>
    <h2><Bot /> Agent Name</h2>
    <Button>Run Now</Button>
  </header>
  
  <div className="stats-grid">
    <Card>Status: Active</Card>
    <Card>Trigger: Scheduled</Card>
  </div>
  
  <Card>
    <h3>Original Prompt</h3>
    <p>...</p>
  </Card>
  
  <Card>
    <h3>Execution History</h3>
    <ExecutionList />
  </Card>
</div>
```

**Visual**:
- Full height layout
- Border-bottom header
- 2-column stats grid
- Scrollable content area
- Execution list with status icons

---

## Interaction States

### Hover Effects

**Template Cards**
```
Normal:  border-border
Hover:   border-blue-500/50 + shadow-lg + gradient-overlay
```

**Agent Cards**
```
Normal:  border-border + hidden actions
Hover:   border-purple-500/50 + shadow-lg + visible actions
```

**Buttons**
```
Primary:   bg-blue-600 → bg-blue-700
Secondary: border-border → border-muted
```

### Loading States

**Creating Agent**
```
Button: [Spinner] Creating Agent...
Textarea: disabled, cursor-not-allowed
```

**Executing Agent**
```
Button: [Spinner] (no text)
Card: opacity-70
```

### Success/Error States

**Toast Notifications**
```
Success: ✅ Agent "Name" created successfully!
Error:   ❌ Failed to create agent
```

---

## Responsive Breakpoints

### Mobile (< 768px)
```
- Single column layout
- Stacked template cards
- Full-width prompt
- Larger touch targets
```

### Tablet (768px - 1024px)
```
- 2 column grid for templates
- 2 column grid for agents
- Side-by-side stats
```

### Desktop (> 1024px)
```
- 4 column grid for templates
- 3 column grid for agents
- Max-width constraints (6xl)
```

---

## Keyboard Shortcuts

```
Ctrl + Enter    Create agent from prompt
Escape          Close details view
Tab             Navigate between elements
```

---

## Accessibility

### ARIA Labels
```html
<button aria-label="Create agent from prompt">
  <ArrowUp />
</button>

<button aria-label="Run agent now">
  <Play /> Run Now
</button>

<div role="status" aria-live="polite">
  Creating agent...
</div>
```

### Focus States
```css
focus:outline-none
focus:ring-2
focus:ring-blue-500
```

---

## Animation Timing

```
Hover transitions:     200ms ease
Status changes:        300ms ease
Loading spinners:      Continuous rotation
Card entrance:         Fade + slide (150ms)
Toast notifications:   Slide from bottom (200ms)
```

---

## Typography Scale

```
Hero:           text-5xl md:text-6xl (48px-60px)
Subtitle:       text-lg (18px)
Section:        text-xl (20px)
Card title:     text-sm (14px)
Description:    text-xs (12px)
Meta info:      text-xs (12px)
```

---

## Spacing System

```
Hero padding:         pt-12 pb-8 (48px, 32px)
Card padding:         p-4 (16px)
Grid gap:             gap-4 (16px)
Section spacing:      space-y-8 (32px)
Max width (hero):     max-w-4xl (56rem)
Max width (content):  max-w-6xl (72rem)
```

---

## Icon Usage

```
Hero:           Sparkles (yellow)
Templates:      Emoji (3xl)
Agents:         Bot (purple)
Status:         CheckCircle2, XCircle, Loader2
Actions:        Play, Pause, Trash2
Meta:           Clock
Submit:         ArrowUp
```

---

This UI is **production-ready** and follows modern design principles! 🎨✨

