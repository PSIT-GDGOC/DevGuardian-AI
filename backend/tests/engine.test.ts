import { describe, it, expect } from "vitest";
import { AnalysisEngine } from "../src/analysis-engine/engine.js";
import { FindingNormalizer } from "../src/analysis-engine/normalizer.js";

describe("Analysis Engine & Normalizer", () => {
  describe("FindingNormalizer", () => {
    const normalizer = new FindingNormalizer();

    it("normalizes uppercase and alternate severity terms", () => {
      expect(normalizer.normalizeSeverity("warn")).toBe("MEDIUM");
      expect(normalizer.normalizeSeverity("error")).toBe("HIGH");
      expect(normalizer.normalizeSeverity("FATAL")).toBe("CRITICAL");
      expect(normalizer.normalizeSeverity("minor")).toBe("LOW");
      expect(normalizer.normalizeSeverity("note")).toBe("INFO");
      expect(normalizer.normalizeSeverity("unknown-level")).toBe("MEDIUM");
    });

    it("normalizes category terms to valid categories", () => {
      expect(normalizer.normalizeCategory("security_vuln")).toBe("SECURITY");
      expect(normalizer.normalizeCategory("cve_package_issue")).toBe("DEPENDENCY");
      expect(normalizer.normalizeCategory("perf_speed")).toBe("PERFORMANCE");
      expect(normalizer.normalizeCategory("code_style")).toBe("QUALITY");
    });

    it("deduplicates raw findings with matching rule, file, and line", () => {
      const rawList = [
        {
          ruleId: "SEC-001",
          title: "Secret Key",
          description: "Leaked secret",
          severity: "HIGH",
          category: "SECURITY",
          filePath: "src/auth.ts",
          startLine: 10,
        },
        {
          ruleId: "SEC-001",
          title: "Secret Key Duplicate",
          description: "Leaked secret duplicate",
          severity: "HIGH",
          category: "SECURITY",
          filePath: "src/auth.ts",
          startLine: 10,
        },
      ];
      const normalized = normalizer.normalizeBatch(rawList);
      expect(normalized).toHaveLength(1);
    });
  });

  describe("AnalysisEngine", () => {
    const engine = new AnalysisEngine();

    it("detects hardcoded API keys", () => {
      const files = [
        {
          path: "src/config.ts",
          content: 'export const apiKey = "AIzaSyD-fakeKeyForTesting1234567890123";',
        },
      ];

      const findings = engine.analyzeFiles(files);
      expect(findings.length).toBeGreaterThanOrEqual(1);
      expect(findings[0].ruleId).toBe("SEC-001");
      expect(findings[0].severity).toBe("CRITICAL");
    });

    it("detects unsafe eval calls", () => {
      const files = [
        {
          path: "src/calculator.ts",
          content: 'const result = eval("2 + 2");',
        },
      ];

      const findings = engine.analyzeFiles(files);
      expect(findings.length).toBeGreaterThanOrEqual(1);
      expect(findings[0].ruleId).toBe("SEC-002");
      expect(findings[0].severity).toBe("HIGH");
    });

    it("detects TODO comments", () => {
      const files = [
        {
          path: "src/service.ts",
          content: "// TODO: implement database caching layer",
        },
      ];

      const findings = engine.analyzeFiles(files);
      expect(findings.length).toBeGreaterThanOrEqual(1);
      expect(findings[0].ruleId).toBe("QUAL-001");
      expect(findings[0].severity).toBe("LOW");
    });
  });
});
