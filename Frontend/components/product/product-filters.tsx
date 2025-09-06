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
        const backendCategories = await ProductService.getCategories();
        setCategories(["All", ...backendCategories]);
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
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
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
        }}
        className="overflow-hidden md:overflow-visible"
      >
        <div className="flex flex-col md:flex-row gap-4 p-4 md:p-0 bg-card md:bg-transparent rounded-lg md:rounded-none border md:border-none">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Category
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-between bg-transparent"
                >
                  {selectedCategory}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={selectedCategory === category ? "bg-accent" : ""}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sort Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Sort By
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-between bg-transparent"
                >
                  <SortAsc className="h-4 w-4 mr-2" />
                  {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                    "Newest First"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className={sortBy === option.value ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Group By Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Group By
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-between bg-transparent"
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  {groupByOptions.find((opt) => opt.value === groupBy)?.label ||
                    "No Grouping"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {groupByOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onGroupByChange(option.value)}
                    className={groupBy === option.value ? "bg-accent" : ""}
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
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Active:</span>
              {selectedCategory !== "All" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => onCategoryChange("All")}
                >
                  {selectedCategory} ×
                </Badge>
              )}
              {sortBy !== "newest" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => onSortChange("newest")}
                >
                  {sortOptions.find((opt) => opt.value === sortBy)?.label} ×
                </Badge>
              )}
              {groupBy !== "none" && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => onGroupByChange("none")}
                >
                  {groupByOptions.find((opt) => opt.value === groupBy)?.label} ×
                </Badge>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
