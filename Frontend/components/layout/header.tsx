"use client";
import React, { useState } from "react"; // ✅ Correct import of React
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Added AnimatePresence
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  Leaf,
  Heart,
  Package,
  List,
  LogOut, // ✅ Added LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { useAuth } from "@/components/auth/auth-context";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state: cartState } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-primary/10 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-primary to-green-500 rounded-full p-2 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <Leaf className="h-5 w-5 text-primary-foreground animate-pulse" />
            </div>
            <motion.span
              className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              EcoFinds
            </motion.span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/70 group-hover:text-primary transition-colors duration-300" />
              <Input
                type="text"
                placeholder="Search for sustainable products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 w-full bg-card/50 border-primary/10 focus:border-primary/30 rounded-full shadow-sm group-hover:shadow-md transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="hover:bg-primary/10 transition-colors duration-300 font-medium"
              asChild
            >
              <Link href="/dashboard" className="flex items-center">
                <Package className="h-4 w-4 mr-2 text-primary" />
                Products
              </Link>
            </Button>
            
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="relative group hover:bg-primary/10 transition-colors duration-300"
              asChild
            >
              <Link href="/wishlist">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Heart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors duration-300" />
                </motion.div>
                {wishlistItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-green-500 text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                  >
                    {wishlistItems.length}
                  </motion.span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative group hover:bg-primary/10 transition-colors duration-300"
              asChild
            >
              <Link href="/cart">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors duration-300" />
                </motion.div>
                {cartState.items.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-green-500 text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                  >
                    {cartState.items.length}
                  </motion.span>
                )}
              </Link>
            </Button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    tabIndex={0}
                    className="relative h-9 w-9 rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 border-2 border-primary/20 bg-card/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 group"
                    aria-label="Open user menu"
                  >
                    <Avatar className="h-full w-full overflow-hidden">
                      <AvatarImage
                        src={user?.avatar || "/placeholder-user.jpg"}
                        alt={user?.username || "User"}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <AvatarFallback className="bg-gradient-to-r from-primary/80 to-green-500/80 text-primary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></span>
                  </motion.span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-60 bg-card/95 backdrop-blur-md border border-primary/10 shadow-xl rounded-xl overflow-hidden animate-in fade-in-80 slide-in-from-top-5"
                  align="end"
                  forceMount
                  sideOffset={8}
                >
                  <div className="px-4 py-3 border-b border-border/50">
                    <p className="text-sm font-medium text-foreground">{user?.username || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
                  </div>

                  <DropdownMenuItem asChild className="hover:bg-primary/10 focus:bg-primary/10 transition-colors duration-200">
                    <Link href="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-primary" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild className="hover:bg-primary/10 focus:bg-primary/10 transition-colors duration-200">
                    <Link href="/dashboard" className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-primary" />
                      <span>Products</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="hover:bg-primary/10 focus:bg-primary/10 transition-colors duration-200">
                    <Link href="/my-listings" className="flex items-center">
                      <List className="h-4 w-4 mr-2 text-primary" />
                      <span>My Listings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="hover:bg-primary/10 focus:bg-primary/10 transition-colors duration-200">
                    <Link href="/purchases" className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-primary" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border/50" />

                  <DropdownMenuItem
                    onClick={logout}
                    className="hover:bg-red-500/10 focus:bg-red-500/10 text-red-500 transition-colors duration-200 flex items-center"
                  >
                    <motion.span
                      className="flex items-center w-full"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      Logout
                    </motion.span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="bg-card/60 backdrop-blur-sm border-primary/10 shadow-md hover:shadow-lg hover:bg-card/80 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <motion.div animate={{ rotate: isMobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                {isMobileMenuOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
              </motion.div>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-primary/10 py-4 space-y-4 bg-card/80 backdrop-blur-md shadow-inner"
            >
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative px-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/70" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 bg-background/50 border-primary/10 focus:border-primary/30 shadow-sm hover:shadow focus:shadow-md transition-all duration-300"
                  />
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-4 px-4">
                <div className="flex items-center justify-between bg-background/50 p-3 rounded-xl border border-primary/10 shadow-sm">
                  <p className="text-sm font-medium text-foreground">Quick Actions</p>
                  <div className="flex items-center space-x-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <ThemeToggle />
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="relative bg-background/50 border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 group"
                        asChild
                      >
                        <Link href="/wishlist">
                          <Heart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors duration-300" />
                          {wishlistItems.length > 0 && (
                            <motion.span
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-green-500 text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                            >
                              {wishlistItems.length}
                            </motion.span>
                          )}
                        </Link>
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="relative bg-background/50 border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 group"
                        asChild
                      >
                        <Link href="/cart">
                          <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-primary transition-colors duration-300" />
                          {cartState.items.length > 0 && (
                            <motion.span
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-green-500 text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                            >
                              {cartState.items.length}
                            </motion.span>
                          )}
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {user && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-background/50 border border-primary/10 shadow-sm">
                      <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm overflow-hidden">
                        <AvatarImage
                          src={user?.avatar || "/placeholder-user.jpg"}
                          alt={user?.username || "User"}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-r from-primary/80 to-green-500/80 text-primary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-600 border border-green-500/30">
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          asChild
                          className="w-full bg-background/50 border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                          <Link href="/dashboard" className="flex items-center justify-center">
                            <User className="h-4 w-4 mr-2 text-primary" />
                            <span>Profile</span>
                          </Link>
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          asChild
                          className="w-full bg-background/50 border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                          <Link href="/my-listings" className="flex items-center justify-center">
                            <List className="h-4 w-4 mr-2 text-primary" />
                            <span>Listings</span>
                          </Link>
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          asChild
                          className="w-full bg-background/50 border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                          <Link href="/purchases" className="flex items-center justify-center">
                            <Package className="h-4 w-4 mr-2 text-primary" />
                            <span>Orders</span>
                          </Link>
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          className="w-full bg-background/50 border-red-500/10 text-red-500 shadow-sm hover:shadow-md hover:bg-red-500/10 transition-all duration-300 group"
                          onClick={logout}
                        >
                          <LogOut className="h-4 w-4 mr-2 text-red-500" />
                          <span>Logout</span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
