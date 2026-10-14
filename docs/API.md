# 📡 Dev AI Sentinel — REST API Reference

Base URL: `http://localhost:4000`

All responses follow the unified envelope:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | REPOSITORY_ALREADY_EXISTS | INTERNAL_ERROR",
    "message": "Human-readable description",
    "details": [ ... ]
  }
}
```

---

## 1. System Health

### `GET /health`
Returns runtime status and API service version.

**Response `200 OK`**:
```json
{
  "status": "ok",
  "timestamp": "2026-10-14T20:00:00.000Z",
  "service": "dev-ai-sentinel-api",
  "version": "0.1.0"
}
```

---

## 2. Repositories

### `GET /api/v1/repositories`
Lists all tracked repositories.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "11111111-1111-4111-a111-111111111111",
      "name": "DevGuardian-AI",
      "url": "https://github.com/PSIT-GDGOC/DevGuardian-AI",
      "defaultBranch": "main",
      "createdAt": "2026-10-14T19:00:00.000Z",
      "updatedAt": "2026-10-14T19:00:00.000Z"
    }
  ]
}
```

### `GET /api/v1/repositories/:id`
Retrieves a single repository by its UUID.

**Response `200 OK`** or **`404 Not Found`**

### `POST /api/v1/repositories`
Registers a new repository.

**Request Body**:
```json
{
  "name": "sample-project",
  "url": "https://github.com/PSIT-GDGOC/sample-project",
  "defaultBranch": "main"
}
```

**Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "id": "7a35...-...",
    "name": "sample-project",
    "url": "https://github.com/PSIT-GDGOC/sample-project",
    "defaultBranch": "main",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### `DELETE /api/v1/repositories/:id`
Deletes a tracked repository by ID.

---

## 3. Scans

### `GET /api/v1/scans`
Lists scans, optionally filtered by `?repositoryId=<uuid>`.

### `GET /api/v1/scans/:id`
Retrieves details for a specific scan.

### `POST /api/v1/scans`
Initiates a code audit scan.

**Request Body**:
```json
{
  "repositoryId": "11111111-1111-4111-a111-111111111111",
  "commitHash": "9c31fd03142ec14136404d0c869d6712c7f16815"
}
```

**Response `202 Accepted`**:
```json
{
  "success": true,
  "data": {
    "id": "scan-uuid",
    "repositoryId": "11111111-1111-4111-a111-111111111111",
    "status": "QUEUED",
    "commitHash": "9c31fd03142ec14136404d0c869d6712c7f16815",
    "totalFindings": 0,
    "highSeverityCount": 0,
    "createdAt": "..."
  }
}
```

---

## 4. Findings

### `GET /api/v1/findings`
Lists findings, optionally filtered by `?scanId=<uuid>`.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "finding-uuid",
      "scanId": "scan-uuid",
      "ruleId": "SEC-001",
      "title": "Hardcoded Secret or Token Detection",
      "description": "Potential sensitive token or secret found in source code.",
      "severity": "HIGH",
      "category": "SECURITY",
      "filePath": "src/config/keys.example.ts",
      "startLine": 12,
      "snippet": "const apiKey = ...",
      "suggestedFix": "Use environment variables instead of hardcoding tokens."
    }
  ]
}
```

### `GET /api/v1/findings/:id`
Retrieves details for a single finding.

---

## 5. Issues

### `GET /api/v1/issues`
Lists created issues, optionally filtered by `?repositoryId=<uuid>`.

### `POST /api/v1/issues`
Creates an issue linked to a repository and optional finding.

**Request Body**:
```json
{
  "repositoryId": "11111111-1111-4111-a111-111111111111",
  "findingId": "finding-uuid",
  "title": "Fix exposed API token in keys configuration",
  "body": "A critical severity secret was identified in src/config/keys.example.ts. Move to .env."
}
```
