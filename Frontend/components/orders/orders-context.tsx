"use client"
import type React from "react"
import { createContext, useContext, useState } from "react"

interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
  seller: string
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  estimatedDelivery?: string
  trackingNumber?: string
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
  }
}

interface OrdersContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "orderDate">) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  getOrderById: (orderId: string) => Order | undefined
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    items: [
      {
        id: "1",
        title: "Vintage Leather Jacket",
        price: 89,
        quantity: 1,
        image: "/vintage-brown-leather-jacket.jpg",
        seller: "Sarah M.",
      },
    ],
    total: 89,
    status: "delivered",
    orderDate: "2024-01-15",
    estimatedDelivery: "2024-01-20",
    trackingNumber: "TRK123456789",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
  },
  {
    id: "ORD-002",
    items: [
      {
        id: "2",
        title: 'MacBook Pro 13" 2019',
        price: 899,
        quantity: 1,
        image: "/macbook-pro-laptop-silver.jpg",
        seller: "Tech Store",
      },
    ],
    total: 899,
    status: "shipped",
    orderDate: "2024-01-18",
    estimatedDelivery: "2024-01-25",
    trackingNumber: "TRK987654321",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
  },
]

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mockOrders)

  const addOrder = (orderData: Omit<Order, "id" | "orderDate">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString().split("T")[0],
    }
    setOrders((prev) => [newOrder, ...prev])
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId)
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrderById,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
