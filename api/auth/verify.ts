import { createHmac } from 'crypto'
import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'

function getTokenSecret(): string {
  const secret = process.env.AUTH_TOKEN_SECRET
  if (!secret) throw new Error('AUTH_TOKEN_SECRET is not set')
  return secret
}

function signToken(email: string, expiresAt: number): string {
  const payload = `${email}|${expiresAt}`
  const sig = createHmac('sha256', getTokenSecret()).update(payload).digest('hex')
  return Buffer.from(`${payload}.${sig}`).toString('base64url')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = String(req.body?.email ?? '')
    .trim()
    .toLowerCase()
  const code = String(req.body?.code ?? '').trim()

  if (!email || !code) {
    return res.status(400).json({ error: 'email and code are required' })
  }

  if (!process.env.POSTGRES_URL) {
    // Demo: any code works, 6-digit style
    if (code.length === 6) {
      const expiresAt = Date.now() + 60 * 60 * 1000
      return res.status(200).json({ token: signToken(email, expiresAt), demo: true })
    }
    return res.status(401).json({ error: 'Invalid code' })
  }

  try {
    const valid = await sql`
      select id from auth_codes
      where email = ${email}
        and code = ${code}
        and used = false
        and expires_at > now()
      order by created_at desc
      limit 1
    `
    if (valid.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired code' })
    }
    await sql`update auth_codes set used = true where id = ${valid.rows[0].id}`
    const expiresAt = Date.now() + 60 * 60 * 1000
    return res.status(200).json({ token: signToken(email, expiresAt) })
  } catch (err) {
    console.error('POST /api/auth/verify failed', err)
    return res.status(500).json({ error: 'Failed to verify code' })
  }
}