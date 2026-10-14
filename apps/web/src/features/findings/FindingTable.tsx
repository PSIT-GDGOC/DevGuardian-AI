import React from "react";
import { FindingDto } from "@dev-ai-sentinel/contracts";

interface FindingTableProps {
  findings: FindingDto[];
}

export function FindingTable({ findings }: FindingTableProps) {
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
      case "HIGH":
        return { bg: "#fee2e2", text: "#991b1b" };
      case "MEDIUM":
        return { bg: "#fef3c7", text: "#92400e" };
      case "LOW":
        return { bg: "#e0e7ff", text: "#3730a3" };
      default:
        return { bg: "#f1f5f9", text: "#475569" };
    }
  };

  return (
    <section id="findings" style={{
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      border: "1px solid #e2e8f0",
      padding: "1.25rem",
      marginBottom: "1.5rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>
          Normalized Findings
        </h2>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
          {findings.length} findings detected
        </span>
      </div>

      {/* TODO (Issue 1): Add severity filter bar (<select> or buttons) here to filter visible findings */}
      {findings.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>No findings detected.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {findings.map((f) => {
            const badge = getSeverityBadge(f.severity);
            return (
              <div key={f.id} style={{
                border: "1px solid #f1f5f9",
                borderRadius: "0.375rem",
                padding: "1rem",
                backgroundColor: "#fafafa"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <div>
                    <span style={{
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.25rem",
                      backgroundColor: badge.bg,
                      color: badge.text,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      marginRight: "0.5rem"
                    }}>
                      {f.severity}
                    </span>
                    <span style={{
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.25rem",
                      backgroundColor: "#f1f5f9",
                      color: "#334155",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      marginRight: "0.5rem"
                    }}>
                      {f.category}
                    </span>
                    <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>{f.title}</strong>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace" }}>
                    {f.ruleId}
                  </span>
                </div>

                <p style={{ margin: "0.25rem 0 0.5rem 0", fontSize: "0.875rem", color: "#334155" }}>
                  {f.description}
                </p>

                <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.5rem" }}>
                  File: <code>{f.filePath}:{f.startLine}</code>
                </div>

                {f.snippet && (
                  <pre style={{
                    margin: "0.5rem 0",
                    padding: "0.5rem",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "0.25rem",
                    fontSize: "0.8rem",
                    overflowX: "auto"
                  }}>
                    <code>{f.snippet}</code>
                  </pre>
                )}

                {f.suggestedFix && (
                  <div style={{ fontSize: "0.8rem", color: "#059669", marginTop: "0.25rem" }}>
                    💡 <strong>Suggested Fix:</strong> {f.suggestedFix}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
