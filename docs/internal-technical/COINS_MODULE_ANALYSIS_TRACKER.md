# COINS Module Analysis Tracker

> 📌 **Internal Technical Documentation** - Tracking which modules have been analyzed for iframe patterns

## 📊 Analysis Summary
- **SYS**: 1 journey
- **FIN/GL**: 2 journeys
- **FIN/SL**: 1 journey
- **FIN/SC (UK)**: 1 journey
- **PRO (UK)**: 7 journeys
- **DOC (ANY)**: 6 journeys
- **HCM/PR (US)**: 10 journeys
- **HCM/ESS (US)**: 2 journeys
- **HOM/Construction (UK)**: 6 journeys
- **HOM/Customer Care (UK)**: 7 journeys
- **Total Journeys Analyzed**: 43

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

### 4. Finance (FIN) - Subcontract (SC) - UK Module

#### Journey: SC002B - Add Multiple Lines To SC Order (UK)
**Key Patterns**:
- Standard getFrame for main operations
- Active inlineframe for Lines tab operations
- Similar to Purchase Order patterns

**Pattern Flow**:
1. Login and setup → getFrame
2. Navigate to order header → getFrame
3. Select order → getFrame
4. **Switch to Lines tab** → `active inlineframe`
5. Add/edit lines → stays in active inlineframe
6. Save and logout → standard patterns

**Notable Behaviors**:
- Uses `%WPO101DTPHL` function (Purchase Order module crossover)
- Lines tab requires active inlineframe (consistent with other modules)
- No Container pattern needed (simpler than GL/SL complex journeys)
- Pattern matches Purchase Order workflows

**Consistency Score**: High - follows expected patterns for order line management

---

### 5. Procurement (PRO) - UK Module

#### Journey: PO001 - Material Order (no WBS) + Invoice Matching (AK)
**Key Patterns**:
- Standard getFrame for most operations
- Active inlineframe for invoice matching tab
- **User switching mid-journey** (prouser1 → DEIDER)
- Complex multi-step workflow across modules

**Pattern Flow**:
1. Create order → standard getFrame
2. Add material lines → standard getFrame (no active frame needed!)
3. Commit order → standard getFrame
4. **User switch** → Logout and login as Purchase Ledger user
5. Create PLINV batch → getFrame
6. Switch to matching tab → `active inlineframe`
7. Match invoice lines → stays in active frame
8. Post batch → standard patterns

**Notable Behaviors**:
- **No active inlineframe for adding order lines** (unlike SC module!)
- Invoice matching requires active inlineframe (consistent)
- Uses both `mainarea` and direct `getFrame` switching
- Cross-module workflow (PRO → PL)
- Multiple user roles required for complete process

**Unusual Pattern Alert**: 
- ⚠️ Adding order lines does NOT use active inlineframe (differs from SC002B)
- This suggests module-specific variations in line handling

#### Journey 2: PO004 - Plant Order + Plant Maintenance + Invoice Matching
**Key Patterns**:
- Standard getFrame throughout (consistent with PO001)
- Active inlineframe for invoice matching (consistent)
- **No active inlineframe for adding plant lines** (confirms PRO pattern)
- Plant Maintenance operations use standard getFrame

**Pattern Flow**:
1. Create plant order → standard getFrame
2. Add plant lines → standard getFrame (NOT active frame)
3. Commit order → standard getFrame
4. Plant Maintenance → standard getFrame
5. **User switch** → Logout and login as PL user
6. Create PLINV batch → getFrame
7. Invoice matching → `active inlineframe`
8. Post batch → standard patterns

**Notable Behaviors**:
- Plant order follows same pattern as material order
- Plant Maintenance module accessed via setMenu
- Complex date-based calculations for plant hire
- Invoice matching identical to PO001 pattern

**Pattern Consistency**: PRO module confirmed to NOT use active inlineframe for order lines

#### Journey 3: PO001C - Cancel Material Order
**Key Patterns**:
- Standard getFrame throughout
- Uses setContainer() for "Material Orders" navigation
- Simple iframe patterns for order cancellation
- No active inlineframe needed

**Pattern Flow**:
1. Login and setup → standard patterns
2. Find material order → setContainer() + getFrame
3. Create cancellation variation → standard getFrame
4. Navigate back to order → setContainer() + getFrame
5. Commit cancellation → standard getFrame
6. Verify cancellation → API queries

**Notable Behaviors**:
- **New pattern**: `setContainer("Material Orders")` for navigation
- Alert handling for warnings (PO462, PO669)
- Depends on data from previous journey (PO001)
- No complex iframe switching despite multi-step process

**Unusual Patterns**:
- None - very straightforward iframe usage
- Confirms PRO module's simple iframe patterns

#### Journey 4: PO006A - Subcontract Order Summary Screen
**Key Patterns**:
- Heavy use of active inlineframe for tab navigation
- Container pattern (2x parent) for tab switching
- Multi-level tab navigation (tabs within tabs)
- Complex navigation flow with drill-downs

**Pattern Flow**:
1. Find order → setContainer() + getFrame
2. Open summary → getFrame
3. Order tab → `active inlineframe`
4. Navigate sub-tabs → stays in active frame
5. **Switch main tabs** → `Container` (2x parent) → new `active inlineframe`
6. Drill into item → getFrame → active inlineframe for item tabs
7. Navigate back → Container → getFrame

**Notable Behaviors**:
- **Container pattern returns!** Used between main tab switches
- Nested tab structure (Order tab has Main/Addresses/Details/Agreement sub-tabs)
- Each main tab switch requires Container → active inlineframe
- Drill-down navigation creates new frame context

**Unusual Patterns**:
- ⚠️ **Most complex PRO journey yet**
- First PRO journey to use Container pattern
- Multiple active inlineframe switches in single journey
- Shows PRO module CAN have complex patterns for summary screens

