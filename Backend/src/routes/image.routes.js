import express from "express";
import {
  uploadImages,
  uploadSingleImage,
  deleteImage,
} from "../controllers/image.controller.js";
import { uploadMultiple, uploadSingle } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/Authentication.js";

const router = express.Router();

// All image routes require authentication
router.post("/upload-multiple", isAuthenticated, uploadMultiple, uploadImages);
router.post("/upload-single", isAuthenticated, uploadSingle, uploadSingleImage);
router.delete("/delete/:publicId", isAuthenticated, deleteImage);

export default router;
