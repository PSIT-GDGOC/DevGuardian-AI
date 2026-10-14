import { RepositoryDto, ScanDto, FindingDto, IssueDto, ApiResponse } from "../types/index.js";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const body: ApiResponse<T> = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.error?.message || `Request failed with status ${res.status}`);
  }

  return body.data as T;
}

export const apiClient = {
  getRepositories: () => fetchJson<RepositoryDto[]>("/api/v1/repositories"),
  getRepositoryById: (id: string) => fetchJson<RepositoryDto>(`/api/v1/repositories/${id}`),
  createRepository: (data: { name: string; url: string; defaultBranch?: string }) =>
    fetchJson<RepositoryDto>("/api/v1/repositories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getScans: (repositoryId?: string) =>
    fetchJson<ScanDto[]>(repositoryId ? `/api/v1/scans?repositoryId=${repositoryId}` : "/api/v1/scans"),
  getFindings: (scanId?: string) =>
    fetchJson<FindingDto[]>(scanId ? `/api/v1/findings?scanId=${scanId}` : "/api/v1/findings"),
  getIssues: (repositoryId?: string) =>
    fetchJson<IssueDto[]>(repositoryId ? `/api/v1/issues?repositoryId=${repositoryId}` : "/api/v1/issues"),
};
