import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";
import { validateCategory } from "../config/categories.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { title, description, category, price, imageUrl, images } = req.body;
    const sellerId = req.user.id; // From authentication middleware

    // Input validation
    if (!title || !description || !category || !price) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Title, description, category, and price are required"
          )
        );
    }

    // Validate category
    if (!validateCategory(category)) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Invalid category. Must be one of: Electronics, Clothing, Books, Home, Sports, Other"
          )
        );
    }

    // Validate price
    if (price <= 0) {
      return res
        .status(400)
        .json(new ApiError(400, "Price must be greater than 0"));
    }

    // Process images
    let productImages = [];
    if (images && Array.isArray(images)) {
      productImages = images;
    } else if (imageUrl) {
      // Backward compatibility - single image
      productImages = [imageUrl];
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        category,
        price: parseFloat(price),
        imageUrl: productImages[0] || null, // First image as main image
        images: productImages,
        sellerId,
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Product created successfully", { product }));
  } catch (err) {
    console.error("Error creating product:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Get all products with pagination and filtering
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = "newest",
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};

    if (category && validateCategory(category)) {
      where.category = category;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return res.status(200).json(
      new ApiResponse(200, "Products retrieved successfully", {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      })
    );
  } catch (err) {
    console.error("Error fetching products:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            createdAt: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Product retrieved successfully", { product })
      );
  } catch (err) {
    console.error("Error fetching product:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Get user's own products
export const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: { sellerId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where: { sellerId } }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return res.status(200).json(
      new ApiResponse(200, "Your products retrieved successfully", {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      })
    );
  } catch (err) {
    console.error("Error fetching user products:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, price, imageUrl } = req.body;
    const userId = req.user.id; // From authentication middleware

    // Check if product exists and user owns it
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    if (existingProduct.sellerId !== userId) {
      return res
        .status(403)
        .json(new ApiError(403, "You can only update your own products"));
    }

    // Validate category if provided
    if (category && !validateCategory(category)) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Invalid category. Must be one of: Electronics, Clothing, Books, Home, Sports, Other"
          )
        );
    }

    // Validate price if provided
    if (price && price <= 0) {
      return res
        .status(400)
        .json(new ApiError(400, "Price must be greater than 0"));
    }

    // Update product
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (price) updateData.price = parseFloat(price);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        seller: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return res.status(200).json(
      new ApiResponse(200, "Product updated successfully", {
        product: updatedProduct,
      })
    );
  } catch (err) {
    console.error("Error updating product:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From authentication middleware

    // Check if product exists and user owns it
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    if (existingProduct.sellerId !== userId) {
      return res
        .status(403)
        .json(new ApiError(403, "You can only delete your own products"));
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Product deleted successfully"));
  } catch (err) {
    console.error("Error deleting product:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};
