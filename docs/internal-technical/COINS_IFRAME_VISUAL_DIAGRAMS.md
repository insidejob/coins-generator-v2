# COINS Iframe Visual Diagrams

## Standard COINS Page Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Window                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                  COINS Header Bar                    │ │
│ │        [Home] [Modules] [User: John] [Logout]       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                 <iframe "mainarea">                  │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │              <iframe "getFrame">                 │ │ │
│ │ │                                                  │ │ │
│ │ │  📊 Grid View / Main Content Area              │ │ │
│ │ │  [Add] [Edit] [Delete] [Refresh]               │ │ │
│ │ │  ┌─────────────────────────────────────┐       │ │ │
│ │ │  │ Filter: [____] [____] [Search]      │       │ │ │
│ │ │  ├─────┬───────┬────────┬──────────────┤       │ │ │
│ │ │  │ Job │ Phase │ Plot   │ Status       │       │ │ │
│ │ │  ├─────┼───────┼────────┼──────────────┤       │ │ │
│ │ │  │ 128 │ 001   │ 099    │ Available    │       │ │ │
│ │ │  │ 128 │ 001   │ 100    │ Reserved     │       │ │ │
│ │ │  └─────┴───────┴────────┴──────────────┘       │ │ │
│ │ │                                                  │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

Frame Path: mainarea > getFrame
Visual Indicators: Grid view, filter fields, action buttons
```

## Modal Dialog Structure (e.g., New Reservation)

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Window                        │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ← Dimmed background
│ ░░┌─────────────────────────────────────────────────┐░░ │
│ ░░│          <div id="desktopDialog">               │░░ │
│ ░░│ ┌─────────────────────────────────────────────┐ │░░ │
│ ░░│ │              <iframe>                        │ │░░ │
│ ░░│ │ ┌─────────────────────────────────────────┐ │ │░░ │
│ ░░│ │ │         <iframe "mainarea">              │ │ │░░ │
│ ░░│ │ │ ┌─────────────────────────────────────┐ │ │ │░░ │
│ ░░│ │ │ │      <iframe "getFrame">            │ │ │ │░░ │
│ ░░│ │ │ │                                     │ │ │ │░░ │
│ ░░│ │ │ │  New Reservation                [X] │ │ │ │░░ │
│ ░░│ │ │ │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │ │ │░░ │
│ ░░│ │ │ │  Progress: ●──○──○──○──○──○        │ │ │ │░░ │
│ ░░│ │ │ │                                     │ │ │ │░░ │
│ ░░│ │ │ │  [Start Reservation]                │ │ │ │░░ │
│ ░░│ │ │ │  [PURCH1] [RESDET] [CHOICE]        │ │ │ │░░ │
│ ░░│ │ │ │                                     │ │ │ │░░ │
│ ░░│ │ │ │  Form Fields...                     │ │ │ │░░ │
│ ░░│ │ │ │  Name: [_______________]            │ │ │ │░░ │
│ ░░│ │ │ │                                     │ │ │ │░░ │
│ ░░│ │ │ │  [Save] [Cancel]                    │ │ │ │░░ │
│ ░░│ │ │ └─────────────────────────────────────┘ │ │ │░░ │
│ ░░│ │ └─────────────────────────────────────────┘ │ │░░ │
│ ░░│ └─────────────────────────────────────────────┘ │░░ │
│ ░░└─────────────────────────────────────────────────┘░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────────────────────────┘

Frame Path: desktopDialog > iframe > mainarea > getFrame
Visual Indicators: Dimmed background, modal window, X button
```

## Grid with Active Inline Frame (Filtered Results)

```
┌─────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────┐ │
│ │                 <iframe "mainarea">                  │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │              <iframe "getFrame">                 │ │ │
│ │ │ ┌─────────────────────────────────────────────┐ │ │ │
│ │ │ │      <iframe class="inlineframe active">    │ │ │ │
│ │ │ │ ┌─────────────────────────────────────────┐ │ │ │ │
│ │ │ │ │         <iframe "getFrame">             │ │ │ │ │
│ │ │ │ │                                         │ │ │ │ │
│ │ │ │ │  Filtered Grid Results                  │ │ │ │ │
│ │ │ │ │  ┌──────┬────────┬─────────────────┐   │ │ │ │ │
│ │ │ │ │  │ Code │ Name   │ Action          │   │ │ │ │ │
│ │ │ │ │  ├──────┼────────┼─────────────────┤   │ │ │ │ │
│ │ │ │ │  │ 099  │ Plot99 │ [Select] [View] │   │ │ │ │ │
│ │ │ │ │  └──────┴────────┴─────────────────┘   │ │ │ │ │
│ │ │ │ └─────────────────────────────────────────┘ │ │ │ │
│ │ │ └─────────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

Frame Path: mainarea > getFrame > inlineframe.active > getFrame
Visual Indicators: Filtered results, embedded grid
```

## Visual State Transitions

### State 1: Main Menu
```
[House Sales Icon]  [Payroll Icon]  [Finance Icon]
      📊                 💰              💵
```
**Frame**: Top level (no switches yet)

### State 2: After Module Click
```
House Sales > Sales Workbench
[Grid appears with data]
```
**Frame**: Switch to getFrame + active inlineframe

### State 3: Modal Opens
```
Background dims ░░░░░░░░░░
    ┌─Modal Window─┐
    │              │
    └──────────────┘
```
**Frame**: Switch to Dialog Frame

### State 4: Nested Modal
```
░░░░░░░░░░░░░░░░░░░░
░┌─Primary Modal──┐░
░│ ┌─Nested────┐  │░
░│ │           │  │░
░│ └───────────┘  │░
░└────────────────┘░
```
**Frame**: Switch to Desktop Frame

## Quick Visual Reference Card

```
┌─────────────────────────────────────────┐
│         VISUAL CUE → FRAME ACTION       │
├─────────────────────────────────────────┤
│ 📊 Grid appears → getFrame + active     │
│ 🔲 Modal opens → Dialog Frame           │
│ 🔳 Modal in modal → Desktop Frame       │
│ 💾 After save → Re-establish frame      │
│ 🏠 Module navigation → getFrame         │
│ 🔍 Filter/Search → Stay in frame        │
│ ➕ Add button → Will open modal         │
│ ✏️ Edit button → Will open modal        │
│ ❌ Cancel → Return to parent frame      │
│ 🔄 Page refresh → Start over            │
└─────────────────────────────────────────┘
```

## Browser DevTools Visual Guide

### How frames appear in DevTools:
```html
Elements Tab:
▼ html
  ▼ body
    ▼ div.main-container
      ▼ iframe#mainarea    ← Click to highlight
        ▼ #document
          ▼ html
            ▼ body
              ▼ iframe#getFrame    ← Current context
                ▼ #document
                  ▼ html
                    ▼ body
                      ● Your content here
```

### Console Frame Selector:
```
Console Tab:
┌─────────────────────┐
│ top ▼               │ ← Dropdown shows all frames
├─────────────────────┤
│ > top               │
│ > mainarea          │
│ > getFrame ✓        │ ← Current frame
│ > desktopDialog     │
└─────────────────────┘
```

### Network Tab Frame Indicator:
```
Network Tab:
Name          Status  Type     Initiator
─────────────────────────────────────────
api/data      200     xhr      getFrame
style.css     200     css      mainarea
module.js     200     script   top
```

These visual diagrams help developers and testers understand exactly what they're seeing in the COINS interface and how it maps to the underlying iframe structure.