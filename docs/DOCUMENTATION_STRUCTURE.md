# COINS Documentation Structure Overview

## 📂 Directory Organization

```
docs/
├── README.md                    # Main documentation index
├── DOCUMENTATION_STRUCTURE.md   # This file - explains the structure
│
├── iframe-guide/               # 🏢 EXTERNAL - Business User Documentation
│   └── COINS_Navigation_Guide.md    # User-friendly visual guide for business users
│
└── internal-technical/         # 🔧 INTERNAL - Technical Documentation
    ├── README.md                    # Technical documentation index
    ├── archive/                     # Deprecated documentation
    │   └── COINS_IFRAME_GUIDE_FOR_BUSINESS_USERS.md
    │
    ├── Core References/
    │   ├── COINS_IFRAME_PATTERNS.md           # Main pattern reference
    │   ├── COINS_IFRAME_SWITCHING_GUIDE.md    # Quick switching reference
    │   └── COINS_MODULE_IFRAME_MAPPING.md     # Module-specific patterns
    │
    ├── Visual Documentation/
    │   ├── COINS_IFRAME_VISUAL_EXAMPLES.md    # Technical visual analysis
    │   ├── COINS_IFRAME_VISUAL_MAPPING_GUIDE.md # DevTools guide
    │   └── COINS_IFRAME_VISUAL_DIAGRAMS.md    # Architecture diagrams
    │
    ├── Analysis & Research/
    │   ├── COINS_IFRAME_PATTERN_ANALYSIS.md   # Statistical analysis
    │   ├── COINS_IFRAME_SEARCH_INVESTIGATION.md # Search pattern research
    │   └── COINS_IFRAME_REFINED_RULES.md      # Refined implementation rules
    │
    └── Specialized Topics/
        ├── COINS_STAGE_NAVIGATION_PATTERN.md   # Multi-step dialogs
        ├── COINS_STAGE_NAVIGATION_DIRECT.md    # Direct navigation
        ├── COINS_IFRAME_ERROR_HANDLING_GUIDE.md # Error handling
        └── COINS_IFRAME_VISUAL_TROUBLESHOOTING.md # Troubleshooting
```

## 🎯 Document Purpose Classification

### External Documentation (Business Users)
| Document | Purpose | Audience |
|----------|---------|----------|
| `COINS_Navigation_Guide.md` | Simple visual guide for COINS navigation | Business users, testers, new employees |

### Internal Documentation (Technical/AI)
| Document | Purpose | Primary Use |
|----------|---------|-------------|
| `COINS_IFRAME_PATTERNS.md` | Comprehensive pattern reference | AI system understanding |
| `COINS_IFRAME_SWITCHING_GUIDE.md` | Quick technical reference | Developer implementation |
| `COINS_MODULE_IFRAME_MAPPING.md` | Module-specific patterns | Both AI and developers |
| `COINS_IFRAME_VISUAL_EXAMPLES.md` | Technical visual patterns | Pattern recognition |
| `COINS_IFRAME_PATTERN_ANALYSIS.md` | Statistical analysis | Understanding confidence levels |
| `COINS_IFRAME_SEARCH_INVESTIGATION.md` | Edge case research | Handling exceptions |

## ✅ No Duplicates

All duplicate guides have been consolidated:
- Old business guide archived (was duplicating new guide content)
- Visual examples integrated into business guide for users
- Technical visual examples remain separate for development reference

## 🔍 Quick Navigation

- **New COINS user?** → Start with [`iframe-guide/COINS_Navigation_Guide.md`](./iframe-guide/COINS_Navigation_Guide.md)
- **Developer?** → Start with [`internal-technical/COINS_IFRAME_PATTERNS.md`](./internal-technical/COINS_IFRAME_PATTERNS.md)
- **Implementing automation?** → Use [`internal-technical/COINS_MODULE_IFRAME_MAPPING.md`](./internal-technical/COINS_MODULE_IFRAME_MAPPING.md)
- **Debugging issues?** → Check [`internal-technical/COINS_IFRAME_VISUAL_TROUBLESHOOTING.md`](./internal-technical/COINS_IFRAME_VISUAL_TROUBLESHOOTING.md)