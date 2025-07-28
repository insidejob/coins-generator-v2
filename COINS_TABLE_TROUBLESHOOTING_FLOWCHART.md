# COINS Table Troubleshooting Flowchart

## 🚦 Start Here When You See a Table

```
                    I see a table in COINS
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Are there input     │
                 │  boxes above the     │
                 │  table for filtering?│
                 └──────────┬───────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
           YES                              NO
            │                               │
            ▼                               ▼
    ┌───────────────┐               ┌───────────────┐
    │ FILTERED GRID │               │ BROWSE TABLE  │
    └───────┬───────┘               └───────┬───────┘
            │                               │
            ▼                               ▼
    Use: getFrame +                 Use: getFrame
    active inlineframe              (only)
            │                               │
            ▼                               ▼
    Need to handle                  Simple click
    nested frames                   operations work
```

## 🔍 Visual Identification Guide

### What Filter Boxes Look Like:

```
THESE ARE FILTER BOXES:
┌─────────────────────────────────────────────────────┐
│ Job: [_______] Phase: [_______] Plot: [_______] 🔍 │
└─────────────────────────────────────────────────────┘

NOT FILTER BOXES (just labels):
┌─────────────────────────────────────────────────────┐
│ Job Number: 12345    Phase: Active    Status: Open  │
└─────────────────────────────────────────────────────┘
```

## 🛠️ Common Problems & Solutions

### Problem 1: "I can see the table but clicks don't work"

```
                Can you see the table?
                        │
                       YES
                        │
                        ▼
              Can you click on it?
                        │
                       NO
                        │
                        ▼
         Are there filter boxes above?
                        │
        ┌───────────────┴───────────────┐
        │                               │
       YES                             NO
        │                               │
        ▼                               ▼
You need:                       Check if you're in
getFrame +                      the right module
active inlineframe              or try: getFrame
```

### Problem 2: "It worked before but now it doesn't"

```
           Did you just filter the table?
                        │
        ┌───────────────┴───────────────┐
        │                               │
       YES                             NO
        │                               │
        ▼                               ▼
Re-establish:                   Did you navigate
getFrame +                      to a new screen?
active inlineframe                      │
                                       YES
                                        │
                                        ▼
                                Start over with
                                frame detection
```

## 📊 Quick Test Method

### Step 1: Right-click on the table
### Step 2: Inspect Element
### Step 3: Count the iframes

```
Browse Table (2 frames):        Filtered Grid (4 frames):
mainarea                        mainarea
  └── getFrame ✓                  └── getFrame
       └── YOUR TABLE                  └── inlineframe.active
                                            └── getFrame ✓
                                                 └── YOUR TABLE
```

## 🎯 Action Guide

### If Browse Table (No Filters):
```
1. Click on module
2. SYS: Switch to getFrame
3. Click on table row
✅ Done!
```

### If Filtered Grid (Has Filters):
```
1. Click on module
2. setMenu("function")
3. SYS: Switch to getFrame + active inlineframe
4. Use filters if needed
5. Click on table row
✅ Done!
```

## ⚡ Quick Decision Helper

Ask yourself ONE question:

**"Can I type above the table to search?"**
- 🚫 NO = Simple Browse = `getFrame`
- ✅ YES = Filtered Grid = `getFrame + active inlineframe`

That's it! This one question solves 90% of table frame issues.