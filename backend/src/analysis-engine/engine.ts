import { AnalysisRule, AnalyzedFile, NormalizedFinding } from "./types.js";
import { FindingNormalizer } from "./normalizer.js";
import { SecretLeakRule } from "./rules/secret-leak-rule.js";
import { HardcodedEvalRule } from "./rules/hardcoded-eval-rule.js";
import { TodoFixmeRule } from "./rules/todo-fixme-rule.js";

export class AnalysisEngine {
  private rules: AnalysisRule[] = [];
  private normalizer: FindingNormalizer;

  constructor(customRules?: AnalysisRule[], normalizer?: FindingNormalizer) {
    this.normalizer = normalizer ?? new FindingNormalizer();
    if (customRules && customRules.length > 0) {
      this.rules = customRules;
    } else {
      this.registerDefaultRules();
    }
  }

  private registerDefaultRules(): void {
    this.rules = [
      new SecretLeakRule(),
      new HardcodedEvalRule(),
      new TodoFixmeRule(),
    ];
  }

  public registerRule(rule: AnalysisRule): void {
    this.rules.push(rule);
  }

  public getRules(): readonly AnalysisRule[] {
    return this.rules;
  }

  /**
   * Evaluates a set of files across registered rules and returns normalized findings.
   */
  public analyzeFiles(files: AnalyzedFile[]): NormalizedFinding[] {
    const rawFindings = [];

    for (const file of files) {
      for (const rule of this.rules) {
        try {
          const ruleFindings = rule.evaluate(file);
          rawFindings.push(...ruleFindings);
        } catch (error) {
          console.error(`Rule ${rule.id} failed on file ${file.path}:`, error);
        }
      }
    }

    return this.normalizer.normalizeBatch(rawFindings);
  }
}
