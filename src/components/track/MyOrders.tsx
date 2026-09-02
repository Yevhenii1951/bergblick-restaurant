import { useState } from 'react'

type TrackOrder = {
  id: string
  created_at: string
  name: string
  total_cents: number
  free_delivery: boolean
  items: { name: string; quantity: number }[]
}

type Step = 'request' | 'verify' | 'done'

function euros(cents: number): string {
  return (cents / 100).toFixed(2) + ' €'
}

export default function MyOrders() {
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [orders, setOrders] = useState<TrackOrder[]>([])
  const [codeDisplay, setCodeDisplay] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function requestCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as { code?: string; error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Fehler')
      } else {
        setStep('verify')
        if (data.code) setCodeDisplay(data.code)
      }
    } catch {
      setError('Netzwerkfehler')
    } finally {
      setLoading(false)
    }
  }

  async function verifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = (await res.json()) as { token?: string; error?: string }
      if (!res.ok || !data.token) {
        setError(data.error ?? 'Fehler')
      } else {
        await loadOrders(data.token)
      }
    } catch {
      setError('Netzwerkfehler')
    } finally {
      setLoading(false)
    }
  }

  async function loadOrders(tok: string) {
    const res = await fetch(`/api/my-orders?token=${encodeURIComponent(tok)}`)
    const data = (await res.json()) as { orders?: TrackOrder[]; error?: string }
    if (!res.ok) {
      setError(data.error ?? 'Fehler')
      return
    }
    setOrders(data.orders ?? [])
    setStep('done')
  }

  return (
    <form onSubmit={step === 'request' ? requestCode : verifyCode} className="space-y-10">
      <label className="form-control mb-7 gap-3">
        <span className="label-text">E-Mail</span>
        <input
          className="input input-bordered"
          type="email"
          value={email}
          disabled={step !== 'request'}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      {step === 'verify' && (
        <label className="form-control mb-7 gap-3">
          <span className="label-text">Code</span>
          <input
            className="input input-bordered"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-stellig"
            inputMode="numeric"
            required
          />
        </label>
      )}

      {codeDisplay && (
        <p className="rounded-lg bg-base-200 px-4 py-2 text-sm">
          Demo-Code: <strong>{codeDisplay}</strong> (in einer echten Integration käme er per E-Mail)
        </p>
      )}
      {error && <p className="text-sm text-error">{error}</p>}

      {step !== 'done' && (
        <button className="btn btn-primary w-full rounded-lg font-semibold text-success!" type="submit" disabled={loading}>
          {loading ? '…' : step === 'request' ? 'Code anfordern' : 'Bestätigen'}
        </button>
      )}

      {step === 'done' && (
        <div className="space-y-3">
          <h3 className="font-display text-lg font-semibold">Ihre Bestellungen</h3>
          {orders.length === 0 ? (
            <p className="text-base-content/60">Für diese E-Mail wurden keine Bestellungen gefunden.</p>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="rounded-lg border border-base-300 bg-base-100 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{new Date(o.created_at).toLocaleDateString('de-DE')}</span>
                  <span className="font-bold">{euros(o.total_cents)}</span>
                </div>
                <ul className="mt-2 text-sm text-base-content/70">
                  {o.items.map((it, i) => (
                    <li key={i}>
                      {it.quantity}× {it.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </form>
  )
}