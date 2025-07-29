# COINS Iframe Switching Guide

## Quick Reference: When to Switch Frames

### Standard Navigation Flow

1. **Module Navigation → Grid Operations**
   ```javascript
   Click on "House Sales"
   setMenu("%WHS1010SHCG")
   SYS: Switch to getFrame + active inlineframe  // For grid access
   ```

2. **Between Grid Operations**
   ```javascript
   setFilter("", "job_num", "128")
   clickRowColumn(0, "job_jobph")
   SYS: Switch to getFrame + active inlineframe  // Re-establish
   setFilter("", "vwb_code", "099")
   clickRowColumn(0, "vwb_code")
   ```

3. **Grid → Command Bar**
   ```javascript
   clickRowColumn(0, "vwb_code")
   SYS: Switch to getFrame  // Back to command level
   Click on "New Reservation"
   ```

### Modal Dialog Flow (Desktop Frame)

**Desktop Frame is Required After:**
- Opening modal dialogs (New/Continue Reservation)
- Stage navigation buttons (PURCH1, RESDET, DISCINC, CHOICE)
- Save operations within modals
- Selection actions (Matching Person, selecting from lists)
- Action buttons (Save, Continue, Complete)
- Form-loading actions (Start Reservation)

**Desktop Frame is NOT Required:**
- Between field inputs in the same form
- After validation messages
- Between related actions in same context

### Actual Desktop Frame Implementation

```javascript
// What "SYS: Switch to Desktop Frame" actually does:
Switch to parent iframe  // 1st level up
Switch to parent iframe  // 2nd level up  
Switch to parent iframe  // Root level
Switch iframe to "//*[starts-with(@id, 'frameID')]/iframe"  // Dynamic modal frame
Look for element "mainarea" on page
Switch iframe to id "mainarea"
Look for element "getFrame" on page
Switch iframe to id "getFrame"
```

### Common Patterns

**Pattern 1: Modal Action → Frame Switch**
```javascript
Click on "PURCH1"
SYS: Switch to Desktop Frame
Write "Sur" in field input "Surname"
```

**Pattern 2: Save → Navigate → Frame Switch**
```javascript
Click on "RESDET"
keyboardShortcut("save")
SYS: Switch to Desktop Frame
```

**Pattern 3: Multiple Actions → Single Frame Switch**
```javascript
Click on "New Reservation"
Click on "Continue Reservation"
SYS: Switch to Desktop Frame  // One switch after both
```

### Frame Switch Decision Tree

```
Did you just...
├── Open a modal? → Desktop Frame
├── Click a stage button? → Desktop Frame
├── Save in a modal? → Desktop Frame
├── Select from a list? → Desktop Frame
├── Load a new form? → Desktop Frame
├── Navigate to a module? → Check if grids needed
│   └── Yes → getFrame + active inlineframe
├── Finish grid operations? → getFrame
└── Input fields only? → No switch needed
```

## Testing Checklist

When reviewing a journey without iframe switches:

1. **After each module navigation**: Add `getFrame + active inlineframe` if grids will be used
2. **Between grid operations**: Re-establish with `getFrame + active inlineframe`
3. **After grid to command bar**: Switch to `getFrame`
4. **After EVERY modal action**: Add Desktop Frame (with few exceptions)
5. **Combine actions**: Group actions before frame switches to avoid single-step checkpoints

## Common Mistakes

1. **Switching frames too early**
   - Wrong: Switch → Click button
   - Right: Click button → Switch

2. **Not re-establishing grid context**
   - Grid operations need frame re-establishment between filters/clicks

3. **Missing Desktop Frame after saves**
   - Even keyboard shortcuts in modals need frame switches

4. **Single-step checkpoints**
   - Combine related actions before switching frames