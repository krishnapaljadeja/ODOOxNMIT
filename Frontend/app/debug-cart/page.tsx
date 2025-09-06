"use client";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugCartPage() {
  const { state, addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [testProductId, setTestProductId] = useState("test-product-123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestAddToCart = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Testing add to cart with product ID:", testProductId);
      await addToCart(testProductId, 1);
      console.log("Successfully added to cart!");
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      setError(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Cart Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}</p>
            <p><strong>User:</strong> {user ? user.username : "None"}</p>
            <p><strong>User ID:</strong> {user ? user.id : "None"}</p>
            <p><strong>LocalStorage Auth:</strong> {typeof window !== "undefined" ? localStorage.getItem("ecofinds-authenticated") : "N/A"}</p>
          </CardContent>
        </Card>

        {/* Cart Status */}
        <Card>
          <CardHeader>
            <CardTitle>Cart Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Items Count:</strong> {state.itemCount}</p>
            <p><strong>Total:</strong> ${state.total.toFixed(2)}</p>
            <p><strong>Items:</strong> {state.items.length}</p>
            <div className="mt-2">
              <strong>Items List:</strong>
              <ul className="text-sm">
                {state.items.map((item, index) => (
                  <li key={index}>
                    {item.title} - ${item.price} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Test Add to Cart */}
        <Card>
          <CardHeader>
            <CardTitle>Test Add to Cart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Test Product ID:
              </label>
              <input
                type="text"
                value={testProductId}
                onChange={(e) => setTestProductId(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter product ID to test"
              />
            </div>
            
            <Button 
              onClick={handleTestAddToCart}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Adding..." : "Test Add to Cart"}
            </Button>
            
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <strong>Error:</strong> {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Test */}
        <Card>
          <CardHeader>
            <CardTitle>API Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch("http://localhost:3000/api/health");
                  const data = await response.json();
                  console.log("Health check response:", data);
                  alert("Health check successful! Check console for details.");
                } catch (err) {
                  console.error("Health check failed:", err);
                  alert("Health check failed! Check console for details.");
                }
              }}
              className="w-full mb-2"
            >
              Test Backend Health
            </Button>
            
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch("http://localhost:3000/api/cart", {
                    credentials: "include"
                  });
                  const data = await response.json();
                  console.log("Cart API response:", data);
                  alert("Cart API test completed! Check console for details.");
                } catch (err) {
                  console.error("Cart API test failed:", err);
                  alert("Cart API test failed! Check console for details.");
                }
              }}
              className="w-full"
            >
              Test Cart API
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
