import { AnalysisRule, AnalyzedFile, RawFinding } from "../types.js";

export class SecretLeakRule implements AnalysisRule {
  public id = "SEC-001";
  public name = "Hardcoded Secret or Token Detection";
  public defaultSeverity = "CRITICAL" as const;
  public category = "SECURITY" as const;
  public description = "Detects high-entropy strings, API keys, or private tokens hardcoded in source code.";

  private patterns = [
    { regex: /(?:api[_-]?key|secret|token|password)[\s]*[=:][\s]*['"`]([a-zA-Z0-9_-]{16,})['"`]/i, title: "Possible hardcoded credential or secret" },
    { regex: /ghp_[a-zA-Z0-9]{36}/, title: "GitHub Personal Access Token exposed" },
    { regex: /AIza[0-9A-Za-z_-]{35}/, title: "Google API Key exposed" },
  ];

  public evaluate(file: AnalyzedFile): RawFinding[] {
    const findings: RawFinding[] = [];
    const lines = file.content.split(/\r?\n/);

    // Skip environment template files or test mocks
    if (file.path.endsWith(".env.example") || file.path.includes(".test.") || file.path.includes(".spec.")) {
      return findings;
    }

    lines.forEach((line, index) => {
      for (const pattern of this.patterns) {
        if (pattern.regex.test(line)) {
          findings.push({
            ruleId: this.id,
            title: pattern.title,
            description: `Potential sensitive token or secret found on line ${index + 1}. Secrets should be stored in environment variables.`,
            severity: this.defaultSeverity,
            category: this.category,
            filePath: file.path,
            startLine: index + 1,
            snippet: line.trim(),
            suggestedFix: "Move secret values to .env and access them via process.env.",
          });
          break;
        }
      }
    });

    return findings;
  }
}
