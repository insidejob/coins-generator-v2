# COINS ERP Iframe Navigation Patterns

> 📌 **Internal Technical Documentation** - This document contains implementation details for AI systems and developers. Business users should refer to the [COINS Navigation Guide](../iframe-guide/COINS_Navigation_Guide.md).

## Critical Patterns Discovered

### 1. Filtered Grid Navigation Pattern
When clicking on links within filtered search results:

```javascript
// After module navigation
Click on "House Sales"
setMenu("%WHS1010SHCG")
SYS: Switch to getFrame + active inlineframe  // AFTER setMenu, not before!

// Filter and click in grid
setFilter("", "job_num", "128")
clickRowColumn(0, "job_jobph")  // Preferred over xpath
SYS: Switch to getFrame + active inlineframe  // Re-establish for next grid operation
```

**Key Learning**: 
- Filtered grids render in nested iframes requiring the full path
- Switch to `getFrame + active inlineframe` AFTER setMenu
- Re-establish frame context between grid operations

### 2. Grid Cell Click Pattern
Best approach for clicking grid cells:
```javascript
// Preferred method
clickRowColumn(0, "job_jobph")  // Uses row index and field name

// Alternative if needed
Click on link "//td[@data-cellid='job_jobph']"
```

### 3. Command Bar Navigation Pattern
After deep iframe interactions, return to command bar level:

```javascript
// After grid interaction
clickRowColumn(0, "vwb_code")

// Return to command bar level
SYS: Switch to getFrame  // No need for Container first!

// Now can access command bar buttons
Click on "Continue Reservation"
```

### 4. Desktop Frame Pattern (CRITICAL UPDATE)
For modal dialogs like "New Reservation" and "Continue Reservation":

```javascript
// Open dialog - combine actions to avoid single-step checkpoints
Click on "New Reservation"
Click on "Continue Reservation"
SYS: Switch to Desktop Frame  // After both clicks

// Start Reservation
Click on "Start Reservation"
SYS: Switch to Desktop Frame  // Required after action that loads form
keyboardShortcut('save')  // Better than Press "CTRL_SHIFT_S"

// Navigate to stage
Click on "PURCH1"
SYS: Switch to Desktop Frame  // Required after stage navigation

// Fill form and submit
Write "Sur" in field input "Surname"
Press DOWN
Press RETURN
Look for element "Matches" on page
Click on "Matching Person"
SYS: Switch to Desktop Frame  // Required after selection action

// Save and navigate
Click on "RESDET"
keyboardShortcut('save')
SYS: Switch to Desktop Frame  // Required after stage nav + save
```

**Critical Pattern**: Desktop Frame involves complex iframe re-establishment:
```javascript
// Actual Desktop Frame implementation:
Switch to parent iframe (3x to root)
Switch iframe to "//*[starts-with(@id, 'frameID')]/iframe"  // Dynamic frame
Switch iframe to id "mainarea"
Switch iframe to id "getFrame"
```

**When Desktop Frame is Required**:
- After opening modal dialogs (New/Continue Reservation)
- After stage navigation buttons (PURCH1, RESDET, etc.)
- After save operations in modals
- After selection actions (Matching Person)
- After action buttons (Save, Complete)
- After loading new forms (Start Reservation)
- NOT required between field inputs in the same form

### 5. Frame Hierarchy
Understanding COINS frame structure:

**Standard Navigation (non-modal):**
```
Window
└── mainarea
    └── getFrame (standard functions, command bar)
        └── active inlineframe (filtered grids only)
            └── getFrame (grid content)
```

**Modal Dialogs (New/Continue Reservation):**
```
Window
└── Dynamic iframe (starts with 'frameID')  // Created for modal
    └── mainarea
        └── getFrame (modal content and forms)
```

**Key Insight**: Modal dialogs create a completely new iframe hierarchy with a dynamically generated frameID, which is why Desktop Frame switching is so complex.

## Best Practices

1. **Use library checkpoints** - They handle complex frame navigation
2. **Prefer keyboardShortcut() over Press** for COINS operations:
   - `keyboardShortcut('save')` instead of `Press "CTRL_SHIFT_S"`
3. **Desktop Frame for modals** - Use Desktop Frame, not Dialog Frame
4. **Combine actions before frame switches** to avoid single-step checkpoints
5. **Use field names over xpath** when possible (more maintainable)
6. **Wait for submitted indicators** to disappear after actions
7. **Understand when to switch frames**:
   - After setMenu → Switch to getFrame + active inlineframe (for grids)
   - After grid operations → Re-establish frame context
   - After modal actions → Desktop Frame (almost always required)

## Common Extensions for COINS

- `setFilter(namedFilter, field, value)` - Filter grids
- `clickRowColumn(row, column)` - Click in grids
- `keyboardShortcut('save')` - Save with proper handling
- `waitForElementToDisappear("[alt=submitted]")` - Wait for actions
- `setMenu(function)` - Navigate menus
- `setKco(company)` - Switch companies

## Related Documentation

- [COINS Stage Navigation Pattern](./COINS_STAGE_NAVIGATION_PATTERN.md) - Detailed guide for multi-step dialog navigation

## Next Steps

1. Build automated pattern detection from PDF requirements
2. Create journey templates for common COINS workflows
3. Develop iframe navigation helper functions