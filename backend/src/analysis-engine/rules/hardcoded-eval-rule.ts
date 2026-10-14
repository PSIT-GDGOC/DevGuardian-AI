import { AnalysisRule, AnalyzedFile, RawFinding } from "../types.js";

export class HardcodedEvalRule implements AnalysisRule {
  public id = "SEC-002";
  public name = "Insecure Code Execution (eval)";
  public defaultSeverity = "HIGH" as const;
  public category = "SECURITY" as const;
  public description = "Detects the use of eval() or Function() constructor which can lead to remote code execution.";

  public evaluate(file: AnalyzedFile): RawFinding[] {
    const findings: RawFinding[] = [];
    if (!file.path.endsWith(".ts") && !file.path.endsWith(".js") && !file.path.endsWith(".tsx") && !file.path.endsWith(".jsx")) {
      return findings;
    }

    const lines = file.content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (/\beval\s*\(/.test(line) && !line.includes("//")) {
        findings.push({
          ruleId: this.id,
          title: "Insecure eval() execution",
          description: `Direct call to eval() detected on line ${index + 1}. This introduces arbitrary code execution risks.`,
          severity: this.defaultSeverity,
          category: this.category,
          filePath: file.path,
          startLine: index + 1,
          snippet: line.trim(),
          suggestedFix: "Refactor dynamic evaluation using safe parsers or JSON.parse().",
        });
      }
    });

    return findings;
  }
}
