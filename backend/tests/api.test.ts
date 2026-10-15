import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { dataStore } from "../src/services/store.js";

describe("Dev AI Sentinel API", () => {
  beforeEach(async () => {
    await dataStore.clearAll();
  });

  describe("Health Check", () => {
    it("returns status ok from /health", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
      expect(res.body.service).toBe("dev-ai-sentinel-api");
    });
  });

  describe("Repositories API", () => {
    it("lists default seeded repositories", async () => {
      const res = await request(app).get("/api/v1/repositories");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("creates a new repository with valid GitHub URL", async () => {
      const newRepo = {
        name: "test-repo",
        url: "https://github.com/PSIT-GDGOC/test-repo",
        defaultBranch: "main",
      };
      const res = await request(app).post("/api/v1/repositories").send(newRepo);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("test-repo");
    });

    it("rejects repository creation with invalid non-GitHub URL", async () => {
      const invalidRepo = {
        name: "test-repo",
        url: "https://not-github.com/test-repo",
      };
      const res = await request(app).post("/api/v1/repositories").send(invalidRepo);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("sanitizes repository URL with whitespace and trailing slashes on creation", async () => {
      const repo = {
        name: "cleaned-repo",
        url: "  https://github.com/PSIT-GDGOC/cleaned-repo///  ",
      };
      const res = await request(app).post("/api/v1/repositories").send(repo);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.url).toBe("https://github.com/PSIT-GDGOC/cleaned-repo");
    });

    it("returns 409 Conflict when repository URL is already registered", async () => {
      const duplicateRepo = {
        name: "duplicate-repo",
        url: "https://github.com/PSIT-GDGOC/DevGuardian-AI",
      };
      const res = await request(app).post("/api/v1/repositories").send(duplicateRepo);
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("REPOSITORY_ALREADY_EXISTS");
    });

    it("returns 409 Conflict for duplicate URL even with extra whitespace or trailing slashes", async () => {
      const duplicateRepo = {
        name: "duplicate-with-slash",
        url: "   https://github.com/PSIT-GDGOC/DevGuardian-AI///   ",
      };
      const res = await request(app).post("/api/v1/repositories").send(duplicateRepo);
      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("REPOSITORY_ALREADY_EXISTS");
    });

    it("filters repositories by name using search query parameter", async () => {
      await request(app).post("/api/v1/repositories").send({
        name: "security-auditor",
        url: "https://github.com/PSIT-GDGOC/security-auditor",
      });

      const res = await request(app).get("/api/v1/repositories?search=guardian");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe("DevGuardian-AI");

      const resCase = await request(app).get("/api/v1/repositories?search=AUDITOR");
      expect(resCase.status).toBe(200);
      expect(resCase.body.success).toBe(true);
      expect(resCase.body.data.length).toBe(1);
      expect(resCase.body.data[0].name).toBe("security-auditor");
    });

    it("returns empty data list when search term does not match any repository", async () => {
      const res = await request(app).get("/api/v1/repositories?search=no-such-repo-match");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it("returns all repositories when search query is empty or whitespace", async () => {
      const res = await request(app).get("/api/v1/repositories?search=   ");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it("returns 404 for nonexistent repository ID", async () => {
      const res = await request(app).get("/api/v1/repositories/nonexistent-id");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("REPOSITORY_NOT_FOUND");
    });
  });

  describe("Scans & Findings API", () => {
    it("lists findings", async () => {
      const res = await request(app).get("/api/v1/findings");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("initiates a scan for existing repository", async () => {
      const reposRes = await request(app).get("/api/v1/repositories");
      const repoId = reposRes.body.data[0].id;

      const scanRes = await request(app).post("/api/v1/scans").send({
        repositoryId: repoId,
      });

      expect(scanRes.status).toBe(202);
      expect(scanRes.body.success).toBe(true);
      expect(scanRes.body.data.repositoryId).toBe(repoId);
    });
  });

  describe("AI & ML API", () => {
    it("generates an AI explanation for an existing finding", async () => {
      const findingsRes = await request(app).get("/api/v1/findings");
      const findingId = findingsRes.body.data[0].id;

      const res = await request(app)
        .post("/api/v1/ai/explain")
        .send({ findingId });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.findingId).toBe(findingId);
      expect(res.body.data.summary).toBeDefined();
    });

    it("evaluates overall repository risk score", async () => {
      const res = await request(app).get("/api/v1/ai/risk-score");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data.overallRiskScore).toBe("number");
    });
  });
});
