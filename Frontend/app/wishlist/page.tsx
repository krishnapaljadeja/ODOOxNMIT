"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/components/wishlist/wishlist-context"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const [isClearing, setIsClearing] = useState(false)

  const handleRemoveItem = (id: string) => {
    removeFromWishlist(id)
  }

  const handleClearWishlist = async () => {
    setIsClearing(true)
    // Simulate API call
    setTimeout(() => {
      clearWishlist()
      setIsClearing(false)
    }, 1000)
  }

  const handleAddToCart = (productId: string) => {
    console.log("Added to cart:", productId)
    // Add toast notification here
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-heading text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
                  <p className="text-muted-foreground">
                    {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
                  </p>
                </div>
                {wishlistItems.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleClearWishlist}
                    disabled={isClearing}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {isClearing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Clear All
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Wishlist Content */}
            {wishlistItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto">
                  <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-6">
                    Start adding items you love to your wishlist and they'll appear here
                  </p>
                  <Button asChild size="lg">
                    <Link href="/">
                      Start Shopping
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow duration-200">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />

                        {/* Discount Badge */}
                        {item.originalPrice && (
                          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                            -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                          </Badge>
                        )}

                        {/* Condition Badge */}
                        <Badge className="absolute top-2 right-2">{item.condition}</Badge>

                        {/* Remove from Wishlist Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute bottom-2 right-2 bg-card/90 backdrop-blur-sm hover:bg-card opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>

                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-foreground line-clamp-2 text-sm">{item.title}</h3>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg text-foreground">${item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{item.seller}</span>
                            <span>{item.location}</span>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={() => handleAddToCart(item.id)}
                              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                              size="sm"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