#### Journey 5: PO001A - Material Order Summary Screen
**Key Patterns**:
- Identical to PO006A (Subcontract Order Summary)
- Heavy use of active inlineframe for tabs
- Container pattern (2x parent) between main tabs
- Complex drill-down navigation

**Pattern Flow**:
1. Find order → setContainer("Material Orders") + getFrame
2. Open summary → getFrame
3. Order tab → `active inlineframe`
4. **Switch main tabs** → `Container` → new `active inlineframe`
5. Lines tab with Detail view → active frame
6. Item Summary → Container → active frame
7. Drill into item → getFrame → multiple tab switches with Container

**Notable Behaviors**:
- **Confirms summary screen pattern** across order types
- Material order summary uses exact same patterns as subcontract
- Item drill-down has 5 tabs (Main, History, GRNs, Invoices, Movement)
- Each tab switch in item view requires Container pattern

**Pattern Consistency**:
- Summary screens in PRO module consistently use Container patterns
- Transaction screens (create/edit) use simple patterns
- Order type (material vs subcontract) doesn't affect patterns

#### Journey 6: PO024 - Stock Order + GRN + Invoice Matching
**Key Patterns**:
- Standard getFrame for all operations
- Active inlineframe ONLY for invoice matching
- No Container patterns despite complex workflow
- Confirms PRO transaction pattern

**Pattern Flow**:
1. Create stock order → standard getFrame
2. Add stock lines → standard getFrame (no active frame)
3. Commit order → standard getFrame
4. Create GRN → standard getFrame
5. Process GRN lines → standard getFrame
6. Post stock batch → standard getFrame
7. Create PLINV batch → getFrame
8. Invoice matching → `active inlineframe`
9. Manual matching → stays in active frame
10. Post batch → standard patterns

**Notable Behaviors**:
- **Stock orders follow material order pattern** (no active frame for lines)
- GRN processing uses standard patterns throughout
- Only invoice matching tab uses active inlineframe
- Complex multi-step process but simple iframe patterns

**Pattern Consistency**:
- Transaction screens remain simple across all order types
- Stock, Material, Plant orders all use same patterns
- Invoice matching universally uses active inlineframe

#### Journey 7: PO055 - Stock Order + PO/AUTOSTK=Y
**Key Patterns**:
- Standard getFrame throughout all operations
- Active inlineframe ONLY for invoice matching
- No Container patterns
- Identical to PO024 pattern-wise

**Pattern Flow**:
1. Enable AUTOSTK parameter → standard operations
2. Create stock order → standard getFrame
3. Add stock lines → standard getFrame (no active frame)
4. Commit/Print/GRN → standard getFrame
5. Find auto-created GRN → standard getFrame
6. Navigate to stock batch → standard getFrame
7. Post stock batch → standard getFrame
8. Create PLINV batch → getFrame
9. Invoice matching → `active inlineframe`
10. Post batch → standard patterns

**Notable Behaviors**:
- **AUTOSTK parameter doesn't affect iframe patterns**
- Auto-created GRN and batch use same patterns as manual
- Stock batch navigation uses standard patterns
- Invoice matching remains consistent

**Pattern Consistency**:
- 100% consistent with PO024 despite AUTOSTK automation
- Confirms PRO patterns are operation-based, not feature-based

---

### 6. Document Management (DOC) - ANY

#### Journey: DM001 - CardView Add Document
**Key Patterns**:
- Standard getFrame for navigation
- Standard inlineframe for CardView (NOT active!)
- **NEW PATTERN**: Dialog Frame for document upload
- Complex frame switching for dialog operations

**Pattern Flow**:
1. Login and setup → standard getFrame
2. Filter to contract → standard getFrame
3. Switch to CardView → `setContainer()` → `inlineframe` (not active!)
4. Click Add Document → switch to parent frames
5. **Document Upload Dialog** → `Dialog Frame` pattern
6. Upload operations → stay in dialog frame
7. Exit and verify → standard patterns

**Notable Behaviors**:
- **First appearance of Dialog Frame pattern!**
- Dialog frame XPath: `//*[@id='desktopDialog']/iframe`
- CardView uses standard inlineframe, NOT active inlineframe
- Multiple parent frame switches to reach dialog

**Dialog Frame Pattern**:
```
Switch to parent iframe (2x)
Switch iframe to "//*[@id='desktopDialog']/iframe"
Switch iframe to "mainarea"
Switch iframe to "getFrame"
```

**Unusual Patterns**:
- ⚠️ **Dialog Frame is completely new pattern**
- Standard inlineframe (not active) for CardView
- Complex navigation between card view and dialog

#### Journey 2: DM004 - Paperclip Upload Tab
**Key Patterns**:
- Standard getFrame throughout
- Container pattern for tab navigation
- NO Dialog Frame (unlike DM001)
- Simple upload directly in main frame

**Pattern Flow**:
1. Login and filter → standard getFrame
2. Navigate to Upload tab → `setContainer()` → `Container` pattern
3. Upload operations → standard getFrame (no dialog!)
4. Verify upload → setContainer() for different view
5. Check results → standard getFrame

**Notable Behaviors**:
- **Much simpler than DM001** - no Dialog Frame
- Upload happens directly in main context
- Container pattern used for navigation between views
- No inlineframe usage at all

**Pattern Differences from DM001**:
- DM001: CardView → Dialog Frame for upload
- DM004: Direct upload in main frame
- DM001: Uses inlineframe for CardView
- DM004: No inlineframe usage

**Consistency**: Shows that upload method affects iframe patterns

#### Journey 3: DM003 - Paperclip Popup
**Key Patterns**:
- Standard getFrame for main operations
- Parent frame navigation for popup interactions
- NO Dialog Frame or inlineframe
- Ajax-based popup handling

