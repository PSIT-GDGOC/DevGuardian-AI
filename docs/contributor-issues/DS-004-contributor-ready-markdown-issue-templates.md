---
name: "Issue 4: GitHub Templates — Contributor Issue & PR Templates"
about: "Add helpful questions and checkboxes to GitHub templates"
title: "GitHub Templates — Contributor Issue & PR Templates"
labels: ["github", "documentation", "contributor"]
assignees: []
---

# Issue 4: GitHub Templates — Contributor Issue & PR Templates

## Description
When contributors open issues or pull requests on GitHub, having friendly prompts makes it easier to submit complete details. We want to refine the GitHub issue and PR templates with clear checklists.

## What Needs to Be Done
1. In `.github/pull_request_template.md`:
   - Add checklist items for running `npm test` and `npm run typecheck`.
2. In `.github/ISSUE_TEMPLATE/`:
   - Ensure `bug_report.yml` and `feature_request.yml` have friendly labels and monorepo workspace options.

## Files to Edit
- `.github/pull_request_template.md`
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/feature_request.yml`

## Acceptance Criteria
- [ ] Pull request template has a simple, easy-to-follow checklist.
- [ ] Issue templates have clear fields and options.
- [ ] Templates render properly on GitHub without YAML syntax errors.
