import { describe, it, expect } from "vitest";

describe("Web Dashboard sanity tests", () => {
  it("validates stat calculation logic", () => {
    const mockFindings = [
      { severity: "CRITICAL" },
      { severity: "HIGH" },
      { severity: "LOW" },
    ];
    const criticalCount = mockFindings.filter(
      (f) => f.severity === "CRITICAL" || f.severity === "HIGH"
    ).length;

    expect(criticalCount).toBe(2);
  });

  it("filters findings by severity", () => {
    const mockFindings = [
      { id: "1", severity: "CRITICAL" },
      { id: "2", severity: "HIGH" },
      { id: "3", severity: "MEDIUM" },
      { id: "4", severity: "LOW" },
      { id: "5", severity: "INFO" },
    ];

    const filterSeverity: string = "HIGH";
    const visibleFindings =
      filterSeverity === "ALL"
        ? mockFindings
        : mockFindings.filter((f) => f.severity === filterSeverity);

    expect(visibleFindings).toHaveLength(1);
    expect(visibleFindings[0].severity).toBe("HIGH");
  });

  it("returns all findings when filter is ALL", () => {
    const mockFindings = [
      { severity: "CRITICAL" },
      { severity: "LOW" },
    ];
    const filterSeverity: string = "ALL";
    const visibleFindings =
      filterSeverity === "ALL"
        ? mockFindings
        : mockFindings.filter((f) => f.severity === filterSeverity);

    expect(visibleFindings).toHaveLength(2);
  });

  it("returns empty array when no findings match the filter", () => {
    const mockFindings = [
      { severity: "LOW" },
      { severity: "INFO" },
    ];
    const filterSeverity: string = "CRITICAL";
    const visibleFindings =
      filterSeverity === "ALL"
        ? mockFindings
        : mockFindings.filter((f) => f.severity === filterSeverity);

    expect(visibleFindings).toHaveLength(0);
  });
});