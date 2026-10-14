import { FindingDto, FindingSeverity } from "@dev-ai-sentinel/contracts";

export interface RiskAssessment {
  overallRiskScore: number; // 0.0 to 10.0
  severityTier: FindingSeverity;
  riskFactors: string[];
}

/**
 * AI/ML Risk Classifier Boilerplate
 * 
 * College contributors can complete this module using machine learning algorithms
 * (e.g. decision trees, TF-IDF + logistic regression, or neural embeddings)
 * to estimate risk scores for source code repositories.
 */
export class RiskClassifier {
  /**
   * Evaluates a collection of findings and predicts an overall risk score.
   * 
   * @param findings - Array of code findings from static scans
   * @returns Predicted risk assessment
   */
  public evaluateRisk(findings: FindingDto[]): RiskAssessment {
    // --------------------------------------------------------------------------
    // TODO: Complete this kind of ML classification / scoring algorithm:
    // 1. Extract feature vector: count(critical), count(high), lines of code,
    //    public exposed routes, dependency CVE history.
    // 2. Feed features into a trained weights matrix or simple scoring model.
    // 3. Return dynamic risk score and dominant factors.
    // --------------------------------------------------------------------------

    if (findings.length === 0) {
      return {
        overallRiskScore: 0.0,
        severityTier: "INFO",
        riskFactors: ["No active findings detected."],
      };
    }

    const criticalCount = findings.filter((f) => f.severity === "CRITICAL").length;
    const highCount = findings.filter((f) => f.severity === "HIGH").length;

    // Baseline heuristic starter calculation
    let score = criticalCount * 4.0 + highCount * 2.0 + findings.length * 0.5;
    score = Math.min(10.0, Math.round(score * 10) / 10);

    const riskFactors: string[] = [];
    if (criticalCount > 0) riskFactors.push(`${criticalCount} critical security issues detected`);
    if (highCount > 0) riskFactors.push(`${highCount} high severity issues detected`);
    if (riskFactors.length === 0) riskFactors.push("Low-risk quality notices only");

    const severityTier: FindingSeverity =
      score >= 7.0 ? "CRITICAL" : score >= 4.0 ? "HIGH" : score >= 2.0 ? "MEDIUM" : "LOW";

    return {
      overallRiskScore: score,
      severityTier,
      riskFactors,
    };
  }
}

export const riskClassifier = new RiskClassifier();
