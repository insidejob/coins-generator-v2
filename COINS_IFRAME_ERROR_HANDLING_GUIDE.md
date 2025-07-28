# COINS Iframe Error Handling Guide

## How to See Which Frame an Element Is In

### Quick Method (Business Users):

1. **Right-click** on the element you want to interact with
2. Select **"Inspect"** or **"Inspect Element"**
3. Look at the bottom of DevTools for the "breadcrumb trail"

**What you'll see:**
```
html > body > iframe#mainarea > #document > ... > iframe#getFrame > #document > ... > input#Surname
                ↑                                      ↑
           First frame                            Second frame
```

This means you need: `mainarea > getFrame` to reach the element.

### Even Simpler: The Highlight Method

1. In DevTools Console, type:
```javascript
$0.style.border = "5px solid red"
```
2. Click on different iframes in the Elements panel
3. When the red border appears around your element, note which iframes you clicked through

## Common Iframe Errors and Solutions

### 1. Element Not Found After Frame Switch

**Error**: "Element not found" immediately after switching frames
```
Click on "New Reservation"
SYS: Switch to Dialog Frame
Write "Sur" in field input "Surname"  // FAILS - Element not found
```

**Causes**:
- Frame not fully loaded
- Wrong frame context
- Dynamic frame ID changed

**Solution**:
```javascript
// Add wait after frame switch
Click on "New Reservation"
SYS: Switch to Dialog Frame
Wait 2 seconds  // Allow frame to load
Look for element "Surname" on page  // Verify correct frame
Write "Sur" in field input "Surname"
```

### 2. Frame Not Found

**Error**: "NoSuchFrameException" or "Frame not found: desktopDialog"

**Causes**:
- Modal hasn't opened yet
- Frame ID is dynamic
- Previous action didn't complete

**Solution**:
```javascript
// Ensure action completes before switching
Click on "New Reservation"
waitForElementToDisappear("[alt=submitted]")  // Wait for action
Wait for element "Continue Reservation" on page  // Confirm modal open
Click on "Continue Reservation"
SYS: Switch to Dialog Frame  // Now safe to switch
```

### 3. Wrong Frame Context

**Error**: Operations work sometimes but fail randomly

**Causes**:
- Missing frame re-establishment after actions
- Assuming frame context persists

**Solution**:
```
// Re-establish frame after significant actions
Click on "Update Incentive"
SYS: Switch to Dialog Frame  // Re-establish after navigation
Write "500" in field "Value"
keyboardShortcut("save")
SYS: Switch to Dialog Frame  // Re-establish after save
```

## Simple Retry Strategies

### When Frame Switch Fails, Try This:

1. **Add a Wait**
```
Click on "New Reservation"
Wait 2 seconds  // Give modal time to open
SYS: Switch to Dialog Frame
```

2. **Look for the Element First**
```
Click on "New Reservation"
Look for element "Continue Reservation" on page  // Verify modal opened
Click on "Continue Reservation"
SYS: Switch to Dialog Frame
```

3. **If Still Failing, Try Multiple Waits**
```
Click on "Update Incentive"
Wait 1 second
SYS: Switch to Dialog Frame
Wait 1 second  // Additional wait after switch
Write "500" in field "Value"
```

## How to Tell You're in the Wrong Frame

### Visual Clues:
- ❌ Button visible but nothing happens when clicked
- ❌ "Element not found" but you can see it on screen
- ❌ Test was working but suddenly fails
- ❌ Some elements work, others don't

### Quick Checks in Browser:

1. **The Console Test**
   - Right-click on the element
   - Select "Inspect"
   - In Console, type: `$0.tagName`
   - If it shows an error, you're in the wrong frame

2. **The URL Check**
   - Look at your browser URL
   - `/browse/` = Browse screen (needs getFrame)
   - `/edit/` = Edit form (needs Dialog Frame)
   - `/add/` = Add form (needs Dialog Frame)

## Simple Recovery Steps

### When Things Go Wrong:

1. **Close and Start Over**
```
// If modal seems broken
Click on "Cancel" or "Close"
Wait 2 seconds
// Try opening modal again
Click on "New Reservation"
Look for element "Continue Reservation" on page
Click on "Continue Reservation"
SYS: Switch to Dialog Frame
```

2. **Return to Main Screen**
```
// If completely lost
Click on "House Sales" in menu  // Return to module home
SYS: Switch to getFrame
// Start your journey again
```

3. **Refresh the Page** (Last Resort)
```
// Only if nothing else works
Refresh page
SYS: Log In sysadmin
// Navigate back to where you were
```

## Best Practices for Error Prevention

### 1. Always Wait After Frame Switch
```javascript
SYS: Switch to Dialog Frame
Wait 1 second  // Minimum wait
Look for element "mainarea" on page  // Verify frame loaded
```

### 2. Verify Context Before Operations
```javascript
// Before critical operations
Look for element "Save" on page  // Ensures correct frame
Click on "Save"
```

### 3. Group Related Actions
```javascript
// Bad - multiple frame switches
Click on "New"
SYS: Switch to Dialog Frame
Write "Test" in "Name"
SYS: Switch to Dialog Frame  // Redundant
Write "123" in "Code"

// Good - single frame switch
Click on "New"
SYS: Switch to Dialog Frame
Write "Test" in "Name"
Write "123" in "Code"
```

### 4. Use Checkpoint Validation
```javascript
// Create validation checkpoints
Checkpoint: Verify Modal Context
Look for element "modalDialog" on page
Look for element "Save" on page
Look for element "Cancel" on page
```

## Error Message Interpretation

| Error Message | Likely Cause | Solution |
|--------------|--------------|----------|
| "Element not found: Surname" | Wrong frame | Add frame switch before |
| "Cannot read property of null" | Frame not loaded | Add wait after switch |
| "Frame not found: desktopDialog" | Modal not open | Wait for modal to open |
| "Stale element reference" | Frame context changed | Re-establish frame |
| "Timeout waiting for element" | Wrong frame or slow load | Check frame + increase wait |

## Real Example: Adding an Incentive

Here's how to handle frames when things go wrong:

```
// What should happen:
Click on "Update Incentive"
SYS: Switch to Dialog Frame
Write "500" in field "Value"
Click on "Save"

// If "Value" field not found, try this:
Click on "Update Incentive"
Wait 2 seconds  // Give modal time to open
Look for element "Incentive Details" on page  // Verify right modal
SYS: Switch to Dialog Frame
Wait 1 second  // Let frame settle
Write "500" in field "Value"
Click on "Save"

// If still failing:
Click on "Cancel"  // Close modal
Wait 2 seconds
Click on "Update Incentive"  // Try again
Wait for element "Value" on page  // Wait for specific field
SYS: Switch to Dialog Frame
Write "500" in field "Value"
Click on "Save"
```

## Quick Reference Card

| Problem | Solution |
|---------|----------|
| Element not found | Add wait before frame switch |
| Modal blank | Wait for content before switching |
| Wrong frame | Check breadcrumb in DevTools |
| Random failures | Re-establish frame after saves |
| Can see but can't click | You're in wrong frame |

Remember: Most iframe issues are solved by adding waits and verifying elements exist before proceeding.