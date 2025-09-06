import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import isAuthenticated from "./middlewares/Authentication.js";

import cors from "cors";
import prisma from "./utils/prismClient.js";

dotenv.config();
const app = express();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "10mb" })); // JSON body parser with size limit
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // URL-encoded body parser
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Static file serving for image placeholders
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

// Request timeout middleware (30 seconds)
app.use((req, res, next) => {
  req.setTimeout(30000, () => {
    res.status(408).json({
      status: "ERROR",
      message: "Request timeout",
      timestamp: new Date().toISOString(),
    });
  });
  next();
});

app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/purchases", purchaseRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "EcoFinds Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Database connection test endpoint
app.get("/api/db-test", async (req, res) => {
  try {
    // Test database connection
    await prisma.$connect();
    res.json({
      status: "OK",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Middleware test endpoint
app.get("/api/middleware-test", (req, res) => {
  res.json({
    status: "OK",
    message: "All middleware working correctly",
    requestInfo: {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
    },
  });
});

// Protected route test endpoint
app.get("/api/protected-test", isAuthenticated, (req, res) => {
  res.json({
    status: "OK",
    message: "Protected route accessed successfully",
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    },
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`EcoFinds Backend running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
