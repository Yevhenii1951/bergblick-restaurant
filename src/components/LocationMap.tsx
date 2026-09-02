import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'
import type { Dictionary } from '../i18n/types'
import { SITE } from '../lib/config'
import { consentGranted, getConsent, grantConsent } from '../stores/consent'

const EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=9.4545%2C51.2917%2C9.5065%2C51.3117&layer=mapnik&marker=51.3017%2C9.4805'

export default function LocationMap({ dict }: { dict: Dictionary }) {
  const granted = useStore(consentGranted)
  const [nativeConsent, setNativeConsent] = useState(false)

  useEffect(() => {
    setNativeConsent(getConsent())
  }, [])

  const showMap = granted || nativeConsent

  return (
    <div className="overflow-hidden rounded-xl border border-base-300">
      {!showMap ? (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <p className="text-base-content/70">{dict.contact.mapNotice}</p>
          <button className="btn btn-primary btn-sm" onClick={grantConsent}>
            {dict.legal.accept}
          </button>
        </div>
      ) : (
        <iframe
          title={SITE.name}
          className="block w-full"
          style={{ height: 320 }}
          loading="lazy"
          src={EMBED_URL}
        />
      )}
    </div>
  )
}