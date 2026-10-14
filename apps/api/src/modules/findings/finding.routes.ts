import { Router } from "express";
import { findingController } from "./finding.controller.js";

export const findingRouter = Router();

findingRouter.get("/", (req, res, next) => findingController.list(req, res, next));
findingRouter.get("/:id", (req, res, next) => findingController.getById(req, res, next));
