import express from "express";
import {
  processPurchase,
  getPurchaseHistory,
  getPurchaseDetails,
  getPurchaseStats,
} from "../controllers/purchase.controller.js";
import isAuthenticated from "../middlewares/Authentication.js";

const router = express.Router();

// All purchase routes require authentication
router.post("/process", isAuthenticated, processPurchase);
router.get("/history", isAuthenticated, getPurchaseHistory);
router.get("/stats", isAuthenticated, getPurchaseStats);
router.get("/:purchaseId", isAuthenticated, getPurchaseDetails);

export default router;
