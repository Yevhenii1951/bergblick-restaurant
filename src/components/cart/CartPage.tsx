import { useStore } from '@nanostores/react'
import { useEffect, useState, type FormEvent } from 'react'
import type { Dictionary } from '../../i18n/types'
import { DELIVERY, SITE } from '../../lib/config'
import { formatPrice, freeDeliveryReached, freeDeliveryThreshold } from '../../lib/takeaway'
import { sendOrderTelegram } from '../../lib/telegram'
import { cartItems, changeQuantity, clearCart, initCart, removeDish } from '../../stores/cart'

type DeliveryMode = 'pickup' | 'delivery'

export default function CartPage({ dict }: { dict: Dictionary }) {
  const items = useStore(cartItems)
  const [ready, setReady] = useState(false)
  const [mode, setMode] = useState<DeliveryMode>('pickup')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useEffect(() => {
    initCart()
    setReady(true)
  }, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const free = freeDeliveryReached(total)
  const deliveryFee = mode === 'delivery' && !free ? DELIVERY.deliveryFee : 0
  const grandTotal = total + deliveryFee

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const order = {
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      total: grandTotal,
      freeDelivery: free,
      contact: { email, name, phone, pickupTime, note, mode },
    }
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: order.items.map(({ total: _t, ...rest }) => rest),
          total: grandTotal,
          freeDelivery: free,
          contact: order.contact,
        }),
      })
    } catch {
      // DB offline (e.g. local dev) - order still delivered via Telegram
    }
    const ok = await sendOrderTelegram(order)
    if (ok) {
      setStatus('success')
      clearCart()
    } else {
      setStatus('error')
    }
  }

  if (!ready) return null

  if (items.length === 0) {
    return <p className="py-8 text-center text-base-content/60">{dict.takeaway.empty}</p>
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">
          {dict.takeaway.cart} ({count})
        </h2>
        <p className="text-sm text-base-content/60">{dict.takeaway.cartHours}</p>
      </div>
      <p className="mt-1 text-sm text-base-content/70">{dict.takeaway.deliveryInfo}</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="card bg-base-200 p-6">
            <ul className="divide-y divide-base-300/70">
              {items.map((item) => (
                <li key={item.dishId} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-base-content/60">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="join">
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs join-item"
                        onClick={() => changeQuantity(item.dishId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="join-item flex w-8 items-center justify-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs join-item"
                        onClick={() => changeQuantity(item.dishId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="w-20 text-right text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-error hover:underline"
                      onClick={() => removeDish(item.dishId)}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-200 p-6">
            <div className="join join-grid grid-cols-2 w-full">
              <button
                type="button"
                className={`btn join-item ${mode === 'pickup' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setMode('pickup')}
              >
                {dict.takeaway.pickup}
              </button>
              <button
                type="button"
                className={`btn join-item ${mode === 'delivery' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setMode('delivery')}
              >
                {dict.takeaway.delivery}
              </button>
            </div>

            {mode === 'pickup' ? (
              <p className="mt-3 text-sm text-base-content/60">
                {SITE.address.street}, {SITE.address.city}
              </p>
            ) : (
              <p className="mt-3 text-sm text-base-content/60">
                {free
                  ? dict.takeaway.freeDeliveryReached
                  : dict.takeaway.freeDelivery.replace('%price', formatPrice(freeDeliveryThreshold()))}
              </p>
            )}

            <label className="form-control mb-5 mt-4 gap-4">
              <span className="label-text">{dict.takeaway.name}</span>
              <input
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className="form-control mb-5 gap-4">
              <span className="label-text">{dict.takeaway.phone}</span>
              <input
                className="input input-bordered"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>

            <label className="form-control mb-5 gap-4">
              <span className="label-text">{dict.takeaway.email}</span>
              <input
                className="input input-bordered"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="form-control mb-5 gap-4">
              <span className="label-text">{dict.takeaway.wishTime}</span>
              <input
                className="input input-bordered"
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
              />
            </label>

            <label className="form-control gap-4">
              <span className="label-text">{dict.takeaway.note}</span>
              <textarea
                className="textarea textarea-bordered"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="card bg-base-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-base-content/70">{dict.takeaway.subtotal}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-base-content/70">{dict.takeaway.deliveryFee}</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-base-300 pt-3">
            <span className="font-bold">{dict.takeaway.total}</span>
            <span className="text-lg font-bold">{formatPrice(grandTotal)}</span>
          </div>

          {!free && mode === 'delivery' && (
            <p className="mt-2 text-sm text-base-content/60">
              {dict.takeaway.freeDelivery.replace('%price', formatPrice(freeDeliveryThreshold()))}
            </p>
          )}

          {status === 'error' && <p className="mt-2 text-sm text-error">{dict.takeaway.failed}</p>}
          {status === 'success' && (
            <p className="mt-2 text-sm text-success">{dict.takeaway.success}</p>
          )}

          <button
            className="btn btn-primary mt-4 w-full rounded-lg font-semibold text-success!"
            type="submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? '…' : dict.takeaway.order}
          </button>
        </div>
      </form>
    </div>
  )
}