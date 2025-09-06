"use client"
import { useState } from "react"
import type React from "react"
import { motion } from "framer-motion"
import { Camera, Save, User, Mail, MapPin, Calendar, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfile {
  name: string
  email: string
  bio: string
  location: string
  joinedDate: string
  avatar: string
}

const mockProfile: UserProfile = {
  name: "Sarah Mitchell",
  email: "sarah.mitchell@example.com",
  bio: "Passionate about sustainable living and finding unique vintage pieces. Love giving pre-loved items a new home!",
  location: "Brooklyn, NY",
  joinedDate: "2023-05-15",
  avatar: "/diverse-user-avatars.png",
}

export function ProfileSection() {
  const [profile, setProfile] = useState(mockProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!profile.name.trim()) newErrors.name = "Name is required"
    if (!profile.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(profile.email)) newErrors.email = "Invalid email format"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
      console.log("Profile updated:", profile)
    }, 1500)
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

  return (
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
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback className="text-lg">{profile.name.charAt(0)}</AvatarFallback>
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
            <h3 className="font-heading text-xl font-semibold text-foreground">{profile.name}</h3>
            <p className="text-muted-foreground flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              Member since {new Date(profile.joinedDate).toLocaleDateString()}
            </p>
            <p className="text-muted-foreground flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {profile.location}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md text-foreground">{profile.name}</div>
              )}
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
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

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            {isEditing ? (
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="pl-10"
                  placeholder="City, State"
                />
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-md text-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                {profile.location}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself and your interests..."
                rows={3}
              />
            ) : (
              <div className="p-3 bg-muted rounded-md text-foreground min-h-[80px]">{profile.bio}</div>
            )}
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
  )
}