**Pattern Flow**:
1. Login and filter → standard getFrame
2. Select contract → standard getFrame
3. **Hover over paperclip** → switch to parent frames (2x)
4. Wait for Ajax popup → stay in parent context
5. Interact with popup → parent frame operations
6. Mouse movements → trigger popup show/hide

**Notable Behaviors**:
- **No iframe for popup** - handled at parent level
- Ajax-based popup appears in DOM, not iframe
- Mouse hover triggers without frame switching
- Parent frame navigation for popup interaction

**New Pattern Discovery**:
- **Ajax popups don't use iframes**
- Different from Dialog Frame pattern
- Simpler than CardView dialog approach

**DOC Module Summary**:
- DM001: Dialog Frame for CardView uploads
- DM003: Parent frame for Ajax popups  
- DM004: Standard patterns for direct uploads

#### Journey 4: DM006 - Annotations for Document
**Key Patterns**:
- Standard getFrame for navigation
- CardView uses standard inlineframe
- Dialog Frame for annotation interface
- **Nested inlineFrame within Dialog Frame**

**Pattern Flow**:
1. Setup and parameters → standard operations
2. Navigate to CardView → `setContainer()` → `inlineframe`
3. Click annotation icon → parent frame switches
4. **Annotation Dialog** → Dialog Frame pattern
5. **Within Dialog** → additional `inlineFrame` nesting
6. Annotation operations → within nested frame
7. Close and verify → standard patterns

**Notable Behaviors**:
- **Most complex DOC pattern yet**
- Dialog Frame contains another inlineFrame
- Pattern: Dialog → mainarea → getFrame → inlineFrame → getFrame
- Multiple annotation operations within nested context

**Frame Nesting Structure**:
```
Parent frames (2x)
→ Dialog Frame (//*[@id='desktopDialog']/iframe)
  → mainarea
    → getFrame
      → inlineFrame (for annotation tools)
        → getFrame
```

**DOC Module Complete Summary**:
- DM001: Dialog Frame for CardView uploads
- DM003: Parent frame for Ajax popups
- DM004: Standard patterns for direct uploads
- DM006: Nested frames for annotation tools

#### Journey 5: DM005 - Update Meta Data
**Key Patterns**:
- Standard getFrame throughout
- Container pattern for navigation
- NO Dialog Frame or complex nesting
- Simple metadata operations

**Pattern Flow**:
1. Keyword maintenance → standard getFrame
2. Document category → standard getFrame
3. Attach keyword → `setContainer()` → operations → `Container` pattern
4. Update keyword values → setContainer() with Container switches
5. PDF report viewing → new tab (no iframe impact)
6. Verify updates → standard getFrame

**Notable Behaviors**:
- **Simplest DOC journey** alongside DM004
- Container pattern only for view switching
- No inlineframe usage
- PDF viewing in new tab doesn't affect iframes

**Pattern Consistency**:
- Metadata operations use simple patterns
- Similar to direct upload approach
- Container for navigation between sections
- No complex UI elements = no complex frames

**DOC Module Complete Summary**:
- DM001: Dialog Frame for CardView uploads
- DM003: Parent frame for Ajax popups
- DM004: Standard patterns for direct uploads
- DM005: Standard patterns for metadata updates
- DM006: Nested frames for annotation tools

#### Journey 6: DM012 - Generate Thumbnails
**Key Patterns**:
- Standard getFrame throughout
- NO Container pattern needed
- NO Dialog Frame or inlineframe
- Simplest DOC journey

**Pattern Flow**:
1. Document category maintenance → standard getFrame
2. Filter and select → standard getFrame
3. Navigate to metadata tab → standard getFrame
4. Generate thumbnails → standard getFrame
5. Wait for process → no frame impact
6. Verify results → database queries

**Notable Behaviors**:
- **Absolutely minimal iframe usage**
- No navigation between containers
- No complex UI interactions
- Background process doesn't affect frames

**Pattern Insights**:
- Background processes use simplest patterns
- No UI complexity = no iframe complexity
- Even simpler than DM004/DM005

**DOC Module Final Summary**:
- DM001: Dialog Frame for CardView uploads
- DM003: Parent frame for Ajax popups
- DM004: Standard patterns for direct uploads
- DM005: Standard patterns for metadata updates
- DM006: Nested frames for annotation tools
- DM012: Minimal patterns for background processes

---

### 7. Human Capital Management / Payroll (HCM/PR) - US

#### Journey: PR001 - Add Weekly Timesheet (check and timecard)
**Key Patterns**:
- Standard getFrame throughout
- NO active inlineframe usage
- NO Container patterns
- NO Dialog Frames
- Very simple iframe patterns

**Pattern Flow**:
1. Employee status management → standard getFrame
2. Reset calculations → standard getFrame  
3. Filter employee → standard getFrame
4. Add timesheet → standard getFrame
5. Fill timecard details → standard getFrame
6. Save and verify → standard getFrame

**Notable Behaviors**:
- **Extremely simple patterns** - only getFrame
- Similar to GL module simplicity
- No tab navigation requiring active frames
- No complex UI interactions
- Timesheet input stays in main frame

**Pattern Insights**:
- HCM/Payroll follows simple transaction patterns
- No special iframe handling for data entry
- Consistent with finance module simplicity
- Alert handling in current frame

**Consistency Score**: High - matches expected patterns for data entry modules

#### Journey 2: PR002 - Load Timesheets
**Key Patterns**:
- Standard getFrame throughout
- NO active inlineframe usage
- NO Container patterns
- NO Dialog Frames
- Identical to PR001 patterns

**Pattern Flow**:
1. Check for existing timesheet → standard getFrame
2. Period maintenance → standard getFrame
3. Load timesheet file → standard getFrame
4. Upload and process → standard getFrame
5. Verify loaded data → standard getFrame
6. Clean up → standard getFrame

