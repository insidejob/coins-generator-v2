# COINS Iframe Visual Examples - Simplified Guide

## 🖼️ One Example Per Frame Type

This guide shows the three main iframe patterns you'll encounter in COINS.

---

## 1. Basic getFrame Pattern (85% of cases)

### Example: General Ledger Grid
![getFrame Example](./screenshots/getFrame_3.png)

**What you see:**
- Standard grid with data
- Search field at bottom ("Search: Development.Plot")
- Navigation controls (Advanced, Filter All)
- Standard COINS layout

**When to use:** `SYS: Switch to getFrame`

**Modules that use this pattern:**
- ✅ General Ledger (GL) - even with search!
- ✅ Payroll (PR) - 95% of the time
- ✅ Human Resources (HCM)
- ✅ Subcontract (SC)
- ✅ Most standard forms across all modules

**Key Point:** Even though there's a search field, this still uses basic getFrame!

---

## 2. Inline Frame Pattern (10% of cases)

### Example: Document Capture with Tabs
![Inline Frame](./screenshots/inlineframe.png)

**What you see:**
- Blue border labeled "getFrame" (outer frame)
- Red border labeled "inlineframe" (inner frame)
- Tab navigation (Batch Maint, Auto Index, Upload)
- Grid area inside the nested frames
- Visual proof of the two-layer structure

**When to use:** First `SYS: Switch to getFrame` THEN `SYS: Switch to inlineframe`

**Key Point:** The colored borders show exactly why you need TWO frame switches - you must navigate through getFrame (blue) to reach inlineframe (red).

---

## 3. Active Inline Frame Pattern (Sales Workbench - Special Case)

### Example: Sales Workbench with Search
![Active Inline Frame](./screenshots/inlineframe.active.png)

**What you see:**
- Filter tabs at top (By Development, By Purchaser, By Provisional)
- Search field at bottom right ("Search: Surname")
- Advanced Search option
- Customer/purchaser data grid

**When to use:** `SYS: Switch to getFrame + active inlineframe`

**Modules that consistently use this pattern:**
- ⚠️ Purchase Ledger (PL) - Most consistent user of extended pattern
- ⚠️ House Sales - Sales Workbench specifically
- ⚠️ Purchase Orders (PO) - 72% of the time
- ⚠️ Sales Ledger (SL) / Accounts Payable (AP) - Complex grids

**Key Point:** This is a special pattern mainly for Sales Workbench and Purchase Ledger - requires the combined checkpoint.

---

## 4. Dialog Frame Pattern (Popups/Modals)

### Example: Continue Reservation Modal
![Dialog Frame](./screenshots/dialogFrame.png)

**What you see:**
- Popup/modal window (separate from main page)
- Title bar at top (color varies by customer)
- Usually has close button (X) or similar
- Content appears in a floating window
- Can be dragged/moved around screen

**When to use:** `SYS: Switch to Dialog Frame`

**Key Point:** The consistent indicator is that it's a popup/modal window - the styling (colors, buttons, etc.) varies by COINS customer.

---

## 🎯 Simple Decision Flow

```
START
  │
  ▼
Is it a popup/modal window?
  │
  ├─ YES → Use: SYS: Switch to Dialog Frame
  │
  └─ NO → Continue
           │
           ▼
         Is it Sales Workbench with search?
           │
           ├─ YES → Use: SYS: Switch to getFrame + active inlineframe
           │
           └─ NO → Try: SYS: Switch to getFrame
                     │
                     ├─ WORKS → Done! (85% of cases)
                     │
                     └─ ERROR → Add: SYS: Switch to inlineframe
```

---

## 💡 Key Takeaways

1. **Start Simple** - Always try `getFrame` first (85% success rate)
2. **Popup/Modal = Dialog Frame** - Floating window is the key indicator
3. **Sales Workbench is Special** - Uses the combined active inlineframe pattern
4. **Two-Step Pattern** - Some grids need getFrame THEN inlineframe
5. **Visual Cues Matter** - Look for specific UI elements, not just any search field

---

## 📋 Quick Reference

| Pattern | Visual Clue | Checkpoint to Use |
|---------|-------------|-------------------|
| Standard Grid | Regular table/form, even with search | `SYS: Switch to getFrame` |
| Nested Content | Tabs with frame borders visible | `SYS: Switch to getFrame` + `SYS: Switch to inlineframe` |
| Sales Workbench | Filter tabs + search field | `SYS: Switch to getFrame + active inlineframe` |
| Modal/Popup | Floating window separate from main page | `SYS: Switch to Dialog Frame` |

That's it! Four patterns cover everything in COINS.

---

## 📚 Module-Specific Guide

For detailed module-by-module iframe patterns, see: **[COINS Module Iframe Mapping](./COINS_MODULE_IFRAME_MAPPING.md)**

This shows exactly which modules use which patterns, with confidence levels based on real test data.