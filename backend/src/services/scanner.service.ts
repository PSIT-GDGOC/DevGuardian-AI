import { AnalysisEngine } from "../analysis-engine/index.js";
import { dataStore } from "./store.js";
import { ScanDto } from "../contracts/index.js";

export class ScannerService {
  private engine: AnalysisEngine;

  constructor() {
    this.engine = new AnalysisEngine();
  }

  /**
   * Executes static analysis for a specific scan.
   */
  public async executeScan(scanId: string, filesToAnalyze: Array<{ path: string; content: string }>): Promise<ScanDto> {
    const scan = await dataStore.getScanById(scanId);
    if (!scan) {
      throw new Error(`Scan with ID ${scanId} not found`);
    }

    // Mark scan as running
    await dataStore.updateScan(scanId, { status: "RUNNING" });

    try {
      const normalizedFindings = this.engine.analyzeFiles(filesToAnalyze);

      let highSeverityCount = 0;
      for (const f of normalizedFindings) {
        if (f.severity === "CRITICAL" || f.severity === "HIGH") {
          highSeverityCount++;
        }
        await dataStore.createFinding({
          scanId,
          ruleId: f.ruleId,
          title: f.title,
          description: f.description,
          severity: f.severity,
          category: f.category,
          filePath: f.filePath,
          startLine: f.startLine,
          endLine: f.endLine ?? null,
          snippet: f.snippet ?? null,
          suggestedFix: f.suggestedFix ?? null,
        });
      }

      const updated = await dataStore.updateScan(scanId, {
        status: "COMPLETED",
        totalFindings: normalizedFindings.length,
        highSeverityCount,
        completedAt: new Date().toISOString(),
      });

      return updated!;
    } catch (err) {
      await dataStore.updateScan(scanId, { status: "FAILED" });
      throw err;
    }
  }
}

export const scannerService = new ScannerService();
