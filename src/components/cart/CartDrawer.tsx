import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'
import type { Dictionary } from '../../i18n/types'
import { freeDeliveryReached, formatPrice, freeDeliveryThreshold } from '../../lib/takeaway'
import { cartItems, changeQuantity, initCart, removeDish } from '../../stores/cart'

interface CartDrawerProps {
  dict: Dictionary
  open: boolean
  onClose: () => void
  checkoutHref: string
}

export default function CartDrawer({ dict, open, onClose, checkoutHref }: CartDrawerProps) {
  const items = useStore(cartItems)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initCart()
    setReady(true)
  }, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const free = freeDeliveryReached(total)
  const threshold = freeDeliveryThreshold()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[500]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md border-l border-base-300 bg-base-100 shadow-2xl"
        role="dialog"
        aria-label={dict.takeaway.cart}
      >
        <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
          <h2 className="font-display text-xl font-semibold">{dict.takeaway.cart}</h2>
          <button
            className="btn btn-ghost btn-sm btn-circle"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto px-5 py-4" style={{ maxHeight: '60vh' }}>
          {!ready ? null : items.length === 0 ? (
            <p className="py-8 text-center text-base-content/60">{dict.takeaway.empty}</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.dishId} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="join">
                        <button
                          className="btn btn-ghost btn-xs join-item"
                          onClick={() => changeQuantity(item.dishId, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="join-item flex items-center px-2 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-ghost btn-xs join-item"
                          onClick={() => changeQuantity(item.dishId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      className="text-xs text-error hover:underline"
                      onClick={() => removeDish(item.dishId)}
                    >
                      {dict.takeaway.remove}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-base-300 px-5 py-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">{dict.takeaway.total}</span>
            <span className="text-lg font-bold">{formatPrice(total)}</span>
          </div>

          <div className={`mb-3 text-sm ${free ? 'text-success' : 'text-base-content/60'}`}>
            {free
              ? dict.takeaway.freeDeliveryReached
              : dict.takeaway.freeDelivery.replace('%price', formatPrice(threshold))}
          </div>

          {count > 0 && (
            <a href={checkoutHref} className="btn btn-primary w-full rounded-lg font-semibold">
              {dict.takeaway.order}
            </a>
          )}
        </div>
      </aside>
    </div>
  )
}