**Notable Behaviors**:
- **100% consistent with PR001**
- File upload uses standard patterns (like DOC direct upload)
- No complex UI despite file processing
- Advanced filter stays in main frame
- Browse operations in standard getFrame

**Pattern Confirmation**:
- HCM/Payroll module uses only simple patterns
- File uploads don't require Dialog Frames here
- Confirms module-level consistency
- Data-focused modules = simple patterns

#### Journey 3: PR003 - Calculate Salary
**Key Patterns**:
- Standard getFrame throughout
- NO active inlineframe usage
- NO Container patterns
- NO Dialog Frames
- Consistent with PR001/PR002

**Pattern Flow**:
1. Employee selection → standard getFrame
2. Create paycheck → standard getFrame
3. Calculate salary → standard getFrame
4. Verify calculations → standard getFrame
5. Save and post → standard getFrame

**Notable Behaviors**:
- **100% consistent with other HCM journeys**
- Salary calculation stays in main frame
- No complex UI despite financial calculations
- Alert handling for warnings in current frame

**Pattern Confirmation**:
- HCM continues simple pattern trend
- Financial calculations don't require complex frames
- Confirms module-level consistency

#### Journey 4: PR004 - EFT Deductions if Employee's Pay Method is Check
**Key Patterns**:
- Standard getFrame throughout
- NO active inlineframe usage
- NO Container patterns
- NO Dialog Frames
- Identical patterns to PR001-PR003

**Pattern Flow**:
1. Employee setup → standard getFrame
2. Deduction configuration → standard getFrame
3. Check payment method → standard getFrame
4. Apply EFT deductions → standard getFrame
5. Verify deductions → standard getFrame

**Notable Behaviors**:
- **Conditional logic doesn't affect patterns**
- Payment method checks stay in main frame
- EFT processing uses simple patterns
- No special frames for financial operations

**Pattern Insights**:
- Business logic complexity ≠ iframe complexity
- Payment processing remains simple
- Consistent with HCM simplicity rule

#### Journey 5: PR007 - Employee Rates
**Key Patterns**:
- Standard getFrame throughout
- **First HCM journey with active inlineframe!**
- Used for rate dialog/modal operations
- Still no Container or Dialog Frame patterns

**Pattern Flow**:
1. Navigate to employee → standard getFrame
2. Access rate maintenance → standard getFrame
3. **Open rate dialog** → `active inlineframe`
4. Edit rate details → stays in active frame
5. Save rates → return to standard getFrame
6. Verify updates → standard getFrame

**Notable Behaviors**:
- **Breaking the HCM simple pattern!**
- Rate dialogs require active inlineframe
- Similar to invoice matching pattern
- Modal-like behavior for rate entry

**Pattern Discovery**:
- HCM can use active inlineframe for dialogs
- Rate maintenance is special case
- Still simpler than financial modules

#### Journey 6: PR008_1 - Timecard Rate Defaulting - from Employee Only
**Key Patterns**:
- Standard getFrame throughout
- NO active inlineframe usage
- Returns to simple HCM pattern
- Rate defaulting doesn't need special frames

**Pattern Flow**:
1. Employee selection → standard getFrame
2. Timecard creation → standard getFrame
3. Rate defaulting logic → standard getFrame
4. Verify defaulted rates → standard getFrame
5. Save timecard → standard getFrame

**Notable Behaviors**:
- **Rate defaulting ≠ rate dialog**
- Automatic rate application stays simple
- No UI interaction for defaulting
- Confirms most HCM stays simple

**Pattern Insight**:
- Only interactive rate editing needs active frame
- Automated processes use simple patterns
- Consistent with automation pattern rule

#### Journey 7: PR028 - Add Timecard via Weekly > Timesheet - By Employee
**Key Patterns**:
- Standard getFrame throughout
- NO active inlineframe usage
- NO Container patterns
- NO Dialog Frames
- Back to simple HCM pattern

**Pattern Flow**:
1. Navigate Weekly menu → standard getFrame
2. Select timesheet view → standard getFrame
3. Filter by employee → standard getFrame
4. Add timecard → standard getFrame
5. Enter time details → standard getFrame
6. Save and verify → standard getFrame

**Notable Behaviors**:
- **Different navigation path, same patterns**
- Weekly vs direct entry uses same frames
- Timesheet grid stays in main frame
- No complex UI for time entry

**Pattern Consistency**:
- Entry method doesn't affect patterns
- Confirms HCM simplicity (except rate dialogs)
- Grid operations stay simple in HCM

**HCM Module Complete Summary**:
- PR001: Manual timesheet entry - simple patterns
- PR002: Bulk timesheet load - simple patterns
- PR003: Calculate salary - simple patterns
- PR004: EFT deductions - simple patterns
- PR005: Employee rates - **active inlineframe for rate dialog**
- PR008_1: Rate defaulting - simple patterns
- PR028: Weekly timesheet entry - simple patterns

#### Journey 8: PR000 - Add Hourly and Vacation Earning Categories to an Employee
**Key Patterns**:
- Standard getFrame throughout most operations
- **NEW PATTERN**: XPath iframe switching for earning category dialogs!
- Complex nested frame structure for add operations
- Similar to SL006 Revenue Distribution pattern

**Pattern Flow**:
1. Setup and maintenance → standard getFrame
2. Employee selection → standard getFrame
3. Navigate to Earning Categories tab → standard getFrame
4. **Add vacation category** → complex XPath pattern:
   ```
   Switch iframe to "/html/body/div[2]/div[1]/iframe"
   Switch iframe to "/html/body/iframe[1]"
   ```
5. Fill earning details → within nested frames
6. Save and verify → standard patterns

