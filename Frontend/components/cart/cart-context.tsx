"use client";
import { CartService } from "@/lib/cart-service";
import type React from "react";
import { createContext, useContext, useReducer, useEffect } from "react";

interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    seller: string;
    condition: string;
    quantity: number;
}

// Backend cart item structure
interface BackendCartItem {
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

interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
}

type CartAction =
    | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
    | { type: "REMOVE_ITEM"; payload: string }
    | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
    | { type: "CLEAR_CART" }
    | { type: "LOAD_CART"; payload: CartItem[] };

const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case "ADD_ITEM": {
            const existingItem = state.items.find(
                (item) => item.id === action.payload.id
            );

            if (existingItem) {
                const updatedItems = state.items.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                return {
                    ...state,
                    items: updatedItems,
                    total: updatedItems.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                    ),
                    itemCount: updatedItems.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                    ),
                };
            }

            const newItems = [
                ...state.items,
                { ...action.payload, quantity: 1 },
            ];
            return {
                ...state,
                items: newItems,
                total: newItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                ),
                itemCount: newItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                ),
            };
        }

        case "REMOVE_ITEM": {
            const newItems = state.items.filter(
                (item) => item.id !== action.payload
            );
            return {
                ...state,
                items: newItems,
                total: newItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                ),
                itemCount: newItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                ),
            };
        }

        case "UPDATE_QUANTITY": {
            if (action.payload.quantity <= 0) {
                return cartReducer(state, {
                    type: "REMOVE_ITEM",
                    payload: action.payload.id,
                });
            }

            const newItems = state.items.map((item) =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
            return {
                ...state,
                items: newItems,
                total: newItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                ),
                itemCount: newItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                ),
            };
        }

        case "CLEAR_CART":
            return {
                items: [],
                total: 0,
                itemCount: 0,
            };

        case "LOAD_CART": {
            return {
                items: action.payload,
                total: action.payload.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                ),
                itemCount: action.payload.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                ),
            };
        }

        default:
            return state;
    }
};

const initialState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
};

// Helper function to convert backend cart item to frontend format
function convertBackendCartItem(backendItem: BackendCartItem): CartItem {
    return {
        id: backendItem.product.id, // Use product ID as the main ID
        title: backendItem.product.title,
        price: backendItem.product.price,
        image: backendItem.product.imageUrl || "/placeholder.svg",
        seller: "Unknown", // Backend doesn't provide seller info in cart
        condition: "Good", // Default condition since not provided
        quantity: backendItem.quantity,
    };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        async function loadCart() {
            try {
                const cartData = await CartService.getCart(); // what backend returns
                console.log("Cart data from backend:", cartData);

                // Convert backend cart items to frontend format
                const cartItems = cartData.items?.map(convertBackendCartItem) || [];

                dispatch({ type: "LOAD_CART", payload: cartItems });
            } catch (err) {
                console.error("Failed to load cart from API:", err);
            }
        }

        loadCart();
    }, []);

    // Enhanced cart actions that sync with backend
    const addToCart = async (productId: string, quantity: number = 1) => {
        try {
            console.log("Adding to cart:", { productId, quantity });
            
            // Check if user is authenticated
            const isAuthenticated = localStorage.getItem("ecofinds-authenticated") === "true";
            console.log("User authenticated:", isAuthenticated);
            
            if (!isAuthenticated) {
                throw new Error("User must be logged in to add items to cart");
            }
            
            await CartService.addToCart({ productId, quantity });
            console.log("Successfully added to cart, reloading cart data...");
            // Reload cart from backend to get updated data
            const cartData = await CartService.getCart();
            console.log("Reloaded cart data:", cartData);
            const cartItems = cartData.items?.map(convertBackendCartItem) || [];
            dispatch({ type: "LOAD_CART", payload: cartItems });
        } catch (error) {
            console.error("Failed to add item to cart:", error);
            throw error;
        }
    };

    const updateCartItemQuantity = async (productId: string, quantity: number) => {
        try {
            await CartService.updateCartItem({ productId, quantity });
            // Reload cart from backend to get updated data
            const cartData = await CartService.getCart();
            const cartItems = cartData.items?.map(convertBackendCartItem) || [];
            dispatch({ type: "LOAD_CART", payload: cartItems });
        } catch (error) {
            console.error("Failed to update cart item:", error);
            throw error;
        }
    };

    const removeFromCart = async (productId: string) => {
        try {
            await CartService.removeFromCart(productId);
            // Reload cart from backend to get updated data
            const cartData = await CartService.getCart();
            const cartItems = cartData.items?.map(convertBackendCartItem) || [];
            dispatch({ type: "LOAD_CART", payload: cartItems });
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            await CartService.clearCart();
            dispatch({ type: "CLEAR_CART" });
        } catch (error) {
            console.error("Failed to clear cart:", error);
            throw error;
        }
    };

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("ecofinds-cart", JSON.stringify(state.items));
    }, [state.items]);

    return (
        <CartContext.Provider value={{ 
            state, 
            dispatch, 
            addToCart, 
            updateCartItemQuantity, 
            removeFromCart, 
            clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
