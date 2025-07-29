# COINS Stage Navigation - Direct URL Pattern

## Discovery
Direct navigation to stage URLs works and avoids complex frame switching, but loads a different layout requiring only `getFrame` context.

## Working Pattern

### Instead of:
```javascript
Click on "Update"
SYS: Switch to Desktop Frame  // Complex multi-level switch
```

### Use Direct Navigation:
```javascript
Navigate to "${$url}/woframe.p?TopMenu=%25WHS2&kco=210&program=wou005&MainArea=%WHS1011SPPE&workbench=SALES&vp_wbsdefRowid=0x0000000000491a0f&hs_resprogRowid=0x00000000111cd085&reservationStage=PURCH1&button=action:add&fromSalesKanban=progbar"

// Then just switch to getFrame (simpler!)
SYS: Switch to getFrame
```

## Benefits
1. Avoids the `resStageButtonClick()` frame issues
2. Simpler frame context (just getFrame)
3. More reliable navigation
4. No Desktop Frame complexity

## Challenge
The URLs contain dynamic IDs that change per session:
- `vp_wbsdefRowid`: Changes per workbench session
- `hs_resprogRowid`: Changes per reservation

## Proposed Extension: `navigateToStage()`

### Usage:
```javascript
// Simple usage with stage code
navigateToStage("PURCH1")
navigateToStage("PURCH2")
navigateToStage("SOLIC")
navigateToStage("PLOTSEL")

// Advanced usage with options
navigateToStage("PURCH1", {
  action: "add",  // or "edit", "view"
  fromKanban: true
})
```

### Implementation Logic:
1. Extract current page's workbench and reservation IDs
2. Build the navigation URL with the requested stage
3. Navigate to the URL
4. Automatically switch to getFrame

### Extension Pseudocode:
```javascript
function navigateToStage(stageCode, options = {}) {
  // Extract current IDs from page
  const currentUrl = window.location.href;
  const wbRowid = extractParam(currentUrl, 'vp_wbsdefRowid');
  const resRowid = extractParam(currentUrl, 'hs_resprogRowid');
  
  // Build navigation URL
  const params = {
    TopMenu: '%25WHS2',
    kco: getCurrentKco(),
    program: 'wou005',
    MainArea: '%WHS1011SPPE',
    workbench: 'SALES',
    vp_wbsdefRowid: wbRowid,
    hs_resprogRowid: resRowid,
    reservationStage: stageCode,
    button: options.action || 'action:add',
    fromSalesKanban: options.fromKanban ? 'progbar' : ''
  };
  
  const url = buildUrl('/woframe.p', params);
  
  // Navigate
  navigate(url);
  
  // Auto-switch to correct frame
  switchToFrame('getFrame');
}
```

## Stage Codes Reference

Common reservation stages:
- `START`: Start Reservation
- `PURCH1`: Purchaser 1 (Main Contact)
- `PURCH2`: Purchaser 2
- `SOLIC`: Solicitor
- `PLOTSEL`: Plot Selection
- `EXTRAS`: Extras/Options
- `SUMM`: Summary

## Current Workaround

Until the extension exists, use:
```javascript
// Store the full URL when on the correct page
setTestData("purchaser1_url", "[full URL with PURCH1]")

// Then navigate when needed
Navigate to $oData.purchaser1_url
SYS: Switch to getFrame
```