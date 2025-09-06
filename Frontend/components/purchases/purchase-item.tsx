"use client";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Purchase {
  id: string;
  buyerId: string;
  totalAmount: number;
  purchaseDate: string;
  status: string;
  items: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      title: string;
      description: string;
      category: string;
      imageUrl: string;
    };
  }[];
}

interface PurchaseItemProps {
  purchase: Purchase;
}

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

export function PurchaseItem({ purchase }: PurchaseItemProps) {
  const statusInfo =
    statusConfig[purchase.status as keyof typeof statusConfig] ||
    statusConfig.completed;
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          {/* Order Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium text-foreground">
                Order #{purchase.id.slice(-8).toUpperCase()}
              </h3>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(purchase.purchaseDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <Badge className={statusInfo.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo.label}
              </Badge>
              <p className="text-sm font-medium text-foreground mt-1">
                ${purchase.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            {purchase.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg"
              >
                <div className="w-16 h-16 rounded-md overflow-hidden border border-border flex-shrink-0">
                  <img
                    src={item.product.imageUrl || "/placeholder.svg"}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.id}`} className="block">
                    <h4 className="font-medium text-foreground line-clamp-1 hover:text-primary transition-colors">
                      {item.product.title}
                    </h4>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {item.product.category}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-medium text-foreground">
                      ${item.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-3">
              {/* {purchase.status === "completed" && (
                <Button variant="outline" size="sm">
                  <Star className="h-3 w-3 mr-1" />
                  Leave Review
                </Button>
              )} */}
              {purchase.status === "shipped" && (
                <Button variant="outline" size="sm">
                  <Truck className="h-3 w-3 mr-1" />
                  Track Package
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* <Button variant="ghost" size="sm" asChild>
                <Link href={`/purchases/${purchase.id}`}>View Details</Link> */}
              {/* </Button> */}
              {/* {purchase.status === "completed" && (
                <Button variant="outline" size="sm">
                  Buy Again
                </Button>
              )} */}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
