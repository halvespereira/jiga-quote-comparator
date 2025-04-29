import { Router } from "express";
import { getComparison } from "./quote.controller";
import { validateQuoteQuery } from "../../middleware/validateQuoteQuery";

const router = Router();

router.get("/", validateQuoteQuery, getComparison);

export default router;
