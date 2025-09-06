"use client"
import { motion } from "framer-motion"
import { Minus, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "./cart-context"

interface CartItem {
  id: string
  title: string
  price: number
  image: string
  seller: string
  condition: string
  quantity: number
}

interface CartItemProps {
  item: CartItem
}

export function CartItemComponent({ item }: CartItemProps) {
  const { updateCartItemQuantity, removeFromCart } = useCart()

  const updateQuantity = async (newQuantity: number) => {
    try {
      await updateCartItemQuantity(item.id, newQuantity)
    } catch (error) {
      console.error("Failed to update quantity:", error)
    }
  }

  const removeItem = async () => {
    try {
      await removeFromCart(item.id)
    } catch (error) {
      console.error("Failed to remove item:", error)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Product Image */}
            <Link href={`/product/${item.id}`} className="flex-shrink-0">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <Link href={`/product/${item.id}`} className="block">
                <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </Link>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-muted-foreground">by {item.seller}</span>
                <Badge className="text-xs">{item.condition}</Badge>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-lg text-foreground">${item.price}</span>
                <span className="text-sm text-muted-foreground">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => updateQuantity(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <div className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">{item.quantity}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => updateQuantity(item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={removeItem}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
