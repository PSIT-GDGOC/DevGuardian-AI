# 🛡️ Dev AI Sentinel — DevGuardian AI

> **A beginner-friendly code security and quality scanner built for Google Developer Groups on Campus (GDGOC).**

---

## 💡 What is Dev AI Sentinel?

When writing code in student projects or hackathons, it is easy to accidentally leave API keys in files, write insecure code, or forget `TODO` comments.

**Dev AI Sentinel** is a modular tool that scans software repositories to find:
- 🔑 **Leaked Secrets & Tokens** (e.g. exposed Google API keys or GitHub tokens)
- ⚠️ **Insecure Code Patterns** (e.g. unsafe `eval()` calls)
- 📝 **Unfinished Code / Technical Debt** (unresolved `TODO` or `FIXME` items)

It provides a simple **REST API** and a **Web Dashboard** to view findings and track issues.

---

## 🚀 Quickstart in 3 Steps

### 1. Clone & Set Up Environment
```bash
git clone https://github.com/PSIT-GDGOC/DevGuardian-AI.git
cd DevGuardian-AI

# Checks your Node.js version and creates .env automatically
node scripts/verify-env.js
```

### 2. Install & Build
```bash
# Install dependencies across the project
npm install

# Build shared packages
npm run build
```

### 3. Run Locally
- **Start the Backend API Server** (Runs at `http://localhost:4000`):
  ```bash
  npm run dev:backend
  ```
- **Start the Frontend Web Dashboard** (Runs at `http://localhost:3000`):
  ```bash
  npm run dev:frontend
  ```

---

## 📁 Simple Project Structure

Contributors can directly open the area they want to work on:

```
dev-ai-sentinel/
├── frontend/                    # 🖥️ FRONTEND: Next.js + React Dashboard UI
│   ├── src/
│   │   ├── app/                 # Dashboard page & layout
│   │   ├── components/          # Reusable UI (Navbar, StatCard)
│   │   ├── features/            # Features (Findings, Repos, Scans, AI Insights)
│   │   ├── hooks/               # Custom data fetching hooks
│   │   └── types/               # TypeScript interfaces
│   └── package.json
│
├── backend/                     # ⚙️ BACKEND: Express + TypeScript REST API
│   ├── src/
│   │   ├── modules/             # API routes & controllers (Repositories, Scans, Findings, AI)
│   │   ├── analysis-engine/     # Static security scanner & finding normalizer
│   │   ├── services/            # In-memory store & scanner service
│   │   ├── middleware/          # Validation, error handling, logging
│   │   ├── contracts/           # Zod validation schemas
│   │   ├── app.ts               # Express app
│   │   └── server.ts            # Server entry point
│   ├── tests/                   # Backend & API integration tests
│   └── package.json
│
├── ai-ml/                       # 🧠 AI / ML: Explainers, Classifiers & Fixers
│   ├── src/
│   │   ├── explainers/          # LLM / Gemini prompt explainer (Boilerplate)
│   │   ├── classifiers/         # ML vulnerability risk score classifier (Boilerplate)
│   │   └── fixers/              # Automated code patch & diff generator (Boilerplate)
│   ├── tests/                   # AI/ML unit tests
│   └── package.json
│
├── docs/
│   ├── CONTRIBUTING.md          # How to contribute as a student
│   ├── API.md                   # Simple API endpoints guide
│   └── contributor-issues/      # Beginner-friendly issue drafts
├── .github/
│   └── ISSUE_TEMPLATE/          # GitHub issue templates
├── scripts/
│   └── verify-env.js            # Pre-flight environment check
├── README.md
└── package.json
```

---

## 🛠️ Helpful Commands

| Command | What It Does |
|---|---|
| `npm run dev:backend` | Starts the Express backend on port 4000 |
| `npm run dev:frontend` | Starts the Next.js web dashboard on port 3000 |
| `npm test` | Runs the full test suite across all 3 folders |
| `npm run typecheck` | Checks TypeScript types across frontend, backend, and ai-ml |
| `npm run lint` | Runs ESLint |
| `npm run build` | Builds backend and ai-ml packages |

---

## 🤝 Contributing for College Students & GDGOC

We welcome all college students, whether it's your 1st open-source contribution or your 10th!

1. Check out the issues listed in [`docs/contributor-issues/`](docs/contributor-issues/) or on GitHub Issues.
2. Read the simple guide in [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md).
3. Create your feature branch:
   ```bash
   git checkout -b feat/my-contribution
   ```
4. Run tests before submitting:
   ```bash
   npm test
   ```
5. Submit a Pull Request on GitHub!

---

## 📖 Additional Docs

- [**Contributing Guide**](docs/CONTRIBUTING.md) — Step-by-step student contributor workflow.
- [**API Reference**](docs/API.md) — Quick reference for available REST endpoints.
- [**Contributor Issues**](docs/contributor-issues/) — Prepared issues ready to be claimed.
