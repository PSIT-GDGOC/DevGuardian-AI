import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { mainRouter } from "./routes/index.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/error-handler.js";

dotenv.config();

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.use(mainRouter);

  // Fallback 404 handler for undefined routes
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "The requested route does not exist",
      },
    });
  });

  app.use(errorHandler);

  return app;
}

export const app = createApp();
