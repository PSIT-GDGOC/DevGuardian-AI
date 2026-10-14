import { Router } from "express";
import { scanController } from "./scan.controller.js";
import { validateBody } from "../../middleware/validator.js";
import { CreateScanSchema } from "../../contracts/index.js";

export const scanRouter = Router();

scanRouter.get("/", (req, res, next) => scanController.list(req, res, next));
scanRouter.get("/:id", (req, res, next) => scanController.getById(req, res, next));
scanRouter.post("/", validateBody(CreateScanSchema), (req, res, next) => scanController.create(req, res, next));
