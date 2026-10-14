import { Request, Response, NextFunction } from "express";
import { dataStore } from "../../services/store.js";
import { CreateRepositoryInput } from "../../contracts/index.js";

export class RepositoryController {
  public async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO (Issue 2): Support search filtering here (e.g. const search = req.query.search as string | undefined)
      const repos = await dataStore.getRepositories();
      res.json({
        success: true,
        data: repos,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const repo = await dataStore.getRepositoryById(id);
      if (!repo) {
        res.status(404).json({
          success: false,
          error: {
            code: "REPOSITORY_NOT_FOUND",
            message: `Repository with ID '${id}' was not found`,
          },
        });
        return;
      }
      res.json({
        success: true,
        data: repo,
      });
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: CreateRepositoryInput = req.body;

      // Note: duplicate check can be enhanced with distinct error code in DS-002
      const existing = await dataStore.findRepositoryByUrl(input.url);
      if (existing) {
        res.status(409).json({
          success: false,
          error: {
            code: "REPOSITORY_ALREADY_EXISTS",
            message: `A repository with URL '${input.url}' is already registered`,
            details: { existingId: existing.id },
          },
        });
        return;
      }

      const created = await dataStore.createRepository(input);
      res.status(201).json({
        success: true,
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await dataStore.deleteRepository(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: {
            code: "REPOSITORY_NOT_FOUND",
            message: `Repository with ID '${id}' was not found`,
          },
        });
        return;
      }
      res.json({
        success: true,
        data: { id, deleted: true },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const repositoryController = new RepositoryController();
