# COINS Parent Frame Navigation Patterns

> 📌 **Internal Technical Documentation** - This document contains detailed parent frame navigation patterns for AI systems and developers. Business users should refer to the [COINS Navigation Guide](../iframe-guide/COINS_Navigation_Guide.md).

## Overview

Parent frame navigation is required when you need to access elements that exist in a higher frame context than your current position. This is common for warning dialogs, confirmation popups, and certain navigation scenarios.

## Visual Frame Hierarchy

### Example: Warning Dialog with 2x Parent Navigation
![Parent Frame Warning](../../screenshots/parent_frame_warning.png)

Frame structure visualization:
```
Root Document
└── mainarea (Blue border)
    └── getFrame (Red border) ← You are typically here
        └── [Your current content]
    
[Warning Dialog] (Purple border) ← Need to navigate UP to access this
```

## Parent Frame Navigation Patterns

### Pattern 1: Warning/Confirmation Dialogs (2x Parent)

**Visual Indicators:**
- Warning icon with message
- OK/Cancel buttons in a dialog box
- Confirmation messages overlaying content
- Delete confirmations

**Navigation Sequence:**
```javascript
// Current position: inside getFrame
Click on "Delete" button
// Warning dialog appears

// To access OK button:
SYS: Switch to parent iframe  // Up to mainarea
SYS: Switch to parent iframe  // Up to dialog level
Click on "OK"
```

**Common Scenarios:**
- Delete record confirmations
- Save warnings
- Permission dialogs
- System alerts

### Pattern 2: Complex Navigation (4x Parent)

**When using active inlineframe:**
```javascript
// Starting from deepest level
// Current: inside active inlineframe
SYS: Switch to parent iframe  // Up to inlineframe
SYS: Switch to parent iframe  // Up to getFrame
SYS: Switch to parent iframe  // Up to mainarea
SYS: Switch to parent iframe  // Up to root/dialog level
```

**Visual Breadcrumb:**
```
active inlineframe (deepest)
    ↑ parent (1)
inlineframe
    ↑ parent (2)
getFrame
    ↑ parent (3)
mainarea
    ↑ parent (4)
Root/Dialog level
```

### Pattern 3: Desktop Frame Alternative

The Desktop Frame checkpoint actually performs parent navigation internally:
```javascript
// What "SYS: Switch to Desktop Frame" does:
Switch to parent iframe  // 1st level up
Switch to parent iframe  // 2nd level up  
Switch to parent iframe  // 3rd level up (root)
Switch iframe to "//*[starts-with(@id, 'frameID')]/iframe"
// Then navigates back down to getFrame
```

## Visual Cues for Parent Frame Requirements

### Indicators You Need Parent Navigation:

1. **Dialog Boxes Over Content**
   - Element appears but can't be clicked
   - Visual overlay on main content
   - Buttons seem "unreachable"

2. **Frame Boundary Issues**
   - DevTools shows element outside current iframe
   - Click events don't register
   - Element visible but not interactive

3. **Common UI Elements Requiring Parent Navigation:**
   - ❌ Cancel buttons in warnings
   - ✓ OK buttons in confirmations
   - 🗑️ Delete confirmations
   - 💾 Save warnings
   - 🔒 Permission dialogs

## Technical Implementation Details

### Detecting Need for Parent Navigation

```javascript
// Check if element is in current frame
function isElementInCurrentFrame(selector) {
  try {
    const element = document.querySelector(selector);
    return element !== null;
  } catch (e) {
    return false;
  }
}

// If element not found in current frame, try parent
if (!isElementInCurrentFrame('button.ok-button')) {
  // Need parent frame navigation
}
```

### Frame Hierarchy Verification

```javascript
// Log current frame path
function logFramePath() {
  let path = [];
  let currentWindow = window;
  
  while (currentWindow !== window.top) {
    const frameName = currentWindow.frameElement?.name || 
                      currentWindow.frameElement?.id || 
                      'unnamed';
    path.unshift(frameName);
    currentWindow = currentWindow.parent;
  }
  
  console.log('Current path:', path.join(' > '));
}
```

## Common Patterns by Module

### Payroll Module
- Employee deletion confirmations: 2x parent
- Pension warnings: 2x parent
- Bulk update confirmations: 2x parent

### Purchase Ledger
- Invoice deletion: 2x parent
- Often starts in extended pattern (getFrame + active inlineframe)
- May need 4x parent for confirmations

### General Ledger
- Transaction reversals: 2x parent
- Period close warnings: 2x parent

## Best Practices

1. **Visual Recognition First**
   - Look for overlay dialogs
   - Check if buttons are clickable
   - Note visual hierarchy

2. **Start Conservative**
   - Try 2x parent first
   - Add more if needed
   - Use DevTools to verify

3. **Return Path**
   - After dialog action, may need to re-establish frame context
   - Usually returns to getFrame automatically
   - Verify position after action

## Troubleshooting

### "Element Not Found" After Parent Navigation
- You may have gone too far up
- Try fewer parent switches
- Use DevTools to inspect frame hierarchy

### "Can See But Can't Click"
- Classic sign of frame boundary issue
- Element is in parent frame
- Apply parent navigation pattern

### Visual Debugging
1. Use browser DevTools
2. Highlight iframe borders
3. Check element's frame context
4. Count frame levels visually

## Frame Navigation Breadcrumbs

### Standard 2x Parent (Most Common)
```
getFrame → mainarea → Dialog
   ↑           ↑
parent(1)  parent(2)
```

### Extended 4x Parent (From Active Inline)
```
active → inline → getFrame → mainarea → Dialog
   ↑        ↑         ↑          ↑
parent(1) parent(2) parent(3) parent(4)
```

### Quick Reference Decision Tree
```
Can you see the element?
    ↓ YES
Can you click it?
    ↓ NO
Is it a dialog/warning?
    ↓ YES
Use: 2x parent navigation
    ↓ Still can't click?
Are you in active inlineframe?
    ↓ YES
Use: 4x parent navigation
```

## Related Documentation
- [COINS Iframe Patterns](./COINS_IFRAME_PATTERNS.md) - General iframe patterns
- [Visual Troubleshooting Guide](./COINS_IFRAME_VISUAL_TROUBLESHOOTING.md) - Debugging frame issues
- [Error Handling Guide](./COINS_IFRAME_ERROR_HANDLING_GUIDE.md) - Frame-related errors