# Catalog Expansion Loop — paste into Cursor Composer with /loop

## Goal

Autonomously expand MoodLab catalog:
- **Phase A:** 100 mood LUTs (`data/lut_100_plan.yaml`)
- **Phase B:** 1000 filter/camera presets (`data/filter_preset_taxonomy.yaml`)

## Loop configuration

| Setting | Phase A (mood) | Phase B (filters) |
|---------|----------------|-------------------|
| `--max-turns` | 15 | 50 |
| `--goal` | 100 mood LUTs shipped | 1000 filter presets shipped |
| Batch size | 10 per turn | 20 per turn |
| Registry | `data/lut_registry.yaml` | `data/filter_registry.yaml` |

## Each iteration (strict order)

1. **Read state** — `.cursor/loop/state.json`
2. **Read plan** — next `status: planned` entries from active phase YAML
3. **Delegate** — use `lut-developer` subagent mindset
4. **Author** — add entries to registry (never hand-edit `.cube`)
5. **Generate** — `pnpm lut:generate --all`
6. **Validate** — `pnpm lut:validate` (must exit 0)
7. **Sync** — `pnpm lut:sync-catalog`
8. **Test** — `pnpm test`
9. **Update state** — increment counts, mark shipped in plan YAML
10. **Commit** — descriptive message, push to branch
11. **Stop** — if goal met OR max turns OR validation fails 2× on same batch

## Phase A prompt (copy-paste)

```
/loop --max-turns=15 --goal="100 mood LUTs"

You are executing the MoodLab catalog expansion loop (Phase A).

Read:
- .cursor/loop/catalog-expansion.md
- .cursor/loop/state.json
- data/lut_100_plan.yaml
- docs/agents/LUT_CATALOG_MASTER_PLAN.md

Use lut-developer subagent workflow. Add up to 10 planned mood LUTs per turn to data/lut_registry.yaml.
Skip ids already in registry (dedupeRules in lut_100_plan.yaml).

After each batch: generate, validate, sync, test, update state.json, commit, push.

Report: shipped count / 100, group progress, any QA flags.
Stop at 100 unique mood LUTs or max turns.
```

## Phase B prompt (copy-paste, after Phase A)

```
/loop --max-turns=50 --goal="1000 filter presets"

Phase B: film/camera presets from data/filter_preset_taxonomy.yaml.

Create data/filter_registry.yaml if missing (mirror lut_registry shape + kind: filter_preset).
Add 20 presets per turn. Implement film_stock_emulation recipe if needed.

Same pipeline: generate, validate, sync, test, commit.
Stop at 1000 or max turns.
```

## Guardrails

- Never hand-edit `.cube` RGB lines
- Never skip `pnpm lut:validate`
- Portrait stocks / mood LUTs: `skinProtectionDefault: high`
- If same validation error 2× in a row: stop loop and report
- Do not modify mobile/API code unless pagination required

## Success criteria

| Phase | Done when |
|-------|-----------|
| A | 100 unique mood LUT ids in registry, validate clean, on main |
| B | 1000 filter preset ids, validate clean, taxonomy families populated |
