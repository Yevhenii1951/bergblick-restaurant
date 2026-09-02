import { useEffect } from 'react'
import { addDish, initCart } from '../../stores/cart'

interface AddToCartButtonProps {
  dishId: string
  name: string
  price: number
  label: string
}

export default function AddToCartButton({ dishId, name, price, label }: AddToCartButtonProps) {
  useEffect(() => {
    initCart()
  }, [])

  return (
    <button className="btn btn-primary btn-sm" onClick={() => addDish(dishId, name, price)}>
      {label}
    </button>
  )
}
