# COINS Iframe Guide for Business Users

## 📋 Table of Contents

1. [What Are COINS Windows?](#what-are-coins-windows)
2. [The One Rule You Need](#the-one-rule-you-need)
3. [How to Identify Different COINS Screens](#how-to-identify-different-coins-screens)
4. [Common Problems and Solutions](#common-problems-and-solutions)
5. [Step-by-Step Troubleshooting](#step-by-step-troubleshooting)
6. [Quick Reference Card](#quick-reference-card)

---

## What Are COINS Windows?

COINS displays information in different "windows" (technically called frames). Think of them like layers:

```
Your Browser Window
  └── COINS Container
      └── COINS Working Area (where you do most work)
          └── COINS Data Grid (only for filtered searches)
              └── COINS Pop-up Window (for forms and dialogs)
```

You need to tell Virtuoso which window to look in - that's what these "Switch to" commands do.

---

## The One Rule You Need

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Can you TYPE to SEARCH above the table?           │
│                                                     │
│  YES → Use the complex pattern (Data Grid)         │
│  NO  → Use the simple pattern (Working Area)       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

That's it! This one question solves 90% of iframe issues.

---

## How to Identify Different COINS Screens

### 1️⃣ Simple Browse Table (Most Common)

**What it looks like:**
```
Human Resources
├─ [Add] [Edit] [Delete]        ← Just buttons
├─ Code │ Description │ Type    ← Just headers
├─ PW   │ Personnel WB │ WB     ← Just data
└─ TW   │ Training WB  │ WB

❌ NO search boxes above the table
```

**What to use:** `SYS: Switch to getFrame` (COINS Working Area)

**Examples:**
- HR Personnel list
- System User list
- Basic module menus
- Chart of Accounts

### 2️⃣ Filtered Grid (Search Tables)

**What it looks like:**
```
House Sales - Plots
├─ [Add] [Edit] [Delete]                    
├─ Job: [___] Phase: [___] [Search] 🔍      ← SEARCH BOXES!
├─ Job │ Phase │ Plot │ Status              
├─ 128 │ 001   │ 099  │ Available           
└─ 128 │ 001   │ 100  │ Reserved

✅ HAS search/filter boxes above the table
```

**What to use:** `SYS: Switch to getFrame + active inlineframe` (Working Area + Data Grid)

**Examples:**
- House Sales plot search
- Invoice selection with date filters
- Employee search with name filter
- Any screen where you type to search

### 3️⃣ Pop-up Windows (Forms & Dialogs)

**What it looks like:**
```
Background dims ░░░░░░░░░░░░░░
┌─ New Reservation ──[X]─┐
│ Name: [_____________]   │
│ Email: [____________]   │
│ [Save] [Cancel]         │
└─────────────────────────┘
```

**What to use:** `SYS: Switch to Dialog Frame` (COINS Pop-up Window)

**Examples:**
- New Reservation form
- Edit screens
- Add new record dialogs

---

## Common Problems and Solutions

### ❌ Problem: "I can see it but can't click it"

**Quick Fix:**
1. Look above the table - are there search boxes?
2. If YES → Add `+ active inlineframe` to your frame switch
3. If NO → Make sure you have `SYS: Switch to getFrame`

### ❌ Problem: "Element not found but I can see it"

**Quick Fix:**
```
// Add a wait before switching frames
Click on "New Reservation"
Wait 2 seconds  // Give COINS time to load
SYS: Switch to Dialog Frame
```

### ❌ Problem: "It worked before but stopped working"

**Common Causes:**
- You just filtered a table (need to re-establish frame)
- You saved a form (need to re-establish frame)
- COINS is running slowly (add more waits)

---

## Step-by-Step Troubleshooting

### 🔍 When Something Isn't Working:

**Step 1: Identify What You See**
```
What type of screen am I on?
├── A table/list → Go to Step 2
├── A pop-up form → Use Dialog Frame
└── Can't tell → Check the URL
```

**Step 2: Check for Search Boxes**
```
Can I type above the table to search?
├── YES → Use: getFrame + active inlineframe
└── NO → Use: getFrame only
```

**Step 3: Add Waits If Needed**
```
If still not working:
├── Add "Wait 2 seconds" after clicks
├── Add "Look for element X" to verify
└── Try closing and reopening
```

### 🛠️ How to Check Frame Structure Yourself

1. **Right-click** on the element you want
2. Select **"Inspect"**
3. Look at the breadcrumb at bottom of DevTools:

```
If you see:
mainarea > getFrame > YOUR ELEMENT
→ Use simple pattern

If you see:
mainarea > getFrame > inlineframe > getFrame > YOUR ELEMENT
→ Use complex pattern
```

---

## Quick Reference Card

### For Tables and Lists

| If you see... | Use this... |
|--------------|-------------|
| Just a table with data | `SYS: Switch to getFrame` |
| Table with search boxes above | `SYS: Switch to getFrame + active inlineframe` |
| Table after filtering | Re-apply the complex switch |

### For Pop-ups and Forms

| If you see... | Use this... |
|--------------|-------------|
| Background dims + pop-up | `SYS: Switch to Dialog Frame` |
| Pop-up inside a pop-up | `SYS: Switch to Desktop Frame` |
| After saving in pop-up | Re-apply Dialog Frame |

### Recovery Steps

| When things go wrong... | Try this... |
|------------------------|-------------|
| Can see but can't click | Check if you need complex frame |
| Element not found | Add waits before frame switch |
| Random failures | Re-establish frame after actions |
| Completely stuck | Close pop-ups and start over |

---

## 💡 Golden Rules

1. **Start Simple** - Most COINS screens only need `getFrame`
2. **Look for Search Boxes** - They're the key indicator
3. **Add Waits** - COINS needs time to load
4. **Re-establish After Actions** - Saves and navigations reset frames
5. **When in Doubt** - Close everything and start fresh

---

## Examples You Can Copy

### Simple Table Click:
```
Click on "Human Resources"
SYS: Switch to getFrame
Click on row "Personnel Workbench"
```

### Filtered Search:
```
Click on "House Sales"
setMenu("%WHS1010SHCG")
SYS: Switch to getFrame + active inlineframe
setFilter("", "job_num", "128")
clickRowColumn(0, "job_jobph")
```

### Pop-up Form:
```
Click on "New Reservation"
Wait 2 seconds
SYS: Switch to Dialog Frame
Write "John Smith" in field "Name"
Click on "Save"
```

---

Remember: If you can type to search above a table, you need the complex pattern. Everything else is simple!