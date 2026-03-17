import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.resolve("src/uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DocDrop backend is running",
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the DocDrop API",
  });
});

app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

export default app;
