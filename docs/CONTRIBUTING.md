# 🤝 Contributing to Dev AI Sentinel

Welcome! We are excited to collaborate with Google Developer Groups on Campus (GDGOC) members and open-source contributors.

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please treat all community members with respect.

## Contribution Workflow

### 1. Finding an Issue
- Browse open issues on GitHub tagged with `good first issue` or `gdgoc-contributor`.
- Check the issue drafts in `docs/contributor-issues/` for pending tasks.
- Comment on the issue you would like to work on and wait for confirmation from a maintainer before beginning implementation.

### 2. Branch Naming Convention
Create a feature branch from `main`:
- `feat/DS-001-dashboard-filters` (for features)
- `fix/DS-002-api-url-validation` (for bug fixes)
- `docs/DS-005-readme-expansion` (for documentation)
- `test/engine-coverage` (for testing improvements)

### 3. Making Changes
- Follow existing patterns in the codebase.
- Maintain documentation integrity and do not remove existing comments without rationale.
- Keep changes scoped to the agreed issue. Do not include unrelated refactors.

### 4. Running Checks Locally
Before opening a pull request, run all verification checks:
```bash
# Type check all packages and apps
npm run typecheck

# Run automated tests
npm test

# Check for lint issues
npm run lint

# Verify full build
npm run build
```

### 5. Opening a Pull Request
- Target the `main` branch.
- Fill out the Pull Request template provided in `.github/pull_request_template.md`.
- Reference the linked issue (e.g., `Closes #12`).
- A maintainer will review your code within 48 hours.
