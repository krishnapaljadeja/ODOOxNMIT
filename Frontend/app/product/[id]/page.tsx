"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, ShoppingCart, Share2, MapPin, Calendar, Eye } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock product data - in real app, this would come from API
const mockProduct = {
  id: "1",
  title: "Vintage Leather Jacket - Genuine Brown Leather",
  price: 89,
  originalPrice: 120,
  category: "Clothing",
  condition: "Good",
  images: [
    "/vintage-brown-leather-jacket.jpg",
    "/vintage-brown-leather-jacket.jpg",
    "/vintage-brown-leather-jacket.jpg",
  ],
  description: `This beautiful vintage leather jacket is made from genuine brown leather and has been well-maintained. Perfect for adding a classic touch to any outfit.

Features:
• Genuine leather construction
• Classic brown color that goes with everything
• Multiple pockets for convenience
• Comfortable fit
• Timeless vintage style

The jacket shows minimal signs of wear and has been stored in a smoke-free environment. A few minor scuffs add to its authentic vintage character.`,
  seller: {
    name: "Sarah M.",
    avatar: "/diverse-user-avatars.png",
    rating: 4.8,
    totalSales: 23,
    location: "Brooklyn, NY",
    joinedDate: "2023-05-15",
  },
  stats: {
    views: 124,
    likes: 18,
    watchers: 5,
  },
  listedDate: "2024-01-15",
  isLiked: false,
}

export default function ProductDetailPage() {
  const params = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(mockProduct.isLiked)
  const [quantity, setQuantity] = useState(1)

  const discountPercentage = mockProduct.originalPrice
    ? Math.round(((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    console.log("Added to cart:", { productId: params.id, quantity })
    // Add toast notification here
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockProduct.title,
        text: `Check out this ${mockProduct.category.toLowerCase()} on EcoFinds`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Add toast notification here
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square overflow-hidden rounded-lg border border-border">
                  <img
                    src={mockProduct.images[selectedImage] || "/placeholder.svg"}
                    alt={mockProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                {mockProduct.images.length > 1 && (
                  <div className="flex space-x-2">
                    {mockProduct.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square w-20 overflow-hidden rounded-md border-2 transition-colors ${
                          selectedImage === index ? "border-primary" : "border-border"
                        }`}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="space-y-6">
                {/* Title and Price */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{mockProduct.title}</h1>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsLiked(!isLiked)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mb-4">
                    <span className="font-bold text-3xl text-foreground">${mockProduct.price}</span>
                    {mockProduct.originalPrice && (
                      <>
                        <span className="text-xl text-muted-foreground line-through">${mockProduct.originalPrice}</span>
                        <Badge className="bg-destructive text-destructive-foreground">-{discountPercentage}%</Badge>
                      </>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {mockProduct.stats.views} views
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {mockProduct.stats.likes} likes
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Listed {new Date(mockProduct.listedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">{mockProduct.category}</Badge>
                  <Badge>{mockProduct.condition}</Badge>
                </div>

                {/* Add to Cart */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleAddToCart}
                          size="lg"
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Add to Cart
                        </Button>
                      </motion.div>
                      <p className="text-xs text-muted-foreground text-center">
                        Free shipping on orders over $50 • 30-day return policy
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Seller Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={mockProduct.seller.avatar || "/placeholder.svg"}
                          alt={mockProduct.seller.name}
                        />
                        <AvatarFallback>{mockProduct.seller.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{mockProduct.seller.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>⭐ {mockProduct.seller.rating}</span>
                          <span>•</span>
                          <span>{mockProduct.seller.totalSales} sales</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {mockProduct.seller.location}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>

          {/* Product Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Card>
              <CardContent className="p-6">
                <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Description</h2>
                <div className="prose prose-sm max-w-none text-foreground">
                  {mockProduct.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
