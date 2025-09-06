"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Share2,
  MapPin,
  Calendar,
  Eye,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProductService, Product } from "@/lib/product-service";
import { useCart } from "@/components/cart/cart-context";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const { state: cartState, dispatch } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const productId = params.id as string;

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await ProductService.getProductById(productId);
        setProduct(response.message.product);
      } catch (err: any) {
        console.error("Failed to fetch product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading product...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Alert variant="destructive">
              <AlertDescription>
                {error || "Product not found"}
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button asChild>
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const discountPercentage = 0; // No original price in current schema

  const handleAddToCart = () => {
    if (product) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.imageUrl || product.images?.[0] || "/placeholder.svg",
          seller: product.seller.username,
          condition: "Good", // Default condition since not in schema
        },
      });
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart`,
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this ${product.category.toLowerCase()} on EcoFinds`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square overflow-hidden rounded-lg border border-border">
                  <img
                    src={
                      product.images?.[selectedImage] ||
                      product.imageUrl ||
                      "/placeholder.svg"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <div className="flex space-x-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square w-20 overflow-hidden rounded-md border-2 transition-colors ${
                          selectedImage === index
                            ? "border-primary"
                            : "border-border"
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-6">
                {/* Title and Price */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                      {product.title}
                    </h1>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsLiked(!isLiked)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isLiked ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
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
                    <span className="font-bold text-3xl text-foreground">
                      ₹{product.price}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Listed {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">{product.category}</Badge>
                </div>

                {/* Product Description */}
                <Card>
                  <CardContent className="p-4">
                    <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
                      Description
                    </h2>
                    <div className="prose prose-sm max-w-none text-foreground">
                      {product.description
                        .split("\n")
                        .map((paragraph, index) => (
                          <p
                            key={index}
                            className="mb-3 last:mb-0 whitespace-pre-line text-sm leading-relaxed"
                          >
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Seller Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src="/placeholder-user.jpg"
                          alt={product.seller.username}
                        />
                        <AvatarFallback>
                          {product.seller.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {product.seller.username}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Seller</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profile/${product.seller.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Add to Cart */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
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
                        Free shipping on orders over ₹50 • 30-day return policy
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
