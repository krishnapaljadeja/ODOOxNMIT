import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecofinds/products",
    format: async (req, file) => {
      // Preserve original format
      const format = file.mimetype.split("/")[1];
      return ["jpg", "jpeg", "png", "webp"].includes(format) ? format : "jpg";
    },
    public_id: (req, file) => {
      // Generate unique public ID with timestamp
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      return `product_${timestamp}_${random}`;
    },
    transformation: [
      { width: 800, height: 600, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5, // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Export different upload configurations
export const uploadSingle = upload.single("image");
export const uploadMultiple = upload.array("images", 5); // Max 5 images
export { upload };
