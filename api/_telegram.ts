type TelegramItem = { name: string; quantity: number; price: number }
type TelegramContact = { name: string; phone: string; pickupTime?: string; note?: string }

type TelegramPayload = {
  items: TelegramItem[]
  total: number
  freeDelivery: boolean
  contact: TelegramContact
}

function formatTelegramOrder(order: TelegramPayload): string {
  const lines = order.items
    .map((item) => `${item.quantity}× ${item.name} – ${(item.price * item.quantity).toFixed(2)} €`)
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
    order.contact.pickupTime ? `Zeit: ${order.contact.pickupTime}` : '',
    order.contact.note ? `Notiz: ${order.contact.note}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function sendOrderTelegram(order: TelegramPayload): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!botToken || !chatId) {
    console.log('Telegram not configured. Demo order submitted:', order)
    return true
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: formatTelegramOrder(order) }),
    })
    return res.ok
  } catch {
    return false
  }
}