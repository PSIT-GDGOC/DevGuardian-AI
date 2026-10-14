import React from "react";
import { ScanDto } from "@dev-ai-sentinel/contracts";

interface ScanHistoryProps {
  scans: ScanDto[];
}

export function ScanHistory({ scans }: ScanHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { bg: "#dcfce7", text: "#166534" };
      case "RUNNING":
        return { bg: "#fef9c3", text: "#854d0e" };
      case "FAILED":
        return { bg: "#fee2e2", text: "#991b1b" };
      default:
        return { bg: "#f1f5f9", text: "#475569" };
    }
  };

  return (
    <section id="scans" style={{
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      border: "1px solid #e2e8f0",
      padding: "1.25rem",
      marginBottom: "1.5rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>
          Recent Analysis Scans
        </h2>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
          {scans.length} total runs
        </span>
      </div>

      {scans.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>No scan executions recorded.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", textAlign: "left", color: "#64748b" }}>
                <th style={{ padding: "0.5rem" }}>Scan ID</th>
                <th style={{ padding: "0.5rem" }}>Status</th>
                <th style={{ padding: "0.5rem" }}>Commit</th>
                <th style={{ padding: "0.5rem" }}>Total Findings</th>
                <th style={{ padding: "0.5rem" }}>High / Critical</th>
                <th style={{ padding: "0.5rem" }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => {
                const style = getStatusColor(scan.status);
                return (
                  <tr key={scan.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.75rem 0.5rem", fontFamily: "monospace" }}>
                      {scan.id.slice(0, 8)}...
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>
                      <span style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "0.25rem",
                        backgroundColor: style.bg,
                        color: style.text,
                        fontSize: "0.75rem",
                        fontWeight: 600
                      }}>
                        {scan.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", fontFamily: "monospace" }}>
                      {scan.commitHash ? scan.commitHash.slice(0, 7) : "HEAD"}
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>{scan.totalFindings}</td>
                    <td style={{ padding: "0.75rem 0.5rem", color: scan.highSeverityCount > 0 ? "#dc2626" : "inherit" }}>
                      {scan.highSeverityCount}
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "#64748b" }}>
                      {new Date(scan.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
