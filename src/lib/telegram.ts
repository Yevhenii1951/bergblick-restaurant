import { TELEGRAM } from './config'
import type { Order } from './takeaway'

function formatOrder(order: Order): string {
  const lines = order.items
    .map((item) => `${item.quantity}× ${item.name} – ${item.total.toFixed(2)} €`)
    .join('\n')
  const delivery = order.freeDelivery ? 'Ja (kostenlos)' : 'Nein'
  return [
    '🛍️ NEUE BESTELLUNG (Bergblick)',
    '',
    lines,
    '',
    `Gesamt: ${order.total.toFixed(2)} €`,
    `Gratis-Lieferung: ${delivery}`,
    '',
    `Name: ${order.contact.name}`,
    `Telefon: ${order.contact.phone}`,
    `Zeit: ${order.contact.pickupTime}`,
    order.contact.note ? `Notiz: ${order.contact.note}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function sendOrderTelegram(order: Order): Promise<boolean> {
  if (!TELEGRAM.botToken || !TELEGRAM.chatId) {
    console.log('Telegram not configured. Demo order submitted:', order)
    return true
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM.chatId,
          text: formatOrder(order),
        }),
      },
    )
    return res.ok
  } catch {
    return false
  }
}
