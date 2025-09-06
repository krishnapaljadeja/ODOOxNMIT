"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { ProductGrid } from "@/components/product/product-grid"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} onCategoryChange={handleCategoryChange} selectedCategory={selectedCategory} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover Sustainable Treasures
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Find unique, pre-loved items and give them a new life while reducing environmental impact
          </p>
        </motion.div>

        {/* Product Grid */}
        <ProductGrid searchQuery={searchQuery} selectedCategory={selectedCategory} />
      </main>

      {/* Floating Add Product Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          asChild
          size="lg"
          className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground h-14 w-14 p-0"
        >
          <Link href="/add-product">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add new product</span>
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