**Notable Behaviors**:
- **First HCM journey with XPath frames!**
- Modal within modal scenario
- Deep DOM nesting for earning category entry
- Different from simple rate dialogs (PR007)

**Pattern Discovery**:
- HCM can have complex iframe patterns
- Earning category dialogs use deep nesting
- XPath indicates complex modal structure
- Similar complexity to financial modules

#### Journey 9: PR006 - Vacation Accruals via Time Cards
**Key Patterns**:
- Standard getFrame throughout all operations
- NO active inlineframe usage
- NO Container patterns
- NO Dialog Frames or XPath
- Returns to simple HCM pattern

**Pattern Flow**:
1. Period maintenance → standard getFrame
2. Personnel WB → standard getFrame (new tab)
3. Benefits enrollment → standard getFrame
4. Employee status reset → standard getFrame
5. Timesheet input → standard getFrame
6. Add timecards → standard getFrame
7. Enter accruals → standard getFrame
8. Verify history → database queries

**Notable Behaviors**:
- **100% simple patterns despite complex accrual logic**
- New tab navigation doesn't affect patterns
- Benefits enrollment stays in main frame
- Timecard entry remains simple
- Accrual calculations happen server-side

**Pattern Consistency**:
- Confirms most HCM operations stay simple
- Business complexity ≠ iframe complexity
- Tab navigation handled simply

#### Journey 10: PR006_A - Rate/Hour - Add Plan Rates for Different Seniority Levels
**Key Patterns**:
- Standard getFrame throughout all operations
- NO active inlineframe usage
- NO Container patterns
- NO Dialog Frames or XPath
- Maintains simple HCM pattern

**Pattern Flow**:
1. Plan maintenance → standard getFrame
2. Filter and drill into plan → standard getFrame
3. Navigate to Plan Rates tab → standard getFrame
4. Add seniority level 0 → standard getFrame
5. Add seniority level 5 → standard getFrame
6. Add seniority level 10 → standard getFrame
7. Verify records → standard getFrame

**Notable Behaviors**:
- **Plan rate configuration stays simple**
- Multiple add operations without frame complexity
- Tab navigation within plan stays simple
- Accrual rate calculations in main frame

**Pattern Insights**:
- Plan configuration uses simple patterns
- Different from earning category dialogs (PR000)
- Confirms pattern variation within HCM
- Configuration screens typically simpler

**HCM Module Complete Summary**:
- PR001: Manual timesheet entry - simple patterns
- PR002: Bulk timesheet load - simple patterns
- PR003: Calculate salary - simple patterns
- PR004: EFT deductions - simple patterns
- PR007: Employee rates - **active inlineframe for rate dialog**
- PR008_1: Rate defaulting - simple patterns
- PR028: Weekly timesheet entry - simple patterns
- PR000: Earning categories - **XPath frames for modal dialogs**
- PR006: Vacation accruals - simple patterns
- PR006_A: Plan rates - simple patterns

**HCM Pattern Rules**:
1. 80% use simple getFrame patterns
2. Interactive rate dialogs use active inlineframe
3. Earning category modals use XPath nested frames
4. Configuration/maintenance screens stay simple
5. Accrual logic doesn't affect iframe complexity

---

### 8. Human Capital Management / Employee Self Service (HCM/ESS) - US

#### Journey 1: ESS001 - Create Portal User
**Key Patterns**:
- Standard getFrame throughout all operations
- NO active inlineframe usage
- NO Container patterns
- NO Dialog Frames or XPath
- 100% simple pattern usage

**Pattern Flow**:
1. Login and setup → standard getFrame
2. Navigate to portal user function → standard getFrame
3. Create new portal user → standard getFrame
4. Input employee details → standard getFrame
5. Save portal user → standard getFrame
6. Verify creation → standard getFrame
7. Test portal login → standard getFrame
8. Check email sent → database queries
9. Cleanup → standard getFrame

**Notable Behaviors**:
- **Portal user creation stays simple**
- Multi-step wizard uses standard patterns
- User switching for testing doesn't affect frames
- Email verification through database
- No UI complexity despite user creation

**Pattern Insights**:
- ESS module follows HCM simplicity
- User management stays in main frame
- Portal operations don't need special frames
- Consistent with admin screen patterns

#### Journey 2: HCMSMOKE04 - Verify ESS Template User
**Key Patterns**:
- Standard getFrame throughout
- NO active inlineframe usage
- NO Container patterns
- NO Dialog Frames
- Maintains simple pattern

**Pattern Flow**:
1. Login as sysadmin → standard getFrame
2. Navigate to parameters → standard getFrame
3. Filter for DEFESUSR → standard getFrame
4. Get template user value → standard getFrame
5. Navigate to user maintenance → standard getFrame
6. Verify user exists → standard getFrame
7. Logout → standard patterns

**Notable Behaviors**:
- **Parameter checking uses simple patterns**
- System configuration stays in main frame
- User verification remains simple
- No complex UI for system checks

**Pattern Consistency**:
- ESS module 100% simple patterns
- Follows HCM module simplicity
- Admin functions stay basic
- No exceptions found

**HCM/ESS Module Summary**:
- ESS001: Create portal user - simple patterns only
- HCMSMOKE04: Verify template user - simple patterns only
- Pattern prediction: All ESS operations use simple getFrame

---

### 9. House Building/Construction (HOM) - UK

#### Journey 1: HC001 - Forecast Matrix Update Stage and Apply Programme Forwards
**Key Patterns**:
- Standard getFrame for navigation
- Container pattern for tab switching
- **Special Construction patterns for matrix operations**
- No Dialog or Desktop frames

