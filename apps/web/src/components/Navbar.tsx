import React from "react";

export function Navbar() {
  return (
    <header style={{
      borderBottom: "1px solid #e2e8f0",
      backgroundColor: "#ffffff",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "1.5rem" }}>🛡️</span>
        <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
          Dev AI Sentinel
        </h1>
        <span style={{
          fontSize: "0.75rem",
          padding: "0.2rem 0.5rem",
          backgroundColor: "#e0f2fe",
          color: "#0369a1",
          borderRadius: "9999px",
          fontWeight: 600
        }}>
          GDGOC Edition
        </span>
      </div>
      <nav style={{ display: "flex", gap: "1.5rem", fontSize: "0.875rem", color: "#475569" }}>
        <a href="#repositories" style={{ textDecoration: "none", color: "inherit" }}>Repositories</a>
        <a href="#scans" style={{ textDecoration: "none", color: "inherit" }}>Scans</a>
        <a href="#findings" style={{ textDecoration: "none", color: "inherit" }}>Findings</a>
        <a href="#issues" style={{ textDecoration: "none", color: "inherit" }}>Issues</a>
      </nav>
    </header>
  );
}
