"use client"
import { useState } from "react"
import type React from "react"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, MapPin, User, Mail, Phone, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CartSummary } from "@/components/cart/cart-summary"
import { useCart } from "@/components/cart/cart-context"

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if cart is empty
  if (state.items.length === 0) {
    router.push("/cart")
    return null
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Shipping validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"

    // Payment validation
    if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required"
    if (!formData.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required"
    if (!formData.cvv.trim()) newErrors.cvv = "CVV is required"
    if (!formData.cardName.trim()) newErrors.cardName = "Cardholder name is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      dispatch({ type: "CLEAR_CART" })
      router.push("/order-confirmation")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
            <h1 className="font-heading text-3xl font-bold text-foreground">Checkout</h1>
            <p className="text-muted-foreground mt-2">Complete your sustainable purchase</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Information */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Shipping Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="firstName"
                              placeholder="John"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              className={`pl-10 ${errors.firstName ? "border-destructive" : ""}`}
                            />
                          </div>
                          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            className={errors.lastName ? "border-destructive" : ""}
                          />
                          {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                            />
                          </div>
                          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              placeholder="(555) 123-4567"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          placeholder="123 Main Street"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className={errors.address ? "border-destructive" : ""}
                        />
                        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="New York"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            className={errors.city ? "border-destructive" : ""}
                          />
                          {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            placeholder="NY"
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            className={errors.state ? "border-destructive" : ""}
                          />
                          {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input
                            id="zipCode"
                            placeholder="10001"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            className={errors.zipCode ? "border-destructive" : ""}
                          />
                          {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Payment Information */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                            className={`pl-10 ${errors.cardNumber ? "border-destructive" : ""}`}
                          />
                        </div>
                        {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                            className={errors.expiryDate ? "border-destructive" : ""}
                          />
                          {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV *</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange("cvv", e.target.value)}
                              className={`pl-10 ${errors.cvv ? "border-destructive" : ""}`}
                            />
                          </div>
                          {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name *</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={formData.cardName}
                          onChange={(e) => handleInputChange("cardName", e.target.value)}
                          className={errors.cardName ? "border-destructive" : ""}
                        />
                        {errors.cardName && <p className="text-sm text-destructive">{errors.cardName}</p>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Place Order Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-4"
                    size="lg"
                  >
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Lock className="h-5 w-5 mr-2" />
                    )}
                    {isProcessing ? "Processing Payment..." : "Place Order"}
                  </Button>
                </motion.div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CartSummary isCheckoutPage={true} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
