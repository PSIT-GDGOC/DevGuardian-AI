import React from "react";
import { IssueDto } from "@dev-ai-sentinel/contracts";

interface IssueListProps {
  issues: IssueDto[];
}

export function IssueList({ issues }: IssueListProps) {
  return (
    <section id="issues" style={{
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      border: "1px solid #e2e8f0",
      padding: "1.25rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>
          Synthesized Actionable Issues
        </h2>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
          {issues.length} tracked
        </span>
      </div>

      {issues.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>No issues currently pending resolution.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {issues.map((issue) => (
            <div key={issue.id} style={{
              border: "1px solid #f1f5f9",
              borderRadius: "0.375rem",
              padding: "0.875rem",
              backgroundColor: "#f8fafc"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>{issue.title}</strong>
                <span style={{
                  padding: "0.2rem 0.5rem",
                  borderRadius: "0.25rem",
                  backgroundColor: issue.status === "OPEN" ? "#dbeafe" : "#f1f5f9",
                  color: issue.status === "OPEN" ? "#1e40af" : "#475569",
                  fontSize: "0.75rem",
                  fontWeight: 600
                }}>
                  {issue.status}
                </span>
              </div>
              <p style={{ margin: "0.5rem 0 0.25rem 0", fontSize: "0.875rem", color: "#475569" }}>
                {issue.body}
              </p>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                Created: {new Date(issue.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
