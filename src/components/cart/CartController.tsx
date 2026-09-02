import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'
import type { Dictionary } from '../../i18n/types'
import { formatPrice } from '../../lib/takeaway'
import { cartItems, initCart } from '../../stores/cart'
import CartDrawer from './CartDrawer'

export default function CartController({
  dict,
  checkoutHref,
}: {
  dict: Dictionary
  checkoutHref: string
}) {
  const items = useStore(cartItems)
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initCart()
    setReady(true)
  }, [])

  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <>
      <button
        className="btn btn-ghost btn-sm gap-2"
        onClick={() => setOpen(true)}
        aria-label={dict.takeaway.cart}
      >
        <span>🛒</span>
        <span className="badge badge-primary badge-sm">{count}</span>
        {ready && <span className="hidden sm:inline">{formatPrice(total)}</span>}
      </button>
      <CartDrawer dict={dict} open={open} onClose={() => setOpen(false)} checkoutHref={checkoutHref} />
    </>
  )
}
