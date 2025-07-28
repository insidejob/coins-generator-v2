# COINS Tables: Browse vs Grid - Executive Summary

## The One Rule You Need to Know

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  If you can TYPE to FILTER above the table:        │
│  → You need the complex frame pattern               │
│                                                     │
│  If you can't:                                      │
│  → You need the simple frame pattern                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Visual Quick Reference

### Simple Browse Table ✅
```
Human Resources
├─ [Add] [Edit] [Delete]        ← Just buttons
├─ Code │ Description │ Type    ← Just headers
├─ PW   │ Personnel WB │ WB     ← Just data
└─ TW   │ Training WB  │ WB

Frame: SYS: Switch to getFrame
```

### Complex Filtered Grid ✅
```
House Sales - Plots
├─ [Add] [Edit] [Delete]                    ← Buttons
├─ Job: [___] Phase: [___] [Search] 🔍      ← FILTER BOXES!
├─ Job │ Phase │ Plot │ Status              ← Headers
├─ 128 │ 001   │ 099  │ Available           ← Data
└─ 128 │ 001   │ 100  │ Reserved

Frame: SYS: Switch to getFrame + active inlineframe
```

## Why This Matters

COINS displays data in two different ways:

1. **Browse Tables** = Simple lists (like your HR screen)
   - Just for viewing and selecting
   - No search functionality
   - Lives in the main COINS Working Area

2. **Filtered Grids** = Interactive data (like Plot Selection)
   - Can search and filter
   - Updates dynamically
   - Lives in a nested Data Grid frame

## Your Troubleshooting Checklist

When a table isn't working:

☐ **Step 1:** Look above the table
☐ **Step 2:** Are there input boxes for filtering?
☐ **Step 3:** If YES → Use complex pattern
☐ **Step 4:** If NO → Use simple pattern

## Real Examples from COINS

### These are BROWSE TABLES (Simple):
- HR Personnel list
- System User list
- Basic module menus
- Static report results

### These are FILTERED GRIDS (Complex):
- House Sales plot search
- Invoice selection with date filters
- Employee search with name filter
- Any screen where you type to search

## The Technical Bit (If You Need It)

**Simple Browse:**
- Path: `mainarea > getFrame`
- Just 2 levels deep

**Filtered Grid:**
- Path: `mainarea > getFrame > inlineframe.active > getFrame`
- 4 levels deep (that's why it needs special handling!)

---

💡 **Remember:** When in doubt, look for filter boxes. No boxes = simple pattern!