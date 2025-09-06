"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { CartItemComponent } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { useCart } from "@/components/cart/cart-context"

export default function CartPage() {
  const { state } = useCart()
  const router = useRouter()

  // Removed checkout navigation - orders are now placed directly from cart

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="font-heading text-3xl font-bold text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground mt-2">
              {state.itemCount > 0
                ? `${state.itemCount} item${state.itemCount > 1 ? "s" : ""} in your cart`
                : "Your cart is empty"}
            </p>
          </motion.div>

          {state.items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <motion.div layout className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {state.items.map((item) => (
                      <CartItemComponent key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <CartSummary />
              </div>
            </div>
          ) : (
            /* Empty Cart State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Discover amazing pre-loved items and start building your sustainable collection
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/products">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Start Shopping
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
