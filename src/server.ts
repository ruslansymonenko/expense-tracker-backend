import express from "express";
import cors from "cors";
import { initDatabase } from "./config/database";
import { config } from "./config/config";
import authRoutes from "./routes/auth";
import categoriesRoutes from "./routes/categories";
import expensesRoutes from "./routes/expenses";

const app = express();
// Cloud Run injects PORT env variable, default to 8080
const PORT = config.port;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/expenses", expensesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running", version: "1.0.0" });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  },
);

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = () => {
  console.log("Received shutdown signal, closing server gracefully...");
  process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

startServer();
