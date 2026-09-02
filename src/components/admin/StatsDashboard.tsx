import { useEffect, useState, type FormEvent } from 'react'

type ByDay = { day: string; orders: number; revenue_cents: number }
type TopDish = { name: string; total_sold: number; revenue_cents: number }

type Stats = {
  configured: boolean
  totalOrders: number
  revenueTodayCents: number
  revenueTotalCents: number
  avgBasketCents: number
  ordersByDay: ByDay[]
  topDishes: TopDish[]
}

type OrderRow = {
  id: string
  created_at: string
  email: string | null
  name: string
  total_cents: number
  free_delivery: boolean
  items: { name: string; quantity: number }[]
}

function euros(cents: number): string {
  return (cents / 100).toFixed(2) + ' €'
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function StatsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [error, setError] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [unauthorized, setUnauthorized] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem('bergblick_admin')
    if (saved) {
      setAdminCode(saved)
      load(saved)
    } else {
      setUnauthorized(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function load(code: string) {
    setError('')
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/stats', { headers: { 'x-admin-code': code } }),
        fetch('/api/orders?limit=20', { headers: { 'x-admin-code': code } }),
      ])
      if (statsRes.status === 403 || ordersRes.status === 403) {
        window.localStorage.removeItem('bergblick_admin')
        setUnauthorized(true)
        return
      }
      const statsJson = (await statsRes.json()) as Stats
      const ordersJson = (await ordersRes.json()) as { orders: OrderRow[] }
      setStats(statsJson)
      setOrders(ordersJson.orders)
    } catch {
      setError('Statistiken konnten nicht geladen werden.')
    }
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    window.localStorage.setItem('bergblick_admin', adminCode)
    setUnauthorized(false)
    load(adminCode)
  }

  if (unauthorized) {
    return (
      <form onSubmit={submit} className="mx-auto max-w-md space-y-5 rounded-xl border border-base-300 bg-base-100 p-7 shadow-sm">
        <h2 className="font-display text-lg font-semibold">Zugangs-Code eingeben</h2>
        <p className="text-sm text-base-content/60">
          Geben Sie den Code des Restaurantbetreibers ein, um die Statistik zu sehen.
        </p>
        <label className="form-control gap-8">
          <span className="label-text">Code</span>
          <input
            className="input input-bordered"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            required
          />
        </label>
        {error && <p className="text-sm text-error">{error}</p>}
        <button className="btn btn-primary w-full rounded-lg font-semibold" type="submit">
          Öffnen
        </button>
      </form>
    )
  }

  if (error) {
    return <p className="text-error">{error}</p>
  }
  if (!stats) {
    return <p className="text-base-content/60">Lade Statistiken…</p>
  }

  const maxSold = Math.max(1, ...stats.topDishes.map((d) => d.total_sold))
  const maxOrdersInDay = Math.max(1, ...stats.ordersByDay.map((d) => d.orders))

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Bestellungen gesamt" value={String(stats.totalOrders)} />
        <Card label="Umsatz heute" value={euros(stats.revenueTodayCents)} />
        <Card label="Umsatz gesamt" value={euros(stats.revenueTotalCents)} />
        <Card label="Ø Warenkorb" value={euros(stats.avgBasketCents)} />
      </div>

      {stats.ordersByDay.length > 0 && (
        <section className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Bestellungen pro Tag</h2>
          <div className="mt-4 flex h-40 items-end gap-2">
            {stats.ordersByDay.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary/80"
                  style={{ height: `${(d.orders / maxOrdersInDay) * 100}%` }}
                  title={`${d.day}: ${d.orders} Bestellungen`}
                />
                <span className="text-[10px] text-base-content/60">{d.day.slice(5)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {stats.topDishes.length > 0 && (
        <section className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Bestseller</h2>
          <ul className="mt-4 space-y-3">
            {stats.topDishes.map((d) => (
              <li key={d.name} className="flex items-center gap-3">
                <div className="w-40 truncate text-sm">{d.name}</div>
                <div className="h-3 flex-1 overflow-hidden rounded bg-base-200">
                  <div
                    className="h-full rounded bg-accent/80"
                    style={{ width: `${(d.total_sold / maxSold) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-semibold">{d.total_sold}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold">Letzte Bestellungen</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-base-content/60">Noch keine Bestellungen.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="text-base-content/60">
                  <th>Zeit</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Summe</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{fmtDate(o.created_at)}</td>
                    <td>{o.name}</td>
                    <td>{o.email ?? '—'}</td>
                    <td>{euros(o.total_cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
      <p className="text-sm text-base-content/60">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  )
}