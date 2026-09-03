import { atom } from 'nanostores'
import { addItem, cartCount, cartTotal, removeItem, setItemQuantity, type CartItem } from '../lib/cartStore'

export const cartItems = atom<CartItem[]>([])

const STORAGE_KEY = 'bergblick-cart'

let subscriptionInitialized = false

function persist(items: readonly CartItem[]): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
}

export function initCart(): void {
  if (typeof window === 'undefined') return

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) cartItems.set(JSON.parse(raw) as CartItem[])
  } catch {
    /* ignore corrupt storage */
  }

  if (!subscriptionInitialized) {
    subscriptionInitialized = true
    cartItems.subscribe(persist)
  }
}

export function addDish(dishId: string, name: string, price: number): void {
  cartItems.set(addItem(cartItems.get(), dishId, name, price))
}

export function removeDish(dishId: string): void {
  cartItems.set(removeItem(cartItems.get(), dishId))
}

export function changeQuantity(dishId: string, quantity: number): void {
  cartItems.set(setItemQuantity(cartItems.get(), dishId, quantity))
}

export function clearCart(): void {
  cartItems.set([])
}

export function cartCountValue(): number {
  return cartCount(cartItems.get())
}

export function cartTotalValue(): number {
  return cartTotal(cartItems.get())
}
