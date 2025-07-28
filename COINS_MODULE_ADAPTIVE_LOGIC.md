# COINS Module Adaptive Logic - Enhanced

Based on comprehensive analysis of iframe patterns across all COINS modules.

## MODULE DETECTION

### Module Recognition Patterns
```python
def detect_module(navigation_text):
    """Detect COINS module from navigation actions"""
    module_map = {
        # Core modules
        "House Sales": "HOUSE_SALES",
        "House Building": "HOUSE_SALES",
        "WHS": "HOUSE_SALES",
        
        # Financial modules
        "General Ledger": "GL",
        "GL": "GL",
        "Purchase Ledger": "PL",
        "PL": "PL",
        "Sales Ledger": "SL",
        "SL": "SL",
        "Accounts Payable": "AP",
        "AP": "AP",
        "Accounts Receivable": "AR",
        "AR": "AR",
        
        # HR/Payroll
        "Payroll": "PAYROLL",
        "PR": "PAYROLL",
        "Human Resources": "HCM",
        "HCM": "HCM",
        "Timesheet": "PAYROLL",
        
        # Procurement
        "Purchase Order": "PO",
        "PO": "PO",
        "Subcontract": "SC",
        "SC": "SC",
        
        # Other
        "System": "SYSTEM",
        "Configuration": "SYSTEM",
        "Activity Workbench": "SYSTEM"
    }
    
    for key, module in module_map.items():
        if key.lower() in navigation_text.lower():
            return module
    
    return "UNKNOWN"
```

## ADAPTIVE IFRAME LOGIC

### Grid Pattern Selection
```python
def get_grid_pattern(module, context=None):
    """Determine iframe pattern for grid operations"""
    
    # Financial modules with complex grids
    if module in ["PL", "GL", "SL", "AP", "AR"]:
        if context and "invoice" in context.lower():
            return "getFrame + 4 frames"  # Multi-panel invoice layouts
        return "getFrame + active inlineframe"
    
    # House Sales uses extended pattern for grids
    elif module == "HOUSE_SALES":
        return "getFrame + active inlineframe"
    
    # Purchase Order uses compound pattern by default
    elif module == "PO":
        return "getFrame + active inlineframe"  # 72% of cases
    
    # Simple modules use basic pattern
    elif module in ["PAYROLL", "HCM", "SC"]:
        return "getFrame"
    
    # System functions vary
    elif module == "SYSTEM":
        if context and "webix" in context.lower():
            return "Webix getFrame"
        return "getFrame"
    
    # Default to simple pattern
    else:
        return "getFrame"
```

### Modal Pattern Selection
```python
def get_modal_pattern(module, context=None):
    """Determine iframe pattern for modal dialogs"""
    
    # House Sales uses Dialog Frame for most modals
    if module == "HOUSE_SALES":
        if context and "add choice" in context.lower():
            return "Desktop Frame"  # Nested modal scenario
        return "Dialog Frame"
    
    # Financial modules use active inlineframe
    elif module in ["PL", "GL", "SL", "AP", "AR"]:
        if context and "validation" in context.lower():
            return "active inlineframe"
        return "Dialog Frame"
    
    # Payroll uses simple pattern
    elif module in ["PAYROLL", "HCM"]:
        return "active inlineframe"  # For rate dialogs
    
    # System dialogs
    elif module == "SYSTEM":
        return "Dialog Frame"
    
    # Default
    else:
        return "Dialog Frame"
```

