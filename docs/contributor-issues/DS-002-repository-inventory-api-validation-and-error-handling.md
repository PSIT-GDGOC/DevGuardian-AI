---
name: "Issue 2: API — Repository Inventory Validation & Search"
about: "Add URL sanitization, search by name, and clear error responses"
title: "API — Repository Inventory Validation & Search"
labels: ["backend", "api", "contributor"]
assignees: []
---

# Issue 2: API — Repository Inventory Validation & Search

## Description
The repository registration endpoint (`POST /api/v1/repositories`) accepts GitHub repository URLs. We need to make sure URLs with trailing slashes or extra whitespace are cleaned automatically, and add a search filter query to `GET /api/v1/repositories?search=...`.

## What Needs to Be Done
1. In `packages/contracts/src/index.ts`:
   - Sanitize repository URLs in `CreateRepositorySchema` (trim whitespace, remove trailing slashes).
2. In `apps/api/src/modules/repositories/repository.controller.ts`:
   - Support `req.query.search` in `list()` to filter repositories by name.
   - Return clean 409 responses if a repository URL is already registered.
3. In `apps/api/tests/api.test.ts`:
   - Add test cases covering search query filtering and duplicate URL prevention.

## Files to Edit
- `packages/contracts/src/index.ts`
- `apps/api/src/modules/repositories/repository.controller.ts`
- `apps/api/tests/api.test.ts`

## Step-by-Step Guidance
1. Open `packages/contracts/src/index.ts`.
2. Update `CreateRepositorySchema` using Zod `.trim()`.
3. In `apps/api/src/modules/repositories/repository.controller.ts`, check `const search = req.query.search as string | undefined;` and filter repositories.
4. Run `npm run test:api` to verify.

## Acceptance Criteria
- [ ] Submitting a URL with extra whitespace or trailing slashes is automatically cleaned.
- [ ] Calling `GET /api/v1/repositories?search=term` filters repositories by name.
- [ ] Duplicate URLs return a clean `409 Conflict` response with error code `REPOSITORY_ALREADY_EXISTS`.
- [ ] All API tests pass cleanly (`npm test`).
