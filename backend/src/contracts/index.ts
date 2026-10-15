import { z } from "zod";

// ============================================================================
// Repository Contracts
// ============================================================================

export const CreateRepositorySchema = z.object({
  name: z.string().min(1, "Repository name is required").max(100),
  url: z
    .string()
    .trim()
    .transform((val) => val.replace(/\/+$/, ""))
    .pipe(
      z
        .string()
        .url("A valid URL is required")
        .refine((val) => val.startsWith("https://github.com/") || val.startsWith("http://github.com/"), {
          message: "Repository URL must be a valid GitHub URL",
        })
    ),
  defaultBranch: z.string().min(1).default("main"),
});

export type CreateRepositoryInput = z.infer<typeof CreateRepositorySchema>;

export interface RepositoryDto {
  id: string;
  name: string;
  url: string;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Scan Contracts
// ============================================================================

export const ScanStatusEnum = z.enum(["QUEUED", "RUNNING", "COMPLETED", "FAILED"]);
export type ScanStatus = z.infer<typeof ScanStatusEnum>;

export const CreateScanSchema = z.object({
  repositoryId: z.string().uuid("Invalid repository UUID format"),
  commitHash: z.string().regex(/^[0-9a-f]{7,40}$/i, "Invalid commit hash format").optional(),
});

export type CreateScanInput = z.infer<typeof CreateScanSchema>;

export interface ScanDto {
  id: string;
  repositoryId: string;
  status: ScanStatus;
  commitHash?: string | null;
  totalFindings: number;
  highSeverityCount: number;
  createdAt: string;
  completedAt?: string | null;
}

// ============================================================================
// Finding Contracts
// ============================================================================

export const FindingSeverityEnum = z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]);
export type FindingSeverity = z.infer<typeof FindingSeverityEnum>;

export const FindingCategoryEnum = z.enum([
  "SECURITY",
  "QUALITY",
  "DEPENDENCY",
  "ARCHITECTURE",
  "PERFORMANCE",
]);
export type FindingCategory = z.infer<typeof FindingCategoryEnum>;

export interface FindingDto {
  id: string;
  scanId: string;
  ruleId: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  category: FindingCategory;
  filePath: string;
  startLine: number;
  endLine?: number | null;
  snippet?: string | null;
  suggestedFix?: string | null;
}

export interface RawFindingInput {
  ruleId: string;
  title: string;
  description: string;
  severity: string;
  category: string;
  filePath: string;
  startLine: number;
  endLine?: number;
  snippet?: string;
  suggestedFix?: string;
}

// ============================================================================
// Issue Contracts
// ============================================================================

export const IssueStatusEnum = z.enum(["OPEN", "RESOLVED", "IGNORED"]);
export type IssueStatus = z.infer<typeof IssueStatusEnum>;

export const CreateIssueSchema = z.object({
  repositoryId: z.string().uuid("Invalid repository UUID format"),
  findingId: z.string().uuid("Invalid finding UUID format").optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  body: z.string().min(10, "Body must be at least 10 characters"),
});

export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;

export interface IssueDto {
  id: string;
  repositoryId: string;
  findingId?: string | null;
  title: string;
  body: string;
  status: IssueStatus;
  githubIssueNumber?: number | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Standard API Envelope
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
