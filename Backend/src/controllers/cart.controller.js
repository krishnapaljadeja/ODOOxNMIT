import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id; // From authentication middleware

    // Input validation
    if (!productId) {
      return res.status(400).json(new ApiError(400, "Product ID is required"));
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .json(new ApiError(400, "Quantity must be greater than 0"));
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    // Prevent users from adding their own products
    if (product.sellerId === userId) {
      return res
        .status(400)
        .json(new ApiError(400, "You cannot add your own products to cart"));
    }

    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });

      return res
        .status(200)
        .json(
          new ApiResponse(200,{
            item: updatedItem,
          },"Item quantity updated in cart")
        );
    } else {
      // Add new item
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: { product: true },
      });

      return res
        .status(201)
        .json(new ApiResponse(201, "Item added to cart", { item: newItem }));
    }
  } catch (err) {
    console.error("Error adding to cart:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id; // From authentication middleware

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                imageUrl: true,
                category: true,
              },
            },
          },
        },
      },
    });
    

    if (!cart) {
      return res
        .status(200)
        .json(
          new ApiResponse(200,{
              cart: { items: [], total: 0 },
            }, "Cart is empty",
          )
        );
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    return res.status(200).json(
      new ApiResponse(200, {
        cart: {
          id: cart.id,
          items: cart.items,
          total: parseFloat(total.toFixed(2)),
          itemCount: cart.items.length,
        },
      }, "Cart retrieved successfully")
    );
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // From authentication middleware

    // Input validation
    if (!productId || quantity === undefined) {
      return res
        .status(400)
        .json(new ApiError(400, "Product ID and quantity are required"));
    }

    if (quantity < 0) {
      return res
        .status(400)
        .json(new ApiError(400, "Quantity cannot be negative"));
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      return res.status(404).json(new ApiError(404, "Cart not found"));
    }

    // Find the cart item
    const cartItem = cart.items.find((item) => item.productId === productId);

    if (!cartItem) {
      return res.status(404).json(new ApiError(404, "Item not found in cart"));
    }

    if (quantity === 0) {
      // Remove item from cart
      await prisma.cartItem.delete({
        where: { id: cartItem.id },
      });

      return res
        .status(200)
        .json(new ApiResponse(200, "Item removed from cart"));
    } else {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
        include: { product: true },
      });

      return res
        .status(200)
        .json(new ApiResponse(200, "Cart item updated", { item: updatedItem }));
    }
  } catch (err) {
    console.error("Error updating cart item:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id; // From authentication middleware

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      return res.status(404).json(new ApiError(404, "Cart not found"));
    }

    // Find the cart item
    const cartItem = cart.items.find((item) => item.productId === productId);

    if (!cartItem) {
      return res.status(404).json(new ApiError(404, "Item not found in cart"));
    }

    // Remove item
    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return res.status(200).json(new ApiResponse(200, "Item removed from cart"));
  } catch (err) {
    console.error("Error removing from cart:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id; // From authentication middleware

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json(new ApiError(404, "Cart not found"));
    }

    // Delete all cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Cart cleared successfully"));
  } catch (err) {
    console.error("Error clearing cart:", err);
    return res
      .status(500)
      .json(new ApiError(500, err.message || "Internal server error"));
  }
};
