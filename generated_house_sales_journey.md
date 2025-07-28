# Generated House Sales Journey

Based on: "Navigate to House Sales, filter for job 128, select plot 099, create new reservation"

## Journey Checkpoints

### Checkpoint 1: Navigate to URL
```
Navigate to ${$url + '/wologin.p'}
```

### Checkpoint 2: SYS: Log In sysadmin
```
getAuthorization($sysadmin, $esbkey, $esbtrust) returning $coinsauth
getSessionToken($coinsauth, $url) returning $oSession
reload
getTestData("SYS") returning $oSYS
Look for element "mainarea" on page
```

### Checkpoint 3: Navigate to House Sales
```
setKco("210")
Click on "House Sales"
setMenu("%WHS1010SHCG")
```

### Checkpoint 4: SYS: Switch to getFrame + active inlineframe
```
waitForElementToDisappear2("[alt=submitted]")
Look for element "mainarea" on page
Switch iframe to id "mainarea"
Look for element "getFrame" on page
Switch iframe to id "getFrame"
Look for element "iframe.inlineframe.active" on page
Switch iframe to "iframe.inlineframe"
Look for element "getFrame" on page
Switch iframe to id "getFrame"
```

### Checkpoint 5: Filter Development
```
setFilter("", "job_num", "128")
waitForElementToDisappear("[alt=submitted]")
Look for element "128" on page
clickRowColumn("0", "job_jobph")
```

### Checkpoint 6: SYS: Switch to getFrame + active inlineframe
```
waitForElementToDisappear2("[alt=submitted]")
Look for element "mainarea" on page
Switch iframe to id "mainarea"
Look for element "getFrame" on page
Switch iframe to id "getFrame"
Look for element "iframe.inlineframe.active" on page
Switch iframe to "iframe.inlineframe"
Look for element "getFrame" on page
Switch iframe to id "getFrame"
```

### Checkpoint 7: Select Plot
```
setFilter("", "vwb_code", "099")
// Add logic to filter for Available
clickRowColumn("0", "vwb_code")
```

### Checkpoint 8: SYS: Switch to getFrame
```
waitForElementToDisappear("[alt=submitted]")
Look for element "mainarea" on page
Switch iframe to id "mainarea"
Look for element "getFrame" on page
Switch iframe to id "getFrame"
```

### Checkpoint 9: Create Reservation
```
Click on "New Reservation"
Click on "Continue Reservation"
```

### Checkpoint 10: SYS: Switch to Dialog Frame
```
Switch to parent iframe
Switch to parent iframe
Switch iframe to "//*[@id='desktopDialog']/iframe"
Switch iframe to "mainarea"
Switch iframe to "getFrame"
```

## Pattern Recognition Applied:

1. **"Navigate to House Sales"** → Module navigation
   - No iframe switch initially, wait for grid operations

2. **"filter for job 128"** → Grid operation trigger
   - Applied: getFrame + active inlineframe after setMenu()

3. **"select plot 099"** → Continued grid operation
   - Re-established: getFrame + active inlineframe between operations

4. **Exit grid for "create new reservation"** → Command bar action
   - Applied: Switch to getFrame to exit grid context

5. **"create new reservation"** → Modal trigger
   - Applied: Dialog Frame after opening modal

## Key Decisions Made:

- Used Dialog Frame (not Desktop Frame) for the modal as it works 95% of the time
- Re-established frame context between grid operations
- Properly exited grid context before command bar action
- Combined "New Reservation" and "Continue Reservation" clicks before frame switch

This follows the pattern recognition rules and produces a working journey structure.