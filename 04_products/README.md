# 04_products — Internal Product Build Layer

This folder is the internal product build layer for all NoDrft Systems proprietary products.

## Purpose

Holds source code, build specifications, prototypes, and product-level governance documents for products owned and operated by NoDrft Systems. This is the build-side of the product record. The business governance record (Proprietary Build Declaration, strategy brief, status log) lives in `02_client-system/`.

## Active Products

| Product | Folder | Status |
|---|---|---|
| CasaClaro | `CASACLARO/` | Active — receiving changes |
| Peak Equity Optimizer | `PEO/` | Active — Phase 6 pending build authorization |
| The Walcott & Co. Press | `WCP/` | Active — blueprint exists, build not yet started |
| Forgotten by Design | `forgotten-by-design-web/` | Active — pre-launch, 5 decisions pending |

## What Belongs Here

- Product source code and build output
- Product-level AGENTS.md, CLAUDE.md, and root contracts
- Product specs, blueprints, and design references
- Prototypes (`prototypes/` subfolder)
- Product governance documents (agent routing notes, evidence ledgers, build control assets)

## What Does NOT Belong Here

- Binary artifacts: ML model files (*.tflite), browser profiles, crash dumps
- node_modules and other dependency trees
- Generated or compiled output: dist/, .next/, minified bundles
- QA screenshot capture directories
- Client intake records, qualification decisions, strategy briefs — those belong in `02_client-system/`

## Governance Authority

Defined in: `01_system/operations/repository-control-plane.md`

Every product here must have a corresponding workspace in `02_client-system/` that tracks the business governance record. The two folders are complementary, not competing.
