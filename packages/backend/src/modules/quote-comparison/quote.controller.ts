import { Request, Response, NextFunction } from "express";
import { compareQuote } from "./quote.service";

export async function getComparison(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const quoteId = req.query.quoteId as string;
    const result = await compareQuote(quoteId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
