"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Mock product data
const mockProducts = [
  {
    id: "1",
    title: "Vintage Leather Jacket - Genuine Brown Leather",
    price: 89,
    originalPrice: 120,
    category: "Clothing",
    condition: "Good",
    image: "/vintage-brown-leather-jacket.jpg",
    seller: "Sarah M.",
    location: "Brooklyn, NY",
    isLiked: false,
  },
  {
    id: "2",
    title: 'MacBook Pro 13" 2019 - Excellent Condition',
    price: 899,
    originalPrice: 1299,
    category: "Electronics",
    condition: "Excellent",
    image: "/macbook-pro-laptop-silver.jpg",
    seller: "Tech Store",
    location: "San Francisco, CA",
    isLiked: true,
  },
  {
    id: "3",
    title: "Mid-Century Modern Coffee Table - Walnut Wood",
    price: 245,
    category: "Furniture",
    condition: "Very Good",
    image: "/mid-century-walnut-coffee-table.jpg",
    seller: "Vintage Home",
    location: "Portland, OR",
    isLiked: false,
  },
  {
    id: "4",
    title: "Canon EOS R5 Camera Body - Like New",
    price: 2899,
    originalPrice: 3899,
    category: "Electronics",
    condition: "Like New",
    image: "/canon-eos-r5-camera-black.jpg",
    seller: "Photo Pro",
    location: "Los Angeles, CA",
    isLiked: false,
  },
  {
    id: "5",
    title: "Patagonia Down Jacket - Women's Medium",
    price: 156,
    originalPrice: 229,
    category: "Clothing",
    condition: "Good",
    image: "/patagonia-down-jacket-blue-womens.jpg",
    seller: "Outdoor Gear",
    location: "Denver, CO",
    isLiked: true,
  },
  {
    id: "6",
    title: "Rare First Edition Harry Potter Book Set",
    price: 1200,
    category: "Books",
    condition: "Very Good",
    image: "/harry-potter-first-edition-books.jpg",
    seller: "Book Collector",
    location: "Boston, MA",
    isLiked: false,
  },
]

interface ProductGridProps {
  searchQuery?: string
  selectedCategory?: string
}

export function ProductGrid({ searchQuery = "", selectedCategory = "All" }: ProductGridProps) {
  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const productsPerPage = 6

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.seller.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
    setPage(1)
  }, [searchQuery, selectedCategory, products])

  const handleAddToCart = (productId: string) => {
    console.log("Added to cart:", productId)
    // Add toast notification here
  }

  const handleToggleLike = (productId: string) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === productId ? { ...product, isLiked: !product.isLiked } : product)),
    )
  }

  const loadMore = () => {
    setIsLoading(true)
    // Simulate loading more products
    setTimeout(() => {
      setPage((prev) => prev + 1)
      setIsLoading(false)
    }, 1000)
  }

  const displayedProducts = filteredProducts.slice(0, page * productsPerPage)
  const hasMore = displayedProducts.length < filteredProducts.length

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {displayedProducts.length} of {filteredProducts.length} products
        </p>
      </div>

      {/* Product Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} onAddToCart={handleAddToCart} onToggleLike={handleToggleLike} />
          </motion.div>
        ))}
      </motion.div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button onClick={loadMore} disabled={isLoading} variant="outline" size="lg">
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
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                🔍
              </motion.div>
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or browse different categories</p>
          </div>
        </div>
      )}
    </div>
  )
}
