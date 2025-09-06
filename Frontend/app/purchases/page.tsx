"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Filter, Calendar, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { PurchaseItem } from "@/components/purchases/purchase-item";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PurchaseService, Purchase } from "@/lib/purchase-service";
import { useAuth } from "@/components/auth/auth-context";

export default function PurchasesPage() {
  const { user, isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch purchase history
  useEffect(() => {
    const fetchPurchases = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await PurchaseService.getPurchaseHistory();
        setPurchases(response.message.purchases);
      } catch (err: any) {
        console.error("Failed to fetch purchases:", err);
        setError(err.message || "Failed to load purchase history");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [isAuthenticated]);

  const filteredPurchases = purchases
    .filter(
      (purchase) => statusFilter === "all" || purchase.status === statusFilter
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.purchaseDate).getTime() -
          new Date(a.purchaseDate).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.purchaseDate).getTime() -
          new Date(b.purchaseDate).getTime()
        );
      } else if (sortBy === "highest") {
        return b.totalAmount - a.totalAmount;
      } else if (sortBy === "lowest") {
        return a.totalAmount - b.totalAmount;
      }
      return 0;
    });

  const totalSpent = purchases.reduce(
    (sum, purchase) => sum + purchase.totalAmount,
    0
  );
  const totalOrders = purchases.length;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Loading purchase history...
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    );
  }

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
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Purchase History
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your orders and manage your sustainable purchases
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {totalOrders}
                  </p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{totalSpent.toFixed(2)}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    ₹
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Items Saved
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round((totalSpent * 0.3) / 10) * 10} lbs CO₂
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-sm">
                    🌱
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Filter:
                </span>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Sort:
                </span>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Amount</SelectItem>
                  <SelectItem value="lowest">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Purchase List */}
          {filteredPurchases.length > 0 ? (
            <motion.div layout className="space-y-4">
              {filteredPurchases.map((purchase, index) => (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <PurchaseItem purchase={purchase} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  No orders found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {statusFilter === "all"
                    ? "You haven't made any purchases yet"
                    : `No orders with status "${statusFilter}"`}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <a href="/">Start Shopping</a>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
