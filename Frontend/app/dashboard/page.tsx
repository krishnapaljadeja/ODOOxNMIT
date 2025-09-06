"use client"
import { motion } from "framer-motion"
import { User, Settings, Bell, Shield } from "lucide-react"
import { Header } from "@/components/layout/header"
import { ProfileSection } from "@/components/dashboard/profile-section"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-10 relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-70 -z-10"></div>
            <div className="absolute top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl opacity-70 -z-10"></div>
            
            <div className="relative bg-card/60 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-lg">
              <h1 className="font-heading text-4xl font-bold text-foreground">
                <span className="relative inline-block">
                  Dashboard
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-green-500 rounded-full"></span>
                </span>
              </h1>
              <p className="text-muted-foreground mt-3 max-w-xl">Manage your profile, track your EcoFinds activity, and customize your sustainable shopping experience</p>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10"></div>
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -z-10"></div>
            
            <div className="bg-card/60 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="font-heading text-xl font-semibold mb-4 flex items-center">
                <motion.span
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mr-2 p-2 rounded-full bg-primary/10 text-primary"
                >
                  <Settings className="h-5 w-5" />
                </motion.span>
                <span>Activity Overview</span>
              </h2>
              <StatsOverview />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Profile Section */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute -top-10 left-1/4 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-green-500/5 rounded-full blur-3xl -z-10"></div>
                
                <div className="bg-card/60 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h2 className="font-heading text-xl font-semibold mb-4 flex items-center">
                    <motion.span
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mr-2 p-2 rounded-full bg-primary/10 text-primary"
                    >
                      <User className="h-5 w-5" />
                    </motion.span>
                    <span>Profile Information</span>
                  </h2>
                  <ProfileSection />
                </div>
              </motion.div>
            </div>

            {/* Settings & Preferences */}
            <div className="space-y-6">
              {/* Account Settings */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                whileHover={{ y: -5 }}
                className="relative overflow-hidden"
              >
                <Card className="border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-sm overflow-hidden">
                  {/* Decorative gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10"></div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <motion.span
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 15 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="mr-2 p-2 rounded-full bg-primary/10 text-primary"
                      >
                        <Settings className="h-5 w-5" />
                      </motion.span>
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                    <motion.div 
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors duration-200"
                      whileHover={{ x: 5 }}
                    >
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive updates about your orders</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                    </motion.div>

                    <motion.div 
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors duration-200"
                      whileHover={{ x: 5 }}
                    >
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Marketing Emails</Label>
                        <p className="text-xs text-muted-foreground">Get notified about new features</p>
                      </div>
                      <Switch className="data-[state=checked]:bg-primary" />
                    </motion.div>

                    <motion.div 
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors duration-200"
                      whileHover={{ x: 5 }}
                    >
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Profile Visibility</Label>
                        <p className="text-xs text-muted-foreground">Show your profile to other users</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                whileHover={{ y: -5 }}
                className="relative overflow-hidden"
              >
                <Card className="border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-sm overflow-hidden">
                  {/* Decorative gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent -z-10"></div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <motion.span
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 15 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="mr-2 p-2 rounded-full bg-green-500/10 text-green-500"
                      >
                        <Shield className="h-5 w-5" />
                      </motion.span>
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start bg-background/50 border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 group"
                      >
                        <motion.div 
                          className="mr-2 p-1.5 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300"
                          whileHover={{ rotate: 5 }}
                        >
                          <Settings className="h-4 w-4" />
                        </motion.div>
                        Change Password
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start bg-background/50 border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 group"
                      >
                        <motion.div 
                          className="mr-2 p-1.5 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300"
                          whileHover={{ rotate: 5 }}
                        >
                          <Shield className="h-4 w-4" />
                        </motion.div>
                        Two-Factor Authentication
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start bg-background/50 border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 group"
                      >
                        <motion.div 
                          className="mr-2 p-1.5 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300"
                          whileHover={{ rotate: 5 }}
                        >
                          <User className="h-4 w-4" />
                        </motion.div>
                        Download My Data
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
             
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
