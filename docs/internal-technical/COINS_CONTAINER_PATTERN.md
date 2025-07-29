# COINS Container Pattern Documentation

> 📌 **Internal Technical Documentation** - Understanding the Container frame switching pattern

## Overview

The Container pattern (`SYS: Switch to Container`) is used for major context transitions, particularly when exiting from nested frame contexts like active inlineframe.

## Pattern Structure

### Standard Container (2x parent)
```javascript
SYS: Switch to Container
Switch to parent iframe
Switch to parent iframe
```

### Deep Container (4x parent)
```javascript
SYS: Switch to Container with 4 parent frames
Switch to parent iframe
Switch to parent iframe
Switch to parent iframe
Switch to parent iframe
```

**Pattern**: The number of parent frames depends on nesting depth

## When to Use Container Pattern

### 1. Exiting Active Inlineframe
**Most Common Use Case**
```javascript
// Working in Transactions tab
Click on "Transactions"
SYS: Switch to active inlineframe

// Do work in the tab...
Click on "Save"

// Exit back to main context
SYS: Switch to Container
Switch to parent iframe
Switch to parent iframe
```

### 2. After Major Operations in Nested Context
```javascript
// In active inlineframe
Pick "Post" from "selectAction"
Click on "actiongo"
waitForLastProcess()

// Return to main batch
SYS: Switch to Container
Switch to parent iframe
Switch to parent iframe
```

### 3. Before Navigation After Deep Nesting
```javascript
// After Container switch
SYS: Switch to Container
Switch to parent iframe
Switch to parent iframe

// Usually followed by fresh frame establishment
SYS: Switch to getFrame  // For next operation
```

## Container vs Other Patterns

| Scenario | Pattern to Use | Why |
|----------|---------------|-----|
| Exit from active inlineframe | Container + 2x parent | Major context change |
| Exit from dialog | Dialog Frame or parent frames | Minor context change |
| After save in main form | getFrame | Page reload |
| After save in nested tab | Container + 2x parent | Exit nested context |

## Visual Context

```
Batch Screen (main context)
    │
    └── Transactions Tab
            │
            └── active inlineframe ← You are here
                    │
                    └── Need Container to exit back to Batch
```

## Key Differences from Simple Parent Navigation

1. **Container is a checkpoint** that handles complex context switching
2. **Always followed by 2x parent frames** (consistent pattern)
3. **Used for major transitions** not minor popup dismissals
4. **Indicates deep nesting** in the frame hierarchy

## Module-Specific Usage

### Finance/GL Module
- Used when working with batch transactions
- Exit from Transactions tab back to batch header
- After posting operations from nested context

### Expected in Other Modules
- Purchase Ledger invoice lines
- Sales Order line items
- Any module with tab-based line entry

## Implementation Notes

The Container checkpoint likely:
1. Identifies current frame depth
2. Calculates required parent traversals
3. Ensures clean context switch
4. May clear frame-specific state

This explains why it's more reliable than manual parent frame counting for complex transitions.