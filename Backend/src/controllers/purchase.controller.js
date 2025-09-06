import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";

// Process purchase (convert cart to purchase)
export const processPurchase = async (req, res) => {
  try {
    const userId = req.user.id; // From authentication middleware

    // Get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Cart is empty. Add items to cart before purchasing."
          )
        );
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        buyerId: userId,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        status: "completed",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price, // Snapshot of price at time of purchase
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                description: true,
                category: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    // Clear the cart after successful purchase
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, "Purchase completed successfully", { purchase })
      );
  } catch (err) {
    console.error("Error processing purchase:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Get user's purchase history
export const getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user.id; // From authentication middleware
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [purchases, totalCount] = await Promise.all([
      prisma.purchase.findMany({
        where: { buyerId: userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  category: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
        orderBy: { purchaseDate: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.purchase.count({ where: { buyerId: userId } }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return res.status(200).json(
      new ApiResponse(200, "Purchase history retrieved successfully", {
        purchases,
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
    console.error("Error fetching purchase history:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Get single purchase details
export const getPurchaseDetails = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const userId = req.user.id; // From authentication middleware

    const purchase = await prisma.purchase.findFirst({
      where: {
        id: purchaseId,
        buyerId: userId, // Ensure user owns this purchase
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                description: true,
                category: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!purchase) {
      return res
        .status(404)
        .json(
          new ApiError(404, "Purchase not found or you don't have access to it")
        );
    }

    return res.status(200).json(
      new ApiResponse(200, "Purchase details retrieved successfully", {
        purchase,
      })
    );
  } catch (err) {
    console.error("Error fetching purchase details:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Get purchase statistics for user
export const getPurchaseStats = async (req, res) => {
  try {
    const userId = req.user.id; // From authentication middleware

    const [totalPurchases, totalSpent, averageOrderValue, recentPurchases] =
      await Promise.all([
        prisma.purchase.count({
          where: { buyerId: userId },
        }),
        prisma.purchase.aggregate({
          where: { buyerId: userId },
          _sum: { totalAmount: true },
        }),
        prisma.purchase.aggregate({
          where: { buyerId: userId },
          _avg: { totalAmount: true },
        }),
        prisma.purchase.findMany({
          where: { buyerId: userId },
          orderBy: { purchaseDate: "desc" },
          take: 5,
          select: {
            id: true,
            totalAmount: true,
            purchaseDate: true,
            status: true,
          },
        }),
      ]);

    return res.status(200).json(
      new ApiResponse(200, "Purchase statistics retrieved successfully", {
        stats: {
          totalPurchases,
          totalSpent: totalSpent._sum.totalAmount || 0,
          averageOrderValue: averageOrderValue._avg.totalAmount || 0,
          recentPurchases,
        },
      })
    );
  } catch (err) {
    console.error("Error fetching purchase stats:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};
