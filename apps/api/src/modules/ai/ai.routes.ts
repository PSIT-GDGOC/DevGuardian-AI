import { Router } from "express";
import { aiController } from "./ai.controller.js";

export const aiRouter = Router();

aiRouter.post("/explain", (req, res, next) => aiController.explain(req, res, next));
aiRouter.get("/risk-score", (req, res, next) => aiController.assessRisk(req, res, next));
aiRouter.post("/suggest-patch", (req, res, next) => aiController.suggestPatch(req, res, next));
