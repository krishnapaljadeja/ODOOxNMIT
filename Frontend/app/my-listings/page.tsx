"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Edit, Trash2, Plus, Eye } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock user listings data
const mockListings = [
  {
    id: "1",
    title: "Vintage Leather Jacket - Genuine Brown Leather",
    price: 89,
    originalPrice: 120,
    category: "Clothing",
    condition: "Good",
    image: "/vintage-brown-leather-jacket.jpg",
    status: "active",
    views: 24,
    likes: 5,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Mid-Century Modern Coffee Table - Walnut Wood",
    price: 245,
    category: "Furniture",
    condition: "Very Good",
    image: "/mid-century-walnut-coffee-table.jpg",
    status: "active",
    views: 18,
    likes: 3,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    title: "Canon EOS R5 Camera Body - Like New",
    price: 2899,
    originalPrice: 3899,
    category: "Electronics",
    condition: "Like New",
    image: "/canon-eos-r5-camera-black.jpg",
    status: "sold",
    views: 45,
    likes: 12,
    createdAt: "2024-01-05",
  },
]

export default function MyListingsPage() {
  const [listings, setListings] = useState(mockListings)

  const handleDelete = (listingId: string) => {
    setListings((prev) => prev.filter((listing) => listing.id !== listingId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "sold":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">My Listings</h1>
                <p className="text-muted-foreground mt-2">Manage your products and track their performance</p>
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/add-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Listing
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">
                  {listings.filter((l) => l.status === "active").length}
                </div>
                <p className="text-sm text-muted-foreground">Active Listings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">
                  {listings.filter((l) => l.status === "sold").length}
                </div>
                <p className="text-sm text-muted-foreground">Sold Items</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">
                  {listings.reduce((sum, l) => sum + l.views, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">
                  {listings.reduce((sum, l) => sum + l.likes, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Total Likes</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Listings Grid */}
          {listings.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className={`absolute top-2 left-2 ${getStatusColor(listing.status)}`}>
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-foreground line-clamp-2 text-sm">{listing.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-bold text-lg text-foreground">${listing.price}</span>
                            {listing.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${listing.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{listing.condition}</span>
                          <span>{listing.category}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {listing.views}
                            </span>
                            <span>❤️ {listing.likes}</span>
                          </div>
                          <span>Listed {new Date(listing.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                            <Link href={`/product/${listing.id}`}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive bg-transparent"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{listing.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(listing.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start selling your pre-loved items and contribute to a more sustainable future
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/add-product">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Listing
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
