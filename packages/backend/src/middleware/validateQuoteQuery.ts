import { RequestHandler } from "express";

export const validateQuoteQuery: RequestHandler = (req, res, next) => {
  const raw = Array.isArray(req.query.quoteId)
    ? req.query.quoteId[0]
    : req.query.quoteId;
  if (!raw || typeof raw !== "string") {
    res.status(400).json({ message: "quoteId is required" });
    return;
  }
  req.query.quoteId = raw;
  next();
};
