import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = String(req.body?.email ?? '')
    .trim()
    .toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' })
  }

  if (!process.env.POSTGRES_URL) {
    return res.status(200).json({ demo: true, code: '123456' })
  }

  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 min

  try {
    await sql`create table if not exists auth_codes (
      id uuid primary key default gen_random_uuid(),
      email text not null,
      code text not null,
      expires_at timestamptz not null,
      used boolean not null default false,
      created_at timestamptz not null default now()
    )`
    await sql`
      update auth_codes set used = true where email = ${email} and used = false
    `
    await sql`
      insert into auth_codes (email, code, expires_at)
      values (${email}, ${code}, ${expiresAt.toISOString()})
    `
    // Demo: return the code in the response (no real email provider).
    return res.status(200).json({ demo: true, code })
  } catch (err) {
    console.error('POST /api/auth/request-code failed', err)
    return res.status(500).json({ error: 'Failed to create code' })
  }
}