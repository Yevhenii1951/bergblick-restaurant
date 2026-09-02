import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import type { Dictionary } from '../../i18n/types'
import { formatPrice } from '../../lib/takeaway'
import { cartItems, initCart } from '../../stores/cart'

export default function CartController({
  dict,
  checkoutHref,
}: {
  dict: Dictionary
  checkoutHref: string
}) {
  const items = useStore(cartItems)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initCart()
    setReady(true)
  }, [])

  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <a
      href={checkoutHref}
      className="btn btn-ghost btn-sm gap-2"
      aria-label={dict.takeaway.cart}
    >
      <ShoppingCart aria-hidden="true" className="size-5 text-neutral" />
      <span className="badge badge-primary badge-sm">{count}</span>
      {ready && <span className="hidden sm:inline">{formatPrice(total)}</span>}
    </a>
  )
}