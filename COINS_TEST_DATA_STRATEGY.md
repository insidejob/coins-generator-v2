# COINS Test Data Dependency Management Strategy

## The Challenge

COINS processes often require complex data hierarchies:
- A PO needs a supplier, GL accounts, cost codes
- A sales reservation needs a development, plot, customer
- An invoice needs a PO, receipt, matching rules
- Payroll needs employees, earning categories, periods

## Three-Tier Approach

### 1. Base Data (Foundation Layer)
Permanent data that rarely changes, loaded once:

```yaml
BASE_DATA:
  GL_ACCOUNTS:
    - code: "1000-00-00"
      name: "Cash"
      type: "ASSET"
    - code: "6000-00-00"
      name: "Expenses"
      type: "EXPENSE"
      
  SUPPLIERS:
    - code: "SUPP001"
      name: "Test Supplier Ltd"
      status: "ACTIVE"
      
  EMPLOYEES:
    - code: "EMP001"
      name: "Test Employee"
      status: "ACTIVE"
      
  KCO_SETTINGS:
    - kco: "100"
      gl_structure: "9999-99-99"
      periods_open: ["202401", "202402"]
```

### 2. Scenario Data (Test-Specific Layer)
Data created for specific test scenarios:

```yaml
SCENARIO: "Purchase_Order_Flow"
REQUIRES:
  - supplier: "SUPP001"  # From base data
  - gl_account: "6000-00-00"
  - cost_code: "CC001"
  
CREATES:
  - po_number: "${generated}"
  - po_lines: 3
  - total_value: 1000.00
  
CLEANUP:
  - delete_po: "${po_number}"
```

### 3. Dynamic Data (Runtime Layer)
Data generated during test execution:

```javascript
// In test journey
generateRandom("{{random.alphaNumeric(8)}}", "PO_") returning $po_ref
getDate("+1D", "") returning $delivery_date
```

## Implementation Strategies

### Strategy 1: Pre-Journey Setup Checkpoints

```javascript
// Reusable setup checkpoint
Checkpoint: Setup PO Test Data
  // Check if supplier exists
  runQuery("FOR EACH supplier WHERE sup_code = 'SUPP001'") returning $supplier
  if (!$supplier) {
    // Create supplier
    setMenu("%AP_SUPPLIER_MAINT")
    Click on "Add"
    Enter "SUPP001" in "sup_code"
    Enter "Test Supplier Ltd" in "sup_name"
    keyboardShortcut('save')
  }
```

### Strategy 2: Test Data Templates

```javascript
// test-data-templates/purchase-order.json
{
  "dependencies": {
    "supplier": {
      "table": "ap_supplier",
      "key": "sup_code",
      "required_fields": {
        "sup_code": "SUPP001",
        "sup_name": "Test Supplier Ltd",
        "sup_status": "ACTIVE"
      }
    },
    "gl_account": {
      "table": "gl_account",
      "key": "gla_code",
      "required_fields": {
        "gla_code": "6000-00-00",
        "gla_name": "Expenses",
        "gla_type": "EXPENSE"
      }
    }
  }
}
```

### Strategy 3: Smart Data Discovery

```javascript
// Extension to find or create test data
findOrCreateTestData("supplier") returning $supplier_code

// Implementation:
// 1. Query for existing active supplier
// 2. If not found, create one with generated code
// 3. Return the code for use in test
```

## Customer Requirements Enhancement

### Simple Format:
```
Test: Create Purchase Order
Needs: Active supplier, GL expense account
Steps:
1. Go to Purchase Orders
2. Click Add
3. Enter supplier: [any active supplier]
4. Enter GL: [any expense account]
```

### Parser Enhancement:
```javascript
// Parser identifies "Needs" section
// Automatically adds data setup:

Checkpoint: Verify Test Data
  // Find active supplier
  runQuery("FOR EACH ap_supplier WHERE sup_status = 'ACTIVE' BY sup_code") returning $suppliers
  if ($suppliers.length == 0) {
    ERROR "No active suppliers found - test cannot proceed"
  }
  setTestData("supplier", $suppliers[0].sup_code)
  
  // Find expense account
  runQuery("FOR EACH gl_account WHERE gla_type = 'EXPENSE' AND gla_active = true") returning $accounts
  setTestData("gl_account", $accounts[0].gla_code)
```

## Data Relationship Mapping

```yaml
COINS_DATA_RELATIONSHIPS:
  purchase_order:
    requires:
      - supplier (ap_supplier)
      - gl_account (gl_account)
      - cost_code (jc_costcode) [optional]
      - period_open (gl_period)
    creates:
      - po_header (po_header)
      - po_lines (po_detail)
      
  sales_reservation:
    requires:
      - development (jc_job)
      - plot (hs_plot) with status='Available'
      - customer_type (hs_customer_type)
    creates:
      - reservation (hs_reservation)
      - customer (hs_customer)
      
  ap_invoice:
    requires:
      - supplier (ap_supplier)
      - po_number (po_header) [optional]
      - gl_accounts (gl_account) [multiple]
    creates:
      - invoice (ap_invoice)
      - distributions (ap_invdist)
```

## Test Data Virtuoso Extensions

```javascript
// Check data exists
assertDataExists("supplier", "SUPP001")
assertDataExists("gl_account", "6000-00-00", "type='EXPENSE'")

// Find available data
findAvailableData("plot", "status='Available'") returning $plot_code

// Create if missing
ensureDataExists("cost_code", {
  code: "CC001",
  name: "General Costs",
  type: "OVERHEAD"
})

// Cleanup after test
cleanupTestData("po_header", "po_ref='${$po_ref}'")
```

## Best Practices

1. **Identify Dependencies Early**
   - Parse requirements for entity references
   - Check what needs to exist before test can run

2. **Use Data Pools**
   - Create pools of test data (suppliers, customers)
   - Rotate through to avoid conflicts

3. **Smart Cleanup**
   - Only cleanup what test created
   - Leave base data intact

4. **Phase Management**
   - Phase 1: Data setup journeys
   - Phase 2: Actual test journeys
   - Phase 3: Cleanup journeys

5. **Error Handling**
   ```javascript
   // If required data missing
   if (!$supplier_exists) {
     SKIP_TEST "Required supplier data not found"
   }
   ```

## Example: Complete Flow

```javascript
// Journey: Create Purchase Order
// Phase: 2
// Dependencies: Base data loaded

Checkpoint 1: Verify Prerequisites
  assertDataExists("supplier", "SUPP001")
  assertDataExists("gl_account", "6000-00-00")
  findAvailableData("period", "status='OPEN'") returning $period

Checkpoint 2: Login and Navigate
  // ... standard login ...

Checkpoint 3: Create PO
  setMenu("%PO_ORDER_ENTRY")
  Click on "Add"
  Enter $oData.supplier in "sup_code"
  Enter $oData.gl_account in "gl_code"
  // ... complete PO ...
  
Checkpoint 4: Cleanup Tracking
  setTestData("created_po", $po_number)  // For cleanup phase
```

This comprehensive approach ensures tests have required data while being maintainable and reliable!