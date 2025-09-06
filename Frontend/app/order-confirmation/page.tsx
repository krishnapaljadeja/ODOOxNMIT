"use client"
import { motion } from "framer-motion"
import { CheckCircle, Package, Truck, Home } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderConfirmationPage() {
  const orderNumber = "ECO-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mb-8"
          >
            <div className="bg-green-100 dark:bg-green-900 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground mb-2">
              Thank you for your sustainable purchase. Your order has been successfully placed.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Order #{orderNumber} • Estimated delivery: {estimatedDelivery}
            </p>
          </motion.div>

          {/* Order Status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium">Confirmed</span>
                  </div>
                  <div className="flex-1 h-px bg-border mx-4"></div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-muted text-muted-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      <Package className="h-4 w-4" />
                    </div>
                    <span className="text-xs">Processing</span>
                  </div>
                  <div className="flex-1 h-px bg-border mx-4"></div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-muted text-muted-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      <Truck className="h-4 w-4" />
                    </div>
                    <span className="text-xs">Shipped</span>
                  </div>
                  <div className="flex-1 h-px bg-border mx-4"></div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="bg-muted text-muted-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      <Home className="h-4 w-4" />
                    </div>
                    <span className="text-xs">Delivered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/purchases">View Order Details</Link>
              </Button>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              You'll receive an email confirmation shortly with tracking information.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
