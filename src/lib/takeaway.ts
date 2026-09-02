import { DELIVERY } from './config'
import type { Dish } from './menu.types'

export interface CartLine {
  dish: Dish
  quantity: number
}

export type Cart = CartLine[]

export interface CartContact {
  name: string
  phone: string
  pickupTime: string
  note: string
}

export function addToCart(cart: Cart, dish: Dish, quantity = 1): Cart {
  const existing = cart.find((line) => line.dish.id === dish.id)
  if (existing) {
    return cart.map((line) =>
      line.dish.id === dish.id ? { ...line, quantity: line.quantity + quantity } : line,
    )
  }
  return [...cart, { dish, quantity }]
}

export function removeFromCart(cart: Cart, dishId: string): Cart {
  return cart.filter((line) => line.dish.id !== dishId)
}

export function setQuantity(cart: Cart, dishId: string, quantity: number): Cart {
  if (quantity <= 0) {
    return removeFromCart(cart, dishId)
  }
  return cart.map((line) => (line.dish.id === dishId ? { ...line, quantity } : line))
}

export function cartTotal(cart: Cart): number {
  return cart.reduce((sum, line) => sum + line.dish.price * line.quantity, 0)
}

export function cartCount(cart: Cart): number {
  return cart.reduce((sum, line) => sum + line.quantity, 0)
}

export function freeDeliveryThreshold(): number {
  return DELIVERY.freeDeliveryThreshold
}

export function freeDeliveryReached(total: number): boolean {
  return total >= freeDeliveryThreshold()
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

export interface Order {
  items: { name: string; quantity: number; price: number; total: number }[]
  total: number
  freeDelivery: boolean
  contact: CartContact
}

export function buildOrder(cart: Cart, contact: CartContact): Order {
  const total = cartTotal(cart)
  return {
    items: cart.map((line) => ({
      name: line.dish.name.de,
      quantity: line.quantity,
      price: line.dish.price,
      total: line.dish.price * line.quantity,
    })),
    total,
    freeDelivery: freeDeliveryReached(total),
    contact,
  }
}
