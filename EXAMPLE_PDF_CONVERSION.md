# Example: Converting Customer PDF to Virtuoso Journey

## Original Customer Steps:
```
Document Capture Workbench
Log into Kco 100 assuming Account.Profile
Using the side menu go to Document Management - Input - Document Capture WB
Click Add
Select "P/L Invoice" against Default Document Category
Click the save icon
Click on the Batch Name blueHyperlink
The following screen appears
Click on the Upload button which opens a second tab
Drag and drop test PDF's or manually select them
Close the second tab
Click Refresh and files appear
Select row 5 and clicked "Down"
File will have moved down a row into Row 6
```

## Converted to Virtuoso Journey:

```javascript
// Journey: Document Capture Workbench
// KCO: 100
// User: Account.Profile

// Checkpoint 1: Navigate to URL
Navigate to ${$url + '/wologin.p'}

// Checkpoint 2: Login
getAuthorization($accountprofile, $esbkey, $esbtrust) returning $coinsauth
getSessionToken($coinsauth, $url) returning $oSession
reload
getTestData("DM") returning $oDM
Look for element "mainarea" on page

// Checkpoint 3: Navigate to Document Capture WB
setKco("100")
Click on "Document Management"
SYS: Switch to getFrame
setMenu("%DM[function_code]")  // Need actual function code
Click on "Input"
Click on "Document Capture WB"

// Checkpoint 4: Create New Batch
Click on "Add"
// May need: SYS: Switch to Dialog Frame
setCombo("Default Document Category", "P/L Invoice")
Click on "Save" icon  // or keyboardShortcut('save')

// Checkpoint 5: Open Batch Details
Click on link containing "Batch Name"  // Blue hyperlink
// If in grid: clickRowColumn(0, "batch_name")

// Checkpoint 6: Upload Documents
Click on "Upload"
// Handle new tab
Switch to tab 1
// Note: Drag and drop would need special handling
// For now: Click on file input and select files
Upload "${$url + getTestFile('testdata', 'sample.pdf')}"
Switch to tab 0  // Return to main tab

// Checkpoint 7: Verify Upload
Click on "Refresh"
waitForElementToDisappear("[alt=submitted]")
assertBrowseNotEmpty(1)  // Verify files appear

// Checkpoint 8: Reorder Files
selectRow(4)  // Row 5 (0-indexed)
Click on "Down"
// Verify move
assertRowColumnValue(5, "file_name", $expected_filename)
```

## Key Conversion Patterns Identified:

1. **Login**: "Log into Kco X assuming Y" → setKco() + role-based login
2. **Menu Navigation**: "Using the side menu go to X - Y - Z" → Click + setMenu()
3. **Simple Clicks**: "Click X" → Click on "X"
4. **Selections**: "Select 'X' against Y" → setCombo(Y, X)
5. **Icons**: "Click the X icon" → Click on "X" icon
6. **Hyperlinks**: "Click on the X hyperlink" → Click on link "X"
7. **Grid Selection**: "Select row X" → selectRow(X-1)
8. **Tab Handling**: "opens a second tab" → Switch to tab 1/0
9. **Verification**: "files appear" → assertBrowseNotEmpty()

## Missing Information Needing Enhancement:

1. **Function Codes**: Menu navigation needs actual COINS function codes
2. **Field IDs**: "Default Document Category" needs actual field ID
3. **Frame Context**: Which operations need frame switches
4. **Validation Details**: What exactly to verify at each step
5. **Test Data**: What files to upload, expected values

## Recommended Additions to Customer Format:

```
NAVIGATION:
- Menu: Document Management (%DM1234)  // Include function code
- Submenu: Input > Document Capture WB

FIELDS:
- Default Document Category [field_id: doc_category]
- Upload File: sample.pdf [location: testdata folder]

VALIDATIONS:
- After save: Batch number generated
- After upload: File count = X
- After reorder: File in position 6
```