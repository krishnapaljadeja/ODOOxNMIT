"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, SortAsc, Grid3X3, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ProductService } from "@/lib/product-service";

interface ProductFiltersProps {
  selectedCategory: string;
  sortBy: string;
  groupBy: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onGroupByChange: (groupBy: string) => void;
}

// Categories will be fetched from backend

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

const groupByOptions = [
  { value: "none", label: "No Grouping" },
  { value: "category", label: "By Category" },
  { value: "condition", label: "By Condition" },
  { value: "price", label: "By Price Range" },
];

export function ProductFilters({
  selectedCategory,
  sortBy,
  groupBy,
  onCategoryChange,
  onSortChange,
  onGroupByChange,
}: ProductFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ProductService.getCategories();
        setCategories(["All", ...response.data.categories]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Fallback to default categories if API fails
        setCategories([
          "All",
          "Electronics",
          "Clothing",
          "Books",
          "Home",
          "Sports",
          "Other",
        ]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button (Mobile) */}
      <div className="flex items-center justify-between md:hidden">
        <Button
          variant="outline"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-card/90 transition-all duration-300"
        >
          <Filter className="h-4 w-4 text-primary" />
          Filters
          <ChevronDown
            className={`h-4 w-4 transition-tr
              
              ansform duration-300 ${
              isFiltersOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Filter Panel */}
      <motion.div
        initial={false}
        animate={{
          height: isFiltersOpen || window.innerWidth >= 768 ? "auto" : 0,
          opacity: isFiltersOpen || window.innerWidth >= 768 ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden md:overflow-visible"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 p-4 md:p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-primary/10 shadow-md hover:shadow-lg transition-all duration-300">
          {/* Category Filter - Horizontal Pills */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-primary/90 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => onCategoryChange(category)}
                    className={`rounded-full px-3 py-1 h-auto text-sm transition-all duration-300 ${selectedCategory === category 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "bg-background/50 hover:bg-background/80 border-primary/20 text-foreground hover:text-primary"}`}
                  >
                    {category}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-primary/90 flex items-center gap-1">
              <SortAsc className="h-3.5 w-3.5" />
              Sort By
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-between bg-background/50 hover:bg-background/80 border-primary/20 text-foreground hover:text-primary rounded-full px-4 transition-all duration-300 shadow-sm hover:shadow"
                >
                  {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                    "Newest First"}
                  <ChevronDown className="h-4 w-4 ml-2 text-primary/70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-sm border border-primary/10 shadow-lg rounded-lg overflow-hidden animate-in fade-in-80 slide-in-from-top-5">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className={`${sortBy === option.value ? "bg-primary/10 text-primary font-medium" : "hover:bg-background/80"} transition-colors duration-200`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Group By Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-primary/90 flex items-center gap-1">
              <Grid3X3 className="h-3.5 w-3.5" />
              Group By
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-between bg-background/50 hover:bg-background/80 border-primary/20 text-foreground hover:text-primary rounded-full px-4 transition-all duration-300 shadow-sm hover:shadow"
                >
                  {groupByOptions.find((opt) => opt.value === groupBy)?.label ||
                    "No Grouping"}
                  <ChevronDown className="h-4 w-4 ml-2 text-primary/70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-sm border border-primary/10 shadow-lg rounded-lg overflow-hidden animate-in fade-in-80 slide-in-from-top-5">
                {groupByOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onGroupByChange(option.value)}
                    className={`${groupBy === option.value ? "bg-primary/10 text-primary font-medium" : "hover:bg-background/80"} transition-colors duration-200`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== "All" ||
            sortBy !== "newest" ||
            groupBy !== "none") && (
            <div className="flex flex-wrap gap-2 items-center md:ml-2">
              <span className="text-sm font-medium text-primary/80 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" />
                Active:
              </span>
              {selectedCategory !== "All" && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full transition-all duration-300"
                    onClick={() => onCategoryChange("All")}
                  >
                    {selectedCategory} 
                    <X className="h-3 w-3 ml-1 inline-block" />
                  </Badge>
                </motion.div>
              )}
              {sortBy !== "newest" && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full transition-all duration-300"
                    onClick={() => onSortChange("newest")}
                  >
                    {sortOptions.find((opt) => opt.value === sortBy)?.label}
                    <X className="h-3 w-3 ml-1 inline-block" />
                  </Badge>
                </motion.div>
              )}
              {groupBy !== "none" && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full transition-all duration-300"
                    onClick={() => onGroupByChange("none")}
                  >
                    {groupByOptions.find((opt) => opt.value === groupBy)?.label}
                    <X className="h-3 w-3 ml-1 inline-block" />
                  </Badge>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
