import { menus } from '../content/menus'
import type { Locale } from '../i18n/config'
import type { Menu, TranslatedText } from './menu.types'

export interface LocalizedDish {
  id: string
  section: string
  name: string
  description: string
  price: number
  vegetarian: boolean
  image?: string
}

export interface LocalizedSection {
  key: string
  name: string
  dishes: LocalizedDish[]
}

export function pick(tt: TranslatedText, locale: Locale): string {
  return tt[locale]
}

export function getMenu(locale: Locale): LocalizedSection[] {
  return menus.map((section) => ({
    key: section.key,
    name: pick(section.name, locale),
    dishes: section.dishes.map((dish) => ({
      id: dish.id,
      section: section.key,
      name: pick(dish.name, locale),
      description: pick(dish.description, locale),
      price: dish.price,
      vegetarian: dish.vegetarian,
      image: dish.image,
    })),
  }))
}

export const menu: Menu = menus

export function findDish(locale: Locale, id: string): LocalizedDish | undefined {
  for (const section of getMenu(locale)) {
    const dish = section.dishes.find((d) => d.id === id)
    if (dish) return dish
  }
  return undefined
}
