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

        <main className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-20 relative"
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
                <span className="relative inline-block">
                  <span className="absolute -inset-1 blur-xl bg-primary/20 rounded-full"></span>
                  <span className="relative">Discover</span>
                </span>{" "}
                <span className="relative inline-block">
                  <span className="absolute -inset-1 blur-xl bg-green-500/20 rounded-full"></span>
                  <span className="relative">Sustainable</span>
                </span>
                <br />
                <motion.span 
                  className="bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent relative inline-block"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Treasures
                </motion.span>
              </h1>

              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed mb-10 relative"
              >
                <span className="absolute -inset-1 blur-3xl bg-primary/5 rounded-full"></span>
                <span className="relative">Find unique, pre-loved items and give them a new life while reducing environmental impact</span>
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-8 mt-16">
                {[
                  { number: "10K+", label: "Happy Customers", icon: "👥", color: "from-primary/20 to-primary/5" },
                  { number: "50K+", label: "Items Saved", icon: "🌱", color: "from-green-500/20 to-green-500/5" },
                  { number: "95%", label: "Satisfaction Rate", icon: "⭐", color: "from-yellow-500/20 to-yellow-500/5" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center relative group"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${stat.color} blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70`}></div>
                    <div className="relative bg-card/30 backdrop-blur-sm border border-primary/10 rounded-2xl px-8 py-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <div className="text-3xl md:text-4xl mb-2">{stat.icon}</div>
                      <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent mb-2">
                        <motion.span
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                        >
                          {stat.number}
                        </motion.span>
                      </div>
                      <div className="text-sm font-medium text-foreground/80">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-12 max-w-5xl mx-auto"
          >
            <div className="bg-card/60 backdrop-blur-md border border-primary/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
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
            className="relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tl from-primary/5 to-transparent rounded-full blur-3xl"></div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mb-8 text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground inline-block relative">
                <span className="absolute -inset-1 blur-lg bg-primary/10 rounded-full"></span>
                <span className="relative">Explore Our Collection</span>
              </h2>
            </motion.div>
            
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
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }} 
            className="relative group"
          >
            {/* Multiple pulsing background effects */}
            <motion.div
              className="absolute inset-0 bg-primary rounded-full blur-md"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 bg-green-500 rounded-full blur-md"
              animate={{
                scale: [1.1, 1.4, 1.1],
                opacity: [0.2, 0.1, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />

            <Button
              asChild
              size="lg"
              className="relative rounded-full shadow-2xl bg-gradient-to-r from-primary to-green-500 hover:from-green-500 hover:to-primary text-primary-foreground h-16 w-16 p-0 border-2 border-primary-foreground/20 backdrop-blur-sm transition-all duration-500 group-hover:shadow-primary/20 group-hover:shadow-2xl"
            >
              <Link href="/add-product">
                <motion.div 
                  whileHover={{ rotate: 90 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center justify-center"
                >
                  <Plus className="h-7 w-7" />
                </motion.div>
                <span className="sr-only">Add new product</span>
              </Link>
            </Button>
            
            {/* Tooltip */}
            <div className="absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-card/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-lg shadow-lg text-sm whitespace-nowrap">
                Add Product
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
