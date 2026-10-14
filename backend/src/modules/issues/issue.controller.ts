import { Request, Response, NextFunction } from "express";
import { dataStore } from "../../services/store.js";
import { CreateIssueInput } from "../../contracts/index.js";

export class IssueController {
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const repositoryId = req.query.repositoryId as string | undefined;
      const issues = await dataStore.getIssues(repositoryId);
      res.json({
        success: true,
        data: issues,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const issue = await dataStore.getIssueById(id);
      if (!issue) {
        res.status(404).json({
          success: false,
          error: {
            code: "ISSUE_NOT_FOUND",
            message: `Issue with ID '${id}' was not found`,
          },
        });
        return;
      }
      res.json({
        success: true,
        data: issue,
      });
    } catch (error) {
      next(error);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: CreateIssueInput = req.body;
      const repo = await dataStore.getRepositoryById(input.repositoryId);
      if (!repo) {
        res.status(404).json({
          success: false,
          error: {
            code: "REPOSITORY_NOT_FOUND",
            message: `Repository '${input.repositoryId}' does not exist`,
          },
        });
        return;
      }

      if (input.findingId) {
        const finding = await dataStore.getFindingById(input.findingId);
        if (!finding) {
          res.status(404).json({
            success: false,
            error: {
              code: "FINDING_NOT_FOUND",
              message: `Finding '${input.findingId}' does not exist`,
            },
          });
          return;
        }
      }

      const created = await dataStore.createIssue(input);
      res.status(201).json({
        success: true,
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const issueController = new IssueController();
