"use client";
import { useState, useEffect } from "react";
import type React from "react";
import { useRouter, useParams } from "next/navigation";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  DollarSign,
  Tag,
  FileText,
  Package,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/auth/auth-context";
import {
  ProductService,
  CreateProductData,
  Product,
} from "@/lib/product-service";
import { ImageService } from "@/lib/image-service";
import { useToast } from "@/hooks/use-toast";

// Backend supported categories
const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Sports",
  "Other",
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productId = params.id as string;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId || !isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        const response = await ProductService.getProductById(productId);
        const productData = response.message.product;

        // Check if user owns this product
        if (productData.sellerId !== user?.id) {
          setError("You can only edit your own products");
          return;
        }

        setProduct(productData);
        setFormData({
          title: productData.title,
          description: productData.description,
          category: productData.category,
          price: productData.price.toString(),
        });
        setImages(productData.images || []);
      } catch (err: any) {
        console.error("Failed to fetch product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isAuthenticated, user?.id]);

  // Show loading while checking authentication or fetching product
  if (isAuthenticated === false || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {loading ? "Loading product..." : "Loading..."}
          </p>
        </div>
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
            <div className="mt-4">
              <Button asChild>
                <Link href="/my-listings">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to My Listings
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let uploadedImageUrls: string[] = [];

      // Upload new images if any
      if (imageFiles.length > 0) {
        try {
          const uploadResponse = await ImageService.uploadImages(imageFiles);
          uploadedImageUrls = uploadResponse.message.images;
        } catch (error) {
          console.error("Image upload failed:", error);
          // Continue without new images for now
          uploadedImageUrls = [];
        }
      }

      // Prepare product data for API
      const productData: Partial<CreateProductData> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
      };

      // Only include images if we have new ones or existing ones
      const allImages = [...images, ...uploadedImageUrls];
      if (allImages.length > 0) {
        productData.images = allImages;
        productData.imageUrl = allImages[0];
      }

      // Update product via API
      const response = await ProductService.updateProduct(
        productId,
        productData
      );

      toast({
        title: "Success!",
        description: "Product updated successfully",
      });

      // Redirect to my listings
      router.push("/my-listings");
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-muted/50">
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
                <Link href="/my-listings">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to My Listings
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                Edit Product
              </h1>
              <p className="text-muted-foreground">
                Update your product information and images
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="flex items-center text-xl">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Product Title *
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter a descriptive title for your product"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product in detail. Include condition, features, and any relevant information..."
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className={`min-h-[120px] ${
                        errors.description ? "border-destructive" : ""
                      }`}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Category and Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        Category *
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger
                          className={
                            errors.category ? "border-destructive" : ""
                          }
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-destructive">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Price *
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        className={errors.price ? "border-destructive" : ""}
                      />
                      {errors.price && (
                        <p className="text-sm text-destructive">
                          {errors.price}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Images */}
                  <div className="space-y-4">
                    <Label className="flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Product Images
                    </Label>

                    {/* Existing Images */}
                    {images.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Current Images:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {images.map((image, index) => (
                            <div
                              key={index}
                              className="relative group aspect-square rounded-lg overflow-hidden border"
                            >
                              <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Image Upload */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Add New Images:
                      </p>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              Click to upload images
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG up to 5MB each
                            </p>
                          </div>
                        </Label>
                      </div>

                      {/* New Image Previews */}
                      {imageFiles.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {imageFiles.map((file, index) => (
                            <div
                              key={index}
                              className="relative group aspect-square rounded-lg overflow-hidden border"
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`New ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImageFile(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/my-listings")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Product"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
