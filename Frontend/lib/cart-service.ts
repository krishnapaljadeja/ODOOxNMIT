import { ApiService, API_ENDPOINTS } from "./api";

// Backend response types
interface BackendCartResponse {
  statusCode: number;
  data: string; // "Cart retrieved successfully"
  message: {
    cart: Cart;
  };
  success: boolean;
}

interface BackendCartItemResponse {
  statusCode: number;
  data: string; // "Item added successfully"
  message: {
    item: CartItem;
  };
  success: boolean;
}

// Cart types
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    category: string;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface AddToCartData {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemData {
  productId: string;
  quantity: number;
}

// Cart Service Class
export class CartService {
  // Get user's cart
  static async getCart(): Promise<Cart> {
    try {
      const response = await ApiService.get<BackendCartResponse>(
        API_ENDPOINTS.CART.GET
      );
      return response.message.cart;
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch cart");
    }
  }

  // Add item to cart
  static async addToCart(itemData: AddToCartData): Promise<CartItem> {
    try {
      const response = await ApiService.post<BackendCartItemResponse>(
        API_ENDPOINTS.CART.ADD,
        itemData
      );
      return response.message.item;
    } catch (error: any) {
      throw new Error(error.message || "Failed to add item to cart");
    }
  }

  // Update cart item quantity
  static async updateCartItem(itemData: UpdateCartItemData): Promise<CartItem> {
    try {
      const response = await ApiService.put<BackendCartItemResponse>(
        API_ENDPOINTS.CART.UPDATE,
        itemData
      );
      return response.message.item;
    } catch (error: any) {
      throw new Error(error.message || "Failed to update cart item");
    }
  }

  // Remove item from cart
  static async removeFromCart(productId: string): Promise<void> {
    try {
      await ApiService.delete(API_ENDPOINTS.CART.REMOVE(productId));
    } catch (error: any) {
      throw new Error(error.message || "Failed to remove item from cart");
    }
  }

  // Clear entire cart
  static async clearCart(): Promise<void> {
    try {
      await ApiService.delete(API_ENDPOINTS.CART.CLEAR);
    } catch (error: any) {
      throw new Error(error.message || "Failed to clear cart");
    }
  }
}
