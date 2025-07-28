# COINS ERP Iframe Navigation Patterns

## Critical Patterns Discovered

### 1. Filtered Grid Navigation Pattern
When clicking on links within filtered search results:

```javascript
// After module navigation
Click on "House Sales"
SYS: Switch to getFrame + active inlineframe  // Critical for filtered grids!
setMenu("%WHS1010SHCG")

// Filter and click in grid
setFilter("", "job_num", "128")
clickRowColumn(0, "job_jobph")  // Preferred over xpath
```

**Key Learning**: Filtered grids render in nested iframes requiring the full path.

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

### 4. Desktop Frame Pattern (CORRECTED)
For modal dialogs like "New Reservation" and "Continue Reservation":

```javascript
// Open dialog
Click on "New Reservation"  // or "Continue Reservation"
SYS: Switch to Desktop Frame  // NOT Dialog Frame!

// Complete first section
Click on "Start Reservation"
keyboardShortcut('save')

// NO FRAME SWITCH NEEDED after keyboardShortcut save
// Can proceed directly to next section
Look for element "2. Purchaser 1 (Main Contact)" on page
Click on "Update"

// FRAME SWITCH NEEDED after "Update" button!
SYS: Switch to Desktop Frame
// Now can interact with form fields
Write "Sur" in field input "Surname"
```

**Important Updates**:
- Use `SYS: Switch to Desktop Frame` for modal windows, NOT Dialog Frame
- No frame switch after `keyboardShortcut('save')` within same section
- Frame switch IS needed after clicking "Update" or similar navigation buttons
- Different buttons have different frame context behaviors

### 5. Frame Hierarchy
Understanding COINS frame structure:
```
Window
└── mainarea
    └── getFrame (standard functions)
        └── active inlineframe (filtered grids)
            └── getFrame (grid content)

For modal dialogs (New/Continue Reservation):
└── Desktop Frame (contains the modal dialog)
    └── [Dialog content - no additional frame switches needed]
```

## Best Practices

1. **Use library checkpoints** - They handle complex frame navigation
2. **Prefer keyboardShortcut() over Press** for COINS operations
3. **Desktop Frame for modals** - Use Desktop Frame, not Dialog Frame
4. **No frame switch between dialog sections** - Saves don't require re-establishing frame
5. **Use field names over xpath** when possible (more maintainable)
6. **Wait for submitted indicators** to disappear after actions

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