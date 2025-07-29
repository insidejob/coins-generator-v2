# Journey Analysis Prompt Template

## 🎯 Optimal Format: Share the COMPLETE journey WITH frame checkpoints

This allows me to:
1. See what actions triggered frame switches
2. Identify patterns in the actual implementation
3. Spot any inconsistencies or special cases
4. Build accurate action-to-frame mappings

## 📝 Suggested Prompt Template:

```
Please analyze this COINS journey and update your action-to-frame mapping. This journey is from [MODULE NAME - e.g., Purchase Ledger, House Sales, etc.] and performs [BRIEF DESCRIPTION - e.g., invoice entry, reservation creation, etc.].

[PASTE COMPLETE JOURNEY WITH ALL CHECKPOINTS]

Key questions to answer:
1. What actions consistently trigger frame switches?
2. Are there any new frame patterns not in our documentation?
3. What actions DON'T require frame switches that we might have expected?
4. Are there any context-specific patterns (e.g., this module always uses X pattern)?
```

## 📊 Additional Helpful Information (if available):

1. **Module Context**: "This is a Purchase Ledger journey"
2. **User Flow**: "User is creating a new invoice"
3. **Any Errors**: "This journey works/failed at step X"
4. **Special Notes**: "Notice how setTab here doesn't need active inline"

## 🔍 What I'll analyze from each journey:

### Pattern Extraction:
- Action X → Always followed by Frame Switch Y
- Action Z → Never needs frame switch
- Context: In module M, pattern P is used

### Example Analysis Output:
```
Journey: Purchase Ledger Invoice Entry
New Patterns Found:
- `enterInvoiceHeader()` → No frame switch needed
- `addInvoiceLine()` → Requires `SYS: Switch to getFrame`
- After `postInvoice()` → Always needs `SYS: Switch to getFrame`

Confirmed Patterns:
- `setMenu()` → `SYS: Switch to getFrame` ✓
- `runAction()` → `SYS: Switch to getFrame` ✓

Corrections to Documentation:
- In PL, not all grids need active inlineframe
```

## ✅ Benefits of sharing complete journeys:

1. **Validation**: I can verify frame switches are correctly placed
2. **Context**: I can see the full flow and understand why frames are needed
3. **Edge Cases**: I can spot unusual patterns or module-specific behavior
4. **Accuracy**: Real implementations are ground truth

## 🚫 What NOT to do:

- Don't remove frame checkpoints (I need to see them!)
- Don't summarize or abbreviate (full detail is valuable)
- Don't worry about journey length (more data = better patterns)

## 📈 After 5-10 journeys, we'll have:

1. Comprehensive action-to-frame mapping
2. Module-specific pattern documentation
3. Confidence levels for each pattern
4. Edge cases and exceptions documented
5. Ability to generate accurate scripts from plain English

## 🎯 End Goal:

Given: "Create a purchase invoice for supplier ABC with 3 lines"
We can accurately predict every frame switch needed based on the actions involved.