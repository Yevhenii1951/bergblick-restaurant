import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'

type OrderItem = {
  name: string
  quantity: number
  price: number
}

type OrderPayload = {
  items: OrderItem[]
  total: number
  freeDelivery: boolean
  contact: {
    email?: string
    name: string
    phone: string
    pickupTime?: string
    note?: string
  }
}

function toCents(amount: number): number {
  return Math.round(amount * 100)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    return handlePost(req, res)
  }
  if (req.method === 'GET') {
    return handleGet(req, res)
  }
  res.setHeader('Allow', 'POST, GET')
  return res.status(405).json({ error: 'Method not allowed' })
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  const body = req.body as OrderPayload
  if (!body || !body.contact || !Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({ error: 'Invalid order payload' })
  }

  const { email, name, phone, pickupTime, note } = body.contact
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' })
  }

  if (!process.env.POSTGRES_URL) {
    // Demo fallback when DB not configured (training behaviour)
    return res.status(200).json({ id: 'demo', persisted: false })
  }

  try {
    await sql`
      create table if not exists orders (
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
      )
    `
    const insert = await sql`
      insert into orders (email, name, phone, pickup_time, note, total_cents, free_delivery, items)
      values (${email ?? null}, ${name}, ${phone}, ${pickupTime ?? null}, ${note ?? null},
              ${toCents(body.total)}, ${body.freeDelivery}, ${JSON.stringify(body.items)}::jsonb)
      returning id
    `
    res.status(201).json({ id: insert.rows[0].id, persisted: true })
  } catch (err) {
    console.error('POST /api/orders failed', err)
    res.status(500).json({ error: 'Failed to persist order' })
  }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100)

  if (process.env.ADMIN_CODE && req.headers['x-admin-code'] !== process.env.ADMIN_CODE) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  if (!process.env.POSTGRES_URL) {
    return res.status(200).json({ orders: [] })
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
    const { rows } = await sql`
      select id, created_at, email, name, total_cents, free_delivery, items
      from orders
      order by created_at desc
      limit ${limit}
    `
    res.status(200).json({ orders: rows })
  } catch (err) {
    console.error('GET /api/orders failed', err)
    res.status(500).json({ error: 'Failed to read orders' })
  }
}