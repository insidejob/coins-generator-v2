# COINS Action to Iframe Mapping

> 📌 **Internal Technical Documentation** - This maps COINS actions/functions to their iframe requirements for script generation.

## Core Principle: Action Triggers Frame Switch

The pattern is: **Certain COINS actions/functions trigger page reloads or context changes that require frame re-establishment**

## 🔄 Actions That REQUIRE Frame Switch After

### Always Need `SYS: Switch to getFrame` After:
| Action | Why | Example | Confidence |
|--------|-----|---------|------------|
| `setMenu()` | Loads new function/page | `setMenu("%WWF2000BWFP")` | ✅ 100% (2/2) |
| `runAction()` | Executes COINS program | `runAction("%WWF2002AWFP")` | ✅ 100% (5/5) |
| `runActionByKcoKey()` | Executes with parameters | `runActionByKcoKey("wfp01", $wf, "wfuwfp02")` | ✅ 100% (1/1) |
| `Navigate to URL` | Full page load | `Navigate to ${$url + '/wologin.p'}` | ✅ 100% |
| `reload` | Page refresh | After login sequence | ✅ 100% |
| `clickRowColumn()` | May load new page | `clickRowColumn("0", "wfp_code")` | ✅ 100% (3/3) |
| `Click "Save"` | Page reload (context dependent) | In GL module | ⚠️ Context (GL: Yes) |
| Navigation clicks | Menu/module navigation | `Click on "House Sales"` | ✅ 100% |

### Need Webix Pattern After:
| Action | Context | Pattern |
|--------|---------|---------|
| `Click on "Tasks"` | In Activity Workbench | `SYS: Switch to Webix getFrame` |
| After save in Webix | Webix context | First `getFrame`, then `Webix getFrame` |

### Need Active Inlineframe After:
| Action | Context | Pattern |
|--------|---------|---------|
| `setTab()` | Switching tabs | `SYS: Switch to active inlineframe` |
| Sales Workbench grids | With search filters | `SYS: Switch to getFrame + active inlineframe` |

### Need Parent Frame Navigation:
| Action | Context | Pattern |
|--------|---------|---------|
| Warning dialog appears | Delete confirmations | `Switch to parent iframe (2x)` |
| Accessing header menus | From deep frame context | `Switch to parent iframe (2x)` |

## 🚫 Actions That DON'T Require Frame Switch

### Can Continue in Current Frame:
| Action | Why | Example | Confidence |
|--------|-----|---------|------------|
| `setFilter()` | Filters in current context | `setFilter("", "", $wf)` | ✅ 100% (3/3) |
| `selectRow()` | Selection only | `selectRow("0", "")` | ✅ 100% (7/7) |
| `setCheckbox()` | Form interaction | `setCheckbox("hsa_complete", "true")` | ✅ 100% |
| `Pick from dropdown` | Form interaction | `Pick "Process 1" from "wft_next"` | ✅ 100% (4/4) |
| `Enter/Write` | Text input | `Enter "test" in "field"` | ✅ 100% |
| `assertElementDisplayed` | Just checking | `assertElementDisplayed("div.newTasks", "true")` | ✅ 100% |
| `assertColumnValue` | Just checking | `assertColumnValue($GL, "Y")` | ✅ 100% (6/6) |
| `assertAlert()` | Alert checking | `assertAlert("GL729")` | ✅ 100% |
| `clickOK` | Alert dismissal | Alert button | ✅ 100% |
| `Store value` | Variable storage | `Store value ${$wf} in $test` | ✅ 100% |

## 🎯 Decision Rules for Script Generation

### Rule 1: Page Load/Context Change
```
IF action causes page load or context change:
    THEN add: SYS: Switch to getFrame
```

### Rule 2: Form vs Navigation
```
IF action is form interaction (input, checkbox, dropdown):
    THEN no frame switch needed
ELSE IF action is navigation/execution:
    THEN add appropriate frame switch
```

### Rule 3: Wait for Completion
```
IF frame switch needed:
    THEN first: waitForElementToDisappear("[alt=submitted]")
```

### Rule 4: Special Contexts
```
IF in Activity Workbench AND clicking Tasks:
    THEN use: SYS: Switch to Webix getFrame
    
IF seeing warning dialog:
    THEN use: Switch to parent iframe (2x)
    
IF using setTab():
    THEN use: SYS: Switch to active inlineframe
```

## 📊 Pattern Recognition from Journey Analysis

From the workflow journey, the pattern emerges:

1. **Navigation/Execution** → Frame switch
   - `setMenu()` → `getFrame`
   - `runAction()` → `getFrame`
   - `clickRowColumn()` → `getFrame`

2. **Form Interactions** → No switch
   - `setCheckbox()` → Continue
   - `Pick from` → Continue
   - `Click "Save"` → Continue (but switch after if context changes)

3. **Special UI Components** → Special patterns
   - Activity Workbench → Webix
   - Tabs → Active inlineframe
   - Warnings → Parent frames

## 🏗️ Building Scripts from Plain English

Given: "Navigate to workflow, filter for TEST_WF, and open it"

Translation:
```javascript
setMenu("%WWF2000BWFP")              // Navigation
SYS: Switch to getFrame              // ← Because setMenu loads new page

setFilter("", "", "TEST_WF")         // Filter action
// No frame switch - filter doesn't change context

clickRowColumn("0", "wfp_code")      // Click action that may navigate
SYS: Switch to getFrame              // ← Because click may load new content
```

## 🔑 Key Insight

**The frame switch is not about the visual state, but about COINS's internal page/context changes.**

Actions that:
- Load new pages/functions → Need frame switch
- Stay in current context → Don't need frame switch
- Use special UI components → Need special patterns