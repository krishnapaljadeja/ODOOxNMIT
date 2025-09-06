"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useWishlist } from "@/components/wishlist/wishlist-context"

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
  },
  {
    id: "7",
    title: "Vintage Gibson Guitar - Excellent Sound",
    price: 1200,
    originalPrice: 1800,
    category: "Musical Instruments",
    condition: "Excellent",
    image: "/placeholder.svg",
    seller: "Music Store",
    location: "Nashville, TN",
  },
  {
    id: "8",
    title: "Antique Silver Necklace - Victorian Era",
    price: 450,
    originalPrice: 650,
    category: "Jewelry & Accessories",
    condition: "Good",
    image: "/placeholder.svg",
    seller: "Antique Shop",
    location: "Charleston, SC",
  },
  {
    id: "9",
    title: "Professional Camera Lens - 85mm f/1.4",
    price: 800,
    originalPrice: 1200,
    category: "Electronics",
    condition: "Like New",
    image: "/placeholder.svg",
    seller: "Photo Pro",
    location: "Los Angeles, CA",
  },
  {
    id: "10",
    title: "Designer Handbag - Leather Crossbody",
    price: 180,
    originalPrice: 350,
    category: "Clothing",
    condition: "Very Good",
    image: "/placeholder.svg",
    seller: "Fashion Boutique",
    location: "New York, NY",
  },
  {
    id: "11",
    title: "Vintage Typewriter - Working Condition",
    price: 120,
    category: "Collectibles",
    condition: "Good",
    image: "/placeholder.svg",
    seller: "Vintage Finds",
    location: "Portland, OR",
  },
  {
    id: "12",
    title: "Professional Tool Set - Complete Kit",
    price: 350,
    originalPrice: 500,
    category: "Tools & Equipment",
    condition: "Excellent",
    image: "/placeholder.svg",
    seller: "Tool Store",
    location: "Detroit, MI",
  },
]

interface ProductGridProps {
  searchQuery?: string
  selectedCategory?: string
  sortBy?: string
  groupBy?: string
}

export function ProductGrid({ 
  searchQuery = "", 
  selectedCategory = "All", 
  sortBy = "newest", 
  groupBy = "none" 
}: ProductGridProps) {
  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const productsPerPage = 6
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  // Filter and sort products based on search, category, and sorting
  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.seller.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "oldest":
          return a.id.localeCompare(b.id) // Using ID as proxy for creation date
        case "popular":
          return Math.random() - 0.5 // Mock popularity with random sorting
        case "newest":
        default:
          return b.id.localeCompare(a.id) // Using ID as proxy for creation date
      }
    })

    setFilteredProducts(filtered)
    setPage(1)
  }, [searchQuery, selectedCategory, sortBy, products])

  const handleAddToCart = (productId: string) => {
    console.log("Added to cart:", productId)
    // Add toast notification here
  }

  const handleToggleLike = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        condition: product.condition,
        image: product.image,
        seller: product.seller,
        location: product.location,
      })
    }
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

  // Group products based on groupBy setting
  const getGroupedProducts = () => {
    if (groupBy === "none") {
      return { "All Products": displayedProducts }
    }

    const groups: Record<string, typeof displayedProducts> = {}
    
    displayedProducts.forEach((product) => {
      let groupKey = ""
      
      switch (groupBy) {
        case "category":
          groupKey = product.category
          break
        case "condition":
          groupKey = product.condition
          break
        case "price":
          if (product.price < 100) groupKey = "Under $100"
          else if (product.price < 500) groupKey = "$100 - $500"
          else if (product.price < 1000) groupKey = "$500 - $1000"
          else groupKey = "Over $1000"
          break
        default:
          groupKey = "All Products"
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(product)
    })
    
    return groups
  }

  const groupedProducts = getGroupedProducts()

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {displayedProducts.length} of {filteredProducts.length} products
        </p>
      </div>

      {/* Product Grid */}
      <div className="space-y-8">
        {Object.entries(groupedProducts).map(([groupName, groupProducts], groupIndex) => (
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
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groupProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (groupIndex * 0.1) + (index * 0.1) }}
                >
                  <ProductCard product={product} onAddToCart={handleAddToCart} onToggleLike={handleToggleLike} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

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