**Pattern Flow**:
1. Login and setup → standard getFrame
2. Filter development → standard getFrame
3. Click development → standard getFrame
4. **Navigate away** → `Container` pattern (2x parent)
5. Return to frame → standard getFrame
6. Forecast Matrix operations → standard getFrame
7. Date picker/calendar → stays in current frame
8. Right-click menu → stays in current frame
9. **Exit matrix** → `Container` pattern

**Notable Behaviors**:
- **Container pattern for navigation between major sections**
- Matrix operations stay in main frame
- Calendar/date pickers don't require frame switches
- Right-click context menus work in current frame

**Pattern Discovery**:
- HOM uses Container for section navigation
- Complex matrix UIs stay simple frame-wise
- Construction module follows House Sales patterns

#### Journey 2: HC002 - Gantt Chart Update End Date on New Plot
**Key Patterns**:
- Standard getFrame throughout
- Container pattern for navigation
- Identical to HC001 patterns
- No Dialog or active frames

**Pattern Flow**:
1. Setup and login → standard getFrame
2. Filter development → standard getFrame
3. Click development → standard getFrame
4. **Navigate away** → `Container` pattern
5. Navigate to Gantt Chart → standard getFrame
6. Filter operations → standard getFrame
7. Date updates → standard getFrame
8. **Exit** → `Container` pattern

**Notable Behaviors**:
- **Gantt Chart uses same patterns as Forecast Matrix**
- Complex visualizations don't need complex frames
- Container pattern consistent for navigation
- Date operations remain simple

#### Journey 3: HC003 - Gantt Chart Update Start Date on New Plot
**Key Patterns**:
- Standard getFrame throughout
- Container pattern for navigation
- 100% consistent with HC002
- No variations detected

**Pattern Flow**:
1. Identical to HC002 but updating start date
2. Same Container pattern usage
3. Same frame switching points

**Pattern Confirmation**:
- Gantt operations are predictable
- Start/End date updates use same patterns
- HOM consistency established

#### Journey 4: HC004 - Whiteboard Update Build Progress
**Key Patterns**:
- Standard getFrame for most operations
- **NEW PATTERN**: Standard inlineframe for Whiteboard!
- Container pattern for navigation
- Similar to DOC CardView pattern

**Pattern Flow**:
1. Setup and navigation → standard getFrame
2. Filter/select development → standard getFrame
3. Navigate to Whiteboard → standard getFrame
4. **Enter Whiteboard** → `inlineframe` → `getFrame`
5. Update stage operations → within inlineframe context
6. Save operations → stays in inlineframe
7. Verification → database queries

**Notable Behaviors**:
- **First HOM journey with inlineframe!**
- Uses standard inlineframe (NOT active)
- Similar to DOC module CardView
- Whiteboard is special UI component

**Pattern Discovery**:
- Whiteboard views require inlineframe
- Not all HOM screens are simple
- Special UI components = special frames

#### Journey 5: HC005 - Build Release via Plot Row Action
**Key Patterns**:
- Standard getFrame throughout
- Container pattern for navigation
- Multiple Container switches
- No inlineframe or Dialog patterns

**Pattern Flow**:
1. Setup and navigation → standard getFrame
2. Development selection → Container → getFrame
3. Navigate to Plots → Container → getFrame
4. Filter and select plot → standard getFrame
5. Run action → standard getFrame
6. **Build release dialog** → Container → getFrame
7. Repeat for second plot → same pattern
8. Verification → database queries

**Notable Behaviors**:
- **Heavy Container pattern usage**
- Each navigation requires Container switch
- Build release stays in main frame (not Dialog)
- Row actions don't trigger special frames

**Pattern Insights**:
- HOM navigation is Container-heavy
- Dialogs handled differently than House Sales
- Consistent Container usage throughout

#### Journey 6: HC012 - Forecast Matrix Plot Actions
**Key Patterns**:
- Standard getFrame throughout
- NO Container patterns (unusual for HOM!)
- Matrix operations stay simple
- Right-click menus in current frame

**Pattern Flow**:
1. Setup and navigation → standard getFrame
2. Select development → standard getFrame
3. Navigate to Forecast Matrix → standard getFrame
4. Filter operations → standard getFrame
5. Matrix cell updates → standard getFrame
6. Right-click actions → standard getFrame
7. Apply programme → standard getFrame
8. Delay operations → standard getFrame
9. Multiple plot operations → all standard getFrame

**Notable Behaviors**:
- **No Container patterns despite navigation!**
- Matrix right-click menus stay simple
- Complex date calculations in main frame
- Different from HC001 which used Container

**Pattern Anomaly**:
- Inconsistent Container usage in HOM
- HC001 vs HC012 for same Matrix screen
- Suggests context-dependent patterns

**HOM Module Summary**:
- HC001: Forecast Matrix - Container patterns
- HC002: Gantt Chart (end date) - Container patterns
- HC003: Gantt Chart (start date) - Container patterns
- HC004: Whiteboard - **inlineframe pattern**
- HC005: Build Release - Heavy Container usage
- HC012: Forecast Matrix actions - NO Container (anomaly)

**HOM Pattern Rules**:
1. Most operations use Container for navigation
2. Whiteboard requires standard inlineframe
3. Matrix/Gantt stay in main frame for operations
4. Container usage can be inconsistent
5. No Dialog/Desktop frames observed

---

### 10. House Building/Customer Care (HOM/CC) - UK

#### Journey 1: CC001 - Call Quick Add
**Key Patterns**:
- Standard getFrame for navigation
- **Heavy active inlineframe usage for tabs**
- Container pattern for tab switching
- NO Dialog or Desktop frames

**Pattern Flow**:
1. Login and setup → standard getFrame
2. Navigate to Developments tab → `active inlineframe`
3. Select development → stays in active frame
4. Select plot → re-establish frame
5. Switch to Calls tab → `active inlineframe`
6. Quick Add operation → standard getFrame
7. Add issues → standard getFrame
8. **Switch tabs** → `Container` → `active inlineframe`
9. Check tasks/history → active frames throughout

