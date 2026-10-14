import { Router } from "express";
import { repositoryRouter } from "../modules/repositories/repository.routes.js";
import { scanRouter } from "../modules/scans/scan.routes.js";
import { findingRouter } from "../modules/findings/finding.routes.js";
import { issueRouter } from "../modules/issues/issue.routes.js";
import { aiRouter } from "../modules/ai/ai.routes.js";

export const mainRouter = Router();

mainRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "dev-ai-sentinel-api",
    version: "0.1.0",
  });
});

mainRouter.use("/api/v1/repositories", repositoryRouter);
mainRouter.use("/api/v1/scans", scanRouter);
mainRouter.use("/api/v1/findings", findingRouter);
mainRouter.use("/api/v1/issues", issueRouter);
mainRouter.use("/api/v1/ai", aiRouter);
