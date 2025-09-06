"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { useCart } from "@/components/cart/cart-context";
import {
  ProductService,
  type Product,
  type ProductFilters,
} from "@/lib/product-service";
import { toast } from "@/hooks/use-toast";

// Convert backend Product to frontend ProductCard format
const convertProductForCard = (product: Product) => ({
  id: product.id,
  title: product.title,
  price: product.price,
  category: product.category,
  condition: "Good", // Backend doesn't have condition field, using default
  image: product.imageUrl || product.images?.[0] || "/placeholder.svg",
  seller: product.seller.username,
  location: "Online", // Backend doesn't have location field, using default
});

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
  sortBy?: string;
  groupBy?: string;
}

export function ProductGrid({
  searchQuery = "",
  selectedCategory = "All",
  sortBy = "newest",
  groupBy = "none",
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const productsPerPage = 6;
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Fetch products from API
  const fetchProducts = async (
    pageNum: number = 1,
    append: boolean = false
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const filters: ProductFilters = {
        page: pageNum,
        limit: productsPerPage,
        sortBy: sortBy as any,
        search: searchQuery || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
      };

      const response = await ProductService.getProducts(filters);

      if (append) {
        setProducts((prev) => [...prev, ...response.message.products]);
      } else {
        setProducts(response.message.products);
      }

      setFilteredProducts(response.message.products);
      setHasMore(response.message.pagination?.hasNext);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(1, false);
    setPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId); // This will handle both API call and context update
      toast({
        title: "Added to cart",
        description: "Product added successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const handleToggleLike = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: undefined, // Backend doesn't have originalPrice
        category: product.category,
        condition: "Good", // Default condition
        image: product.imageUrl || product.images?.[0] || "/placeholder.svg",
        seller: product.seller.username,
        location: "Online", // Default location
      });
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  const displayedProducts = products;

  // Group products based on groupBy setting
  const getGroupedProducts = () => {
    if (groupBy === "none") {
      return { "All Products": displayedProducts };
    }

    const groups: Record<string, typeof displayedProducts> = {};

    displayedProducts.forEach((product) => {
      let groupKey = "";

      switch (groupBy) {
        case "category":
          groupKey = product.category;
          break;
        case "condition":
          groupKey = "Good"; // Default condition since backend doesn't have this field
          break;
        case "price":
          if (product.price < 100) groupKey = "Under ₹100";
          else if (product.price < 500) groupKey = "₹100 - ₹500";
          else if (product.price < 1000) groupKey = "₹500 - ₹1000";
          else groupKey = "Over ₹1000";
          break;
        default:
          groupKey = "All Products";
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(product);
    });

    return groups;
  };

  const groupedProducts = getGroupedProducts();

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {isLoading
            ? "Loading products..."
            : `Showing ${displayedProducts?.length || 0} products`}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-destructive/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
              Error loading products
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => fetchProducts(1, false)} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="space-y-8">
        {Object.entries(groupedProducts).map(
          ([groupName, groupProducts], groupIndex) => (
            <div key={groupName}>
              {groupBy !== "none" && (
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="text-lg font-semibold text-foreground mb-4"
                >
                  {groupName} ({groupProducts.length})
                </motion.h3>
              )}
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {groupProducts?.map((product, index) => {
                  const cardProduct = convertProductForCard(product);
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: groupIndex * 0.1 + index * 0.1,
                      }}
                    >
                      <ProductCard
                        product={cardProduct}
                        onAddToCart={handleAddToCart}
                        onToggleLike={handleToggleLike}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={loadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Products"
            )}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && displayedProducts?.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                🔍
              </motion.div>
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or browse different categories
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
