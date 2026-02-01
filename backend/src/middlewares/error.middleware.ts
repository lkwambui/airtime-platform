import { Request, Response, NextFunction } from "express";
import { logError } from "../utils/logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  logError("Unhandled application error", {
    path: req.path,
    method: req.method,
    error: err,
  });

  const status = err.status || 500;

  res.status(status).json({
    message: err.message || "Internal server error",
  });
}