**Notable Behaviors**:
- **Every tab switch uses active inlineframe**
- Container pattern between major tabs
- Quick Add stays in main frame (not modal)
- Multi-tab workflow with consistent patterns

**Pattern Discovery**:
- Customer Care uses active inlineframe heavily
- Different from Construction module patterns
- Tab-heavy interfaces need active frames

#### Journey 2: CC002 - Call Standard Add
**Key Patterns**:
- Identical to CC001 patterns
- Active inlineframe for all tabs
- Container for tab switching
- Standard getFrame for data entry

**Pattern Flow**:
1. Exact same pattern as CC001
2. Only difference is "Standard Add" vs "Quick Add"
3. Same tab navigation patterns
4. Same frame switching points

**Pattern Confirmation**:
- Customer Care patterns are consistent
- Add type doesn't affect frame patterns
- Tab navigation always uses active frames

#### Journey 3: CC003 - Issue Quick Add
**Key Patterns**:
- Same patterns as CC001/CC002
- Active inlineframe for tabs
- Container for tab switches
- Standard getFrame for forms

**Pattern Flow**:
1. Navigate to Calls tab → `active inlineframe`
2. Select call → stays in active frame
3. Switch to Issues tab → `active inlineframe`
4. Quick Add issue → standard getFrame
5. Add task details → standard getFrame
6. **Tab navigation** → `Container` → `active inlineframe`
7. Verify in multiple tabs → active frames

**Pattern Consistency**:
- 100% consistent with CC001/CC002
- Issue operations mirror call operations
- Customer Care module very predictable

#### Journey 4: CC005 - Task Close and Reopen via Task Update
**Key Patterns**:
- Standard active inlineframe usage
- NO Container patterns (unusual!)
- Direct task operations
- Simpler than CC001-CC003

**Pattern Flow**:
1. Navigate to Tasks tab → `active inlineframe`
2. Filter and select task → stays in active frame
3. Re-establish frames → `active inlineframe`
4. Update task (close) → within active frame
5. Update task (reopen) → within active frame
6. No tab switches = no Container patterns

**Notable Behaviors**:
- **No Container pattern despite navigation**
- Single tab focus = simpler patterns
- Task updates stay in active frame
- Different from multi-tab journeys

#### Journey 5: CC006 - Task Close via Quick Complete Row Action
**Key Patterns**:
- Active inlineframe for Tasks tab
- Standard getFrame for action dialog
- NO Container patterns
- Row actions stay simple

**Pattern Flow**:
1. Navigate to Tasks tab → `active inlineframe`
2. Filter and select task → stays in active frame
3. Run row action → standard getFrame
4. Process completion → standard getFrame
5. Verification → database queries

**Pattern Insights**:
- Row actions don't need special frames
- Quick Complete stays in main context
- Simpler than full task update (CC005)
- No multi-tab navigation = no Container

#### Journey 6: CC019 - Plot Add Activity Workbench Appointment
**Key Patterns**:
- Active inlineframe for tabs
- **Dialog Frame for appointment creation!**
- Container pattern for tab switches
- First CC journey with Dialog Frame

**Pattern Flow**:
1. Navigate to Developments → `active inlineframe`
2. Select development/plot → active frames
3. **New Appointment** → `Dialog Frame`
4. Fill appointment details → within dialog
5. Save and close dialog → standard getFrame
6. Switch to Actions tab → `active inlineframe`
7. Verify appointment → in active frame

**Notable Behaviors**:
- **First Customer Care Dialog Frame!**
- Appointment creation uses modal dialog
- Similar to House Sales patterns
- Tab navigation remains consistent

**Pattern Discovery**:
- Activity Workbench integration uses Dialog Frame
- Special UI actions trigger dialog patterns
- Customer Care can have complex modals

#### Journey 7: CC034 - Plot Resale
**Key Patterns**:
- Active inlineframe for tabs
- **Desktop Frame for event creation!**
- Container pattern for tab switches
- Complex multi-step workflow

**Pattern Flow**:
1. Navigate tabs → `active inlineframe`
2. Select development/plot → active frames
3. **New Event** → `Desktop Frame`
4. Select event type → within desktop frame
5. Update event details → desktop frame
6. Add new owner → triggers new tab
7. Return to desktop frame → complete event
8. Tab navigation → `Container` → `active inlineframe`
9. Verify in multiple tabs → active frames

**Notable Behaviors**:
- **First Customer Care Desktop Frame!**
- Complex event creation needs desktop frame
- Multi-tab workflow during event creation
- Uses XPath pattern: `//*[starts-with(@id, 'frameID')]/iframe`

**Pattern Discovery**:
- Desktop Frame for complex multi-step events
- Different from Dialog Frame (CC019)
- Most complex Customer Care journey
- Shows full range of frame patterns

**HOM/Customer Care Module Summary**:
- CC001: Call Quick Add - active frames, Container patterns
- CC002: Call Standard Add - identical to CC001
- CC003: Issue Quick Add - identical patterns
- CC005: Task Update - active frames, no Container
- CC006: Quick Complete - active frames, simple patterns
- CC019: Appointment - **Dialog Frame** for creation
- CC034: Plot Resale - **Desktop Frame** for complex event

**Customer Care Pattern Rules**:
1. Heavy active inlineframe usage for all tabs
2. Container pattern for multi-tab navigation
3. Dialog Frame for appointments/simple modals
4. Desktop Frame for complex multi-step events
5. Row actions stay in main frame
6. Single-tab operations may skip Container

---

## 🔄 Modules Pending Analysis

