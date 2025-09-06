"use client"
import { motion } from "framer-motion"
import { ShoppingCart, Truck, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "./cart-context"

interface CartSummaryProps {
  onCheckout?: () => void
  isCheckoutPage?: boolean
}

export function CartSummary({ onCheckout, isCheckoutPage = false }: CartSummaryProps) {
  const { state } = useCart()

  const shipping = state.total >= 50 ? 0 : 9.99
  const tax = state.total * 0.08 // 8% tax
  const finalTotal = state.total + shipping + tax

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Items Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({state.itemCount} items)</span>
              <span>${state.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <Truck className="h-3 w-3 mr-1" />
                Shipping
                {state.total >= 50 && <span className="ml-1 text-green-600">(Free!)</span>}
              </span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>

          {/* Free Shipping Notice */}
          {state.total < 50 && state.total > 0 && (
            <div className="bg-muted p-3 rounded-lg text-sm text-center">
              Add ${(50 - state.total).toFixed(2)} more for free shipping!
            </div>
          )}

          {/* Checkout Button */}
          {!isCheckoutPage && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onCheckout}
                disabled={state.items.length === 0}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
                size="lg"
              >
                Proceed to Checkout
              </Button>
            </motion.div>
          )}

          {/* Security Notice */}
          <div className="flex items-center justify-center text-xs text-muted-foreground pt-2">
            <Shield className="h-3 w-3 mr-1" />
            Secure checkout with 256-bit SSL encryption
          </div>

          {/* Benefits */}
          <div className="space-y-2 pt-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              30-day return policy
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Buyer protection guarantee
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Sustainable packaging
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
