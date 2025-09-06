"use client";
import { useState, useEffect } from "react";
import type React from "react";
import { useRouter } from "next/navigation";

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
import { useAuth } from "@/components/auth/auth-context";
import { ProductService, CreateProductData } from "@/lib/product-service";
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

export default function AddProductPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

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

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Show loading while checking authentication
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
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

      // Upload images if any
      if (imageFiles.length > 0) {
        try {
          const uploadResponse = await ImageService.uploadImages(imageFiles);
          uploadedImageUrls = uploadResponse.message.images;
        } catch (error) {
          console.error("Image upload failed:", error);
          // Continue without images for now
          uploadedImageUrls = [];
        }
      }

      // Prepare product data for API
      const productData: CreateProductData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        images:
          uploadedImageUrls && uploadedImageUrls.length > 0
            ? uploadedImageUrls
            : undefined,
        imageUrl:
          uploadedImageUrls && uploadedImageUrls.length > 0
            ? uploadedImageUrls[0]
            : undefined,
      };

      // Create product via API
      const response = await ProductService.createProduct(productData);

      toast({
        title: "Success!",
        description: "Product created successfully",
      });

      // Redirect to my listings
      router.push("/my-listings");
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create product. Please try again.",
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

    // Limit to 5 images
    if (files.length + imageFiles.length > 5) {
      toast({
        title: "Too many images",
        description: "Maximum 5 images allowed",
        variant: "destructive",
      });
      return;
    }

    // Store files for upload
    setImageFiles((prev) => [...prev, ...files]);

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
            <Link
              href="/products"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <div className="text-center">
              <h1 className="font-heading text-4xl font-bold text-foreground mb-3">
                List Your Item
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Share your pre-loved items with the EcoFinds community and give
                them a new life
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Unified Product Form Card */}
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Package className="h-6 w-6 text-primary" />
                    Product Information
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Fill in all the details about your item to create an
                    attractive listing
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Basic Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">
                        Basic Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Title */}
                      <div className="space-y-2 lg:col-span-2">
                        <Label
                          htmlFor="title"
                          className="text-sm font-semibold flex items-center gap-2"
                        >
                          <Tag className="h-4 w-4" />
                          Product Title *
                        </Label>
                        <Input
                          id="title"
                          placeholder="e.g., Vintage Leather Jacket - Brown"
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className={`h-12 text-base ${
                            errors.title ? "border-destructive" : ""
                          }`}
                        />
                        {errors.title && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive flex items-center gap-1"
                          >
                            {errors.title}
                          </motion.p>
                        )}
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Category *
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            handleInputChange("category", value)
                          }
                        >
                          <SelectTrigger
                            className={`h-12 ${
                              errors.category ? "border-destructive" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select category" />
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
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors.category}
                          </motion.p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="price"
                          className="text-sm font-semibold flex items-center gap-2"
                        >
                          <DollarSign className="h-4 w-4" />
                          Price * (₹)
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground font-bold">
                            ₹
                          </span>
                          <Input
                            id="price"
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) =>
                              handleInputChange("price", e.target.value)
                            }
                            className={`h-12 pl-10 text-base ${
                              errors.price ? "border-destructive" : ""
                            }`}
                          />
                        </div>
                        {errors.price && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-destructive"
                          >
                            {errors.price}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-semibold flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your item's condition, features, and any relevant details..."
                        rows={5}
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className={`text-base resize-none ${
                          errors.description ? "border-destructive" : ""
                        }`}
                      />
                      {errors.description && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive"
                        >
                          {errors.description}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Product Images</h3>
                    </div>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="bg-primary/10 rounded-full p-4">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">
                            Upload Product Images
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Drag and drop images here, or click to browse.
                            Upload up to 5 high-quality photos.
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                            className="bg-background hover:bg-accent"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Choose Images
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {images.length > 0 && (
                      <div className="space-y-4">
                        <Separator />
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">
                            Uploaded Images ({images.length}/5)
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {images.map((image, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                              >
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <Badge className="absolute bottom-2 left-2 text-xs">
                                  {index === 0 ? "Main" : `${index + 1}`}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex justify-center pt-6"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-md h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold text-lg shadow-lg"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-3"
                      />
                      Publishing Listing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Publish Listing
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
