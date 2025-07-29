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
           COINS Main Area                      COINS Working Area
```

This means you need: COINS is displaying your element inside two nested windows.

### Even Simpler: The Highlight Method

1. In DevTools Console, type:
```javascript
$0.style.border = "5px solid red"
```
2. Click on different iframes in the Elements panel
3. When the red border appears around your element, note which iframes you clicked through

## What These Frame Names Mean in COINS

| Technical Name | What It Is in COINS | When You See It |
|----------------|-------------------|-----------------|
| **getFrame** | COINS Working Area | Main content area where you do your work |
| **Dialog Frame** | COINS Pop-up Window | Reservation forms, add/edit screens |
| **Desktop Frame** | COINS Nested Pop-up | Pop-ups inside pop-ups (like Add Choice) |
| **active inlineframe** | COINS Data Grid | Filtered lists, search results |
| **mainarea** | COINS Container | The overall COINS workspace |

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
// Add wait after opening COINS pop-up
Click on "New Reservation"
SYS: Switch to Dialog Frame  // Switch to COINS Pop-up Window
Wait 2 seconds  // Allow pop-up to load
Look for element "Surname" on page  // Verify correct window
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
Wait 2 seconds  // Give COINS pop-up time to open
SYS: Switch to Dialog Frame  // Enter COINS Pop-up Window
```

2. **Look for the Element First**
```
Click on "New Reservation"
Look for element "Continue Reservation" on page  // Verify pop-up opened
Click on "Continue Reservation"
SYS: Switch to Dialog Frame  // Enter COINS Pop-up Window
```

3. **If Still Failing, Try Multiple Waits**
```
Click on "Update Incentive"
Wait 1 second
SYS: Switch to Dialog Frame  // Enter COINS Pop-up Window
Wait 1 second  // Let COINS finish loading
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
   - `/browse/` = COINS Browse screen (needs Working Area)
   - `/edit/` = COINS Edit form (needs Pop-up Window)
   - `/add/` = COINS Add form (needs Pop-up Window)

## Simple Recovery Steps

### When Things Go Wrong:

1. **Close and Start Over**
```
// If COINS pop-up seems broken
Click on "Cancel" or "Close"
Wait 2 seconds
// Try opening pop-up again
Click on "New Reservation"
Look for element "Continue Reservation" on page
Click on "Continue Reservation"
SYS: Switch to Dialog Frame  // Enter COINS Pop-up Window
```

2. **Return to Main Screen**
```
// If completely lost
Click on "House Sales" in menu  // Return to module home
SYS: Switch to getFrame  // Enter COINS Working Area
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
| "Element not found: Surname" | Wrong COINS window | Add frame switch before |
| "Cannot read property of null" | COINS window not loaded | Add wait after switch |
| "Frame not found: desktopDialog" | COINS pop-up not open | Wait for pop-up to open |
| "Stale element reference" | COINS refreshed the window | Re-establish frame |
| "Timeout waiting for element" | Wrong window or COINS slow | Check frame + increase wait |

## Real Example: Adding an Incentive

Here's how to handle frames when things go wrong:

```
// What should happen:
Click on "Update Incentive"
SYS: Switch to Dialog Frame  // Enter COINS Pop-up Window
Write "500" in field "Value"
Click on "Save"

// If "Value" field not found, try this:
Click on "Update Incentive"
Wait 2 seconds  // Give COINS pop-up time to open
Look for element "Incentive Details" on page  // Verify right pop-up
SYS: Switch to Dialog Frame  // Enter COINS Pop-up Window
Wait 1 second  // Let COINS finish loading
Write "500" in field "Value"
Click on "Save"

// If still failing:
Click on "Cancel"  // Close COINS pop-up
Wait 2 seconds
Click on "Update Incentive"  // Try again
Wait for element "Value" on page  // Wait for specific field
SYS: Switch to Dialog Frame  // Enter COINS Pop-up Window
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