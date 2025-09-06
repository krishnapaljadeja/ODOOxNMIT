import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/multer.js";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload multiple images
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json(new ApiError(400, "No images provided"));
    }

    // Limit to maximum 5 images per product
    if (req.files.length > 5) {
      return res
        .status(400)
        .json(new ApiError(400, "Maximum 5 images allowed per product"));
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          file.path,
          {
            folder: "ecofinds/products",
            resource_type: "auto",
            transformation: [
              { width: 800, height: 600, crop: "limit" },
              { quality: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    return res.status(200).json(
      new ApiResponse(200, "Images uploaded successfully", {
        images: imageUrls,
        count: imageUrls.length,
      })
    );
  } catch (err) {
    console.error("Error uploading images:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Failed to upload images"));
  }
};

// Upload single image
export const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(new ApiError(400, "No image provided"));
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "ecofinds/products",
          resource_type: "auto",
          transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    return res.status(200).json(
      new ApiResponse(200, "Image uploaded successfully", {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      })
    );
  } catch (err) {
    console.error("Error uploading image:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Failed to upload image"));
  }
};

// Delete image from Cloudinary
export const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json(new ApiError(400, "Public ID is required"));
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    if (result.result === "ok") {
      return res
        .status(200)
        .json(new ApiResponse(200, "Image deleted successfully"));
    } else {
      return res.status(404).json(new ApiError(404, "Image not found"));
    }
  } catch (err) {
    console.error("Error deleting image:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Failed to delete image"));
  }
};
