import express from "express";
import cors from "cors";
import morgan from "morgan";
import quoteRoutes from "./modules/quote-comparison/quote.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/quote-comparison", quoteRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(errorHandler);

export default app;
