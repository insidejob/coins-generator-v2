# COINS Search Field Investigation

## Critical Finding

The presence of a search field does NOT always indicate the need for `getFrame + active inlineframe`.

## Evidence

### General Ledger Example (getFrame only)
- Has search field: "Search: Development.Plot" at bottom right
- Works with just `SYS: Switch to getFrame`
- No active inlineframe needed

### Sales Workbench Example (getFrame + active inlineframe)
- Has search field: "Search: Surname" at bottom right
- Requires `SYS: Switch to getFrame + active inlineframe`
- More complex grid structure

## Revised Understanding

The key differentiator is NOT just the presence of a search field, but rather:

1. **Grid Component Type**: Different COINS modules use different grid implementations
2. **Module Context**: Sales modules tend to use more complex grids
3. **Visual Indicators**: Need to look for additional clues beyond just search fields

## New Decision Criteria

Instead of: "Can you search?"
Consider: "What module are you in and how complex is the grid?"

### Module-Based Approach:
- **Financial Modules (GL, PL, AP, AR)**: Usually just `getFrame` even with search
- **Sales Modules (House Sales, Sales Workbench)**: Often need `getFrame + active inlineframe`
- **Document Management**: Basic `getFrame`

## Action Items
1. Test more modules to confirm pattern
2. Update documentation with module-specific guidance
3. Consider error-recovery approach: try `getFrame` first, then add active inlineframe if needed