# COINS Browse Tables vs Filtered Grids - Visual Guide

## Quick Identification Guide

### 🔍 What Am I Looking At?

Look at the top of your COINS table and answer these questions:

```
┌─────────────────────────────────────────────┐
│  Do you see filter boxes above the table?   │
│                                              │
│  [YES] → You have a Filtered Grid           │
│  [NO]  → You have a Browse Table            │
└─────────────────────────────────────────────┘
```

## Visual Examples

### 1️⃣ COINS Browse Table (Simple)

```
┌─────────────────────────────────────────────────┐
│ Human Resources                                 │
├─────────────────────────────────────────────────┤
│ [Add] [Edit] [Delete] [Refresh]                 │  ← Action buttons only
├─────────────────────────────────────────────────┤
│ Code │ Description              │ Type          │  ← Column headers
├──────┼──────────────────────────┼───────────────┤
│ PW   │ Personnel Workbench      │ Workbench     │  ← Data rows
│ TW   │ Training Workbench       │ Workbench     │
│ HRW  │ HR Requests Workbench    │ Workbench     │
└─────────────────────────────────────────────────┘

✅ Frame Required: SYS: Switch to getFrame (COINS Working Area)
```

**How to Recognize:**
- ❌ NO filter boxes above the table
- ✅ Just column headers and data
- ✅ Action buttons at the top
- ✅ Simple list of records

### 2️⃣ COINS Filtered Grid (Complex)

```
┌─────────────────────────────────────────────────┐
│ House Sales - Plot Selection                    │
├─────────────────────────────────────────────────┤
│ [Add] [Edit] [Delete] [Refresh]                 │
├─────────────────────────────────────────────────┤
│ Filter: [____] Job  [____] Phase  [Search] 🔍   │  ← FILTER BOXES!
├──────┬────────┬────────┬────────────────────────┤
│ Job  │ Phase  │ Plot   │ Status                 │
├──────┼────────┼────────┼────────────────────────┤
│ 128  │ 001    │ 099    │ Available              │
│ 128  │ 001    │ 100    │ Reserved               │
└──────┴────────┴────────┴────────────────────────┘

✅ Frame Required: SYS: Switch to getFrame + active inlineframe
                  (COINS Working Area + Data Grid)
```

**How to Recognize:**
- ✅ Filter input boxes above the table
- ✅ Search button or filter options
- ✅ Can type to filter results
- ✅ Results update dynamically

## 🎯 Decision Tree

```
Start Here
    │
    ▼
Can I type in boxes above the table to filter?
    │
    ├─── YES ──→ Use: getFrame + active inlineframe
    │
    └─── NO ───→ Use: getFrame only
```

## Common COINS Screens

### Browse Tables (Simple Frame)
These screens only need `getFrame`:

| Module | Screen | Why Simple? |
|--------|--------|-------------|
| HR | Personnel Workbench List | No filters, just a list |
| System | User List | Basic table display |
| Finance | Chart of Accounts | Browse only, no filtering |
| Payroll | Employee List | Simple selection list |

### Filtered Grids (Complex Frame)
These screens need `getFrame + active inlineframe`:

| Module | Screen | Why Complex? |
|--------|--------|--------------|
| House Sales | Plot Selection | Has job/phase filters |
| Purchase Ledger | Invoice List | Date range filters |
| Stock | Item Search | Multiple filter fields |
| CRM | Contact Search | Name/type filters |

## 🔧 Troubleshooting

### Problem: "I see a table but can't click on rows"

**Check These:**

1. **Are there filter boxes?**
   - YES → You need `getFrame + active inlineframe`
   - NO → You only need `getFrame`

2. **Did you filter first?**
   - If you typed in filter boxes, the grid reloads in a nested frame
   - Need to re-establish frame after filtering

### Visual Check in DevTools

**For Browse Table:**
```
Elements tab shows:
▼ iframe#mainarea
  ▼ iframe#getFrame
    ▼ table.browse-table  ← Your table is here
```

**For Filtered Grid:**
```
Elements tab shows:
▼ iframe#mainarea
  ▼ iframe#getFrame
    ▼ iframe.inlineframe.active  ← Extra frame!
      ▼ iframe#getFrame
        ▼ table.filtered-grid  ← Your table is deeper
```

## ✅ Best Practices

### For Browse Tables:
```
Click on "Human Resources"
SYS: Switch to getFrame
Click on row "Personnel Workbench"
```

### For Filtered Grids:
```
Click on "House Sales"
setMenu("%WHS1010SHCG")
SYS: Switch to getFrame + active inlineframe
setFilter("", "job_num", "128")
clickRowColumn(0, "job_jobph")
```

## 📋 Quick Reference Card

```
┌─────────────────────────────────────────┐
│         BROWSE vs GRID CHEAT SHEET      │
├─────────────────────────────────────────┤
│ Filter boxes visible?                   │
│   NO  → Browse Table → getFrame         │
│   YES → Filtered Grid → + active inline │
│                                         │
│ Can I search/filter?                    │
│   NO  → Simple frame                    │
│   YES → Complex frame                   │
│                                         │
│ Table updates when I type?              │
│   NO  → Basic browse                    │
│   YES → Dynamic grid                    │
└─────────────────────────────────────────┘
```

## 💡 Remember

- **Most COINS tables are simple browse tables** - Start with just `getFrame`
- **Only add `active inlineframe` if you see filter boxes**
- **When in doubt, check for filter fields at the top**
- **If clicking doesn't work, you might need the complex pattern**

The key is looking for those filter input boxes - they're the clearest sign you need the complex frame pattern!