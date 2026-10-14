import { Request, Response, NextFunction } from "express";
import { dataStore } from "../../services/store.js";
import { vulnerabilityExplainer, riskClassifier, patchGenerator } from "@dev-ai-sentinel/ai-ml";

export class AiController {
  /**
   * Explains a specific code finding in plain English.
   * Route: POST /api/v1/ai/explain
   */
  public async explain(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { findingId } = req.body;
      if (!findingId) {
        res.status(400).json({
          success: false,
          error: {
            code: "MISSING_FINDING_ID",
            message: "findingId is required in request body",
          },
        });
        return;
      }

      const finding = await dataStore.getFindingById(findingId);
      if (!finding) {
        res.status(404).json({
          success: false,
          error: {
            code: "FINDING_NOT_FOUND",
            message: `Finding with ID '${findingId}' was not found`,
          },
        });
        return;
      }

      // ------------------------------------------------------------------------
      // TODO: Complete this AI explanation controller logic:
      // You can integrate real Gemini API calls or customize the explanation!
      // ------------------------------------------------------------------------
      const explanation = await vulnerabilityExplainer.explainFinding(finding);

      res.json({
        success: true,
        data: {
          findingId,
          ...explanation,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Assesses overall repository risk score.
   * Route: GET /api/v1/ai/risk-score?scanId=...
   */
  public async assessRisk(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const scanId = req.query.scanId as string | undefined;
      const findings = await dataStore.getFindings(scanId);

      // ------------------------------------------------------------------------
      // TODO: Complete this AI risk prediction endpoint:
      // Train or connect a custom ML classifier for vulnerability scoring!
      // ------------------------------------------------------------------------
      const assessment = riskClassifier.evaluateRisk(findings);

      res.json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generates a proposed code patch / diff for a finding.
   * Route: POST /api/v1/ai/suggest-patch
   */
  public async suggestPatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { findingId } = req.body;
      const finding = await dataStore.getFindingById(findingId);
      if (!finding) {
        res.status(404).json({
          success: false,
          error: {
            code: "FINDING_NOT_FOUND",
            message: `Finding with ID '${findingId}' was not found`,
          },
        });
        return;
      }

      // ------------------------------------------------------------------------
      // TODO: Complete this automated patch generation endpoint:
      // Generate git-compatible diff patches!
      // ------------------------------------------------------------------------
      const patch = patchGenerator.generatePatch(finding);

      res.json({
        success: true,
        data: patch,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AiController();
