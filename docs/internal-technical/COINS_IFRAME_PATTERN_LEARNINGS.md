# COINS Iframe Pattern Learnings from Workflow Journey

> 📌 **Internal Technical Documentation** - This document captures learnings from comparing predicted vs actual iframe patterns in a workflow journey.

## Key Learnings and Pattern Corrections

### 1. ❌ **Major Miss: No active inlineframe after setFilter**

**What I predicted:**
```javascript
setFilter("", "", $wf)
SYS: Switch to getFrame + active inlineframe  // WRONG
```

**What actually happens:**
```javascript
setFilter("", "", $wf)
clickRowColumn("0", "wfp_code")
SYS: Switch to getFrame  // Just standard getFrame!
```

**Learning:** `setFilter()` does NOT automatically require active inlineframe. The grid remains accessible with just getFrame.

### 2. ✅ **Correct: Parent frame navigation for Activity Workbench**

**What I predicted = What actually happens:**
```javascript
Switch to parent iframe
Switch to parent iframe
Click on "Activity Workbench"
SYS: Switch to getFrame
```

This confirms our parent frame navigation pattern documentation.

### 3. ❌ **Major Discovery: Webix Pattern in Activity Workbench**

**What I missed completely:**
```javascript
Click on "Tasks"
SYS: Switch to Webix getFrame  // NEW PATTERN!
```

**Webix getFrame structure:**
```javascript
Switch to iframe index 0  // Note: Uses index, not ID!
Look for element "getFrame" on page
Switch iframe to id "getFrame"
```

**Learning:** Activity Workbench uses Webix components requiring special frame switching pattern.

### 4. ❌ **Wrong: No Dialog Frame for Open/Save**

**What I predicted:**
```javascript
Click on "Open"
SYS: Switch to Dialog Frame  // WRONG
setCheckbox("hsa_complete", "true")
```

**What actually happens:**
```javascript
Click on "Open"
// No frame switch - stays in current context!
setCheckbox("hsa_complete", "true")
```

**Learning:** Not all "Open" actions create dialogs. This form opens inline.

### 5. ✅ **Pattern: Webix context persists after operations**

**New pattern discovered:**
```javascript
Click on "Save"
SYS: Switch to getFrame
SYS: Switch to Webix getFrame  // Must re-establish Webix context
```

**Learning:** After saving in Webix context, you must re-establish both standard AND Webix frames.

### 6. ✅ **Correct: setTab requires active inlineframe**

**What actually happens:**
```javascript
setTab("%WWF2000SWFPT4")
SYS: Switch to active inlineframe
```

**Active inlineframe structure:**
```javascript
Look for element "iframe.inlineframe.active" on page
Switch iframe to "iframe.inlineframe"
Look for element "getFrame" on page
Switch iframe to id "getFrame"
```

### 7. 📝 **Critical Pattern: waitForElementToDisappear**

Every `SYS: Switch to getFrame` includes:
```javascript
waitForElementToDisappear("[alt=submitted]")
```

**Learning:** Always wait for submission spinner before switching frames.

## Updated Pattern Rules

### Rule 1: setFilter Behavior
- `setFilter()` alone → No frame switch needed
- `setFilter()` + grid operations → Still just `SYS: Switch to getFrame`
- NOT `getFrame + active inlineframe` as previously assumed

### Rule 2: Webix Components
- Activity Workbench Tasks → `SYS: Switch to Webix getFrame`
- Uses `iframe index 0` instead of ID
- Must re-establish after save operations

### Rule 3: Form Opening Patterns
- Not all "Open" buttons create dialogs
- Check if form opens inline vs popup
- No frame switch needed for inline forms

### Rule 4: Tab Navigation
- `setTab()` → Requires `SYS: Switch to active inlineframe`
- This is consistent with our documentation

### Rule 5: Frame Re-establishment
- After save in Webix → Need both getFrame AND Webix getFrame
- Shows frame context is fully reset after saves

## New Webix Pattern Documentation

```javascript
// Checkpoint 13: SYS: Switch to Webix getFrame
Switch to iframe index 0        // ← Key difference: uses index
Look for element "getFrame" on page
Switch iframe to id "getFrame"
```

This pattern appears when:
- Navigating to Activity Workbench > Tasks
- Working with modern UI components
- System/Configuration modules (as previously noted)

## Revised Decision Tree

```
After navigation/action:
    ↓
Is it Activity Workbench Tasks?
    YES → Use: Webix getFrame
    ↓
NO → Did you just save in Webix?
    YES → Use: getFrame THEN Webix getFrame
    ↓
NO → Are you using setTab()?
    YES → Use: active inlineframe
    ↓
NO → Default: Use getFrame
```

## Key Takeaways

1. **Webix is real** - We found concrete examples of Webix pattern
2. **setFilter misconception** - Doesn't need active inlineframe
3. **Not all opens are dialogs** - Some forms open inline
4. **Webix uses index** - Different from ID-based switching
5. **Always wait for spinner** - Critical for timing

This journey provided excellent validation and correction of our iframe patterns!