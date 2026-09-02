import { useStore } from '@nanostores/react'
import { useEffect, useState, type FormEvent } from 'react'
import type { Dictionary } from '../../i18n/types'
import {
  freeDeliveryReached,
  formatPrice,
  freeDeliveryThreshold,
} from '../../lib/takeaway'
import { sendOrderTelegram } from '../../lib/telegram'
import { cartItems, clearCart, initCart } from '../../stores/cart'

export default function OrderForm({ dict }: { dict: Dictionary }) {
  const items = useStore(cartItems)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useEffect(() => {
    initCart()
  }, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const free = freeDeliveryReached(total)

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
      total,
      freeDelivery: free,
      contact: { name, phone, pickupTime, note },
    }
    const ok = await sendOrderTelegram(order)
    if (ok) {
      setStatus('success')
      clearCart()
    } else {
      setStatus('error')
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      {items.length === 0 ? (
        <p className="py-8 text-center text-base-content/60">{dict.takeaway.empty}</p>
      ) : (
        <form onSubmit={handleSubmit} className="card bg-base-200 p-6">
          <h2 className="mb-4 text-xl font-bold">{dict.takeaway.order}</h2>

          <ul className="mb-4 space-y-1 text-sm">
            {items.map((item) => (
              <li key={item.dishId} className="flex justify-between">
                <span>
                  {item.quantity}× {item.name}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mb-4 flex items-center justify-between border-t border-base-300 pt-3">
            <span className="font-bold">{dict.takeaway.total}</span>
            <span className="text-lg font-bold">{formatPrice(total)}</span>
          </div>

          <p className={`mb-4 text-sm ${free ? 'text-success' : 'text-base-content/60'}`}>
            {free
              ? dict.takeaway.freeDeliveryReached
              : dict.takeaway.freeDelivery.replace('%price', formatPrice(freeDeliveryThreshold()))}
          </p>

          <label className="form-control mb-3">
            <span className="label-text">{dict.takeaway.name}</span>
            <input
              className="input input-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="form-control mb-3">
            <span className="label-text">{dict.takeaway.phone}</span>
            <input
              className="input input-bordered"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>

          <label className="form-control mb-3">
            <span className="label-text">{dict.takeaway.pickupTime}</span>
            <input
              className="input input-bordered"
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              required
            />
          </label>

          <label className="form-control mb-4">
            <span className="label-text">{dict.takeaway.note}</span>
            <textarea
              className="textarea textarea-bordered"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>

          {status === 'error' && (
            <p className="mb-2 text-sm text-error">{dict.takeaway.failed}</p>
          )}
          {status === 'success' && (
            <p className="mb-2 text-sm text-success">{dict.takeaway.success}</p>
          )}

          <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? '…' : dict.takeaway.submit}
          </button>
        </form>
      )}
    </div>
  )
}
