"use client"
import { motion } from "framer-motion"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  category: string
  condition: string
  image: string
  seller: string
  location: string
  isLiked?: boolean
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
  onToggleLike?: (productId: string) => void
}

export function ProductCard({ product, onAddToCart, onToggleLike }: ProductCardProps) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group">
      <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow duration-200">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
              -{discountPercentage}%
            </Badge>
          )}

          {/* Condition Badge */}
          <Badge className="absolute top-2 right-2">{product.condition}</Badge>

          {/* Like Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-card/90 backdrop-blur-sm hover:bg-card"
            onClick={() => onToggleLike?.(product.id)}
          >
            <Heart className={`h-4 w-4 ${product.isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-foreground line-clamp-2 text-sm">{product.title}</h3>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-foreground">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{product.seller}</span>
              <span>{product.location}</span>
            </div>

            <Button
              onClick={() => onAddToCart?.(product.id)}
              className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
