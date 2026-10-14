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
