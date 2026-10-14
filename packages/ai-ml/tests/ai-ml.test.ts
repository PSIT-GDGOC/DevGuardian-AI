import { describe, it, expect } from "vitest";
import { vulnerabilityExplainer, riskClassifier, patchGenerator } from "../src/index.js";
import { FindingDto } from "@dev-ai-sentinel/contracts";

describe("AI/ML Package Boilerplate Tests", () => {
  const sampleFinding: FindingDto = {
    id: "sample-1",
    scanId: "scan-1",
    ruleId: "SEC-001",
    title: "Leaked API Key",
    description: "Hardcoded credential found",
    severity: "CRITICAL",
    category: "SECURITY",
    filePath: "src/keys.ts",
    startLine: 10,
    snippet: 'const key = "AIzaFakeKey123456789";',
    suggestedFix: "Use process.env",
  };

  describe("VulnerabilityExplainer", () => {
    it("generates an explanation with summary and impact", async () => {
      const result = await vulnerabilityExplainer.explainFinding(sampleFinding);
      expect(result.summary).toContain("SEC-001");
      expect(result.confidenceScore).toBeGreaterThan(0);
    });

    it("builds a prompt template containing finding details", () => {
      const prompt = vulnerabilityExplainer.buildPrompt(sampleFinding);
      expect(prompt).toContain("src/keys.ts:10");
      expect(prompt).toContain("AIzaFakeKey123456789");
    });
  });

  describe("RiskClassifier", () => {
    it("evaluates risk score from findings array", () => {
      const assessment = riskClassifier.evaluateRisk([sampleFinding]);
      expect(assessment.overallRiskScore).toBeGreaterThan(0);
      expect(assessment.severityTier).toBe("HIGH");
      expect(assessment.riskFactors.length).toBeGreaterThan(0);
    });

    it("returns 0 score for empty findings list", () => {
      const assessment = riskClassifier.evaluateRisk([]);
      expect(assessment.overallRiskScore).toBe(0);
      expect(assessment.severityTier).toBe("INFO");
    });
  });

  describe("PatchGenerator", () => {
    it("generates suggested code patch", () => {
      const patch = patchGenerator.generatePatch(sampleFinding);
      expect(patch.filePath).toBe("src/keys.ts");
      expect(patch.replacementSnippet).toContain("process.env");
    });
  });
});
