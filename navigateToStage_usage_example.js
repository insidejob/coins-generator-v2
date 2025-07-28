/**
 * Example Usage in Virtuoso Journey
 */

// Basic usage - navigate to Purchaser 1 section
navigateToStage("PURCH1")
SYS: Switch to getFrame

// Navigate to Solicitor section
navigateToStage("SOLIC")
SYS: Switch to getFrame

// With options
navigateToStage("PURCH2", { action: "edit" })
SYS: Switch to getFrame

// Using convenience methods
navigateToPurchaser1()
SYS: Switch to getFrame

// Debug - see all available stages on current page
debugStages()

/**
 * Integration in Journey Script
 */

// Instead of:
Click on "Update"
SYS: Switch to Desktop Frame

// Use:
navigateToStage("PURCH1")
SYS: Switch to getFrame

/**
 * Full Journey Example
 */

Checkpoint 9: New Reservation - Purchaser 1
// Old way with hardcoded URL:
// Navigate to "https://persimmonhomes-test.coinscloud.com/env/upgrade/woframe.p?..."

// New way with extension:
navigateToStage("PURCH1")

Checkpoint 4: SYS: Switch to getFrame
waitForElementToDisappear("[alt=submitted]")
Look for element "mainarea" on page
Switch iframe to id "mainarea"
Look for element "getFrame" on page
Switch iframe to id "getFrame"

Checkpoint 10: New Reservation - Purchaser 1 - Contact Details
Write "Sur" in field input "Surname"
Enter "test@example.com" in "Email"
keyboardShortcut("save")

// Move to next section
navigateToStage("PURCH2")
SYS: Switch to getFrame