import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'
import type { Dictionary } from '../i18n/types'
import { SITE } from '../lib/config'
import { consentGranted, getConsent, grantConsent } from '../stores/consent'

export default function LocationMap({ dict }: { dict: Dictionary }) {
  const granted = useStore(consentGranted)
  const [nativeConsent, setNativeConsent] = useState(false)

  useEffect(() => {
    setNativeConsent(getConsent())
  }, [])

  useEffect(() => {
    if (!granted && !nativeConsent) return
    let cancelled = false
    let L: any
    async function load() {
      const mod = await import('leaflet')
      L = mod.default
      if (cancelled) return
      const map = L.map('bergblick-map').setView([SITE.coordinates.lat, SITE.coordinates.lng], 14)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)
      L.marker([SITE.coordinates.lat, SITE.coordinates.lng])
        .addTo(map)
        .bindPopup(SITE.name)
        .openPopup()
    }
    load()
    return () => {
      cancelled = true
    }
  }, [granted, nativeConsent])

  const showMap = granted || nativeConsent

  return (
    <div className="h-full overflow-hidden rounded-xl border border-base-300">
      {!showMap ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="text-base-content/70">{dict.contact.mapNotice}</p>
          <button className="btn btn-primary btn-sm" onClick={grantConsent}>
            {dict.legal.accept}
          </button>
        </div>
      ) : (
        <div
          id="bergblick-map"
          style={{ height: '100%', minHeight: 320, width: '100%' }}
          ref={(node) => {
            // leaflet needs the container before init; the effect handles init after mount
            void node
          }}
        />
      )}
    </div>
  )
}
