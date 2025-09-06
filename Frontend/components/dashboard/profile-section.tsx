"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Save, User, Mail, Calendar, Edit2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

  // Simplified animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      setIsLoading(true)
      try {
        const response = await AuthService.getProfile()
        if (response.success && response.data?.user) {
          const userData = response.data.user as any
          setProfile({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            joinedDate: userData.joinedDate || new Date().toISOString(),
            avatar: userData.avatar || "/placeholder-user.jpg",
            stats: userData.stats,
            recentProducts: userData.recentProducts,
            recentPurchases: userData.recentPurchases
          })
        } else {
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
          setProfile((prev) => ({ ...prev, avatar: event.target.result as string }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) {
    return (
      <Card className="border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground">Loading profile...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <motion.div
            {...fadeInUp}
            className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-muted/30 rounded-lg border"
          >
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.username} />
                <AvatarFallback className="text-xl font-semibold">
                  {profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
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
            
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h3 className="text-2xl font-semibold">{profile.username}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Member since {profile.joinedDate}</span>
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                <div className="h-2 w-2 bg-primary rounded-full" />
                Active Member
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            {...fadeInUp}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username *
                </Label>
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="username-edit"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Input
                        id="username"
                        value={profile.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className={errors.username ? "border-destructive" : ""}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="username-display"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-muted/50 border rounded-md"
                    >
                      <span className="font-medium">{profile.username}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {errors.username}
                  </motion.p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address *
                </Label>
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="email-edit"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={errors.email ? "border-destructive" : ""}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="email-display"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-muted/50 border rounded-md"
                    >
                      <span className="font-medium">{profile.email}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-3 pt-4"
                >
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}