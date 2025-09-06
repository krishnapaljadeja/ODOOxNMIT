"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { motion } from "framer-motion"
import { Camera, Save, User, Mail, Calendar, Edit2, Package, ShoppingCart, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-context"
import { AuthService } from "@/lib/auth-service"

interface UserProfile {
  id: string
  username: string
  email: string
  joinedDate: string
  avatar?: string
  stats?: {
    totalProducts: number
    totalPurchases: number
    totalSpent: number
  }
  recentProducts?: Array<{
    id: string
    title: string
    price: number
    category: string
    createdAt: string
  }>
  recentPurchases?: Array<{
    id: string
    totalAmount: number
    purchaseDate: string
    status: string
  }>
}

export function ProfileSection() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    username: "",
    email: "",
    joinedDate: "",
    avatar: "/placeholder-user.jpg",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      
      setIsLoading(true)
      try {
        const response = await AuthService.getProfile()
        if (response.success && response.data?.user) {
          const userData = response.data.user as any // Backend returns extended user data
          setProfile({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            joinedDate: userData.joinedDate || new Date().toISOString(),
            avatar: userData.avatar || '/placeholder-user.jpg',
            stats: userData.stats,
            recentProducts: userData.recentProducts,
            recentPurchases: userData.recentPurchases
          })
        } else {
          // Fallback to basic user data if profile fetch fails
          setProfile({
            id: user.id,
            username: user.username || "",
            email: user.email || "",
            joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
            avatar: user.avatar || "/placeholder-user.jpg",
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        // Fallback to basic user data
        setProfile({
          id: user.id,
          username: user.username || "",
          email: user.email || "",
          joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          avatar: user.avatar || "/placeholder-user.jpg",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user])
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!profile.username.trim()) newErrors.username = "Username is required"
    if (!profile.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(profile.email)) newErrors.email = "Invalid email format"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)

    try {
      const response = await AuthService.updateProfile({
        username: profile.username,
        email: profile.email,
      })
  
      if (response.success && response.data?.user) {
        const userData = response.data.user as any
        setProfile((prev) => ({ ...prev, ...userData }))
        setIsEditing(false)
        // User data is automatically updated in localStorage by AuthService
        console.log("Profile successfully updated:", response.data.user)
      } else {
        console.error("Profile update failed:", response.message)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfile((prev) => ({ ...prev, avatar: event.target!.result as string }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading profile...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.username} />
              <AvatarFallback className="text-lg">{profile.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Camera className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-xl font-semibold text-foreground">{profile.username}</h3>
            <p className="text-muted-foreground flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              Member since {profile.joinedDate}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              {isEditing ? (
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={errors.username ? "border-destructive" : ""}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md text-foreground">{profile.username}</div>
              )}
              {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              {isEditing ? (
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  />
                </div>
              ) : (
                <div className="p-3 bg-muted rounded-md text-foreground flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  {profile.email}
                </div>
              )}
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 pt-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
                {isSaving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
              Cancel
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>

    {/* Statistics Cards */}
    {profile.stats && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Products Listed</p>
                <p className="text-2xl font-bold">{profile.stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Purchases Made</p>
                <p className="text-2xl font-bold">{profile.stats.totalPurchases}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${profile.stats.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )}

    {/* Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Products */}
      {profile.recentProducts && profile.recentProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Recent Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${product.price}</p>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Purchases */}
      {profile.recentPurchases && profile.recentPurchases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Recent Purchases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Purchase #{purchase.id.slice(-8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${purchase.totalAmount.toFixed(2)}</p>
                    <Badge 
                      variant={purchase.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {purchase.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  </div>
  )
}
