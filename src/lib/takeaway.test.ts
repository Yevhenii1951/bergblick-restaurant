import { describe, expect, it } from 'vitest'
import type { Dish } from './menu.types'
import {
  addToCart,
  buildOrder,
  cartCount,
  cartTotal,
  formatPrice,
  freeDeliveryReached,
  removeFromCart,
  setQuantity,
} from './takeaway'

const dish: Dish = {
  id: 'd1',
  section: 'hauptgerichte',
  name: { de: 'Schnitzel', ru: 'Шницель', en: 'Schnitzel' },
  description: { de: 'Test', ru: 'Тест', en: 'Test' },
  price: 10,
  vegetarian: false,
}

const dish2: Dish = { ...dish, id: 'd2', price: 5 }

describe('cart', () => {
  it('adds a new dish', () => {
    const cart = addToCart([], dish)
    expect(cart).toHaveLength(1)
    expect(cart[0].quantity).toBe(1)
  })

  it('increments quantity of an existing dish', () => {
    const one = addToCart([], dish)
    const two = addToCart(one, dish)
    expect(two).toHaveLength(1)
    expect(two[0].quantity).toBe(2)
  })

  it('supports bulk quantity on add', () => {
    const cart = addToCart([], dish, 3)
    expect(cart[0].quantity).toBe(3)
  })

  it('removes a dish', () => {
    const cart = addToCart(addToCart([], dish), dish2)
    expect(removeFromCart(cart, 'd1')).toHaveLength(1)
  })

  it('sets quantity and removes when zero', () => {
    const cart = addToCart([], dish)
    expect(setQuantity(cart, 'd1', 4)[0].quantity).toBe(4)
    expect(setQuantity(cart, 'd1', 0)).toHaveLength(0)
  })
})

describe('totals', () => {
  it('sums line totals', () => {
    const cart = addToCart(addToCart([], dish), dish2, 2)
    expect(cartTotal(cart)).toBe(20)
  })

  it('counts items', () => {
    const cart = addToCart(addToCart([], dish), dish2, 2)
    expect(cartCount(cart)).toBe(3)
  })
})

describe('free delivery', () => {
  it('not reached below threshold', () => {
    expect(freeDeliveryReached(20)).toBe(false)
  })

  it('reached at threshold', () => {
    expect(freeDeliveryReached(25)).toBe(true)
  })

  it('reached above threshold', () => {
    expect(freeDeliveryReached(40)).toBe(true)
  })
})

describe('order', () => {
  const contact = { name: 'Anna', phone: '123', pickupTime: '18:00', note: '' }

  it('builds order payload with items and total', () => {
    const cart = addToCart(addToCart([], dish), dish2)
    const order = buildOrder(cart, contact)
    expect(order.items).toHaveLength(2)
    expect(order.total).toBe(15)
    expect(order.freeDelivery).toBe(false)
  })

  it('marks free delivery when threshold met', () => {
    const cart = addToCart([], dish, 5)
    const order = buildOrder(cart, contact)
    expect(order.freeDelivery).toBe(true)
  })
})

describe('formatPrice', () => {
  it('formats euros', () => {
    expect(formatPrice(12.5)).toBe('12,50 €')
  })
})
