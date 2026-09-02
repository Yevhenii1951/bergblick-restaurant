export interface TranslatedText {
  de: string
  ru: string
  en: string
}

export interface Dish {
  id: string
  section: string
  name: TranslatedText
  description: TranslatedText
  price: number
  vegetarian: boolean
  image?: string
}

export interface MenuSection {
  key: string
  name: TranslatedText
  dishes: Dish[]
}

export type Menu = MenuSection[]
