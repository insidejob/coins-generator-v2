# COINS Iframe Error Handling Guide

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
```javascript
// Re-establish frame after significant actions
Click on "PURCH1"
SYS: Switch to Dialog Frame  // Re-establish after stage nav
Write "Test" in field "Name"
keyboardShortcut("save")
SYS: Switch to Dialog Frame  // Re-establish after save
```

## Retry Logic for Frame Switches

### Basic Retry Pattern
```javascript
function switchToFrameWithRetry(frameType, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            switch(frameType) {
                case 'Dialog Frame':
                    executeCheckpoint('SYS: Switch to Dialog Frame');
                    break;
                case 'Desktop Frame':
                    executeCheckpoint('SYS: Switch to Desktop Frame');
                    break;
                case 'getFrame':
                    executeCheckpoint('SYS: Switch to getFrame');
                    break;
            }
            
            // Verify switch succeeded
            wait(1); // Brief pause
            if (verifyFrameContext()) {
                return true;
            }
        } catch (error) {
            console.log(`Frame switch attempt ${i + 1} failed: ${error}`);
            if (i < maxRetries - 1) {
                wait(2); // Longer wait before retry
                // Try to reset to known state
                switchToDefaultContent();
            }
        }
    }
    return false;
}
```

### Advanced Retry with Context Detection
```javascript
function smartFrameSwitch(targetElement, expectedFrame) {
    // First, try without switching (might already be in correct frame)
    if (elementExists(targetElement)) {
        return true;
    }
    
    // Try expected frame
    if (switchToFrameWithRetry(expectedFrame)) {
        if (elementExists(targetElement)) {
            return true;
        }
    }
    
    // Try alternative frames based on context
    const alternativeFrames = getAlternativeFrames(expectedFrame);
    for (const frame of alternativeFrames) {
        if (switchToFrameWithRetry(frame)) {
            if (elementExists(targetElement)) {
                console.log(`Found element in ${frame} instead of ${expectedFrame}`);
                return true;
            }
        }
    }
    
    return false;
}

function getAlternativeFrames(primaryFrame) {
    const alternatives = {
        'Desktop Frame': ['Dialog Frame', 'getFrame'],
        'Dialog Frame': ['Desktop Frame', 'active inlineframe'],
        'getFrame': ['getFrame + active inlineframe'],
        'getFrame + active inlineframe': ['getFrame']
    };
    return alternatives[primaryFrame] || [];
}
```

## Detecting Wrong Frame Context

### Visual Indicators
```javascript
// Check for frame-specific elements
function detectCurrentFrameContext() {
    const frameIndicators = {
        'mainWorkspace': 'getFrame',
        'modalDialog': 'Dialog Frame',
        'desktopDialog': 'Desktop Frame',
        'gridContainer': 'getFrame + active inlineframe',
        'popupWindow': 'active inlineframe'
    };
    
    for (const [element, frame] of Object.entries(frameIndicators)) {
        if (elementExists(element)) {
            return frame;
        }
    }
    return 'unknown';
}
```

### Diagnostic Function
```javascript
// Add as checkpoint for debugging
function diagnoseFrameState() {
    console.log("=== Frame Diagnosis ===");
    
    // Check common COINS frames
    const frames = ['mainarea', 'getFrame', 'inlineframe', 'desktopDialog'];
    frames.forEach(frame => {
        const exists = frameExists(frame);
        console.log(`${frame}: ${exists ? 'Present' : 'Not found'}`);
    });
    
    // Check current URL for context clues
    const url = getCurrentUrl();
    if (url.includes('/browse/')) console.log("Context: Browse screen");
    if (url.includes('/edit/')) console.log("Context: Edit form");
    if (url.includes('/add/')) console.log("Context: Add form");
    
    return true;
}
```

## Recovery Strategies

### 1. Return to Known State
```javascript
function recoverToKnownState() {
    try {
        // Try to get back to main workspace
        switchToDefaultContent();
        wait(1);
        
        // Look for mainarea
        if (frameExists('mainarea')) {
            switchToFrame('mainarea');
            if (frameExists('getFrame')) {
                switchToFrame('getFrame');
                return 'Recovered to main workspace';
            }
        }
        
        // If that fails, try to find any COINS frame
        const coinsFrames = ['getFrame', 'Container', 'desktopDialog'];
        for (const frame of coinsFrames) {
            if (attemptFrameSwitch(frame)) {
                return `Recovered to ${frame}`;
            }
        }
        
        return 'Recovery failed';
    } catch (error) {
        return `Recovery error: ${error}`;
    }
}
```

### 2. Modal-Specific Recovery
```javascript
function recoverModalContext(modalType = 'Dialog') {
    // Close and reopen modal
    try {
        // Try to close current modal
        if (elementExists('Close') || elementExists('Cancel')) {
            click('Close') || click('Cancel');
            wait(2);
        }
        
        // Return to main and retry
        recoverToKnownState();
        
        // Reopen modal based on type
        if (modalType === 'NewReservation') {
            click('New Reservation');
            click('Continue Reservation');
            switchToFrameWithRetry('Dialog Frame');
        }
        
        return true;
    } catch (error) {
        console.log(`Modal recovery failed: ${error}`);
        return false;
    }
}
```

### 3. Grid Recovery
```javascript
function recoverGridContext() {
    // Grid operations require specific frame setup
    try {
        recoverToKnownState();
        
        // Re-establish grid frame context
        executeCheckpoint('SYS: Switch to getFrame + active inlineframe');
        
        // Verify grid is accessible
        if (elementExists('[data-gridid]') || elementExists('.grid-container')) {
            return true;
        }
        
        // Try refreshing grid
        if (elementExists('Refresh')) {
            click('Refresh');
            wait(2);
            return true;
        }
        
        return false;
    } catch (error) {
        return false;
    }
}
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

## Implementation Example

```javascript
// Robust modal operation with error handling
function safeModalOperation() {
    try {
        // Open modal with verification
        Click on "New Reservation"
        Wait for element "Continue Reservation" on page  // Verify modal
        Click on "Continue Reservation"
        
        // Switch with retry
        if (!switchToFrameWithRetry('Dialog Frame', 3)) {
            throw new Error('Failed to switch to Dialog Frame');
        }
        
        // Verify correct context
        Look for element "Start Reservation" on page
        
        // Perform operations
        Click on "Start Reservation"
        
        // Re-establish frame after action
        SYS: Switch to Dialog Frame
        
        // Continue with form...
        
    } catch (error) {
        console.log(`Modal operation failed: ${error}`);
        
        // Attempt recovery
        recoverModalContext('NewReservation');
        
        // Retry or fail gracefully
        throw error;
    }
}
```

This guide provides comprehensive error handling for COINS iframe operations, with practical solutions for common failures and robust recovery strategies.