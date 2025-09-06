"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Save, User, Mail, Calendar, Edit2, Package, ShoppingCart, DollarSign, X } from "lucide-react"
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

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      } 
    }
  }
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 15 }
    }
  }

  const cardHoverVariants = {
    rest: { scale: 1, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    hover: { 
      scale: 1.03, 
      boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08)",
      transition: { type: "spring", stiffness: 500, damping: 12 }
    }
  }

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.08, transition: { type: "spring", stiffness: 500, damping: 10 } },
    tap: { scale: 0.92 }
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
      <Card className="border-primary/10 shadow-xl overflow-hidden relative bg-card/60 backdrop-blur-sm border-2 border-opacity-20 transition-all duration-500">
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              "linear-gradient(120deg, rgba(var(--primary-rgb), 0.08) 0%, rgba(var(--primary-rgb), 0.01) 100%)",
              "linear-gradient(240deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(var(--primary-rgb), 0.01) 100%)",
              "linear-gradient(360deg, rgba(var(--primary-rgb), 0.08) 0%, rgba(var(--primary-rgb), 0.01) 100%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20"
              style={{
                width: Math.random() * 30 + 10,
                height: Math.random() * 30 + 10,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 80 - 40],
                y: [0, Math.random() * 80 - 40],
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        <CardHeader>
          <CardTitle className="flex items-center">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                boxShadow: [
                  "0 0 0 0 rgba(var(--primary-rgb), 0)",
                  "0 0 0 4px rgba(var(--primary-rgb), 0.2)",
                  "0 0 0 0 rgba(var(--primary-rgb), 0)"
                ]
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 2, ease: "linear" },
                boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" }
              }}
              className="mr-2 p-2 rounded-full bg-primary/20 text-primary"
            >
              <User className="h-5 w-5" />
            </motion.div>
            <motion.span
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
            >
              Profile Information
            </motion.span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 space-y-6">
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7],
                  rotate: [0, 360]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut" 
                }}
                className="absolute -inset-4 rounded-full bg-primary/5 blur-md"
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut" 
                }}
                className="rounded-full h-20 w-20 bg-primary/10 flex items-center justify-center relative"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary"
                />
                <motion.div 
                  animate={{ rotate: -360, scale: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center"
                >
                  <User className="h-5 w-5 text-primary" />
                </motion.div>
              </motion.div>
            </div>
            
            <div className="space-y-2 text-center">
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="text-lg font-medium text-foreground"
              >
                Loading your profile
              </motion.h3>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full mx-auto max-w-[200px]"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 0.8, repeat: Infinity, duration: 2 }}
                className="text-sm text-muted-foreground"
              >
                Preparing your dashboard experience...
              </motion.p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Card */}
      <motion.div 
        variants={itemVariants}
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="transform-gpu"
      >
        <motion.div
          variants={cardHoverVariants}
          className="overflow-hidden relative transform-gpu"
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <Card className="border-primary/10 bg-card/60 backdrop-blur-sm overflow-hidden relative border-2 border-opacity-20 hover:border-opacity-40 transition-all duration-500 shadow-2xl">
            {/* Animated background gradient */}
            <motion.div 
              className="absolute inset-0 -z-10"
              animate={{
                background: [
                  "linear-gradient(120deg, rgba(var(--primary-rgb), 0.08) 0%, rgba(var(--primary-rgb), 0.01) 100%)",
                  "linear-gradient(240deg, rgba(var(--primary-rgb), 0.12) 0%, rgba(var(--primary-rgb), 0.02) 100%)",
                  "linear-gradient(360deg, rgba(var(--primary-rgb), 0.08) 0%, rgba(var(--primary-rgb), 0.01) 100%)"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            />
            
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden -z-10">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-primary/20"
                  style={{
                    width: Math.random() * 50 + 15,
                    height: Math.random() * 50 + 15,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, Math.random() * 120 - 60],
                    y: [0, Math.random() * 120 - 60],
                    opacity: [0, 0.7, 0],
                    scale: [0, 1, 0],
                    rotate: [0, Math.random() * 360]
                  }}
                  transition={{
                    duration: Math.random() * 12 + 8,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </div>
            
            {/* Animated light effect */}
            <motion.div 
              className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-70 -z-10"
              animate={{
                x: [0, 30, 0, -30, 0],
                y: [0, -30, 0, 30, 0],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-70 -z-10"
              animate={{
                x: [0, -30, 0, 30, 0],
                y: [0, 30, 0, -30, 0],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: 5
              }}
            />
            
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <motion.span
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 15, scale: 1.1, backgroundColor: "rgba(var(--primary-rgb), 0.2)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="mr-2 p-2 rounded-full bg-primary/10 text-primary"
                  >
                    <User className="h-5 w-5" />
                  </motion.span>
                  <motion.span
                    initial={{ y: 0 }}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    Profile Information
                  </motion.span>
                </CardTitle>
                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.div 
                      key="edit-button"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <motion.div 
                        variants={buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditing(true)}
                          className="bg-background/50 border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden relative"
                        >
                          <motion.span 
                            className="absolute inset-0 bg-primary/5 -z-10"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "0%" }}
                            transition={{ type: "tween", ease: "easeInOut" }}
                          />
                          <motion.span 
                            whileHover={{ rotate: 15 }}
                            className="mr-2 text-primary"
                          >
                            <Edit2 className="h-4 w-4" />
                          </motion.span>
                          Edit Profile
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
            {/* Avatar Section */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-6 sm:space-y-0 bg-background/40 p-6 rounded-2xl border border-primary/10 shadow-inner relative overflow-hidden"
              variants={itemVariants}
              layout
              whileHover={{ boxShadow: "0 10px 30px -5px rgba(var(--primary-rgb), 0.2)" }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {/* Background animation for avatar section */}
              <motion.div 
                className="absolute inset-0 -z-10 opacity-30"
                animate={{
                  background: [
                    "radial-gradient(circle at 30% 50%, rgba(var(--primary-rgb), 0.1) 0%, transparent 60%)",
                    "radial-gradient(circle at 70% 50%, rgba(var(--primary-rgb), 0.1) 0%, transparent 60%)"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
              />
              
              {/* Avatar container with enhanced animations */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {/* Animated glow effect */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    scale: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                    opacity: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                    rotate: { repeat: Infinity, duration: 10, ease: "easeInOut" }
                  }}
                  className="absolute -inset-3 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 rounded-full blur-md -z-10"
                />
                
                {/* Pulsing ring animation */}
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0px rgba(var(--primary-rgb), 0.3)",
                      "0 0 0 8px rgba(var(--primary-rgb), 0.1)",
                      "0 0 0 0px rgba(var(--primary-rgb), 0.3)"
                    ],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    boxShadow: { duration: 2.5, repeat: Infinity, repeatType: "loop" },
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                  }}
                  className="rounded-full p-1"
                >
                  {/* Spinning border effect */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="rounded-full p-0.5 bg-gradient-to-r from-primary/50 via-primary/20 to-primary/50"
                  >
                    <Avatar className="h-32 w-32 border-2 border-primary/30 shadow-xl">
                      <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.username} className="object-cover" />
                      <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary/30 to-primary/10">
                        {profile.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </motion.div>
                
                {/* Edit avatar overlay */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1.1, rotate: 5 }}
                      className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <motion.div 
                        whileHover={{ scale: 1.3, rotate: 10 }} 
                        whileTap={{ scale: 0.8 }}
                        animate={{ 
                          boxShadow: [
                            "0 0 0 0 rgba(255, 255, 255, 0.7)",
                            "0 0 0 10px rgba(255, 255, 255, 0)",
                            "0 0 0 0 rgba(255, 255, 255, 0)"
                          ]
                        }}
                        transition={{ 
                          boxShadow: { repeat: Infinity, duration: 1.5 },
                          scale: { type: "spring", stiffness: 400 }
                        }}
                        className="bg-primary p-3 rounded-full"
                      >
                        <Camera className="h-7 w-7 text-white" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* User info with enhanced animations */}
              <div className="flex-1 text-center sm:text-left space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <motion.h3 
                    variants={itemVariants} 
                    className="font-heading text-3xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
                    whileHover={{ scale: 1.05, x: 5 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {profile.username}
                  </motion.h3>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants} 
                  className="text-muted-foreground flex items-center mt-4 text-sm justify-center sm:justify-start"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <motion.span 
                    whileHover={{ rotate: 30, scale: 1.3, backgroundColor: "rgba(var(--primary-rgb), 0.3)" }} 
                    whileTap={{ scale: 0.9 }}
                    className="mr-2 p-2 rounded-full bg-primary/15 text-primary shadow-sm"
                  >
                    <Calendar className="h-4 w-4" />
                  </motion.span>
                  <motion.span
                    whileHover={{ y: -2, x: 2 }}
                    transition={{ type: "spring", stiffness: 500 }}
                    className="font-medium"
                  >
                    Member since {profile.joinedDate}
                  </motion.span>
                </motion.div>
                
                {/* Additional user badge - new element */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="mt-4 inline-flex sm:justify-start justify-center w-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs font-medium text-primary inline-flex items-center space-x-1 shadow-sm"
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="h-3 w-3 rounded-full bg-primary/50 mr-1"
                    />
                    <span>Active Member</span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Form Section */}
            <motion.div 
              className="space-y-6 mt-8" 
              variants={itemVariants}
              layout
            >
              {/* Form header - new element */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="relative overflow-hidden bg-primary/5 rounded-xl p-4 border border-primary/10 shadow-inner"
              >
                <motion.div 
                  className="absolute inset-0 -z-10"
                  animate={{
                    background: [
                      "linear-gradient(60deg, rgba(var(--primary-rgb), 0.05) 0%, rgba(var(--primary-rgb), 0.01) 100%)",
                      "linear-gradient(120deg, rgba(var(--primary-rgb), 0.08) 0%, rgba(var(--primary-rgb), 0.01) 100%)",
                      "linear-gradient(180deg, rgba(var(--primary-rgb), 0.05) 0%, rgba(var(--primary-rgb), 0.01) 100%)"
                    ]
                  }}
                  transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
                />
                <h3 className="text-lg font-medium flex items-center">
                  <motion.span
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="mr-2 p-1.5 rounded-full bg-primary/15 text-primary"
                  >
                    <User className="h-5 w-5" />
                  </motion.span>
                  <span>Account Information</span>
                </h3>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                {/* Username */}
                <motion.div 
                  className="space-y-3" 
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Label htmlFor="username" className="flex items-center text-sm font-medium">
                    <motion.span 
                      whileHover={{ rotate: 15, scale: 1.2, backgroundColor: "rgba(var(--primary-rgb), 0.3)" }} 
                      whileTap={{ scale: 0.9 }}
                      className="mr-2 p-2 rounded-full bg-primary/15 text-primary shadow-sm"
                    >
                      <User className="h-3.5 w-3.5" />
                    </motion.span>
                    <motion.span
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      Username *
                    </motion.span>
                  </Label>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div 
                        key="username-edit"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(var(--primary-rgb), 0.15)" }}
                        className="relative overflow-hidden rounded-lg"
                      >
                        {/* Animated gradient background */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 -z-10"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 3, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
                        />
                        <Input
                          id="username"
                          value={profile.username}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          className={`bg-background/80 border-primary/30 shadow-md focus:border-primary/50 focus:ring-primary/30 transition-all duration-300 h-11 ${errors.username ? "border-destructive" : ""}`}
                        />
                        
                        {/* Animated focus indicator */}
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/50 rounded-full"
                          initial={{ scaleX: 0, opacity: 0 }}
                          whileHover={{ scaleX: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="username-display"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(var(--primary-rgb), 0.15)" }} 
                        className="p-3 bg-background/70 border border-primary/20 rounded-lg text-foreground shadow-md overflow-hidden relative h-11 flex items-center"
                      >
                        {/* Animated hover effect */}
                        <motion.div 
                          className="absolute inset-0 bg-primary/10 -z-10"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "0%" }}
                          transition={{ type: "tween", ease: "easeInOut" }}
                        />
                        
                        {/* Username with icon */}
                        <div className="flex items-center">
                          <motion.span 
                            className="text-primary mr-2 opacity-70"
                            whileHover={{ rotate: 15, scale: 1.2 }}
                          >
                            <User className="h-4 w-4" />
                          </motion.span>
                          <span className="font-medium">{profile.username}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {errors.username && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="text-sm text-destructive flex items-center font-medium"
                      >
                        <motion.span
                          animate={{ x: [0, 3, -3, 0] }}
                          transition={{ duration: 0.3, repeat: 3, repeatType: "mirror" }}
                          className="flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.username}
                        </motion.span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Email */}
                <motion.div 
                  className="space-y-3" 
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Label htmlFor="email" className="flex items-center text-sm font-medium">
                    <motion.span 
                      whileHover={{ rotate: 15, scale: 1.2, backgroundColor: "rgba(var(--primary-rgb), 0.3)" }} 
                      whileTap={{ scale: 0.9 }}
                      className="mr-2 p-2 rounded-full bg-primary/15 text-primary shadow-sm"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </motion.span>
                    <motion.span
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      Email Address *
                    </motion.span>
                  </Label>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div 
                        key="email-edit"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(var(--primary-rgb), 0.15)" }} 
                        className="relative overflow-hidden rounded-lg"
                      >
                        {/* Animated gradient background */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 -z-10"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 3, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
                        />
                        
                        {/* Animated mail icon */}
                        <motion.div 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60"
                          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Mail className="h-4 w-4" />
                        </motion.div>
                        
                        <Input
                          id="email"
                          value={profile.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`pl-10 bg-background/80 border-primary/30 shadow-md focus:border-primary/50 focus:ring-primary/30 transition-all duration-300 h-11 ${errors.email ? "border-destructive" : ""}`}
                        />
                        
                        {/* Animated focus indicator */}
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/50 rounded-full"
                          initial={{ scaleX: 0, opacity: 0 }}
                          whileHover={{ scaleX: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="email-display"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(var(--primary-rgb), 0.15)" }} 
                        className="p-3 bg-background/70 border border-primary/20 rounded-lg text-foreground shadow-md overflow-hidden relative h-11 flex items-center"
                      >
                        {/* Animated hover effect */}
                        <motion.div 
                          className="absolute inset-0 bg-primary/10 -z-10"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "0%" }}
                          transition={{ type: "tween", ease: "easeInOut" }}
                        />
                        
                        {/* Email with icon */}
                        <div className="flex items-center">
                          <motion.span 
                            className="text-primary mr-2 opacity-70"
                            whileHover={{ rotate: 15, scale: 1.2 }}
                          >
                            <Mail className="h-4 w-4" />
                          </motion.span>
                          <span className="font-medium">{profile.email}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className="text-sm text-destructive flex items-center font-medium"
                      >
                        <motion.span
                          animate={{ x: [0, 3, -3, 0] }}
                          transition={{ duration: 0.3, repeat: 3, repeatType: "mirror" }}
                          className="flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.email}
                        </motion.span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* Action Buttons */}
              <AnimatePresence>
                {isEditing && (
                  <motion.div 
                    className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-4 mt-8" 
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    layout
                  >
                    {/* Decorative elements */}
                    <motion.div 
                      className="absolute -left-20 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                        rotate: [0, 15, 0]
                      }}
                      transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                    />
                    
                    <motion.div
                      variants={buttonVariants}
                      initial="rest"
                      whileHover={{ scale: 1.1, y: -8, x: -5 }}
                      whileTap={{ scale: 0.9, y: 2 }}
                      transition={{ type: "spring", stiffness: 600, damping: 15 }}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        variant="default"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 w-full sm:w-auto relative overflow-hidden group h-12 px-6 rounded-lg shadow-xl"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        {/* Enhanced background animation */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary to-primary/80 -z-10"
                          animate={{ 
                            background: [
                              "linear-gradient(to right, rgba(var(--primary-rgb), 0.9), rgba(var(--primary-rgb), 1), rgba(var(--primary-rgb), 0.8))",
                              "linear-gradient(to right, rgba(var(--primary-rgb), 0.8), rgba(var(--primary-rgb), 0.9), rgba(var(--primary-rgb), 1))",
                              "linear-gradient(to right, rgba(var(--primary-rgb), 1), rgba(var(--primary-rgb), 0.8), rgba(var(--primary-rgb), 0.9))"
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        />
                        
                        {/* Enhanced hover effect */}
                        <motion.div 
                          className="absolute inset-0 bg-white/20 -z-10"
                          initial={{ x: "-100%", opacity: 0 }}
                          whileHover={{ x: "100%", opacity: 0.3 }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                        
                        {/* Glow effect on hover */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 duration-300 transition-opacity"
                          initial={{ boxShadow: "0 0 0 rgba(var(--primary-rgb), 0)" }}
                          whileHover={{ boxShadow: "0 0 25px rgba(var(--primary-rgb), 0.6)" }}
                        />
                        
                        {isSaving ? (
                          <motion.div 
                            animate={{ 
                              rotate: 360,
                              boxShadow: [
                                "0 0 0 0 rgba(255, 255, 255, 0.7)",
                                "0 0 0 10px rgba(255, 255, 255, 0)",
                                "0 0 0 0 rgba(255, 255, 255, 0)"
                              ]
                            }}
                            transition={{ 
                              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                              boxShadow: { repeat: Infinity, duration: 1.5 }
                            }}
                            className="h-6 w-6 border-3 border-t-transparent border-primary-foreground rounded-full"
                          ></motion.div>
                        ) : (
                          <motion.span 
                            className="flex items-center justify-center font-medium"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <motion.span
                              animate={{ rotate: [0, 10, 0, -10, 0] }}
                              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                              whileHover={{ rotate: 180, scale: 1.2 }}
                              className="mr-2 bg-primary-foreground/20 p-1.5 rounded-full"
                            >
                              <Save className="h-4 w-4" />
                            </motion.span>
                            <span className="relative">
                              Save Changes
                              <motion.span 
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground/30 rounded-full"
                                initial={{ scaleX: 0, opacity: 0 }}
                                whileHover={{ scaleX: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                            </span>
                          </motion.span>
                        )}
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      variants={buttonVariants}
                      initial="rest"
                      whileHover={{ scale: 1.1, y: -8, x: -5 }}
                      whileTap={{ scale: 0.9, y: 2 }}
                      transition={{ type: "spring", stiffness: 600, damping: 15 }}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                        className="border-primary/10 hover:border-destructive/30 transition-all duration-300 w-full sm:w-auto relative overflow-hidden group h-12 px-6 rounded-lg shadow-xl"
                      >
                        {/* Enhanced background animation */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-background to-destructive/5 -z-10"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        
                        {/* Enhanced hover effect */}
                        <motion.div 
                          className="absolute inset-0 bg-destructive/10 -z-10"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "0%" }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                        
                        <motion.span
                          className="flex items-center justify-center font-medium"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <motion.span
                            whileHover={{ rotate: 90, scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="mr-2 bg-destructive/10 p-1.5 rounded-full text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </motion.span>
                          <span className="relative group-hover:text-destructive transition-colors duration-300">
                            Cancel
                            <motion.span 
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-destructive/30 rounded-full"
                              initial={{ scaleX: 0, opacity: 0 }}
                              whileHover={{ scaleX: 1, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          </span>
                        </motion.span>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
