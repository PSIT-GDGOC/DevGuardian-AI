import { RepositoryDto, ScanDto, FindingDto, IssueDto } from "@dev-ai-sentinel/contracts";
import crypto from "node:crypto";

/**
 * Storage service providing in-memory state for development and testing,
 * with clean abstractions to back against Prisma ORM in production.
 */
class InMemoryDataStore {
  private repositories: Map<string, RepositoryDto> = new Map();
  private scans: Map<string, ScanDto> = new Map();
  private findings: Map<string, FindingDto> = new Map();
  private issues: Map<string, IssueDto> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const defaultRepoId = "11111111-1111-4111-a111-111111111111";
    const defaultScanId = "22222222-2222-4222-a222-222222222222";

    const repo: RepositoryDto = {
      id: defaultRepoId,
      name: "DevGuardian-AI",
      url: "https://github.com/PSIT-GDGOC/DevGuardian-AI",
      defaultBranch: "main",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.repositories.set(defaultRepoId, repo);

    const scan: ScanDto = {
      id: defaultScanId,
      repositoryId: defaultRepoId,
      status: "COMPLETED",
      commitHash: "9c31fd03142ec14136404d0c869d6712c7f16815",
      totalFindings: 2,
      highSeverityCount: 1,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date().toISOString(),
    };
    this.scans.set(defaultScanId, scan);

    const finding1: FindingDto = {
      id: "33333333-3333-4333-a333-333333333331",
      scanId: defaultScanId,
      ruleId: "SEC-001",
      title: "Hardcoded Secret or Token Detection",
      description: "Potential sensitive token or secret found in source code.",
      severity: "HIGH",
      category: "SECURITY",
      filePath: "src/config/keys.example.ts",
      startLine: 12,
      snippet: 'const apiKey = "SAMPLE_KEY_TOKEN_VALUE";',
      suggestedFix: "Use environment variables instead of hardcoding tokens.",
    };
    this.findings.set(finding1.id, finding1);

    const finding2: FindingDto = {
      id: "33333333-3333-4333-a333-333333333332",
      scanId: defaultScanId,
      ruleId: "QUAL-001",
      title: "Unresolved TODO item",
      description: "Line contains a work-in-progress tag: implement rate limiting",
      severity: "LOW",
      category: "QUALITY",
      filePath: "src/server.ts",
      startLine: 45,
      snippet: "// TODO: implement rate limiting on API endpoints",
      suggestedFix: "Implement rate limiter or track as GitHub issue.",
    };
    this.findings.set(finding2.id, finding2);
  }

  // Repository Methods
  public async getRepositories(): Promise<RepositoryDto[]> {
    return Array.from(this.repositories.values());
  }

  public async getRepositoryById(id: string): Promise<RepositoryDto | null> {
    return this.repositories.get(id) ?? null;
  }

  public async findRepositoryByUrl(url: string): Promise<RepositoryDto | null> {
    for (const repo of this.repositories.values()) {
      if (repo.url.toLowerCase() === url.toLowerCase()) {
        return repo;
      }
    }
    return null;
  }

  public async createRepository(data: { name: string; url: string; defaultBranch?: string }): Promise<RepositoryDto> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const repo: RepositoryDto = {
      id,
      name: data.name,
      url: data.url,
      defaultBranch: data.defaultBranch || "main",
      createdAt: now,
      updatedAt: now,
    };
    this.repositories.set(id, repo);
    return repo;
  }

  public async deleteRepository(id: string): Promise<boolean> {
    return this.repositories.delete(id);
  }

  // Scan Methods
  public async getScans(repositoryId?: string): Promise<ScanDto[]> {
    const all = Array.from(this.scans.values());
    if (repositoryId) {
      return all.filter((s) => s.repositoryId === repositoryId);
    }
    return all;
  }

  public async getScanById(id: string): Promise<ScanDto | null> {
    return this.scans.get(id) ?? null;
  }

  public async createScan(data: { repositoryId: string; commitHash?: string }): Promise<ScanDto> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const scan: ScanDto = {
      id,
      repositoryId: data.repositoryId,
      status: "QUEUED",
      commitHash: data.commitHash || null,
      totalFindings: 0,
      highSeverityCount: 0,
      createdAt: now,
    };
    this.scans.set(id, scan);
    return scan;
  }

  public async updateScan(id: string, updates: Partial<ScanDto>): Promise<ScanDto | null> {
    const scan = this.scans.get(id);
    if (!scan) return null;
    const updated = { ...scan, ...updates };
    this.scans.set(id, updated);
    return updated;
  }

  // Finding Methods
  public async getFindings(scanId?: string): Promise<FindingDto[]> {
    const all = Array.from(this.findings.values());
    if (scanId) {
      return all.filter((f) => f.scanId === scanId);
    }
    return all;
  }

  public async getFindingById(id: string): Promise<FindingDto | null> {
    return this.findings.get(id) ?? null;
  }

  public async createFinding(data: Omit<FindingDto, "id">): Promise<FindingDto> {
    const id = crypto.randomUUID();
    const finding: FindingDto = { id, ...data };
    this.findings.set(id, finding);
    return finding;
  }

  // Issue Methods
  public async getIssues(repositoryId?: string): Promise<IssueDto[]> {
    const all = Array.from(this.issues.values());
    if (repositoryId) {
      return all.filter((i) => i.repositoryId === repositoryId);
    }
    return all;
  }

  public async getIssueById(id: string): Promise<IssueDto | null> {
    return this.issues.get(id) ?? null;
  }

  public async createIssue(data: { repositoryId: string; title: string; body: string; findingId?: string }): Promise<IssueDto> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const issue: IssueDto = {
      id,
      repositoryId: data.repositoryId,
      findingId: data.findingId || null,
      title: data.title,
      body: data.body,
      status: "OPEN",
      createdAt: now,
      updatedAt: now,
    };
    this.issues.set(id, issue);
    return issue;
  }

  public async clearAll(): Promise<void> {
    this.repositories.clear();
    this.scans.clear();
    this.findings.clear();
    this.issues.clear();
    this.seedDefaults();
  }
}

export const dataStore = new InMemoryDataStore();
