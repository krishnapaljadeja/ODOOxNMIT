"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  Bell,
  Shield,
  Search,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductFilters } from "@/components/product/product-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [groupBy, setGroupBy] = useState("none");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handleGroupByChange = (group: string) => {
    setGroupBy(group);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <Header onSearch={(query) => setSearchQuery(query)} />

      <main className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-10 relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-70 -z-10"></div>
          <div className="absolute top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl opacity-70 -z-10"></div>

          <motion.div
            variants={itemVariants}
            className="relative bg-card/60 backdrop-blur-sm border border-primary/10 rounded-xl p-4 shadow-lg"
          >
            <h1 className="font-heading text-4xl font-bold text-foreground">
              <span className="relative inline-block">
                Products Marketplace
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-green-500 rounded-full"></span>
              </span>
            </h1>
            {/* <p className="text-muted-foreground mt-3 max-w-xl">Browse our collection of sustainable and pre-loved items</p> */}
          </motion.div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-card/60 backdrop-blur-sm border border-primary/10 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 bg-background/50 border-primary/10 focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Button
                variant="outline"
                className="bg-background/50 border-primary/10 hover:bg-primary/5"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <motion.div
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </motion.div>
              </Button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                >
                  <ProductFilters
                    selectedCategory={selectedCategory}
                    sortBy={sortBy}
                    groupBy={groupBy}
                    onCategoryChange={handleCategoryChange}
                    onSortChange={handleSortChange}
                    onGroupByChange={handleGroupByChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div variants={itemVariants} className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tl from-primary/5 to-transparent rounded-full blur-3xl"></div>

          <ProductGrid
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            groupBy={groupBy}
          />
        </motion.div>
      </main>
    </div>
  );
}
