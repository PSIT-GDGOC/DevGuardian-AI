import { AnalysisRule, AnalyzedFile, RawFinding } from "../types.js";

export class TodoFixmeRule implements AnalysisRule {
  public id = "QUAL-001";
  public name = "Unresolved TODO / FIXME Marker";
  public defaultSeverity = "LOW" as const;
  public category = "QUALITY" as const;
  public description = "Flags unfinished code markers (TODO, FIXME, HACK) that may indicate missing requirements or tech debt.";

  public evaluate(file: AnalyzedFile): RawFinding[] {
    const findings: RawFinding[] = [];
    const lines = file.content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const match = /\b(TODO|FIXME|HACK)\b:?\s*(.*)/i.exec(line);
      if (match && !file.path.includes(".test.") && !file.path.endsWith(".md")) {
        findings.push({
          ruleId: this.id,
          title: `Unresolved ${match[1].toUpperCase()} item`,
          description: `Line ${index + 1} contains a work-in-progress tag: "${match[2].trim() || 'No explanation provided'}"`,
          severity: this.defaultSeverity,
          category: this.category,
          filePath: file.path,
          startLine: index + 1,
          snippet: line.trim(),
          suggestedFix: "Address the marked task or convert it into a tracked GitHub issue.",
        });
      }
    });

    return findings;
  }
}
