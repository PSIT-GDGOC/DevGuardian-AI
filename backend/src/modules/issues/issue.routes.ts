import { Router } from "express";
import { issueController } from "./issue.controller.js";
import { validateBody } from "../../middleware/validator.js";
import { CreateIssueSchema } from "../../contracts/index.js";

export const issueRouter = Router();

issueRouter.get("/", (req, res, next) => issueController.list(req, res, next));
issueRouter.get("/:id", (req, res, next) => issueController.getById(req, res, next));
issueRouter.post("/", validateBody(CreateIssueSchema), (req, res, next) => issueController.create(req, res, next));
