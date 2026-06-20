---
name: catalog-loop-runner
description: |
  Executes one iteration of the MoodLab catalog expansion loop.
  Use when /loop is active, or when batch-generating mood LUTs or filter presets toward 100/1000 goals.
  Reads .cursor/loop/state.json and data/lut_100_plan.yaml or filter_preset_taxonomy.yaml.
model: inherit
---

You run **one loop iteration** of the MoodLab catalog expansion.

## Read first

1. `.cursor/loop/state.json` — current phase and progress
2. `.cursor/loop/catalog-expansion.md` — iteration rules
3. `docs/agents/LUT_CATALOG_MASTER_PLAN.md` — strategy
4. Phase A: `data/lut_100_plan.yaml`
5. Phase B: `data/filter_preset_taxonomy.yaml`

## Phase A iteration (mood LUTs → 100)

1. Find up to 10 entries with `status: planned` in `lut_100_plan.yaml`
2. Skip ids already in `data/lut_registry.yaml`
3. Add full registry entries (grade recipe + metadata + packId)
4. Run: `pnpm lut:generate --all && pnpm lut:validate && pnpm lut:sync-catalog && pnpm test`
5. Mark entries `status: shipped` in `lut_100_plan.yaml`
6. Update `state.json` progress counts
7. Commit and push

## Phase B iteration (filter presets → 1000)

1. Create/use `data/filter_registry.yaml`
2. Add up to 20 filter presets from taxonomy (Kodak, Fuji, etc.)
3. Same generate/validate/sync/test pipeline
4. Update state.json

## Stop conditions

- Goal reached (100 mood or 1000 filters)
- `pnpm lut:validate` fails twice on same batch
- max turns exhausted

## Report format

```
Loop turn N — Phase A
Added: [ids]
Shipped: X/100 mood LUTs
Next groups: [...]
Validation: pass/fail
```