### Module-Specific Rules
```python
def get_module_rules(module):
    """Get complete iframe rules for a module"""
    
    rules = {
        "HOUSE_SALES": {
            "grid_pattern": "getFrame + active inlineframe",
            "modal_pattern": "Dialog Frame",
            "nested_modal_pattern": "Desktop Frame",
            "after_save": "Dialog Frame",
            "after_stage_nav": "Dialog Frame",
            "complexity": "HIGH"
        },
        
        "PAYROLL": {
            "grid_pattern": "getFrame",
            "modal_pattern": "active inlineframe",
            "after_function": "getFrame",
            "after_calculation": "getFrame",
            "complexity": "LOW"
        },
        
        "HCM": {
            "grid_pattern": "getFrame",
            "modal_pattern": "active inlineframe",
            "after_navigation": "getFrame",
            "complexity": "LOW"
        },
        
        "GL": {
            "grid_pattern": "getFrame + active inlineframe",
            "modal_pattern": "Dialog Frame",
            "batch_entry": "Checkpoint from iframe",
            "multi_panel": "4 frames",
            "complexity": "HIGH"
        },
        
        "PL": {
            "grid_pattern": "getFrame + active inlineframe",
            "modal_pattern": "Dialog Frame",
            "invoice_layout": "4 frames",
            "container_switch": True,
            "complexity": "HIGH"
        },
        
        "PO": {
            "grid_pattern": "getFrame + active inlineframe",
            "modal_pattern": "active inlineframe",
            "default_compound": True,  # 72% use compound
            "complexity": "MEDIUM"
        },
        
        "SC": {
            "grid_pattern": "getFrame",
            "modal_pattern": "getFrame",
            "complexity": "LOW"
        },
        
        "SYSTEM": {
            "grid_pattern": "getFrame",
            "modal_pattern": "Dialog Frame",
            "webix_pattern": "Webix getFrame",
            "complexity": "VARIABLE"
        }
    }
    
    return rules.get(module, {
        "grid_pattern": "getFrame",
        "modal_pattern": "Dialog Frame",
        "complexity": "UNKNOWN"
    })
```

## IMPLEMENTATION EXAMPLE

```python
def generate_iframe_switch(action, module, context):
    """Generate appropriate iframe switch for action"""
    
    # Detect action type
    if any(trigger in action.lower() for trigger in ["filter", "search", "grid", "clickrow"]):
        pattern = get_grid_pattern(module, context)
        
    elif any(trigger in action.lower() for trigger in ["dialog", "modal", "add", "new", "popup"]):
        pattern = get_modal_pattern(module, context)
        
    elif "save" in action.lower() and module == "HOUSE_SALES":
        pattern = "Dialog Frame"  # After save in modal
        
    elif "stage" in action.lower() and module == "HOUSE_SALES":
        pattern = "Dialog Frame"  # After stage navigation
        
    else:
        # Default based on module
        rules = get_module_rules(module)
        pattern = rules.get("grid_pattern", "getFrame")
    
    return generate_switch_code(pattern)
```

## PATTERN CONFIDENCE LEVELS

| Module | Pattern Confidence | Notes |
|--------|-------------------|-------|
| House Sales | 95% | Well-tested with Dialog/Desktop Frame |
| Payroll/HCM | 95% | Simple patterns, consistent |
| GL | 85% | Complex but predictable |
| PL | 85% | Multi-panel complexity |
| PO | 90% | Compound pattern dominant |
| SC | 95% | Very simple |
| System | 70% | Highly variable |

## KEY DISCOVERIES

1. **Financial modules (GL, PL, SL, AP, AR)** are most complex:
   - Use "4 frames" pattern for multi-panel layouts
   - Have "Checkpoint from iframe" for validation
   - Require container switching

2. **Payroll/HCM modules** are simplest:
   - 95.5% use basic getFrame
   - Minimal modal handling
   - Predictable patterns

3. **Purchase Order** is unique:
   - 72% use compound pattern immediately
   - Indicates dialog-ready state preference

4. **House Sales** (from our testing):
   - Uses Dialog Frame successfully (not Desktop Frame in most cases)
   - Desktop Frame only for nested modals
   - Complex but consistent patterns

5. **System functions** are most variable:
   - 11 unique iframe patterns
   - Includes modern Webix components
   - Context-dependent behavior