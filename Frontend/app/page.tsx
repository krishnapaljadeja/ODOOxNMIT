"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Sparkles, Leaf, Heart } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { ProductGrid } from "@/components/product/product-grid"
import { ProductFilters } from "@/components/product/product-filters"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [groupBy, setGroupBy] = useState("none")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
  }

  const handleGroupByChange = (group: string) => {
    setGroupBy(group)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

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
  }

  const floatingIconVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
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

        <Header onSearch={handleSearch} />

        <main className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16 relative"
          >
            {/* Floating decorative icons */}
            <motion.div
              variants={floatingIconVariants}
              animate="animate"
              className="absolute -top-8 left-1/4 text-green-500/30"
            >
              <Leaf className="w-8 h-8" />
            </motion.div>
            <motion.div
              variants={floatingIconVariants}
              animate="animate"
              className="absolute -top-4 right-1/4 text-primary/30"
              style={{ animationDelay: "2s" }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            <motion.div
              variants={floatingIconVariants}
              animate="animate"
              className="absolute top-8 right-1/3 text-red-500/30"
              style={{ animationDelay: "4s" }}
            >
              <Heart className="w-7 h-7" />
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <motion.div
                className="inline-block mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-primary/10 rounded-full text-sm font-medium text-foreground border border-green-500/20 backdrop-blur-sm">
                  <Leaf className="w-4 h-4 text-green-500" />
                  Sustainable Marketplace
                </span>
              </motion.div>

              <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                Discover Sustainable
                <br />
                <span className="bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent">
                  Treasures
                </span>
              </h1>

              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed mb-8"
              >
                Find unique, pre-loved items and give them a new life while reducing environmental impact
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-8 mt-12">
                {[
                  { number: "10K+", label: "Happy Customers" },
                  { number: "50K+", label: "Items Saved" },
                  { number: "95%", label: "Satisfaction Rate" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-12"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
              <ProductFilters
                selectedCategory={selectedCategory}
                sortBy={sortBy}
                groupBy={groupBy}
                onCategoryChange={handleCategoryChange}
                onSortChange={handleSortChange}
                onGroupByChange={handleGroupByChange}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <ProductGrid
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              sortBy={sortBy}
              groupBy={groupBy}
            />
          </motion.div>
        </main>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 1,
            type: "spring",
            stiffness: 200,
            damping: 15,
            duration: 0.8,
          }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
            {/* Pulsing background effect */}
            <motion.div
              className="absolute inset-0 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <Button
              asChild
              size="lg"
              className="relative rounded-full shadow-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground h-16 w-16 p-0 border-2 border-primary-foreground/20 backdrop-blur-sm transition-all duration-300"
            >
              <Link href="/add-product">
                <motion.div whileHover={{ rotate: 90 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Plus className="h-7 w-7" />
                </motion.div>
                <span className="sr-only">Add new product</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
