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
});
