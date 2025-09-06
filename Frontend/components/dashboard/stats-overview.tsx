"use client"
import { motion } from "framer-motion"
import { ShoppingBag, DollarSign, Heart, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Total Purchases",
    value: "23",
    change: "+3 this month",
    icon: ShoppingBag,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
  },
  {
    title: "Items Sold",
    value: "15",
    change: "+2 this month",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
  },
  {
    title: "Saved Items",
    value: "8",
    change: "+1 this week",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
  },
  {
    title: "Profile Views",
    value: "142",
    change: "+12 this week",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900",
  },
]

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="border-primary/10 shadow-md hover:shadow-xl transition-all duration-300 bg-card/60 backdrop-blur-sm overflow-hidden relative">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent -z-10"></div>
            
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <motion.p 
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    className="text-xs font-medium text-muted-foreground mt-2 flex items-center"
                  >
                    <motion.span 
                      initial={{ x: 0 }}
                      whileHover={{ x: 2 }}
                      className="text-primary mr-1"
                    >
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                    </motion.span>
                    {stat.change}
                  </motion.p>
                </div>
                <motion.div 
                  className={`p-3 rounded-full bg-gradient-to-br ${stat.bgColor.replace('bg-', 'from-').replace(' dark:bg-', ' to-')} to-transparent`}
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
