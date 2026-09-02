import TiltedCard from '../effects/TiltedCard'
import AddToCartButton from './AddToCartButton'

interface DishCardProps {
  id: string
  name: string
  description: string
  price: number
  vegetarian?: boolean
  image?: string
  vegLabel: string
  addToCartLabel: string
}

export default function DishCard({
  id,
  name,
  description,
  price,
  vegetarian = false,
  image,
  vegLabel,
  addToCartLabel,
}: DishCardProps) {
  return (
    <TiltedCard className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-xl">
        {image && (
          <div className="relative h-40 overflow-hidden">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold leading-tight">{name}</h3>
            <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
              {price.toFixed(2)} €
            </span>
          </div>
          <p className="mt-2 flex-1 text-sm text-base-content/70">{description}</p>
          <div className="mt-4 flex items-center justify-between">
            {vegetarian ? (
              <span className="badge badge-accent badge-outline">{vegLabel}</span>
            ) : (
              <span />
            )}
            <AddToCartButton dishId={id} name={name} price={price} label={addToCartLabel} />
          </div>
        </div>
      </div>
    </TiltedCard>
  )
}
