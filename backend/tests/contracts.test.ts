import { describe, it, expect } from "vitest";
import { CreateRepositorySchema, CreateScanSchema, CreateIssueSchema } from "../src/contracts/index.js";

describe("Contracts Zod Schemas", () => {
  describe("CreateRepositorySchema", () => {
    it("accepts a valid GitHub repository URL", () => {
      const valid = {
        name: "DevGuardian-AI",
        url: "https://github.com/PSIT-GDGOC/DevGuardian-AI",
        defaultBranch: "main",
      };
      const result = CreateRepositorySchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects non-github URLs", () => {
      const invalid = {
        name: "InsecureRepo",
        url: "https://malicious-site.com/repo",
      };
      const result = CreateRepositorySchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects empty repository name", () => {
      const invalid = {
        name: "",
        url: "https://github.com/test/repo",
      };
      const result = CreateRepositorySchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("CreateScanSchema", () => {
    it("validates repository UUID and optional commit hash", () => {
      const valid = {
        repositoryId: "123e4567-e89b-12d3-a456-426614174000",
        commitHash: "9c31fd03142ec14136404d0c869d6712c7f16815",
      };
      const result = CreateScanSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects invalid UUID", () => {
      const invalid = {
        repositoryId: "not-a-uuid",
      };
      const result = CreateScanSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("CreateIssueSchema", () => {
    it("requires minimum length for title and body", () => {
      const invalid = {
        repositoryId: "123e4567-e89b-12d3-a456-426614174000",
        title: "hi",
        body: "short",
      };
      const result = CreateIssueSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
