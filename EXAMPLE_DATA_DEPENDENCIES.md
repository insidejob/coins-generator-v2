# Example: House Sales Reservation Data Dependencies

## Scenario: Create a New Reservation

### Required Pre-existing Data

```yaml
DEPENDENCIES:
  Development:
    - Job Number: 128
    - Name: "MALMESBURY BACKBRIDGE FARM"
    - Status: Active
    - Has Plots: Yes
    
  Plot:
    - Development: 128
    - Plot Code: 089
    - Status: "Available" (not Reserved, Exchanged, or Sold)
    - House Type: "3 Bed End Terrace House"
    
  Configuration:
    - KCO: 210
    - User Role: SALESADMIN
    - Reservation Types configured
    - Customer Types configured
```

### Problem: Plot Status Changes

The plot we want to reserve might already be reserved from a previous test run!

### Solution Approaches

#### Approach 1: Dynamic Plot Selection

```javascript
Checkpoint: Find Available Plot
  setFilter("", "job_num", "128")
  waitForElementToDisappear("[alt=submitted]")
  
  // Get all plots for this development
  runQuery("FOR EACH hs_plot WHERE job_num = '128' AND plot_status = 'Available'") returning $available_plots
  
  if ($available_plots.length == 0) {
    SKIP_TEST "No available plots in development 128"
  }
  
  // Use first available plot
  setTestData("plot_code", $available_plots[0].plot_code)
  
  // Now filter for this specific plot
  setFilter("", "vwb_code", $oData.plot_code)
  clickRowColumn(0, "vwb_code")
```

#### Approach 2: Reset Plot Status (Cleanup)

```javascript
// In a Phase 1 setup journey
Checkpoint: Reset Test Plots
  // Direct database update (if allowed)
  runQuery("UPDATE hs_plot SET plot_status = 'Available' WHERE job_num = '128' AND plot_code IN ('089', '090', '091')")
  
  // Or via UI
  setMenu("%HS_PLOT_MAINTENANCE")
  setFilter("", "job_num", "128")
  setFilter("", "plot_code", "089")
  clickRowColumn(0, "plot_code")
  setCombo("plot_status", "Available")
  keyboardShortcut('save')
```

#### Approach 3: Test Data Pools

```javascript
// Define pool of test plots
TEST_DATA_POOLS:
  house_sales_plots:
    - { dev: "128", plot: "089", reset_to: "Available" }
    - { dev: "128", plot: "090", reset_to: "Available" }
    - { dev: "128", plot: "091", reset_to: "Available" }
    - { dev: "129", plot: "001", reset_to: "Available" }
    
// In test, rotate through pool
getNextFromPool("house_sales_plots") returning $test_plot
```

### Enhanced Customer Requirements

#### What Customer Provides:
```
Test: Create House Sales Reservation
Development: 128
Plot: Any available plot
Customer: New customer
```

#### What We Generate:

```javascript
Journey: HS001 - Create House Sales Reservation
Phase: 2
Tags: house_sales, uk, reservation

Dependencies:
  required_data:
    - development: { job_num: "128", status: "Active" }
    - plot: { status: "Available", count: ">= 1" }
  
Checkpoint 1: Setup Test Data
  // Find available plot
  findAvailableData("hs_plot", "job_num='128' AND status='Available'") returning $plot
  if (!$plot) {
    // Try to reset a plot
    resetTestData("hs_plot", "089", { status: "Available" })
    setTestData("plot", "089")
  } else {
    setTestData("plot", $plot.code)
  }
  
  // Generate customer data
  generateRandom("{{name.firstName}}", "") returning $first_name
  generateRandom("{{name.lastName}}", "") returning $last_name
  generateRandom("{{internet.email}}", "") returning $email
  
Checkpoint 2: Navigate to Sales Workbench
  // ... navigation steps ...
  
Checkpoint 3: Select Plot
  setFilter("", "job_num", "128")
  setFilter("", "vwb_code", $oData.plot)
  // Verify plot is available before proceeding
  assertColumnValue("plot_status", "Available")
  clickRowColumn(0, "vwb_code")
```

### Data Verification Extensions

```javascript
// Before starting test
verifyPrerequisites({
  "development": { 
    table: "jc_job",
    where: "job_num = '128' AND job_status = 'A'"
  },
  "plots_available": {
    table: "hs_plot", 
    where: "job_num = '128' AND plot_status = 'Available'",
    minimum: 1
  },
  "reservation_types": {
    table: "hs_reservation_type",
    where: "active = true",
    minimum: 1
  }
})

// During test
assertDataState("hs_plot", $plot_code, { status: "Available" })

// After test (for next run)
cleanupData("hs_reservation", { plot_code: $plot_code })
// or
resetData("hs_plot", $plot_code, { status: "Available" })
```

### Intelligent Dependency Resolution

```javascript
// Parser identifies entities mentioned
Entities found:
- Development (number provided: 128)
- Plot (status needed: Available)
- Customer (action: create new)

// Generator adds:
1. Verification that development 128 exists
2. Dynamic selection of available plot
3. Customer data generation
4. Cleanup/reset for reusability
```

## Key Principles

1. **Never Assume Data Exists** - Always verify or create
2. **Make Tests Rerunnable** - Reset or use different data each time
3. **Handle Missing Data Gracefully** - Skip rather than fail
4. **Document Data Requirements** - Help customers understand what's needed
5. **Use Phases** - Setup → Test → Cleanup