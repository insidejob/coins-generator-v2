# COINS Stage Navigation Button Pattern

## Context
When working with COINS multi-step dialogs (like House Sales Reservation wizards), stage navigation buttons require special frame handling.

## The Pattern

### Where This Applies
- **House Sales**: New Reservation / Continue Reservation dialogs
- **Any Multi-Step Wizard**: Where you see numbered sections (1. Start, 2. Purchaser, 3. Solicitor, etc.)
- **Stage Navigation Buttons**: Update, Next, Previous, Continue buttons with `onclick="resStageButtonClick(this)"`

### The Rule
```javascript
// ALWAYS after clicking a stage navigation button:
Click on "Update"  // or "Next", "Previous", "Continue"
SYS: Switch to Desktop Frame  // REQUIRED - frame context is lost
```

### Why Desktop Frame?
- These multi-step dialogs open in a modal window
- The modal uses Desktop Frame (NOT Dialog Frame)
- Stage navigation buttons call `resStageButtonClick()` which resets frame context

## Example: House Sales Reservation Flow

```javascript
// Initial dialog opening
Click on "New Reservation"  // or "Continue Reservation"
SYS: Switch to Desktop Frame  // Enter the modal

// Section 1: Start Reservation
Click on "Start Reservation"
Enter "test" in "reservation_type"
keyboardShortcut('save')  // NO frame switch needed after keyboard save

// Moving to Section 2
Look for element "2. Purchaser 1 (Main Contact)" on page
Click on "Update"  // Stage navigation button
SYS: Switch to Desktop Frame  // REQUIRED after stage button

// Now in Section 2: Can interact with fields
Write "Sur" in field input "Surname"
Enter "test@example.com" in "Email"
keyboardShortcut('save')  // Again, no switch needed

// Moving to Section 3
Click on "Next"  // Another stage navigation
SYS: Switch to Desktop Frame  // REQUIRED again
```

## Technical Details

### Stage Button HTML Pattern
```html
<button class="stage-button" 
        data-coinshref="woframe.p?...&reservationStage=PURCH1&button=action:add..."
        onclick="resStageButtonClick(this);return false;">
    <span class="stage-button-icon fa fa-folder-o"></span>Update
</button>
```

### Key Indicators
- Class: `stage-button`
- onclick: `resStageButtonClick(this)`
- data-coinshref: Contains stage navigation parameters

## Quick Reference

| Action | Frame Switch Required |
|--------|----------------------|
| `keyboardShortcut('save')` | No |
| Click "Save" button | No |
| Click "Update" (stage button) | Yes - Desktop Frame |
| Click "Next" (stage button) | Yes - Desktop Frame |
| Click "Previous" (stage button) | Yes - Desktop Frame |
| Enter text in fields | No |
| Select from dropdowns | No |

## Alternative: Direct Navigation (NEW BEST PRACTICE)

**LATEST DISCOVERY**: Direct navigation to stage URLs is the most reliable approach!

### The Direct Navigation Pattern
```javascript
// Instead of clicking Update buttons
Navigate to "[stage URL with reservationStage=PURCH1]"
SYS: Switch to getFrame  // Simple frame switch only

// This avoids all the Desktop Frame complexity
```

### Why This Works Best
- Bypasses `resStageButtonClick()` entirely
- Loads simpler layout needing only getFrame
- No complex Desktop Frame switching
- Most reliable approach

See [COINS Stage Navigation Direct](./COINS_STAGE_NAVIGATION_DIRECT.md) for implementation details.

## Best Practice (Updated)
1. **Most Reliable**: Direct navigation with `navigateToStage()` extension (when available)
2. **Current Best**: Navigate to full URL + `SYS: Switch to getFrame`
3. **Fallback**: Click button + `SYS: Switch to Desktop Frame`
4. Check for `stage-button` class or `onclick="resStageButtonClick"` to identify these buttons

This pattern ensures reliable navigation through COINS multi-step dialogs without frame context errors.