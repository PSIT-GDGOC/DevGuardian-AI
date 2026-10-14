import { Router } from "express";
import { repositoryController } from "./repository.controller.js";
import { validateBody } from "../../middleware/validator.js";
import { CreateRepositorySchema } from "../../contracts/index.js";

export const repositoryRouter = Router();

repositoryRouter.get("/", (req, res, next) => repositoryController.list(req, res, next));
repositoryRouter.get("/:id", (req, res, next) => repositoryController.getById(req, res, next));
repositoryRouter.post("/", validateBody(CreateRepositorySchema), (req, res, next) => repositoryController.create(req, res, next));
repositoryRouter.delete("/:id", (req, res, next) => repositoryController.delete(req, res, next));
