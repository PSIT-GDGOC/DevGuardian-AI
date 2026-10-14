import { Request, Response, NextFunction } from "express";
import { dataStore } from "../../services/store.js";
import { scannerService } from "../../services/scanner.service.js";
import { CreateScanInput } from "@dev-ai-sentinel/contracts";

export class ScanController {
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repositoryId = req.query.repositoryId as string | undefined;
      const scans = await dataStore.getScans(repositoryId);
      res.json({
        success: true,
        data: scans,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const scan = await dataStore.getScanById(id);
      if (!scan) {
        res.status(404).json({
          success: false,
          error: {
            code: "SCAN_NOT_FOUND",
            message: `Scan with ID '${id}' was not found`,
          },
        });
        return;
      }
      res.json({
        success: true,
        data: scan,
      });
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: CreateScanInput = req.body;
      const repo = await dataStore.getRepositoryById(input.repositoryId);
      if (!repo) {
        res.status(404).json({
          success: false,
          error: {
            code: "REPOSITORY_NOT_FOUND",
            message: `Cannot initiate scan: repository '${input.repositoryId}' does not exist`,
          },
        });
        return;
      }

      const scan = await dataStore.createScan(input);

      // Trigger asynchronous background analysis or mock run with sample files
      const sampleFiles = [
        {
          path: "src/config/app.config.ts",
          content: 'export const config = { secret: "DEMO_KEY_abc1234567890123" };',
        },
        {
          path: "src/utils/evaluator.ts",
          content: 'function run(code) { return eval(code); }',
        },
      ];

      // Execute scan asynchronously
      scannerService.executeScan(scan.id, sampleFiles).catch((err) => {
        console.error(`Scan execution failed for ${scan.id}:`, err);
      });

      res.status(202).json({
        success: true,
        data: scan,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const scanController = new ScanController();
