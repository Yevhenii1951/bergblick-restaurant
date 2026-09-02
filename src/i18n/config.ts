export type Locale = 'de' | 'ru' | 'en'

export const locales: Locale[] = ['de', 'ru', 'en']
export const defaultLocale: Locale = 'de'

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  ru: 'Русский',
  en: 'English',
}
