import { atom } from 'nanostores'

const KEY = 'bergblick-consent'

export const consentGranted = atom(false)

export function getConsent(): boolean {
  if (typeof window === 'undefined') return false
  const raw = window.localStorage.getItem(KEY)
  return raw === 'yes'
}

export function grantConsent(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(KEY, 'yes')
  }
  consentGranted.set(true)
}
