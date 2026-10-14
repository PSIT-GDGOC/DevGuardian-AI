import { FindingSeverity, FindingCategory } from "@dev-ai-sentinel/contracts";

export interface AnalyzedFile {
  path: string;
  content: string;
}

export interface RawFinding {
  ruleId: string;
  title: string;
  description: string;
  severity: string; // raw input might be "warn", "error", "HIGH", "low", etc.
  category: string; // raw input might be "sec", "security", "style", etc.
  filePath: string;
  startLine: number;
  endLine?: number;
  snippet?: string;
  suggestedFix?: string;
}

export interface NormalizedFinding {
  ruleId: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  category: FindingCategory;
  filePath: string;
  startLine: number;
  endLine?: number;
  snippet?: string;
  suggestedFix?: string;
}

export interface AnalysisRule {
  id: string;
  name: string;
  defaultSeverity: FindingSeverity;
  category: FindingCategory;
  description: string;
  evaluate(file: AnalyzedFile): RawFinding[];
}
