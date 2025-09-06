import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiError(400, "Email and password are required"));
    }

    // Find user by email
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json(new ApiError(401, "Invalid email or password"));
    }

    // Check if user is banned
    if (user.isBanned) {
      return res
        .status(403)
        .json(
          new ApiError(
            403,
            "Your account has been banned. Please contact support for more information."
          )
        );
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json(new ApiError(401, "Invalid email or password"));
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res
      .status(200)
      .json(
        new ApiResponse(200, "Login successful", { user: userWithoutPassword })
      );
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

export const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Input validation
    if (!email || !username || !password) {
      return res
        .status(400)
        .json(new ApiError(400, "Email, username, and password are required"));
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(new ApiError(400, "Invalid email format"));
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return res
        .status(400)
        .json(new ApiError(400, "Password must be at least 6 characters long"));
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.isBanned) {
        return res
          .status(403)
          .json(
            new ApiError(
              403,
              "This account has been banned. Please contact support."
            )
          );
      }
      if (existingUser.email === email) {
        return res
          .status(409)
          .json(new ApiError(409, "User with this email already exists"));
      }
      if (existingUser.username === username) {
        return res
          .status(409)
          .json(new ApiError(409, "Username is already taken"));
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return res.status(201).json(
      new ApiResponse(201, "User registered successfully", {
        user: userWithoutPassword,
      })
    );
  } catch (err) {
    console.error("Signup error:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json(new ApiResponse(200, "Logout successful"));
  } catch (err) {
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Get current user's profile (authenticated)
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From authentication middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        products: {
          select: {
            id: true,
            title: true,
            price: true,
            category: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        purchases: {
          select: {
            id: true,
            totalAmount: true,
            purchaseDate: true,
            status: true,
          },
          orderBy: { purchaseDate: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    // Calculate user statistics
    const totalProducts = await prisma.product.count({
      where: { sellerId: userId },
    });

    const totalPurchases = await prisma.purchase.count({
      where: { buyerId: userId },
    });

    const totalSpent = await prisma.purchase.aggregate({
      where: { buyerId: userId },
      _sum: { totalAmount: true },
    });

    const formattedProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      isBanned: user.isBanned,
      joinedDate: user.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      stats: {
        totalProducts,
        totalPurchases,
        totalSpent: totalSpent._sum.totalAmount || 0,
      },
      recentProducts: user.products,
      recentPurchases: user.purchases,
    };

    return res.status(200).json(
      new ApiResponse(200, "Profile retrieved successfully", {
        user: formattedProfile,
      })
    );
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Update current user's profile (authenticated)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From authentication middleware
    const { username, email } = req.body;

    // Input validation
    if (!username && !email) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "At least one field (username or email) is required"
          )
        );
    }

    // Email validation if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json(new ApiError(400, "Invalid email format"));
      }
    }

    // Check if username or email already exists (excluding current user)
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: userId } },
          {
            OR: [
              ...(username ? [{ username }] : []),
              ...(email ? [{ email }] : []),
            ],
          },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(409)
          .json(new ApiError(409, "Email is already taken"));
      }
      if (existingUser.username === username) {
        return res
          .status(409)
          .json(new ApiError(409, "Username is already taken"));
      }
    }

    // Update user
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = updatedUser;

    return res.status(200).json(
      new ApiResponse(200, "Profile updated successfully", {
        user: userWithoutPassword,
      })
    );
  } catch (err) {
    console.error("Error updating profile:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Get any user's public profile (by userId)
export const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json(new ApiError(400, "User ID is required"));
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        createdAt: true,
        products: {
          select: {
            id: true,
            title: true,
            price: true,
            category: true,
            createdAt: true,
          },
          where: { sellerId: userId },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    // Calculate public statistics
    const totalProducts = await prisma.product.count({
      where: { sellerId: userId },
    });

    const publicProfile = {
      id: user.id,
      username: user.username,
      joinedDate: user.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      stats: {
        totalProducts,
      },
      recentProducts: user.products,
    };

    return res.status(200).json(
      new ApiResponse(200, "Public profile retrieved successfully", {
        user: publicProfile,
      })
    );
  } catch (err) {
    console.error("Error fetching public profile:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};
