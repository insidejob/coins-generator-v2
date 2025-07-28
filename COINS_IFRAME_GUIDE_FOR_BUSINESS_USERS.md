# COINS Iframe Guide for Business Users

## 🚀 Quick Answer Box

**Background dimmed?** → Use `Checkpoint 13: SYS: Switch to Dialog Frame`  
**Search boxes above table?** → Use `Checkpoint 29: SYS: Switch to getFrame + active inlineframe`  
**Just a plain table?** → Use `Checkpoint 4: SYS: Switch to getFrame`  
**Closing a pop-up?** → Use `SYS: Switch to parent frame` (goes back one level)

---

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

## 🎯 Super Quick Checkpoint Finder

```
START HERE
    │
    ▼
Did you just close a pop-up or cancel something?
    │
    ├─── YES ──→ Use: SYS: Switch to parent frame
    │
    └─── NO ───→ Continue
                    │
                    ▼
            Is the background dimmed/grayed out?
                    │
                    ├─── YES ──→ Use: Checkpoint 13: SYS: Switch to Dialog Frame
                    │
                    └─── NO ───→ Continue
                                    │
                                    ▼
                            Can you type in boxes above the table?
                                    │
                                    ├─── YES ──→ Use: Checkpoint 29: SYS: Switch to getFrame + active inlineframe
                                    │
                                    └─── NO ───→ Use: Checkpoint 4: SYS: Switch to getFrame
```

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

### 4️⃣ Going Back (Parent Frame)

**When to use parent frame switching:**

```
You were in a pop-up → You closed it → Need to go back
                    ↓
        Use: SYS: Switch to parent frame
```

**Common scenarios:**
- After clicking "Cancel" in a pop-up
- After saving and closing a form
- When returning from a nested screen
- After any "back" navigation

**Visual example:**
```
Before:                          After Cancel:
┌─ Pop-up ──────┐               Main Screen
│ [Save][Cancel]│ → Click →     (Need parent frame
└───────────────┘   Cancel       to get back here)
```

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

### ❌ Problem: "None of the standard methods work"

**Emergency Troubleshooting:**

1. **Take a screenshot** of what you see
2. **Note these details:**
   - What module are you in? (House Sales, Payroll, etc.)
   - What are you trying to click? (button, link, field)
   - What happened just before? (filtered, saved, opened popup)

3. **Try the Universal Recovery:**
```
// Close all popups
Click on "Cancel" or press ESC
Wait 2 seconds

// Return to main menu
Click on module name in menu
Wait 2 seconds

// Start your journey again with correct frame
SYS: Switch to getFrame
```

4. **If still stuck, try each checkpoint:**
```
First try: Checkpoint 4: SYS: Switch to getFrame
If that fails: Checkpoint 29: SYS: Switch to getFrame + active inlineframe  
If that fails: Checkpoint 13: SYS: Switch to Dialog Frame
```

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

### 🛠️ Easy Way to Find Which Frame You Need

#### Method 1: The Copy Test (Simplest)

1. **Try to copy text** from the table:
   - Right-click on any text in the table
   - Select "Copy"
   
**If you CAN copy:** Simple table → Use `getFrame`  
**If you CAN'T copy:** Complex grid → Use `getFrame + active inlineframe`

#### Method 2: The DevTools Method

1. **Press F12** to open DevTools
2. **Click the Elements tab**
3. **Press Ctrl+F** (or Cmd+F on Mac) to search
4. **Search for:** `iframe`
5. **Count how many results** you see

```
2 iframes found → Use: getFrame only
4 iframes found → Use: getFrame + active inlineframe
```

#### Method 3: Visual Check for Beginners

Just answer these questions:

1. **Is there a gray/dimmed background?**
   - YES → It's a pop-up → Use `Dialog Frame`
   - NO → Continue to question 2

2. **Are there empty boxes above the table where I can type?**
   - YES → It's a filtered grid → Use `getFrame + active inlineframe`
   - NO → It's a simple table → Use `getFrame`

---

## Library Checkpoints

COINS has pre-built checkpoints that handle complex frame switching for you:

### Common Library Checkpoints:

| Checkpoint Name | What It Does | When to Use |
|----------------|--------------|-------------|
| `SYS: Switch to getFrame` | Goes to main working area | After module navigation |
| `SYS: Switch to Dialog Frame` | Enters pop-up windows | When pop-up opens |
| `SYS: Switch to Desktop Frame` | Enters nested pop-ups | Pop-up inside pop-up |
| `SYS: Switch to parent frame` | Goes back one level | After closing something |
| `SYS: Switch to getFrame + active inlineframe` | Complex grid access | Filtered search tables |

### Why Use Library Checkpoints?

Library checkpoints handle multiple steps for you. For example, `SYS: Switch to Dialog Frame` actually does:
- Switch to parent frame (multiple times)
- Find the dynamic pop-up frame
- Navigate to the correct window

**Always prefer library checkpoints** over manual frame switching!

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

### Returning from Pop-up:
```
// In a pop-up form
Click on "Cancel"
SYS: Switch to parent frame  // Go back to main screen
// Now you can interact with the main screen again
```

### Complex Navigation (Multiple Levels):
```
// Open first pop-up
Click on "New Reservation"
SYS: Switch to Dialog Frame

// Open nested pop-up (like Add Choice)
Click on "Add Choice"
SYS: Switch to Desktop Frame

// Close nested pop-up
Click on "Cancel"
SYS: Switch to parent frame  // Back to first pop-up

// Close first pop-up
Click on "Cancel"
SYS: Switch to parent frame  // Back to main screen
```

---

Remember: If you can type to search above a table, you need the complex pattern. Everything else is simple!