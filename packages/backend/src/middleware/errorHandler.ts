import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    next(err);
    return;
  }

  if (err.message === "Quote not found") {
    res.status(404).json({ message: "Quote not found" });
    return;
  }

  res.status(500).json({ message: "Internal Server Error" });
};
