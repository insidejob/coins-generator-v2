# COINS Iframe Visual Mapping Guide

## Visual Indicators That Predict Frame Switches

### 1. Navigation Bar Changes
**Visual Cue**: When the top navigation bar changes or a new menu appears
```
User Sees: House Sales → Sales Workbench menu appears
Frame Action: SYS: Switch to getFrame + active inlineframe (for grids)
```

### 2. Modal Dialog Overlays
**Visual Cue**: Screen dims and a popup window appears
```
User Sees: 
- Background grays out
- Modal window with title bar
- Close (X) button in corner

Frame Action: SYS: Switch to Dialog Frame
```

### 3. Grid/Table Views
**Visual Cue**: Data displayed in rows and columns with filters
```
User Sees:
- Filter fields at top
- Sortable column headers  
- Row selection checkboxes
- Pagination controls

Frame Action: SYS: Switch to getFrame + active inlineframe
```

### 4. Multi-Panel Layouts
**Visual Cue**: Screen split into multiple sections (common in Finance)
```
User Sees:
- Header panel
- List panel on left
- Detail panel on right
- Footer/summary panel

Frame Action: Switch to 4 frames (Financial modules)
```

### 5. Loading Spinners
**Visual Cue**: Spinning icon or "Processing..." message
```
User Sees: [alt=submitted] spinner
Frame Action: Wait for spinner to disappear, then switch frames
```

## Browser DevTools Frame Verification

### Chrome/Edge DevTools Method

1. **Open DevTools** (F12)
2. **Navigate to Elements tab**
3. **Look for iframe hierarchy**

```html
<!-- What you'll see in DevTools -->
<body>
  <div id="mainarea">
    <iframe name="mainarea" id="mainarea">
      #document
        <iframe name="getFrame" id="getFrame">
          #document
            <!-- Your current context is here -->
            <div class="grid-container">...</div>
        </iframe>
    </iframe>
  </div>
  
  <!-- Modal dialogs appear separately -->
  <div id="desktopDialog" class="modal-overlay">
    <iframe>
      #document
        <div id="mainarea">
          <iframe name="mainarea">
            #document
              <iframe name="getFrame">
                <!-- Modal content -->
              </iframe>
          </iframe>
        </div>
    </iframe>
  </div>
</body>
```

### Quick Console Commands

```javascript
// Check current frame context
console.log('Current frame:', window.frameElement?.name || 'top');

// List all iframes
Array.from(document.querySelectorAll('iframe')).forEach(f => 
  console.log('Frame:', f.name || f.id, 'Visible:', f.offsetWidth > 0)
);

// Find element in any frame
function findInAllFrames(selector) {
  function search(win, path) {
    try {
      const el = win.document.querySelector(selector);
      if (el) console.log('Found in:', path);
      
      Array.from(win.document.querySelectorAll('iframe')).forEach((f, i) => {
        search(f.contentWindow, path + ' > ' + (f.name || `frame[${i}]`));
      });
    } catch(e) {} // Cross-origin frames
  }
  search(window, 'top');
}

// Usage
findInAllFrames('input[name="Surname"]');
```

### Visual Frame Indicators in DevTools

1. **Highlighted iframe borders**: When selecting an iframe in Elements panel
2. **#document nodes**: Indicate frame boundaries
3. **Console context dropdown**: Shows available frames
4. **Network tab**: Shows which frame made requests

## UI Element to Frame Mapping

### Standard Page Elements

| UI Element | Visual Appearance | Required Frame | When to Switch |
|------------|-------------------|----------------|----------------|
| **Module Icons** | Large tiles on home | None initially | After click → getFrame |
| **Menu Items** | Left navigation menu | getFrame | Already in context |
| **Browse Grids** | Data tables | getFrame + active inlineframe | After setMenu() |
| **Add Button** | Green + icon | Current → Dialog/Desktop Frame | After click |
| **Edit Button** | Pencil icon | Current → Dialog/Desktop Frame | After click |
| **Save Button** | Disk icon | Stay in current | After save → re-establish |
| **Cancel Button** | X or Cancel text | Current → parent/getFrame | Returns to previous |

### Modal Dialog Elements

