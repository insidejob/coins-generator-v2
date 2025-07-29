# COINS Module Analysis Tracker

> 📌 **Internal Technical Documentation** - Tracking which modules have been analyzed for iframe patterns

## ✅ Modules Analyzed

### 1. System (SYS) - Workflow Management
**Journey**: Activity Workbench workflow processing
**Key Patterns**:
- Webix frames for Activity Workbench Tasks
- Parent frame navigation for header access
- Active inlineframe for setTab()
- Standard getFrame for most operations

**New Discoveries**:
- `SYS: Switch to Webix getFrame` pattern
- Double frame re-establishment after Webix save
- setFilter() doesn't need active inlineframe

---

### 2. Finance (FIN) - General Ledger (GL)

#### Journey 1: GL001 - Open and Close Periods
**Key Patterns**:
- Very simple - only uses standard getFrame
- Save operations trigger page reload
- No complex frame patterns at all

**Consistent Actions**:
- `setMenu()` → getFrame
- `runAction()` → getFrame
- `Click "Save"` → getFrame (after reload)
- Alert handling stays in current frame

#### Journey 2: GL003 - GL Batch
**Key Patterns**:
- 🆕 **Container Pattern discovered!**
- Active inlineframe for Transactions tab
- Container + 2x parent to exit nested contexts

**New Discoveries**:
- `SYS: Switch to Container` + 2x parent frames
- Used when exiting active inlineframe
- After major operations in nested context
- Before navigation after deep nesting

**Workflow**:
1. Main batch screen → Add batch
2. Click Transactions → `active inlineframe`
3. Work in transactions → Save
4. Exit to main → `Container` + 2x parent
5. Post batch → `Container` again

---

### 3. Finance (FIN) - Sales Ledger (SL)

#### Journey: SL006 - Add SINV Small Works
**Key Patterns**:
- 🆕 **Container with 4 parent frames!** (not just 2)
- XPath frame navigation for deep modals
- Complex Revenue Distribution pattern
- Standard inlineframe for invoice entry

**Major Discoveries**:
1. **Container Variations**:
   - 2x parent (standard tabs)
   - 4x parent (deep nesting like Revenue Distribution)
   
2. **XPath Frame Switching**:
   ```javascript
   Switch iframe to "/html/body/form/table/tbody/tr/..."
   ```
   - Indicates modal within modal
   - Very deep DOM structure

3. **Revenue Distribution Pattern**:
   - Exit: Container + 4x parent
   - Enter: getFrame + active inlineframe
   - Contains nested modals with XPath

**Workflow Complexity**:
1. Batch → Add invoice (inlineframe)
2. Invoice → Lines (stays in frame)
3. Invoice → Revenue Distribution (Container 4x → active inline)
4. Distribution → Add (XPath modal navigation)

---

## 🔄 Modules Pending Analysis

### High Priority (Core Modules):
- [ ] Purchase Ledger (PL) - Expected: active inlineframe, 4-frame pattern
- [ ] Sales Ledger (SL) / Accounts Receivable (AR)
- [ ] Purchase Orders (PO)
- [ ] House Sales (HS) - Expected: Desktop/Dialog frames
- [ ] Payroll (PR)

### Medium Priority:
- [ ] Human Resources (HCM)
- [ ] Subcontract (SC)
- [ ] Accounts Payable (AP)
- [ ] Construction/Contract Status

### Low Priority:
- [ ] Asset Management
- [ ] Reporting & BI
- [ ] Document Management

## 📊 Pattern Frequency by Module

| Pattern | SYS | FIN/GL | FIN/SL | Total |
|---------|-----|--------|--------|-------|
| Standard getFrame | ✓ | ✓ | ✓ | 3/3 |
| Standard inlineframe | - | - | ✓ | 1/3 |
| Active inlineframe | ✓ | ✓ | ✓ | 3/3 |
| Container (2x parent) | - | ✓ | ✓ | 2/3 |
| Container (4x parent) | - | - | ✓ | 1/3 |
| Parent frame | ✓ | ✓ | ✓ | 3/3 |
| XPath frame | - | - | ✓ | 1/3 |
| Webix getFrame | ✓ | - | - | 1/3 |
| Dialog frame | - | - | - | 0/3 |
| Desktop frame | - | - | - | 0/3 |
| 4-frame pattern | - | - | - | 0/3 |

## 🎯 Next Recommended Journeys

1. **Purchase Ledger** - To verify active inlineframe and 4-frame patterns
2. **House Sales** - To verify Desktop/Dialog frame patterns
3. **Purchase Orders** - Mixed patterns expected
4. **Payroll** - Should be simple like GL
5. **Sales Ledger** - Complex grids expected