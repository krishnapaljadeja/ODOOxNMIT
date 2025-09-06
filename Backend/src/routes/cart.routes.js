import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import isAuthenticated from "../middlewares/Authentication.js";

const router = express.Router();

// All cart routes require authentication
router.post("/add", isAuthenticated, addToCart);
router.get("/", isAuthenticated, getCart);
router.put("/update", isAuthenticated, updateCartItem);
router.delete("/remove/:productId", isAuthenticated, removeFromCart);
router.delete("/clear", isAuthenticated, clearCart);

export default router;
