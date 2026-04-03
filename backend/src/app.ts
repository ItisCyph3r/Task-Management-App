import "reflect-metadata";
import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Task Management API");
});

app.use("/tasks", taskRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export { app };
