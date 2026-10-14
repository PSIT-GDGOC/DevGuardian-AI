---
name: "Issue 1: Frontend Dashboard — Severity Filtering & Loading State"
about: "Add filter controls and loading feedback to the web dashboard"
title: "Frontend Dashboard — Severity Filtering & Loading State"
labels: ["frontend", "contributor"]
assignees: []
---

# Issue 1: Frontend Dashboard — Severity Filtering & Loading State

## Description
The web dashboard (`apps/web`) currently displays code findings in a flat list without a way to filter by severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`) or category (`SECURITY`, `QUALITY`, etc.). Adding a simple filter bar and loading state makes the dashboard much cleaner to view.

## What Needs to Be Done
1. In `apps/web/src/features/findings/FindingTable.tsx`:
   - Add a dropdown or buttons to filter findings by severity (`ALL`, `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`).
   - Add an empty-state message when no findings match the selected filter.
2. In `apps/web/src/app/page.tsx`:
   - Show a simple loading indicator or message while data is being fetched.

## Files to Edit
- `apps/web/src/features/findings/FindingTable.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/hooks/use-dashboard-data.ts`
- `apps/web/tests/dashboard.test.ts`

## Step-by-Step Guidance
1. Open `apps/web/src/features/findings/FindingTable.tsx`.
2. Add a `useState` for `filterSeverity` (default: `"ALL"`).
3. Filter the `findings` array before mapping:
   ```tsx
   const visibleFindings = filterSeverity === "ALL" 
     ? findings 
     : findings.filter(f => f.severity === filterSeverity);
   ```
4. Render a `<select>` dropdown above the table to let the user pick a severity.
5. In `apps/web/tests/dashboard.test.ts`, add a test verifying filter logic.

## Acceptance Criteria
- [ ] Users can filter findings by severity from the dashboard UI.
- [ ] If no findings match, display a helpful "No findings match this filter" message.
- [ ] A loading state appears while `useDashboardData` is loading.
- [ ] `npm test` and `npm run typecheck` pass with 0 errors.
