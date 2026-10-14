"use client";

import React from "react";
import { Navbar } from "../components/Navbar.js";
import { StatCard } from "../components/StatCard.js";
import { useDashboardData } from "../hooks/use-dashboard-data.js";
import { RepositoryList } from "../features/repositories/RepositoryList.js";
import { ScanHistory } from "../features/scans/ScanHistory.js";
import { FindingTable } from "../features/findings/FindingTable.js";
import { IssueList } from "../features/issues/IssueList.js";

export default function DashboardPage() {
  const { repositories, scans, findings, issues, metrics, loading, error, refresh } = useDashboardData();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem", width: "100%", boxSizing: "border-box" }}>
        {/* Header bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 0.25rem 0", color: "#0f172a" }}>
              Project Health Overview
            </h1>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.875rem" }}>
              Automated repository audits, risk assessments, and actionable recommendations.
            </p>
          </div>
          <button
            onClick={() => refresh()}
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.375rem",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {loading ? "Refreshing..." : "Refresh Status"}
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            padding: "0.75rem 1rem",
            borderRadius: "0.375rem",
            marginBottom: "1.5rem",
            fontSize: "0.875rem"
          }}>
            ⚠️ {error} — Operating with cached/fallback data.
          </div>
        )}

        {/* Metric Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem"
        }}>
          <StatCard
            title="Repositories"
            value={metrics.totalRepositories}
            description="Active tracked projects"
          />
          <StatCard
            title="Total Scans"
            value={metrics.totalScans}
            description="Static audits conducted"
          />
          <StatCard
            title="Total Findings"
            value={metrics.totalFindings}
            description="Detected code patterns"
          />
          <StatCard
            title="High / Critical"
            value={metrics.criticalSecurityCount}
            description="Urgent vulnerabilities"
            highlight={metrics.criticalSecurityCount > 0}
          />
          <StatCard
            title="Open Issues"
            value={metrics.openIssuesCount}
            description="Pending student contributions"
          />
        </div>

        {/* Main Content Sections */}
        <RepositoryList repositories={repositories} />
        <ScanHistory scans={scans} />
        <FindingTable findings={findings} />
        <IssueList issues={issues} />
      </main>
    </div>
  );
}
