import type { Locale } from './config'
import { de } from './de'
import { en } from './en'
import { ru } from './ru'
import type { Dictionary } from './types'

const dictionaries: Record<Locale, Dictionary> = {
  de,
  ru,
  en,
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
