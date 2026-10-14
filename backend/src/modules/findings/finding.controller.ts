import { Request, Response, NextFunction } from "express";
import { dataStore } from "../../services/store.js";

export class FindingController {
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const scanId = req.query.scanId as string | undefined;
      const findings = await dataStore.getFindings(scanId);
      res.json({
        success: true,
        data: findings,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const finding = await dataStore.getFindingById(id);
      if (!finding) {
        res.status(404).json({
          success: false,
          error: {
            code: "FINDING_NOT_FOUND",
            message: `Finding with ID '${id}' was not found`,
          },
        });
        return;
      }
      res.json({
        success: true,
        data: finding,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const findingController = new FindingController();
