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

## 3. Dialog Frame Pattern (5% of cases)

### Example: Continue Reservation Modal
![Dialog Frame](./screenshots/dialogFrame.png)

**What you see:**
- Modal/popup window
- Green header bar ("Continue Reservation")
- Multi-step form (1. Reservation Type, 2. Purchaser, etc.)
- Background is dimmed/grayed out

**When to use:** `SYS: Switch to Dialog Frame`

**Key Point:** Use this when you see a popup/modal with the background dimmed.

---

## 🎯 Simple Decision Flow

```
START
  │
  ▼
Is it a popup/modal? (Background dimmed?)
  │
  ├─ YES → Use: SYS: Switch to Dialog Frame
  │
  └─ NO → Continue
           │
           ▼
         Try: SYS: Switch to getFrame
           │
           ├─ WORKS → Done! (85% of cases)
           │
           └─ ERROR → Add: SYS: Switch to inlineframe
```

---

## 💡 Key Takeaways

1. **Start Simple** - Always try `getFrame` first
2. **Popups are Different** - Use Dialog Frame for modals
3. **Two-Step Pattern** - Some grids need getFrame THEN inlineframe
4. **Don't Overcomplicate** - The search field location doesn't determine the pattern

---

## 📋 Quick Reference

| Pattern | Visual Clue | Checkpoint to Use |
|---------|-------------|-------------------|
| Standard Grid | Regular table/form | `SYS: Switch to getFrame` |
| Complex Grid | Tabs, nested content | `SYS: Switch to getFrame` + `SYS: Switch to inlineframe` |
| Modal/Popup | Dimmed background | `SYS: Switch to Dialog Frame` |

That's it! Three patterns cover everything in COINS.