#!/usr/bin/env node

/**
 * Pre-flight script to verify contributor environment requirements.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

console.log("🔍 Checking Dev AI Sentinel environment...");

const nodeVersion = process.versions.node;
const majorVersion = parseInt(nodeVersion.split(".")[0], 10);

if (majorVersion < 18) {
  console.error(`❌ Node.js 18+ required. Current version: ${nodeVersion}`);
  process.exit(1);
} else {
  console.log(`✅ Node.js version ${nodeVersion} detected.`);
}

const envExamplePath = path.resolve(process.cwd(), ".env.example");
const envPath = path.resolve(process.cwd(), ".env");

if (!fs.existsSync(envExamplePath)) {
  console.error("❌ Missing .env.example template!");
  process.exit(1);
} else {
  console.log("✅ .env.example present.");
}

if (!fs.existsSync(envPath)) {
  console.warn("⚠️ No .env file found. Creating from .env.example...");
  fs.copyFileSync(envExamplePath, envPath);
  console.log("✅ Created .env with default local settings.");
} else {
  console.log("✅ .env file present.");
}

console.log("🚀 Pre-flight check passed!");
