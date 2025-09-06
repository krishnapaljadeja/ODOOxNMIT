import express from "express";
import {
  getProfile,
  loginUser,
  logoutUser,
  signup,
  updateProfile,
  getPublicProfile,
} from "../controllers/auth.controller.js";
import isAuthenticated from "../middlewares/Authentication.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/signup", signup);
router.post("/logout", logoutUser);
router.get("/public-profile/:userId", getPublicProfile);

// Protected routes (require authentication)
router.get("/profile", isAuthenticated, getProfile);
router.put("/profile", isAuthenticated, updateProfile);

export default router;
