import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (process.env.ADMIN_CODE && req.headers['x-admin-code'] !== process.env.ADMIN_CODE) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  if (!process.env.POSTGRES_URL) {
    return res.status(200).json({
      configured: false,
      totalOrders: 0,
      revenueTodayCents: 0,
      revenueTotalCents: 0,
      avgBasketCents: 0,
      ordersByDay: [],
      topDishes: [],
    })
  }

  try {
    await sql`create table if not exists orders (
        id uuid primary key default gen_random_uuid(),
        created_at timestamptz not null default now(),
        email text,
        name text not null,
        phone text not null,
        pickup_time text,
        note text,
        total_cents integer not null,
        free_delivery boolean not null default false,
        items jsonb not null default '[]'
      )`

    const totals = await sql`
      select
        count(*)::int                                                          as total_orders,
        coalesce(sum(total_cents), 0)::int                                     as revenue_total_cents,
        coalesce(sum(total_cents) filter (where created_at >= date_trunc('day', now())), 0)::int as revenue_today_cents,
        coalesce(round(avg(total_cents)), 0)::int                              as avg_basket_cents
      from orders
    `

    const byDay = await sql`
      select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
             count(*)::int                                      as orders,
             sum(total_cents)::int                              as revenue_cents
      from orders
      group by date_trunc('day', created_at)
      order by day
    `

    const topDishes = await sql`
      select item_name as name,
             sum(item_qty)::int                        as total_sold,
             sum((item_price * 100)::int * item_qty)::int as revenue_cents
      from orders, jsonb_to_recordset(items) as t(
        item_name text, item_qty int, item_price numeric
      )
      group by item_name
      order by total_sold desc
      limit 10
    `

    const t = totals.rows[0]
    res.status(200).json({
      configured: true,
      totalOrders: t.total_orders,
      revenueTodayCents: t.revenue_today_cents,
      revenueTotalCents: t.revenue_total_cents,
      avgBasketCents: t.avg_basket_cents,
      ordersByDay: byDay.rows,
      topDishes: topDishes.rows,
    })
  } catch (err) {
    console.error('GET /api/stats failed', err)
    res.status(500).json({ error: 'Failed to read stats' })
  }
}