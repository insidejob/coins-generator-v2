# COINS Module-Specific Iframe Patterns

## 🎯 Quick Module Reference

This guide shows which iframe patterns each COINS module typically uses, based on analysis of pre-written assets and real test data.

---

## 📊 Module-to-Pattern Mapping

### Financial Modules

#### General Ledger (GL)
- **Standard Grids**: `SYS: Switch to getFrame` ✅
- **Complex Grids**: `SYS: Switch to getFrame + active inlineframe` (rare)
- **Search Fields**: Works with just `getFrame` (as shown in screenshots)
- **Modals**: `SYS: Switch to Dialog Frame`
- **Confidence**: 85%

#### Purchase Ledger (PL) ⚠️ Special Case
- **Standard Grids**: `SYS: Switch to getFrame + active inlineframe` 
- **Invoice Layouts**: May need 4-frame pattern
- **Container Switching**: Often required
- **Modals**: `SYS: Switch to Dialog Frame`
- **Confidence**: 85%
- **Note**: PL is the most consistent user of the extended pattern

#### Sales Ledger (SL) / Accounts Receivable (AR)
- **Standard Grids**: `SYS: Switch to getFrame + active inlineframe`
- **Modals**: `SYS: Switch to Dialog Frame`
- **Confidence**: 85%

#### Accounts Payable (AP)
- **Standard Grids**: `SYS: Switch to getFrame + active inlineframe`
- **Invoice Entry**: May need 4-frame pattern
- **Modals**: `SYS: Switch to Dialog Frame`
- **Confidence**: 85%

---

### Sales & Construction Modules

#### House Sales / House Building (WHS) 🏠
- **Sales Workbench**: `SYS: Switch to getFrame + active inlineframe` ⚠️
- **Standard Forms**: `SYS: Switch to getFrame`
- **Reservation Modals**: `SYS: Switch to Dialog Frame`
- **Stage Navigation**: `SYS: Switch to Desktop Frame` (documented, not verified)
- **After Save in Modal**: `SYS: Switch to Dialog Frame`
- **Confidence**: 95%
- **Note**: Sales Workbench is the special case that requires active inlineframe

#### Construction (Contract Status, etc.)
- **Standard Operations**: `SYS: Switch to getFrame`
- **Modals**: `SYS: Switch to Dialog Frame`
- **Confidence**: 90%

---

### HR & Payroll Modules

#### Payroll (PR) / Timesheets 💰
- **All Operations**: `SYS: Switch to getFrame` ✅
- **Rate Dialogs**: `SYS: Switch to active inlineframe` (rare)
- **Confidence**: 95%
- **Note**: One of the simplest modules - almost always just getFrame

#### Human Resources (HCM)
- **All Operations**: `SYS: Switch to getFrame` ✅
- **Employee Dialogs**: `SYS: Switch to active inlineframe` (rare)
- **Confidence**: 95%

---

### Procurement Modules

#### Purchase Orders (PO) 📋
- **Default Pattern**: `SYS: Switch to getFrame + active inlineframe` (72% of cases)
- **Simple Views**: `SYS: Switch to getFrame`
- **Modals**: `SYS: Switch to active inlineframe`
- **Confidence**: 90%
- **Note**: Unusual - often starts in compound pattern

#### Subcontract (SC)
- **All Operations**: `SYS: Switch to getFrame` ✅
- **Confidence**: 95%
- **Note**: Very simple pattern

---

### System & Configuration

#### System Functions / Configuration
- **Standard**: `SYS: Switch to getFrame`
- **Webix Components**: `SYS: Switch to Webix getFrame`
- **Activity Workbench**: `SYS: Switch to getFrame`
- **Confidence**: 70%
- **Note**: Most variable module - 11 different patterns found

---

## 🔍 Pattern Summary by Complexity

### Simple Modules (95% use getFrame only)
- Payroll (PR)
- Human Resources (HCM)
- Subcontract (SC)
- General Ledger (GL) - even with search!

### Complex Modules (Often need extended patterns)
- Purchase Ledger (PL) - most consistent extended user
- House Sales - Sales Workbench specifically
- Purchase Orders (PO) - unusual default compound state

### Variable Modules
- System/Configuration - depends on specific function

---

## 💡 Key Takeaways

1. **Most modules use simple getFrame** - Even with search fields!
2. **Purchase Ledger is special** - Consistently needs extended pattern
3. **Sales Workbench is unique** - The main place you'll see active inlineframe in House Sales
4. **Payroll/HR are simplest** - Almost never need complex patterns
5. **Start simple** - Always try getFrame first, regardless of module

---

## 🎯 Decision Guide by Module

```
What module are you in?
│
├─ Payroll/HR/Subcontract?
│  └─ Use: getFrame (95% success)
│
├─ Purchase Ledger?
│  └─ Use: getFrame + active inlineframe
│
├─ Sales Workbench (House Sales)?
│  └─ Use: getFrame + active inlineframe
│
├─ General Ledger (even with search)?
│  └─ Use: getFrame
│
└─ Everything else?
   └─ Start with: getFrame
      └─ If error: Add active inlineframe
```

---

## 📝 Notes on Confidence Levels

- **95%** = Almost always works with stated pattern
- **90%** = Usually works, occasional exceptions
- **85%** = Works most of the time, some complexity
- **70%** = Variable, depends on specific context

Based on analysis of actual COINS test data and pre-written library checkpoints.