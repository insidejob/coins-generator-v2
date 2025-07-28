# COINS Iframe Visual Troubleshooting Guide

## Quick Visual Diagnosis

### "I can see it but can't click it"

**What you see:**
```
┌──────────────────────────┐
│  [Visible Button]        │ ← Can see
│                          │ ← Can't click
└──────────────────────────┘
```

**DevTools diagnosis:**
```javascript
// In Console, try:
document.querySelector('[text="Visible Button"]')
// Returns: null (wrong frame!)

// Find which frame:
window.top.findInAllFrames('[text="Visible Button"]')
// Output: "Found in: mainarea > getFrame"
```

**Fix:** Switch to correct frame first

### "Element appears then disappears"

**What you see:**
```
Time 0s: [Element Visible] ✓
Time 1s: [               ] ✗ Gone!
```

**Visual clues:**
- Page flicker
- URL change in address bar
- Loading spinner appeared

**Fix:** Re-establish frame after the action

### "Modal is blank/not loading"

**What you see:**
```
┌─────────────────┐
│  Modal Title    │
│                 │ ← Empty!
│ [Loading...]    │
└─────────────────┘
```

**Common cause:** Switched frames too early

**Fix:**
```javascript
Click on "Open Modal"
Wait for element "Modal Title" // Wait for content
Wait 1 second // Additional safety
SYS: Switch to Dialog Frame
```

## Visual Frame Indicators Cheat Sheet

### Top-Level Indicators (No frame switch needed)
```
🏠 Home page tiles
🔐 Login screen  
📋 Module selection screen
```

### getFrame Indicators
```
📑 Left navigation menu
🔧 System menus
📊 After clicking module tile
```

### getFrame + active inlineframe Indicators
```
🔍 Filter bar at top of grid
📊 Sortable column headers
☑️ Row checkboxes
📄 Pagination controls
```

### Dialog Frame Indicators
```
🔲 Dimmed background
❌ X button in corner
💾 Save/Cancel buttons at bottom
📈 Progress bar (House Sales)
```

### Desktop Frame Indicators
```
🔳 Modal within a modal
➕ "Add Choice" inside reservation
📝 Nested form popup
```

## Visual Pattern Recognition

### Pattern: Standard Browse Screen
```
┌─────────────────────────────────┐
│ House Sales > Browse Plots      │ ← Module context
├─────────────────────────────────┤
│ [Add] [Edit] [Delete]           │ ← Action buttons  
│ Filter: [___] [___] [Search]    │ ← Filter bar
│ ┌────┬──────┬────────┬────────┐│
│ │Job │Phase │Plot    │Status  ││ ← Grid headers
│ ├────┼──────┼────────┼────────┤│
│ │128 │001   │099     │Avail   ││ ← Grid data
│ └────┴──────┴────────┴────────┘│
└─────────────────────────────────┘

Required: getFrame + active inlineframe
```

### Pattern: Modal Form
```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ← Dimmed
░┌─────────────────────────────┐░
░│ New Reservation         [X] │░ ← Title + close
░├─────────────────────────────┤░
░│ Progress: ●──○──○──○        │░ ← Progress
░│                             │░
░│ Name: [________________]    │░ ← Form fields
░│ Email: [_______________]    │░
░│                             │░
░│ [Save] [Cancel]             │░ ← Actions
░└─────────────────────────────┘░

Required: Dialog Frame
```

### Pattern: Nested Selection
```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░┌─── Primary Modal ──────────┐░
░│                            │░
░│  ┌── Nested Popup ────┐    │░
░│  │ Select Item:       │    │░
░│  │ ○ Option 1         │    │░
░│  │ ● Option 2         │    │░
░│  │ [OK] [Cancel]      │    │░
░│  └────────────────────┘    │░
░│                            │░
░└────────────────────────────┘░

Required: Desktop Frame (for nested)
```

## DevTools Visual Frame Verification

### Step 1: Identify Visual Context
```
Look at the page and identify:
□ Is there a dimmed background?
□ Is this a popup/modal?
□ Can I see a grid with filters?
□ Are there multiple panels?
```

### Step 2: Inspect Element Location
```
1. Right-click on target element
2. Select "Inspect"
3. Look at breadcrumb trail:

html > body > iframe#mainarea > #document > html > body > iframe#getFrame > #document > html > body > div.target

This shows: mainarea > getFrame is needed
```

### Step 3: Verify Current Frame in Console
```javascript
// Check where you are
console.log('Current frame:', window.name || 'top');

// Check what frames exist
Array.from(parent.document.querySelectorAll('iframe'))
  .map(f => ({name: f.name, visible: f.offsetWidth > 0}));
```

### Step 4: Visual Verification After Switch
```javascript
// After switching frames, verify visually:
document.body.style.border = '5px solid red';
// The red border shows which frame context you're in
```

## Common Visual Mismatches

### 1. "I see the grid but no data"
**Visual**: Empty grid with headers
**Cause**: Data loads in nested frame
**Fix**: Need active inlineframe

### 2. "Modal has wrong content"
**Visual**: Modal showing different form than expected
**Cause**: Previous modal not properly closed
**Fix**: Close all modals, return to main, retry

### 3. "Buttons don't match documentation"
**Visual**: Different button labels/positions
**Cause**: Different module context or permissions
**Fix**: Verify module and user role

### 4. "Can't find stage navigation buttons"
**Visual**: Missing PURCH1, RESDET buttons
**Cause**: Not in correct modal context
**Fix**: Ensure New Reservation modal is fully open

## Visual Debugging Checklist

```
□ Screenshot what you see
□ Note any dimmed backgrounds
□ Check for loading spinners
□ Look for modal X buttons
□ Identify grid vs form view
□ Check progress indicators
□ Note URL changes
□ Watch for page flickers
□ Check DevTools Console for errors
□ Verify frame hierarchy in Elements
```

This visual guide helps map what users actually see to the underlying iframe requirements, making it easier to diagnose and fix frame-related issues in COINS automation.