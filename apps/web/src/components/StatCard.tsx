import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  highlight?: boolean;
}

export function StatCard({ title, value, description, highlight }: StatCardProps) {
  return (
    <div style={{
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      border: `1px solid ${highlight ? "#f87171" : "#e2e8f0"}`,
      padding: "1.25rem",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem"
    }}>
      <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>{title}</span>
      <span style={{
        fontSize: "2rem",
        fontWeight: 700,
        color: highlight ? "#dc2626" : "#0f172a"
      }}>
        {value}
      </span>
      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{description}</span>
    </div>
  );
}
