import { useEffect } from 'react'
import { addDish, initCart } from '../../stores/cart'
import Magnet from '../effects/Magnet'

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
    <Magnet strength={20}>
      <button
        className="btn btn-primary btn-sm rounded-lg font-semibold text-success!"
        onClick={() => addDish(dishId, name, price)}
      >
        {label}
      </button>
    </Magnet>
  )
}
