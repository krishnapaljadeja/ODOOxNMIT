import { ApiService, API_ENDPOINTS } from "./api";

// Backend response types
interface BackendCartResponse {
    statusCode: number;
    message: string; // "Cart retrieved successfully"
    data: {
        cart: Cart;
    };
    success: boolean;
}

interface BackendCartItemResponse {
    statusCode: number;
    message: string; // "Item added successfully"
    data: {
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
            console.log("CartService: Received response:", API_ENDPOINTS.CART.GET);
            console.log("Cart fetched:", response);
            
            return response.data.cart;
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch cart");
        }
    }

    // Add item to cart
    static async addToCart(itemData: AddToCartData): Promise<CartItem> {
        try {
            console.log("CartService: Adding to cart with data:", itemData);
            console.log("CartService: Making request to:", API_ENDPOINTS.CART.ADD);
            
            const response = await ApiService.post<BackendCartItemResponse>(
                API_ENDPOINTS.CART.ADD,
                itemData
            );

            console.log("CartService: Received response:", response);

            // ApiResponse structure: { statusCode, message, data }
            if (!response.data?.item) {
                console.error("CartService: Invalid response structure:", response);
                throw new Error(
                    "Invalid response from server: missing cart item"
                );
            }

            console.log("CartService: Successfully added item:", response.data.item);
            return response.data.item;
        } catch (error: any) {
            console.error("CartService: Error adding to cart:", error);
            throw new Error(error.message || "Failed to add item to cart");
        }
    }

    // Update cart item quantity
    static async updateCartItem(
        itemData: UpdateCartItemData
    ): Promise<CartItem> {
        try {
            const response = await ApiService.put<BackendCartItemResponse>(
                API_ENDPOINTS.CART.UPDATE,
                itemData
            );
            return response.data.item;
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
