import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import isAuthenticated from "../middlewares/Authentication.js";
import { PRODUCT_CATEGORIES } from "../config/categories.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/categories", (req, res) => {
  res.json({
    statusCode: 200,
    message: "Categories retrieved successfully",
    data: { categories: PRODUCT_CATEGORIES },
  });
});

// Protected routes (require authentication)
router.post("/", isAuthenticated, createProduct);
router.get("/my-listings", isAuthenticated, getMyProducts);

// Routes with parameters (must come after specific routes)
router.get("/:id", getProductById);
router.put("/:id", isAuthenticated, updateProduct);
router.delete("/:id", isAuthenticated, deleteProduct);

export default router;
