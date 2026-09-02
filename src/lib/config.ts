export const DELIVERY = {
  freeDeliveryThreshold: 25,
  currency: 'EUR',
  locale: 'de-DE',
}

export const TELEGRAM = {
  botToken: import.meta.env.PUBLIC_TELEGRAM_BOT_TOKEN ?? '',
  chatId: import.meta.env.PUBLIC_TELEGRAM_CHAT_ID ?? '',
}

export const SITE = {
  name: 'Bergblick',
  phone: '+49 561 123456',
  address: {
    street: 'Wilhelmshöher Allee 112',
    city: '34119 Kassel',
  },
  hours: 'Mo–So 11:00–22:00 Uhr',
  coordinates: {
    lat: 51.3017,
    lng: 9.4805,
  },
}
