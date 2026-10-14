import { FindingDto } from "@dev-ai-sentinel/contracts";

export interface CodePatch {
  filePath: string;
  originalSnippet: string;
  replacementSnippet: string;
  diffSummary: string;
}

/**
 * AI Patch Generator Boilerplate
 * 
 * College contributors can complete this module to automatically synthesize
 * code fixes (diff patches) that resolve detected findings.
 */
export class PatchGenerator {
  /**
   * Generates a code patch suggestion for a given finding.
   * 
   * @param finding - The code finding to generate a fix for
   * @returns Proposed code patch
   */
  public generatePatch(finding: FindingDto): CodePatch {
    // --------------------------------------------------------------------------
    // TODO: Complete this kind of patch generator:
    // 1. Take finding.snippet (e.g. `const apiKey = "12345";`)
    // 2. Use rule templates or LLM completion to construct safe replacement:
    //    `const apiKey = process.env.API_KEY || "";`
    // 3. Output unified diff block ready for git apply.
    // --------------------------------------------------------------------------

    const original = finding.snippet || "// Original code";
    let replacement = original;

    if (finding.ruleId === "SEC-001") {
      replacement = `// Secured via environment variable:\nconst apiKey = process.env.API_SECRET_KEY;`;
    } else if (finding.ruleId === "SEC-002") {
      replacement = `// Replaced unsafe eval with safe parser:\nJSON.parse(data);`;
    } else {
      replacement = `// Fixed: ${finding.suggestedFix || "Refactored"}`;
    }

    return {
      filePath: finding.filePath,
      originalSnippet: original,
      replacementSnippet: replacement,
      diffSummary: `Patch for ${finding.ruleId} at ${finding.filePath}:${finding.startLine}`,
    };
  }
}

export const patchGenerator = new PatchGenerator();
