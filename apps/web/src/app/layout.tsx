import React from "react";

export const metadata = {
  title: "Dev AI Sentinel — Dashboard",
  description: "AI-powered guardian for modern software projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        backgroundColor: "#f8fafc",
        color: "#0f172a"
      }}>
        {children}
      </body>
    </html>
  );
}
