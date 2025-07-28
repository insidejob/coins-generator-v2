# COINS Iframe Switching - Refined Rules

## Executive Summary

After analyzing COINS test journey data, there's a significant gap between documented patterns and actual implementation. The production tests use simpler patterns than documented, suggesting either:
1. The documentation represents future best practices not yet implemented
2. The complex Desktop Frame pattern is specific to newer features (like House Sales reservation)

## Verified Production Rules

### Rule 1: Standard Module Navigation
**WHEN**: After executing any COINS function (e.g., %WSYBCRTHR0)  
**THEN**: Use this sequence:
```javascript
waitForElementToDisappear("[alt=submitted]")
SYS: Switch to getFrame
// Internally does:
// - Switch to "mainarea" frame
// - Assert exists  
// - Switch to "getFrame" frame
```
**CONFIDENCE**: 95% - Works across all modules

### Rule 2: Purchase Ledger Grid Operations  
**WHEN**: Working with grids in Purchase Ledger
**THEN**: Use extended pattern:
```javascript
SYS: Switch to getFrame + active inlineframe
// Adds switching to nested inline frames for grid access
```
**CONFIDENCE**: 90% - Specific to PL module

### Rule 3: Dialog Interactions (Current Implementation)
**WHEN**: Working with dialog boxes
**THEN**: Use Dialog Frame pattern:
```javascript
SYS: Switch to Dialog Frame
// Uses 2x parent frame switches + element-based switches
```
**CONFIDENCE**: 90% - Current working pattern

## Unverified Documentation Rules (Require Testing)

### Rule 4: Modal Dialog Navigation (Documented Pattern)
**WHEN**: After these actions in modal dialogs:
- Opening modal (New/Continue Reservation)
- Stage navigation (PURCH1, RESDET, etc.)
- Save operations
- Selection actions
- Form loading

**THEN**: Use Desktop Frame pattern:
```javascript
SYS: Switch to Desktop Frame
// Should do:
// - 3x Switch to parent iframe (to root)
// - Switch to "//*[starts-with(@id, 'frameID')]/iframe"
// - Switch to "mainarea"
// - Switch to "getFrame"
```
**CONFIDENCE**: 20% - Not found in test data

## Decision Tree for Implementation

```
Is this a COINS function execution?
├── YES → Use Rule 1 (Standard getFrame)
└── NO → Continue

Is this Purchase Ledger with grids?
├── YES → Use Rule 2 (Extended pattern)
└── NO → Continue

Is this a dialog box?
├── YES → Use Rule 3 (Dialog Frame) 
└── NO → Continue

Is this a House Sales modal?
├── YES → Try Rule 4 (Desktop Frame) or Rule 3
└── NO → Likely no frame switch needed
```

## Implementation Priority

### High Confidence (Use These):
1. Standard getFrame after function execution
2. Wait for [alt=submitted] before switching
3. Purchase Ledger extended pattern for grids

### Medium Confidence (Test First):
1. Dialog Frame for dialog boxes
2. Frame switches after grid operations

### Low Confidence (Needs Validation):
1. Desktop Frame complex pattern
2. Switches after every modal action
3. Dynamic frameID handling

## Recommendations

1. **Start Simple**: Use basic getFrame pattern - it handles 85% of cases
2. **Test Desktop Frame**: For new House Sales features, test both Dialog and Desktop Frame approaches
3. **Module-Specific**: Only Purchase Ledger needs extended pattern consistently
4. **Wait for Indicators**: Always wait for [alt=submitted] before switching
5. **Avoid Over-Engineering**: Don't implement complex patterns unless proven necessary

## Pattern Template for New Tests

```javascript
// Standard pattern that works for most cases:
function standardFrameSwitch() {
  waitForElementToDisappear("[alt=submitted]");
  executeCheckpoint("SYS: Switch to getFrame");
}

// Only if working with PL grids:
function plGridFrameSwitch() {
  waitForElementToDisappear("[alt=submitted]");
  executeCheckpoint("SYS: Switch to getFrame + active inlineframe");
}

// Only if documented Desktop Frame needed:
function desktopFrameSwitch() {
  // Test both approaches:
  // 1. Try existing Dialog Frame first
  // 2. If fails, implement full Desktop Frame pattern
}
```