### High Priority (Core Modules):
- [✓] Purchase Ledger (PL) - Partially covered in PO001 journey
- [ ] Sales Ledger (SL) / Accounts Receivable (AR)
- [✓] Purchase Orders (PO) - Covered via PRO module
- [ ] House Sales (HS) - Expected: Desktop/Dialog frames
- [ ] Payroll (PR)

### Medium Priority:
- [✓] Human Resources (HCM) - PR001 analyzed
- [✓] Subcontract (SC) - SC002B analyzed
- [ ] Accounts Payable (AP)
- [ ] Construction/Contract Status

### Low Priority:
- [ ] Asset Management
- [ ] Reporting & BI
- [ ] Document Management

## 📊 Pattern Frequency by Module

| Pattern | SYS | FIN/GL | FIN/SL | FIN/SC | PRO/PL | DOC | HCM/PR | HCM/ESS | HOM/Const | HOM/CC | Total |
|---------|-----|--------|--------|--------|--------|-----|--------|-------|
| Standard getFrame | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 10/10 |
| Standard inlineframe | - | - | ✓ | - | - | ✓ | - | - | ✓ | - | 3/10 |
| Active inlineframe | ✓ | ✓ | ✓ | ✓ | ✓ | - | ✓* | - | - | ✓ | 7/10 |
| Container (2x parent) | - | ✓ | ✓ | - | ✓ | - | - | - | ✓ | ✓ | 5/10 |
| Container (4x parent) | - | - | ✓ | - | - | - | - | - | - | - | 1/10 |
| Parent frame | ✓ | ✓ | ✓ | - | ✓ | ✓ | - | - | - | - | 5/10 |
| XPath frame | - | - | ✓ | - | - | - | ✓** | - | - | - | 2/10 |
| Webix getFrame | ✓ | - | - | - | - | - | - | - | - | - | 1/10 |
| Dialog frame | - | - | - | - | - | ✓ | - | - | - | ✓ | 2/10 |
| Desktop frame | - | - | - | - | - | - | - | - | - | ✓ | 1/10 |
| 4-frame pattern | - | - | - | - | - | - | - | - | - | - | 0/10 |
| User switching | - | - | - | - | ✓ | - | - | ✓ | - | - | 2/10 |
| setContainer() | - | - | - | - | ✓ | ✓ | - | - | ✓ | - | 3/10 |

## 🎯 Next Recommended Journeys

1. **Purchase Ledger** - To verify active inlineframe and 4-frame patterns
2. **House Sales** - To verify Desktop/Dialog frame patterns
3. **Purchase Orders** - Mixed patterns expected
4. **Payroll** - Should be simple like GL
5. **Sales Ledger** - Complex grids expected

## 📈 Module Coverage by Region
- **Global/Core Modules**: SYS (1), DOC (6)
- **Finance (ANY)**: GL (2), SL (1)
- **Finance (UK Specific)**: SC (1)
- **Procurement (UK Specific)**: PRO (7) - includes PL operations
- **HCM/Payroll (US Specific)**: HCM/PR (10), HCM/ESS (2)
- **House Building/Construction (UK Specific)**: HOM/Construction (6), HOM/Customer Care (7)
- **Total Unique Module Areas**: 10

## 🔍 Key Pattern Discoveries
1. **PRO Module Anomaly**: Order lines (material/plant/stock) do NOT use active inlineframe
2. **SC Module**: Order lines DO use active inlineframe
3. **Universal Pattern**: Invoice matching ALWAYS uses active inlineframe
4. **Plant Maintenance**: Uses standard getFrame patterns
5. **Navigation Pattern**: `setContainer()` used for module navigation screens
6. **PRO Complexity**: Summary screens have complex Container patterns
7. **Tab Navigation Rule**: Main tab switches require Container pattern
8. **Screen Type Rule**: Transaction screens (simple) vs Summary screens (complex)
9. **GRN Processing**: Always uses standard getFrame patterns
10. **System Parameters**: Don't affect iframe patterns (AUTOSTK example)
11. **Dialog Frame Pattern**: Used for popup dialogs (CardView upload, annotations)
12. **CardView Pattern**: Uses standard inlineframe (NOT active)
13. **Upload Methods**: Different upload methods use different patterns (Dialog vs Direct)
14. **Ajax Popups**: Use parent frame navigation, not iframes
15. **Nested Frames**: Complex tools (annotations) can have frames within Dialog Frames
16. **DOC Complexity Rule**: UI complexity drives iframe complexity
17. **HCM Simplicity**: Payroll/HR modules use mostly standard getFrame patterns
18. **HCM Exception 1**: Interactive rate dialogs require active inlineframe
19. **HCM Exception 2**: Earning category modals use XPath nested frames
20. **Automation Rule**: Automated processes (rate defaulting) use simple patterns
21. **Entry Method Rule**: Different navigation paths don't affect iframe patterns
22. **HCM Modal Complexity**: Earning categories > Rate dialogs > Standard operations
23. **Tab Navigation Rule**: New browser tabs don't affect iframe patterns
24. **ESS Simplicity**: Employee Self Service uses only standard getFrame patterns
25. **Portal Operations**: User creation and management stay in main frame
26. **HOM Navigation**: Construction module heavily uses Container patterns
27. **Whiteboard Pattern**: Special UI component requires standard inlineframe
28. **Matrix Operations**: Complex grids can stay in main frame
29. **Container Inconsistency**: Same screen may or may not use Container patterns
30. **Construction Similarity**: HOM follows House Sales navigation patterns
31. **Customer Care Complexity**: CC uses active inlineframe for all tab navigation
32. **CC Modal Hierarchy**: Desktop Frame (complex events) > Dialog Frame (simple modals)
33. **Tab Navigation Consistency**: Multi-tab interfaces always use Container + active inlineframe
34. **Row Action Simplicity**: Browse row actions stay in main frame
35. **HOM Module Split**: Construction uses simple patterns, Customer Care uses complex patterns