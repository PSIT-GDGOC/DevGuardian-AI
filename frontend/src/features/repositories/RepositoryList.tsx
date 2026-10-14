import React from "react";
import { RepositoryDto } from "../../types/index.js";

interface RepositoryListProps {
  repositories: RepositoryDto[];
}

export function RepositoryList({ repositories }: RepositoryListProps) {
  return (
    <section id="repositories" style={{
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      border: "1px solid #e2e8f0",
      padding: "1.25rem",
      marginBottom: "1.5rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>
          Tracked Repositories
        </h2>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
          {repositories.length} registered
        </span>
      </div>

      {repositories.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>No repositories configured yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {repositories.map((repo) => (
            <div key={repo.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              backgroundColor: "#f8fafc",
              border: "1px solid #f1f5f9"
            }}>
              <div>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 600, color: "#2563eb", textDecoration: "none" }}
                >
                  {repo.name}
                </a>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
                  Branch: <code>{repo.defaultBranch}</code> | URL: {repo.url}
                </div>
              </div>
              <span style={{
                fontSize: "0.75rem",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.25rem",
                backgroundColor: "#dcfce7",
                color: "#166534",
                fontWeight: 500
              }}>
                Active
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
