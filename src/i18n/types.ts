export interface Dictionary {
  siteName: string
  tagline: string
  description: string

  nav: {
    home: string
    menu: string
    about: string
    contact: string
    reservation: string
    takeaway: string
  }

  hero: {
    title: string
    subtitle: string
    ctaMenu: string
    ctaReserve: string
  }

  highlights: {
    title: string
    items: { title: string; text: string }[]
  }

  menu: {
    title: string
    intro: string
    vegetarian: string
    allergenHint: string
    addToCart: string
  }

  gallery: {
    title: string
    subtitle: string
  }

  takeaway: {
    title: string
    subtitle: string
    cart: string
    empty: string
    order: string
    freeDelivery: string
    freeDeliveryReached: string
    total: string
    name: string
    phone: string
    pickupTime: string
    note: string
    submit: string
    success: string
    failed: string
    quantity: string
    remove: string
    addToCart: string
  }

  reservation: {
    title: string
    subtitle: string
    date: string
    time: string
    guests: string
    submit: string
    success: string
  }

  contact: {
    title: string
    address: string
    hours: string
    phone: string
    mapNotice: string
  }

  about: {
    title: string
    body: string
  }

  legal: {
    impressum: string
    datenschutz: string
    cookieConsent: string
    accept: string
  }

  footer: {
    rights: string
    hours: string
  }

  categories: Record<string, string>
}
