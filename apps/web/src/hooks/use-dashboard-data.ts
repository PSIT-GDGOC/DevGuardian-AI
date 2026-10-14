import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../lib/api-client.js";
import { RepositoryDto, ScanDto, FindingDto, IssueDto } from "@dev-ai-sentinel/contracts";

export interface DashboardMetrics {
  totalRepositories: number;
  totalScans: number;
  totalFindings: number;
  criticalSecurityCount: number;
  openIssuesCount: number;
}

export function useDashboardData() {
  const [repositories, setRepositories] = useState<RepositoryDto[]>([]);
  const [scans, setScans] = useState<ScanDto[]>([]);
  const [findings, setFindings] = useState<FindingDto[]>([]);
  const [issues, setIssues] = useState<IssueDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [repos, scs, fnds, iss] = await Promise.all([
        apiClient.getRepositories().catch(() => []),
        apiClient.getScans().catch(() => []),
        apiClient.getFindings().catch(() => []),
        apiClient.getIssues().catch(() => []),
      ]);
      setRepositories(repos);
      setScans(scs);
      setFindings(fnds);
      setIssues(iss);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const metrics: DashboardMetrics = {
    totalRepositories: repositories.length,
    totalScans: scans.length,
    totalFindings: findings.length,
    criticalSecurityCount: findings.filter(
      (f) => f.severity === "CRITICAL" || f.severity === "HIGH"
    ).length,
    openIssuesCount: issues.filter((i) => i.status === "OPEN").length,
  };

  return {
    repositories,
    scans,
    findings,
    issues,
    metrics,
    loading,
    error,
    refresh: loadData,
  };
}
