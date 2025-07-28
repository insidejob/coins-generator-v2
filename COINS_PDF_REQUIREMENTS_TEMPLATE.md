# COINS PDF Requirements Template

## Journey Metadata
- **Journey Name**: [e.g., "Create New Sales Reservation"]
- **Module**: [e.g., "House Sales", "General Ledger", "Accounts Payable"]
- **Test ID**: [e.g., "HS001"]
- **Environment**: [UK/US/AU/ANY]
- **Phase**: [1/2/3 - for execution order]

## Prerequisites
- **User Role**: [e.g., "SALESADMIN", "SALESUSER", "FINADMIN"]
- **Company (KCO)**: [e.g., "210"]
- **Required Test Data**:
  - Development: [e.g., "128 - MALMESBURY FARM"]
  - Plot Status: [e.g., "Available", "Released"]
  - GL Accounts: [list required accounts]
  - Other entities: [suppliers, employees, etc.]

## Navigation Path
1. **Main Menu**: [e.g., "House Sales"]
2. **Function Code**: [e.g., "%WHS1010SHCG"]
3. **Sub-navigation**: [any additional menu selections]

## Test Steps

### Step 1: [Action Name]
- **Action Type**: [Navigate/Filter/Click/Enter/Select/Save]
- **Target**: [field name, button text, or element identifier]
- **Value**: [if entering data]
- **Frame Context**: [if special iframe handling needed]
- **Validation**: [what to check after action]

### Step 2: Filter Grid
- **Filter Field**: [e.g., "job_num"]
- **Filter Value**: [e.g., "128"]
- **Grid Action**: [e.g., "Click row where job_jobph = 128"]
- **Expected Result**: [e.g., "Development details page opens"]

### Step 3: Multi-Step Dialog
- **Dialog Trigger**: [e.g., "Click 'New Reservation'"]
- **Sections**:
  1. **Start Reservation**
     - Fields: [list all fields to complete]
     - Save Method: [Save button/Keyboard shortcut]
  2. **Purchaser 1**
     - Fields: [Name, Address, Email, etc.]
     - Mandatory: [Y/N for each field]
  3. **Additional Sections**: [list remaining sections]

## Field Specifications

### [Field Name]
- **Field ID/Selector**: [e.g., "sur_name"]
- **Type**: [Text/Dropdown/Date/Checkbox/Radio]
- **Mandatory**: [Y/N]
- **Format**: [e.g., "DD/MM/YYYY", "999-99-9999"]
- **Validation Rules**: [e.g., "Must be future date"]
- **Lookup**: [Y/N - if inline lookup needed]
- **Default Value**: [if any]

## Expected Outcomes
- **Success Indicators**:
  - Message: [e.g., "Reservation created successfully"]
  - Status Change: [e.g., "Plot status = Reserved"]
  - Reference Generated: [e.g., "Reservation number format: RES-XXXXX"]
- **Database Validation**:
  - Table: [e.g., "hs_reservation"]
  - Key Fields: [to verify record created]

## Error Scenarios
- **Validation Errors**: [list expected validations]
- **Business Rules**: [e.g., "Cannot reserve sold plot"]
- **Permission Errors**: [if role-specific]

## Special Considerations
- **Frame Switches**: [note any complex iframe navigation]
- **Wait Conditions**: [e.g., "Wait for background process"]
- **Dynamic Elements**: [elements that change based on data]
- **Regional Differences**: [UK vs US specific behavior]

## Reusability
- **Cleanup Required**: [Y/N - what data to delete after test]
- **Dependent Tests**: [tests that rely on this journey's output]
- **Variable Data**: [data that should be randomized]

---

## Example Entry:

### Journey Metadata
- **Journey Name**: "Create House Sales Reservation"
- **Module**: "House Sales"
- **Test ID**: "HS001"
- **Environment**: "UK"
- **Phase**: "1"

### Prerequisites
- **User Role**: "SALESADMIN"
- **Company (KCO)**: "210"
- **Required Test Data**:
  - Development: "128 - MALMESBURY FARM"
  - Plot: "089 - Available status"

### Navigation Path
1. **Main Menu**: "House Sales"
2. **Function Code**: "%WHS1010SHCG"
3. **Sub-navigation**: "Sales Workbench"

### Test Steps

#### Step 1: Navigate to Sales Workbench
- **Action Type**: Navigate
- **Target**: Menu item "House Sales"
- **Frame Context**: SYS: Switch to getFrame + active inlineframe
- **Validation**: Sales Workbench grid visible

#### Step 2: Filter Development
- **Filter Field**: "job_num"
- **Filter Value**: "128"
- **Grid Action**: clickRowColumn(0, "job_jobph")
- **Expected Result**: Development 128 details load