| Modal Type | Visual Indicators | Frame Pattern | Key Elements |
|------------|-------------------|---------------|--------------|
| **New Reservation** | Full screen overlay, progress bar | Dialog Frame | Stage buttons at top |
| **Add Choice** | Popup within modal | Desktop Frame | Nested modal indicator |
| **Lookup Window** | Small popup, search field | active inlineframe | Search and select list |
| **Date Picker** | Calendar popup | active inlineframe | Calendar grid |
| **Validation Error** | Red banner/popup | Same frame | Error message box |

### Financial Module Layouts

```
┌─────────────────────────────────────┐
│         Header (Frame 1)            │
├──────────┬──────────────────────────┤
│  List    │                          │
│ (Frame 2)│    Detail (Frame 3)      │
│          │                          │
├──────────┴──────────────────────────┤
│         Summary (Frame 4)           │
└─────────────────────────────────────┘

Frame Action: Switch to 4 frames
Access Pattern: Navigate to specific frame number
```

## Visual Workflow Patterns

### 1. Browse → Add New Record
```
Visual Flow:
[Grid View] → Click "Add" → [Modal Opens] → [Form Fields Appear]

Frame Flow:
getFrame + active inlineframe → Click → Dialog Frame → Input fields
```

### 2. Multi-Stage Modal (House Sales)
```
Visual Flow:
[New Reservation] → [Stage 1: Start] → [Stage 2: Purchaser] → [Stage 3: Details]
     ↓                    ↓                    ↓                      ↓
Progress Bar: ●────○────○────○    ●────●────○────○    ●────●────●────○

Frame Flow:
Click stages → Dialog Frame → Form input → Click next → Dialog Frame (re-establish)
```

### 3. Grid Filter and Select
```
Visual Flow:
[Empty Grid] → Type in filter → [Filtered Results] → Click row → [Detail View]

Frame Flow:
getFrame + active inlineframe → Filter → Same frame → Click → getFrame or Dialog
```

## Quick Reference: Visual Cues to Frame Actions

| What You See | What It Means | Frame Action Required |
|--------------|---------------|----------------------|
| 🏠 Module tiles | Home screen | None yet |
| 📊 Data grid appears | Browse mode | getFrame + active inlineframe |
| 🔲 Modal overlay | Dialog opened | Dialog Frame |
| 💾 Save completes | Context may change | Re-establish current frame |
| 🔄 Page refresh | Full navigation | Start from getFrame |
| ⚡ Quick popup | Lookup/picker | active inlineframe |
| 📑 Multi-panel view | Complex layout | 4 frames or container |
| ❌ Error banner | Validation failed | Stay in current frame |
| ✓ Success message | Action completed | May need frame switch |

## Testing Frame Context

### Manual Test in Browser
1. Right-click on element you want to interact with
2. Select "Inspect Element"
3. In DevTools, look at the frame hierarchy above the element
4. Note all parent iframes - these need to be switched to in order

### Automated Context Detection
```javascript
// Add this as a test helper
function getCurrentFramePath() {
  let path = [];
  let currentWindow = window;
  
  while (currentWindow !== window.top) {
    const frameName = currentWindow.frameElement?.name || 
                      currentWindow.frameElement?.id || 
                      'unnamed';
    path.unshift(frameName);
    currentWindow = currentWindow.parent;
  }
  
  return path.length ? path.join(' > ') : 'top';
}

// Usage in test
console.log('Current frame path:', getCurrentFramePath());
// Output: "mainarea > getFrame" or "desktopDialog > mainarea > getFrame"
```

## Common Visual Patterns

### Pattern 1: "Nothing happens when I click"
**Visual**: Button appears clickable but nothing happens
**Cause**: Wrong frame context
**Fix**: Check frame hierarchy in DevTools, switch to correct frame

### Pattern 2: "Element appears then disappears"
**Visual**: Briefly see element, then it's gone
**Cause**: Frame reload/context change
**Fix**: Re-establish frame after the action that caused reload

### Pattern 3: "Can see element but can't interact"
**Visual**: Element visible but clicks pass through
**Cause**: Element in different frame than current context
**Fix**: Switch to frame containing the element

### Pattern 4: "Modal content not loading"
**Visual**: Modal opens but shows blank/loading
**Cause**: Frame switch too early
**Fix**: Wait for modal to fully load before switching frames

This visual mapping guide helps connect what users see in the COINS interface with the underlying iframe structure, making it easier to predict and debug frame-related issues.