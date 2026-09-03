export interface CartItem {
  dishId: string
  name: string
  price: number
  quantity: number
}

export function addItem(
  items: CartItem[],
  dishId: string,
  name: string,
  price: number,
): CartItem[] {
  const existing = items.find((item) => item.dishId === dishId)
  if (existing) {
    return items.map((item) =>
      item.dishId === dishId ? { ...item, quantity: item.quantity + 1 } : item,
    )
  }
  return [...items, { dishId, name, price, quantity: 1 }]
}

export function removeItem(items: CartItem[], dishId: string): CartItem[] {
  return items.filter((item) => item.dishId !== dishId)
}

export function setItemQuantity(items: CartItem[], dishId: string, quantity: number): CartItem[] {
  if (quantity <= 0) return removeItem(items, dishId)
  return items.map((item) => (item.dishId === dishId ? { ...item, quantity } : item))
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
