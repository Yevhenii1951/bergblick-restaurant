import { createHmac, timingSafeEqual } from 'crypto'
import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ORDERS_DDL } from './orders'

function getTokenSecret(): string {
  const secret = process.env.AUTH_TOKEN_SECRET
  if (!secret) throw new Error('AUTH_TOKEN_SECRET is not set')
  return secret
}

function verifyEmail(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const sep = decoded.lastIndexOf('.')
    if (sep === -1) return null
    const payload = decoded.slice(0, sep)
    const sig = decoded.slice(sep + 1)
    const expected = createHmac('sha256', getTokenSecret()).update(payload).digest('hex')
    const sigBuf = Buffer.from(sig)
    const expBuf = Buffer.from(expected)
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null
    const [email, exp] = payload.split('|')
    if (Number(exp) < Date.now()) return null
    return email
  } catch {
    return null
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = verifyEmail(String(req.query.token ?? ''))
  if (!email) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  if (!process.env.POSTGRES_URL) {
    return res.status(200).json({ orders: [] })
  }

  try {
    await ORDERS_DDL
    const { rows } = await sql`
      select id, created_at, name, total_cents, free_delivery, items
      from orders
      where email = ${email}
      order by created_at desc
      limit 50
    `
    return res.status(200).json({ orders: rows })
  } catch (err) {
    console.error('GET /api/my-orders failed', err)
    return res.status(500).json({ error: 'Failed to read orders' })
  }
}