# COINS Simple Requirements Format

## What Customers Typically Provide

Based on real customer examples, requirements usually come in this simple format:

```
[Test Name]
Log into Kco [number] assuming [role]
Using the side menu go to [Menu Path]
Click [button/link]
Select "[option]" against [field name]
Click the [button] icon
Click on the [element] [type]
The following screen appears
[Additional steps...]
```

## Parser-Friendly Enhanced Format

To make this automatable while keeping it simple, we need to add minimal structure:

```
TEST: Document Capture Workbench
KCO: 100
USER: Account.Profile
MODULE: Document Management

STEPS:
1. Navigate: Document Management > Input > Document Capture WB
2. Click: Add
3. Select: "P/L Invoice" in "Default Document Category"
4. Click: Save icon
5. Click: Batch Name (hyperlink)
6. Verify: Screen appears
7. Click: Upload button
8. Action: Drag and drop PDF files
9. Click: Close tab
10. Click: Refresh
11. Verify: Files appear
12. Select: Row 5
13. Click: Down button
14. Verify: File moved to Row 6
```

## Minimal Required Enhancements

### 1. Header Section (Required)
```
TEST: [Journey Name]
KCO: [Company Code]
USER: [Role/Username]
MODULE: [COINS Module]
```

### 2. Step Types (Standardized)
- **Navigate**: Menu navigation
- **Click**: Button/link clicks
- **Select**: Dropdown/radio selections
- **Enter**: Text input
- **Verify**: Validation checks
- **Action**: Special actions (drag/drop, etc.)
- **Wait**: Wait conditions

### 3. Element Identification
Instead of: "Click Add"
Better: "Click: Add button"
Best: "Click: Add button [data-action='add']"

### 4. Verifications
Instead of: "The following screen appears"
Better: "Verify: Document Batch screen visible"
Best: "Verify: Element 'Batch Name' exists"

## Conversion Rules for Parser

1. **Login Steps**
   - "Log into Kco X assuming Y" → setKco(X), login as role Y

2. **Navigation**
   - "Using the side menu go to X > Y > Z" → setMenu() with proper function code

3. **Clicks**
   - "Click X" → Identify if button/link/icon and use appropriate selector
   - "Click the X icon" → Look for icon elements
   - "Click on the X hyperlink" → Click on link "X"

4. **Selections**
   - "Select 'X' against Y" → setCombo(Y, X) or dropdown selection

5. **Grid Operations**
   - "Select row X" → selectRow(X-1) // 0-indexed
   - "clicked 'Down'" → Click on "Down" button

6. **Tab Management**
   - "opens a second tab" → Note tab switch needed
   - "Close the second tab" → Switch to tab 0

## Example Conversion

### Customer Provides:
```
Click on the Batch Name blueHyperlink
```

### Parser Identifies:
- Action: Click
- Target: "Batch Name"
- Type: hyperlink
- Color hint: blue (ignore for selector)

### Generates:
```javascript
Click on link "Batch Name"
// or if in grid:
clickRowColumn(0, "batch_name")
```

## Recommended Customer Template

```
# [Test Name]

## Setup
- Company: [KCO number]
- User: [Role name]
- Test Data: [Any specific data needed]

## Steps
1. Go to: [Menu path]
2. Click: [Button/link name] 
3. Enter: [Value] in [Field name]
4. Select: [Option] from [Dropdown name]
5. Verify: [What should appear/happen]
6. [Continue steps...]

## Expected Result
[What should happen when test completes successfully]
```

This format is:
- Simple enough for customers to write
- Structured enough for parsing
- Contains minimum viable information
- Can be enhanced by parser with technical details