"use client"
import type React from "react"
import { motion } from "framer-motion"
import { Leaf } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-muted flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          {/* Logo and Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary rounded-full p-3">
                <Leaf className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">EcoFinds</h1>
            <p className="text-muted-foreground text-sm mt-1">Sustainable Second-Hand Marketplace</p>
          </motion.div>

          {/* Form Content */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
