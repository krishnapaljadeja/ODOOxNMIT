"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  CheckCircle,
  Truck,
  Star,
  Calendar,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PurchaseService, Purchase } from "@/lib/purchase-service";
import { useAuth } from "@/components/auth/auth-context";

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    label: "Completed",
  },
  shipped: {
    icon: Truck,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    label: "Shipped",
  },
  processing: {
    icon: Package,
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    label: "Processing",
  },
  cancelled: {
    icon: Package,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    label: "Cancelled",
  },
};

export default function PurchaseDetailPage() {
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const purchaseId = params.id as string;

  // Fetch purchase details
  useEffect(() => {
    const fetchPurchase = async () => {
      if (!purchaseId || !isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        const response = await PurchaseService.getPurchaseDetails(purchaseId);
        setPurchase(response.message.purchase);
      } catch (err: any) {
        console.error("Failed to fetch purchase:", err);
        setError(err.message || "Failed to load purchase details");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [purchaseId, isAuthenticated]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Loading purchase details...
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error || !purchase) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive">
              <AlertDescription>
                {error || "Purchase not found"}
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button asChild>
                <Link href="/purchases">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Purchase History
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const statusInfo =
    statusConfig[purchase.status as keyof typeof statusConfig] ||
    statusConfig.completed;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/purchases">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Purchase History
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">
                  Order #{purchase.id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-muted-foreground mt-2">
                  Placed on{" "}
                  {new Date(purchase.purchaseDate).toLocaleDateString()}
                </p>
              </div>
              <Badge className={statusInfo.color}>
                <StatusIcon className="h-4 w-4 mr-2" />
                {statusInfo.label}
              </Badge>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Order Items ({purchase.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {purchase.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center space-x-4 p-4 border border-border rounded-lg"
                    >
                      <div className="w-20 h-20 rounded-md overflow-hidden border border-border flex-shrink-0">
                        <img
                          src={item.product.imageUrl || "/placeholder.svg"}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.product.id}`}>
                          <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
                            {item.product.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.product.category}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-foreground">
                            ₹{item.price} × {item.quantity}
                          </span>
                          <span className="font-medium text-foreground">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary & Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Order Date</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <StatusIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-sm text-muted-foreground">
                          {statusInfo.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        ₹{purchase.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">₹0.00</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-lg">Total</span>
                        <span className="font-bold text-lg">
                          ₹{purchase.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    {purchase.status === "completed" && (
                      <Button className="w-full" variant="outline">
                        <Star className="h-4 w-4 mr-2" />
                        Leave Review
                      </Button>
                    )}
                    {purchase.status === "shipped" && (
                      <Button className="w-full" variant="outline">
                        <Truck className="h-4 w-4 mr-2" />
                        Track Package
                      </Button>
                    )}
                    <Button className="w-full" variant="outline">
                      Download Receipt
                    </Button>
                    {purchase.status === "completed" && (
                      <Button className="w-full">Buy Again</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
