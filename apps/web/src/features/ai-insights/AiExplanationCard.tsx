import React, { useState } from "react";

interface AiExplanationCardProps {
  findingTitle: string;
  initialSummary?: string;
  recommendedFix?: string;
}

/**
 * AI Explanation Card Boilerplate
 * 
 * College contributors can complete this component to fetch and render
 * real-time explanations from `POST /api/v1/ai/explain`.
 */
export function AiExplanationCard({
  findingTitle,
  initialSummary,
  recommendedFix,
}: AiExplanationCardProps) {
  const [expanded, setExpanded] = useState(false);

  // --------------------------------------------------------------------------
  // TODO: Complete this component with:
  // 1. "Ask AI" button that calls `/api/v1/ai/explain`
  // 2. Diff viewer showing proposed patch from `/api/v1/ai/suggest-patch`
  // 3. One-click "Copy Fix" button
  // --------------------------------------------------------------------------

  return (
    <div style={{
      marginTop: "0.75rem",
      padding: "0.75rem",
      backgroundColor: "#f0fdf4",
      border: "1px solid #bbf7d0",
      borderRadius: "0.375rem",
      fontSize: "0.85rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600, color: "#166534" }}>
          🤖 AI Guardian Insight: {findingTitle}
        </span>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none",
            border: "none",
            color: "#15803d",
            fontSize: "0.75rem",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          {expanded ? "Hide Details" : "Show AI Fix"}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: "0.5rem", color: "#374151" }}>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Analysis:</strong> {initialSummary || "This code pattern introduces a maintainability or security vulnerability."}
          </p>
          <p style={{ margin: "0.25rem 0", color: "#166534" }}>
            <strong>Suggested Fix:</strong> {recommendedFix || "Refactor code to avoid hardcoded credentials or dynamic evaluation."}
          </p>
        </div>
      )}
    </div>
  );
}
