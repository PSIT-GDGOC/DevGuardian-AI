---
name: "Issue 3: Analysis Engine — Finding Normalization & Detection Rules"
about: "Expand severity tag mappings and sanitize file paths in normalizer"
title: "Analysis Engine — Finding Normalization & Detection Rules"
labels: ["analysis-engine", "contributor"]
assignees: []
---

# Issue 3: Analysis Engine — Finding Normalization & Detection Rules

## Description
The `FindingNormalizer` in `packages/analysis-engine/src/normalizer.ts` converts raw findings from different scanners into standard severity and category levels. We need to expand this to recognize common synonyms (e.g. `moderate`, `suggestion`, `fatal`) and clean relative file paths (e.g. `./src/file.ts` -> `src/file.ts`).

## What Needs to Be Done
1. In `packages/analysis-engine/src/normalizer.ts`:
   - Add mappings for severity terms like `moderate` -> `MEDIUM`, `suggestion` -> `INFO`, `fatal` -> `CRITICAL`.
   - Strip leading `./` in `filePath` so `./src/index.ts` and `src/index.ts` match.
2. In `packages/analysis-engine/tests/engine.test.ts`:
   - Add tests checking new severity mappings and path deduplication.

## Files to Edit
- `packages/analysis-engine/src/normalizer.ts`
- `packages/analysis-engine/tests/engine.test.ts`

## Step-by-Step Guidance
1. Open `packages/analysis-engine/src/normalizer.ts`.
2. In `normalizeSeverity()`, add the new keyword cases to the switch block.
3. In `normalize()`, ensure `filePath` is cleaned:
   ```ts
   filePath: raw.filePath.replace(/\\/g, "/").replace(/^\.\//, "").trim()
   ```
4. Run `npm run test:analysis-engine` to verify.

## Acceptance Criteria
- [ ] `normalizeSeverity` maps `moderate` to `MEDIUM` and `suggestion` to `INFO`.
- [ ] File paths with leading `./` are cleaned before deduplication.
- [ ] All analysis engine tests pass cleanly (`npm test`).
