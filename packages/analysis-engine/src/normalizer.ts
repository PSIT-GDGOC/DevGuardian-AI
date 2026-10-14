import { FindingSeverity, FindingCategory } from "@dev-ai-sentinel/contracts";
import { RawFinding, NormalizedFinding } from "./types.js";

/**
 * Normalizes raw scanner outputs into consistent Dev AI Sentinel findings.
 * Maps varying severity and category nomenclature from third-party tools into standard enums.
 */
export class FindingNormalizer {
  /**
   * Normalizes severity string into standard FindingSeverity.
   */
  public normalizeSeverity(rawSeverity: string): FindingSeverity {
    const s = rawSeverity.trim().toUpperCase();
    switch (s) {
      case "CRITICAL":
      case "FATAL":
      case "BLOCKER":
        return "CRITICAL";
      case "HIGH":
      case "ERROR":
        return "HIGH";
      case "MEDIUM":
      case "WARN":
      case "WARNING":
        return "MEDIUM";
      case "LOW":
      case "MINOR":
        return "LOW";
      case "INFO":
      case "NOTE":
      case "INFORMATION":
        return "INFO";
      // TODO (Issue 3): Add mappings for numeric severities ("2", "1") and synonyms ("MODERATE", "SUGGESTION")
      default:
        // Default fallback for unrecognized severity levels
        return "MEDIUM";
    }
  }

  /**
   * Normalizes category string into standard FindingCategory.
   */
  public normalizeCategory(rawCategory: string): FindingCategory {
    const c = rawCategory.trim().toUpperCase();
    if (c.includes("SEC") || c.includes("VULN") || c.includes("AUTH")) {
      return "SECURITY";
    }
    if (c.includes("DEP") || c.includes("PACKAGE") || c.includes("CVE")) {
      return "DEPENDENCY";
    }
    if (c.includes("ARCH") || c.includes("DESIGN") || c.includes("MODULE")) {
      return "ARCHITECTURE";
    }
    if (c.includes("PERF") || c.includes("SPEED") || c.includes("MEMORY")) {
      return "PERFORMANCE";
    }
    return "QUALITY";
  }

  /**
   * Normalizes an entire raw finding object.
   */
  public normalize(raw: RawFinding): NormalizedFinding {
    return {
      ruleId: raw.ruleId.trim(),
      title: raw.title.trim(),
      description: raw.description.trim(),
      severity: this.normalizeSeverity(raw.severity),
      category: this.normalizeCategory(raw.category),
      filePath: raw.filePath.replace(/\\/g, "/").trim(),
      startLine: Math.max(1, Math.floor(raw.startLine || 1)),
      endLine: raw.endLine ? Math.max(1, Math.floor(raw.endLine)) : undefined,
      snippet: raw.snippet ? raw.snippet.trim() : undefined,
      suggestedFix: raw.suggestedFix ? raw.suggestedFix.trim() : undefined,
    };
  }

  /**
   * Normalizes a batch of findings, removing potential duplicates by rule, file, and line.
   */
  public normalizeBatch(rawList: RawFinding[]): NormalizedFinding[] {
    const seen = new Set<string>();
    const normalized: NormalizedFinding[] = [];

    for (const raw of rawList) {
      const item = this.normalize(raw);
      const dedupeKey = `${item.ruleId}:${item.filePath}:${item.startLine}`;
      if (!seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        normalized.push(item);
      }
    }

    return normalized;
  }
}
